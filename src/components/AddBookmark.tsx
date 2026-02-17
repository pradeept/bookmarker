'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

import { useRouter } from 'next/navigation'

export function AddBookmark() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
        setLoading(false)
        return
    }

    const { error } = await supabase.from('bookmarks').insert({
      title,
      url,
      user_id: user.id
    })

    setLoading(false)
    if (!error) {
      setTitle('')
      setUrl('')
      setOpen(false)
      router.refresh()
    } else {
        console.error(error)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700 active:scale-95">
          <Plus className="h-4 w-4" />
          Add Bookmark
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-2xl md:w-full dark:bg-gray-900 border-gray-100 dark:border-gray-800">
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <Dialog.Title className="text-xl font-bold leading-none tracking-tight text-gray-900 dark:text-white">Add New Bookmark</Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 dark:text-gray-400">
              Paste a URL and give it a memorable title.
            </Dialog.Description>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-6 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., My Favorite Blog"
                className="flex h-11 w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-white dark:focus:ring-blue-500 transition-all"
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="url" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                URL
              </label>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex h-11 w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-white dark:focus:ring-blue-500 transition-all"
                required
              />
            </div>
            <div className="flex justify-end gap-3 mt-2">
                <Dialog.Close asChild>
                    <button type="button" className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-700">
                        Cancel
                    </button>
                </Dialog.Close>
                <button type="submit" disabled={loading} className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700">
                    {loading ? 'Saving...' : 'Save Bookmark'}
                </button>
            </div>
          </form>
          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
