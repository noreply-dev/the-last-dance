import React, { createContext, useEffect, useState } from 'react'

export const WorkspaceContext = createContext<any>({
  currentPage: 1,
  pagesIndexes: [],
  pages: []
})

export const WorkspaceProvider = ({ children }: { children: any }) => {
  const [workspace, setWorkspace] = useState({
    currentPage: 1, // selected page
    pagesIndexes: [], // validated pages
    pages: [] // all the responses from each page
  })

  useEffect(() => {
    console.log('workspace', workspace)
  }, [workspace])

  return <WorkspaceContext.Provider value={{ workspace, setWorkspace }}>
    {children}
  </WorkspaceContext.Provider>
}

export function getComputedPage(workspace: any, human: any) {
  return human ? workspace.currentPage : workspace.currentPage - 1
}
