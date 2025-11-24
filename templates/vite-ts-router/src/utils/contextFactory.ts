import { createContext, useContext } from 'react'

export const createContextFactory = <T>(name = 'Context') => {
  const Context = createContext<T | undefined>(undefined)

  const useContextHook = () => {
    const context = useContext(Context)
    if (context === undefined) {
      throw new Error(`${name} must be used within Provider`)
    }
    return context
  }

  return { Context, useContextHook }
}
