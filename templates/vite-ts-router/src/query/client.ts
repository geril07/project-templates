import { QueryClient, QueryCache } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    /** log errors in case something is wrong,
     * by default there are no errors from tanstack query
     */
    onError: (error) => {
      console.error(error)
    },
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 3 * 60 * 1000,
      retry: 0,
      // retryOnMount: false,
    },
    mutations: {
      retry: 0,
    },
  },
})
