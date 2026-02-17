'use client'

import { Bookmark } from '@/types'
import { Trash2, ExternalLink } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'

export function BookmarkItem({ bookmark }: { bookmark: Bookmark }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const supabase = createClient()

  const handleDelete = async () => {
    setIsDeleting(true)
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', bookmark.id)
    
    if (error) {
      console.error('Error deleting bookmark:', error)
      setIsDeleting(false)
    }
  }

  return (
    <div className="group relative flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-blue-100 dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-blue-900/30">
      <div className="flex items-center gap-4 overflow-hidden flex-1">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
          <ExternalLink className="h-5 w-5" />
        </div>
        <div className="flex flex-col overflow-hidden min-w-0">
          <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {bookmark.title}
          </h3>
          <a 
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer" 
            className="truncate text-xs text-gray-500 hover:underline dark:text-gray-400"
          >
            {bookmark.url}
          </a>
        </div>
      </div>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="ml-4 rounded-lg p-2 text-gray-400 transition-all opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 dark:hover:bg-red-900/20 dark:hover:text-red-400"
        aria-label="Delete bookmark"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}
