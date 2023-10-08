'use client'

import { ConfigProvider } from "context/ConfigContext"
import { WorkspaceContext, getComputedPage } from "context/WorkspaceContext"
import { useContext, useEffect } from "react"
import { Products } from "./editor/Products"
import { useAtom } from 'jotai'
import { FocusFieldAtom, FocusProductAtom, ProductsAtom, ProductsSchemasAtom } from "context/ProductsContext"
import { atom } from 'jotai'

export const ProductChangeAtom = atom('nothing')

export default function Editor() {
  const { workspace } = useContext(WorkspaceContext)

  const [pagesSchemas, setPagesSchemas] = useAtom(ProductsSchemasAtom)
  const [pagesData, setPagesData] = useAtom(ProductsAtom)
  const [focusProduct, setFocusProduct] = useAtom(FocusProductAtom)
  const [focusField, setFocusField] = useAtom(FocusFieldAtom)

  useEffect(() => {
    console.log(pagesData)
  }, [pagesData])

  // add shortcuts listeners
  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      // add to schema
      if (event.ctrlKey && event.key.toLowerCase() === "n") {
        event.preventDefault()
        const input = document.getElementById('schemaInput')
        if (input) {
          input.focus()
        }
        return
      }

      // go up
      if (event.ctrlKey && event.key.toLowerCase() === "s") {
        event.preventDefault()

        const newIndex = (focusField - 1) <= 0
          ? 0
          : focusField - 1

        setFocusField(newIndex)
      }

      // go down
      if (event.ctrlKey && event.key.toLowerCase() === "a") {
        event.preventDefault()

        const upperBound = Object.keys(
          pagesData[getComputedPage(workspace, false)][focusProduct]
        ).length - 1

        const newIndex = (focusField + 1) >= upperBound
          ? upperBound
          : focusField + 1

        setFocusField(newIndex)
      }

      // next product
      if (event.code === 'Space' && event.shiftKey) {
        event.preventDefault()

        if ((focusProduct + 1) <= pagesData[getComputedPage(workspace, false)].length - 1) {
          setFocusProduct(focusProduct + 1)
          return
        }

        // create empty product object
        const fields = pagesSchemas[getComputedPage(workspace, false)]
          .split(',')
          .filter(field => field !== '')
          .map((field: any) => field.trim())

        const defaultObject: any = {}

        fields.forEach((field: string) => {
          defaultObject[field] = 'not set'
        })

        const arr = [...pagesData]

        // add new blank product
        arr[getComputedPage(workspace, false)].push(defaultObject)

        // add a new product
        setPagesData(arr)

        setFocusProduct(focusProduct + 1)
        setFocusField(0)
      }

      // go to the previous product
      if (event.ctrlKey && event.key === "Backspace") {
        setFocusProduct(focusProduct <= 0 ? 0 : focusProduct - 1)
        setFocusField(0)
      }
    };

    window.addEventListener("keydown", keyDownHandler);

    return () => removeEventListener("keydown", keyDownHandler)
  }, [pagesData, focusProduct, focusField,
    setPagesData, setFocusProduct, setFocusField, workspace])

  return <ConfigProvider>
    <div className="relative h-full w-full bg-[#171717] px-10 py-10 flex flex-col
      justify-start items-start overflow-y-scroll overflow-x-hidden"
    >
      {/*         {
          workspace.pages[workspace.currentPage]
            ? <OutputEditor />
            : <ConfigBuilder />
        } */}
      <Products />
    </div >
  </ConfigProvider>
}