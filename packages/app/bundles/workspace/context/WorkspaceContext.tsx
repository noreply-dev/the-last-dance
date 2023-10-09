import { atom } from 'jotai'

export const CurrentPageAtom = atom(1)

export function getComputedPage(currentPage: any, human: any) {
  return human ? currentPage : currentPage - 1
}
