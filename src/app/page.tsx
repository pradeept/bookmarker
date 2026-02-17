import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { BookmarkList } from '@/components/BookmarkList'
import { AddBookmark } from '@/components/AddBookmark'
import { SignOut } from '@/components/SignOut'
import { Bookmark } from '@/types'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-gray-50/50 dark:bg-gray-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
                 <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">My Bookmarks</h1>
                 <p className="text-sm text-gray-500 dark:text-gray-400">Manage and access your saved links</p>
            </div>
         
          <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600 hidden md:inline-block dark:text-gray-400">
                {user.email}
              </span>
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
            <AddBookmark />
            <SignOut />
          </div>
        </div>
        
        <BookmarkList initialBookmarks={(bookmarks as Bookmark[]) || []} />
      </div>
    </main>
  )
}
