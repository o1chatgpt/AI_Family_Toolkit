// Mock Supabase client for the image page
const supabase = {
  auth: {
    getSession: async () => ({
      data: {
        session: null,
      },
      error: null,
    }),
  },
  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: any, options: any) => ({
        data: { path },
        error: null,
      }),
      getPublicUrl: (path: string) => ({
        data: {
          publicUrl: `/placeholder.svg?height=512&width=512`,
        },
      }),
    }),
  },
}

export { supabase }

