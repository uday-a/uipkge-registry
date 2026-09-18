import { createContext, useContext } from 'react'

export const StoryCodeContext = createContext<Record<string, string>>({})

export function useStoryCode(title: string) {
  const codeMap = useContext(StoryCodeContext)
  return codeMap[title] || ''
}
