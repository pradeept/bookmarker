'use client'

import { Bookmark } from '@/types'
import { BookmarkItem } from './BookmarkItem'
import { useRealtimeBookmarks } from '@/hooks/useRealtimeBookmarks'

export function BookmarkList({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
  const bookmarks = useRealtimeBookmarks(initialBookmarks)

  if (bookmarks.length === 0) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-12 text-center dark:border-gray-800 dark:bg-gray-900/50">
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No bookmarks yet</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
          Your collection is empty. Click the button above to add your first bookmark.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8 pb-12">
      {bookmarks.map((bookmark) => (
        <BookmarkItem key={bookmark.id} bookmark={bookmark} />
      ))}
    </div>
  )
}
