"use client"

import * as React from "react"
import { X, Search as SearchIcon, MessageCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface ChatItem {
  id: string
  title: string
  timestamp: Date
}

interface SearchPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchPopup({ isOpen, onClose }: SearchPopupProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Sample chat data - replace with your actual data
  const chatItems: ChatItem[] = [
    { id: '1', title: 'New chat', timestamp: new Date() },
    { id: '2', title: 'How to use the assistant', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    { id: '3', title: 'Project ideas', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  ]

  // Group chats by date
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
  
  const groupedChats = chatItems.reduce((acc, chat) => {
    const date = chat.timestamp.toDateString()
    const group = date === today ? 'Today' : date === yesterday ? 'Yesterday' : 'Older'
    if (!acc[group]) {
      acc[group] = []
    }
    acc[group].push(chat)
    return acc
  }, {} as Record<string, ChatItem[]>)

  // Filter chats based on search query
  const filteredGroups = Object.entries(groupedChats).reduce((acc, [group, chats]) => {
    const filtered = chats.filter(chat => 
      chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    if (filtered.length > 0) {
      acc[group] = filtered
    }
    return acc
  }, {} as Record<string, ChatItem[]>)

  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/30 dark:bg-black/50 backdrop-blur-sm transition-colors duration-200 overflow-y-auto" 
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#1e1e1e] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-200 transform origin-top my-8 mx-4"
        style={{
          opacity: isOpen ? 1 : 0.95,
          transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.98)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center bg-white/95 dark:bg-[#1e1e1e]/95 backdrop-blur-sm">
          <SearchIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search chats..."
            className="flex-1 bg-transparent border-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Chat List */}
        <div className="overflow-visible">
          {Object.entries(filteredGroups).map(([group, chats]) => (
            <div key={group} className="py-1">
              <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {group}
              </div>
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 flex items-center gap-3 transition-colors duration-150 rounded-md mx-2 my-1"
                  onClick={() => {
                    router.push(`/chat/${chat.id}`)
                    onClose()
                  }}
                >
                  {chat.title === 'New chat' ? (
                    <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      <Plus className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                      <MessageCircle className="h-4 w-4" />
                    </div>
                  )}
                  <span className="truncate">{chat.title}</span>
                </button>
              ))}
            </div>
          ))}
          
          {Object.keys(filteredGroups).length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <div className="mx-auto w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <SearchIcon className="h-5 w-5" />
              </div>
              <p className="font-medium">No matching chats found</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
