'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Bookmark } from '@/types'

export function useRealtimeBookmarks(initialBookmarks: Bookmark[]) {
  const [bookmarks, setBookmarks] = useState(initialBookmarks)
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    // We set the initial bookmarks if they change (e.g. from server re-fetch)
    setBookmarks(initialBookmarks)
  }, [initialBookmarks])

  useEffect(() => {
    // Note: The channel name can be anything, but using a unique name 
    // or scoped name helps debugging.
    const channel = supabase
      .channel('realtime-bookmarks')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'bookmarks',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks((prev) => [payload.new as Bookmark, ...prev])
          } else if (payload.eventType === 'DELETE') {
             setBookmarks((prev) => prev.filter((item) => item.id !== payload.old.id))
          } else if (payload.eventType === 'UPDATE') {
              setBookmarks((prev) => prev.map((item) => item.id === payload.new.id ? payload.new as Bookmark : item))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return bookmarks
}
