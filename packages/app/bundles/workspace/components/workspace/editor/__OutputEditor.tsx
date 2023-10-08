'use client'

import { ConfigContext } from "@/context/ConfigContext";
import { WorkspaceContext } from "@/context/WorkspaceContext";
import Image from "next/image";
import { useContext, useEffect, useRef } from "react";

export function OutputEditor() {
  const { workspace, setWorkspace } = useContext(WorkspaceContext)
  const { config } = useContext(ConfigContext)

  function reparse() {
    const currentPage = workspace.currentPage
    const updates: any = {} // create an object for A.T.O.M.I.C update

    // if is validated remove from validated array
    if (workspace.pagesIndexes.includes(currentPage)) {
      const oldPagesIndexes = [...workspace.pagesIndexes]
      const indexOfCurrentPage = oldPagesIndexes.indexOf(currentPage)
      oldPagesIndexes.splice(indexOfCurrentPage, 1)

      updates.pagesIndexes = oldPagesIndexes
    }

    // remove from the pages array
    const pages = [...workspace.pages]
    pages[currentPage] = null
    updates.pages = pages

    // update the workspace
    setWorkspace({
      ...workspace,
      ...updates
    })
  }

  return <>
    <h1
      className="text-white text-xl"
    >Products editor</h1>
    <div className="h-full w-full overflow-scroll">
      <code className="text-white h-full w-full gap-6">
        {/*         {
          workspace.pages[workspace.currentPage].products.map((product: any, index: number) => {
            return <ProductArea product={product} key={product.isId} />
          })
        } */}
        {
          workspace.pages[workspace.currentPage].products.map((product: any, index: number) => {
            return <ProductArea product={product} key={product.isId} />
          })
        }
      </code>
    </div>
    <div className="h-fit w-full flex flex-row justify-center items-center
      gap-4"
    >
      <button
        onClick={() => {
          // avoid multiples pushes
          if (workspace.pagesIndexes.includes(workspace.currentPage)) return

          const pagesIndexes = [...workspace.pagesIndexes]
          pagesIndexes.push(workspace.currentPage) // validate current page
          setWorkspace({
            ...workspace,
            pagesIndexes
          })
        }}
        className="bg-[#47FF5A] h-10 w-10 grid place-items-center rounded-lg
          group cursor-pointer">
        <Image
          className="group-hover:scale-[1.3]
            transition-all ease-in-out duration-[0.3s]"
          src="/check.svg"
          alt="save the current pdf as a well parsed"
          width={14}
          height={14}
        />
      </button>
      <button
        onClick={reparse}
        className="bg-[#1F1F1F] h-10 w-10 grid place-items-center rounded-lg
          group cursor-pointer"
      >
        <Image
          className="group-hover:rotate-[90deg] group-hover:scale-[1.1]
            transition-all ease-in-out duration-[0.3s]"
          src="/reedit.svg"
          alt="icon to go to the editor again an regenerate response"
          width={14}
          height={14}
        />
      </button>
    </div>
  </>
}


function ProductArea({ product }: { product: any }) {
  const textAreaRef = useRef<any>(null)

  // set the textArea height to its scrollHeight
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current!.style.height = textAreaRef.current!.scrollHeight + 'px'
    }
  }, [textAreaRef])

  return <textarea
    ref={textAreaRef}
    key={product.isId}
    className="w-full bg-transparent resize-none outline-none borde-none
      rounded-md hover:bg-[#1F1F1F] px-4 py-2
      cursor-pointer"
    defaultValue={JSON.stringify(product, null, 2)}
  />
}