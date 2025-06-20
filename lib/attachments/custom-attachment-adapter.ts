import { 
  AttachmentAdapter, 
  type PendingAttachment, 
  type CompleteAttachment,
  type ImageContentPart
} from "@assistant-ui/react";

type AttachmentType = 'image' | 'document' | 'file';

type AttachmentUploadResult = {
  id: string;
  name: string;
  type: AttachmentType;
  size: number;
  url: string;
  contentType: string;
  metadata?: Record<string, unknown>;
};

// Extend the PendingAttachment type to include metadata
interface ExtendedPendingAttachment extends Omit<PendingAttachment, 'metadata'> {
  metadata?: Record<string, unknown>;
}

export class CustomAttachmentAdapter implements AttachmentAdapter {
  private apiEndpoint: string;
  private maxFileSizeMB: number;
  private allowedFileTypes: string[];

  constructor({
    apiEndpoint = "/api/upload",
    maxFileSizeMB = 10,
    allowedFileTypes = [
      "application/pdf", 
      "text/plain", 
      "text/csv", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ],
  } = {}) {
    this.apiEndpoint = apiEndpoint;
    this.maxFileSizeMB = maxFileSizeMB;
    this.allowedFileTypes = allowedFileTypes;
  }

  // Required by AttachmentAdapter
  accept = '.pdf,.doc,.docx,.txt,.csv,.png,.jpg,.jpeg,.webp';

  // Required by AttachmentAdapter
  async add(state: { file: File }): Promise<ExtendedPendingAttachment> {
    const { file } = state;
    try {
      const result = await this.uploadFile(file);
      
      // Create a pending attachment with the required fields
      return {
        id: result.id,
        name: result.name,
        type: result.type,
        contentType: result.contentType,
        file: file,
        status: {
          type: 'running',
          reason: 'uploading',
          progress: 100
        },
        ...(result.metadata || {})
      };
    } catch (error) {
      console.error('Error adding file:', error);
      const errorAttachment: ExtendedPendingAttachment = {
        id: `error-${Date.now()}`,
        name: file.name,
        type: this.mapMimeTypeToAttachmentType(file.type),
        contentType: file.type,
        file: file,
        status: {
          type: 'incomplete',
          reason: 'error'
        }
      };
      // Store error information in a way that's type-safe
      const attachmentWithError = {
        ...errorAttachment,
        metadata: {
          ...errorAttachment.metadata,
          error: error instanceof Error ? error.message : 'Upload failed'
        }
      };
      return attachmentWithError;
    }
  }

  private mapMimeTypeToAttachmentType(mimeType: string): AttachmentType {
    if (mimeType.startsWith('image/')) return 'image';
    if ([
      'application/pdf', 
      'text/plain', 
      'text/csv', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ].includes(mimeType)) {
      return 'document';
    }
    return 'file';
  }

  // Required by AttachmentAdapter
  async remove(attachment: PendingAttachment | CompleteAttachment): Promise<void> {
    try {
      // Implement if you need to clean up files on the server
      // await fetch(`/api/files/${attachment.id}`, { method: 'DELETE' });
      console.log(`Removed file: ${attachment.name}`);
    } catch (error) {
      console.error('Error removing file:', error);
      throw error;
    }
  }

  // Required by AttachmentAdapter
  async send(attachment: PendingAttachment): Promise<CompleteAttachment> {
    // Convert PendingAttachment to CompleteAttachment
    return {
      ...attachment,
      status: { type: 'complete' },
      content: [{
        type: 'text',
        text: `[${attachment.name}](${await this.getPreviewUrl(attachment)})`
      }]
    };
  }

  // Internal method for file uploads
  public async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<AttachmentUploadResult> {
    const type = this.mapMimeTypeToAttachmentType(file.type);
    const contentType = file.type || 'application/octet-stream';
    
    // Validate file type
    if (!this.allowedFileTypes.includes(file.type) && 
        !this.allowedFileTypes.includes(`.${file.name.split('.').pop()?.toLowerCase()}`)) {
      throw new Error(`File type not supported. Allowed types: ${this.allowedFileTypes.join(', ')}`);
    }

    // Validate file size (10MB default)
    const maxSizeBytes = this.maxFileSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new Error(`File too large. Maximum size is ${this.maxFileSizeMB}MB`);
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const xhr = new XMLHttpRequest();
      
      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable && onProgress) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            onProgress(percentComplete);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            resolve({
              id: response.fileId || Date.now().toString(),
              name: file.name,
              type: type,
              size: file.size,
              contentType: contentType,
              url: response.fileUrl || URL.createObjectURL(file),
              metadata: {
                ...response.metadata,
                _file: file,
              },
            });
          } else {
            reject(new Error(`Upload failed: ${xhr.statusText}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Network error during file upload'));
        });

        xhr.open('POST', this.apiEndpoint, true);
        xhr.send(formData);
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  // Helper method for file previews
  async getPreviewUrl(attachment: PendingAttachment | CompleteAttachment): Promise<string> {
    // For CompleteAttachment, check if there's an image content part
    if (attachment.status.type === 'complete' && 'content' in attachment) {
      const imageContent = attachment.content?.find(
        (c): c is ImageContentPart => c.type === 'image'
      );
      if (imageContent) {
        return imageContent.image;
      }
    }
    
    // For PendingAttachment or if no image content was found
    if ('file' in attachment && attachment.file) {
      return URL.createObjectURL(attachment.file);
    }
    
    // Fallback to any URL that might be in the attachment's metadata
    const attachmentWithMeta = attachment as ExtendedPendingAttachment;
    if (attachmentWithMeta.metadata?.url && typeof attachmentWithMeta.metadata.url === 'string') {
      return attachmentWithMeta.metadata.url;
    }
    
    return '';
  }
}