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
    const channel = supabase.channel('realtime-bookmarks')

    const subscribe = async () => {
        // wait for auth before subscribing to channel (to avoid RLS error)
        const { data: { session } } = await supabase.auth.getSession()
        // to satisfy linter using session a stub if condition
        if(session){}
        channel
            .on(
                'postgres_changes',
                {
                    event: '*',
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
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('Realtime subscribed')
                }
            })
    }

    subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return bookmarks
}
