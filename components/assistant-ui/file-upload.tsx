import { useCallback, useState } from "react";
import { Paperclip, X, FileText, FileImage, FileArchive, File, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

type FilePreviewProps = {
  file: File;
  onRemove: () => void;
  uploadProgress?: number;
};

const FileIcon = ({ type }: { type: string }) => {
  const iconProps = { className: "h-4 w-4 text-muted-foreground" };
  
  if (type.startsWith("image/")) {
    return <FileImage {...iconProps} />;
  }
  if (type === "application/pdf") {
    return <FileText {...iconProps} />;
  }
  if (type.includes("zip") || type.includes("compressed")) {
    return <FileArchive {...iconProps} />;
  }
  return <File {...iconProps} />;
};

const FilePreview = ({ file, onRemove, uploadProgress }: FilePreviewProps) => {
  const isUploading = uploadProgress !== undefined && uploadProgress < 100;
  
  return (
    <div className="flex items-center justify-between rounded-md border bg-muted/50 p-2 text-sm">
      <div className="flex items-center gap-2 overflow-hidden">
        <FileIcon type={file.type} />
        <span className="truncate" title={file.name}>
          {file.name}
        </span>
        <span className="text-xs text-muted-foreground">
          {(file.size / 1024).toFixed(1)} KB
        </span>
      </div>
      
      <div className="flex items-center gap-1">
        {isUploading && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>{uploadProgress}%</span>
          </div>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onRemove}
          disabled={isUploading}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

type FileUploadProps = {
  onFilesSelected: (files: File[]) => Promise<void>;
  className?: string;
  disabled?: boolean;
  maxFiles?: number;
  acceptedFileTypes?: string;
};

export const FileUpload = ({
  onFilesSelected,
  className,
  disabled = false,
  maxFiles = 5,
  acceptedFileTypes = ".pdf,.txt,.doc,.docx,.csv,image/*",
}: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputId = "file-upload";

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = Array.from(event.target.files || []);
      
      if (newFiles.length === 0) return;
      
      const updatedFiles = [...files, ...newFiles].slice(0, maxFiles);
      setFiles(updatedFiles);
      
      try {
        setIsUploading(true);
        await onFilesSelected(updatedFiles);
      } catch (error) {
        console.error("Error uploading files:", error);
        toast.error(error instanceof Error ? error.message : "Failed to upload files");
      } finally {
        setIsUploading(false);
        // Reset the file input to allow selecting the same file again if needed
        event.target.value = "";
      }
    },
    [files, maxFiles, onFilesSelected]
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      const newFiles = files.filter((_, i) => i !== index);
      setFiles(newFiles);
      // You might want to call onFilesSelected here if you want to update the parent immediately
    },
    [files]
  );

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <input
          id={fileInputId}
          type="file"
          className="hidden"
          multiple
          onChange={handleFileChange}
          accept={acceptedFileTypes}
          disabled={disabled || isUploading || files.length >= maxFiles}
        />
        <label
          htmlFor={fileInputId}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
            "bg-muted text-muted-foreground hover:bg-muted/80",
            "cursor-pointer disabled:pointer-events-none disabled:opacity-50",
            isUploading && "opacity-50"
          )}
        >
          <Paperclip className="h-3.5 w-3.5" />
          <span>Add files</span>
        </label>
        
        {files.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {files.length} of {maxFiles} files
          </span>
        )}
      </div>

      <div className="space-y-2">
        {files.map((file, index) => (
          <FilePreview
            key={`${file.name}-${index}`}
            file={file}
            onRemove={() => handleRemoveFile(index)}
            uploadProgress={uploadProgress[file.name]}
          />
        ))}
      </div>
    </div>
  );
};
