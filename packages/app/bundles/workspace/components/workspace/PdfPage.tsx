import { FocusFieldAtom, FocusProductAtom, ProductsAtom } from "../../context/ProductsContext"
import { CurrentPageAtom, getComputedPage } from "../../context/WorkspaceContext"
import { useCallback, useEffect, useRef, useState } from "react"
import { Document, Page } from "react-pdf"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useAtom } from "jotai"
import { FileBlobAtom } from '../../nextPages/workspace';
import Image from "next/image"

// assets
import hardDrive from '../../resources/hard-drive.svg'
import fileDown from '../../resources/file-down.svg'
import fileStack from '../../resources/file-stack.svg'

export default function PdfPage() {
  const [fileBlob] = useAtom(FileBlobAtom)
  const [currentPage] = useAtom(CurrentPageAtom)

  const [pagesData, setPagesData] = useAtom(ProductsAtom)
  const [focusProduct, setFocusProduct] = useAtom(FocusProductAtom)
  const [focusField, setFocusField] = useAtom(FocusFieldAtom)

  const [pdfWidth, setPdfWidth] = useState(0)
  const [pdfHeight, setPdfHeight] = useState(0)
  const parentRef = useRef<any>(null)

  useEffect(() => {
    if (parentRef.current) {
      setPdfWidth(parentRef.current.clientWidth)
      setPdfHeight(parentRef.current.clientHeight)
    }
  }, [parentRef])

  function Loader() {
    return <div
      className="flex flex-col justify-center items-center"
      style={{ width: pdfWidth, height: pdfHeight }}>
      {/* Here will go a loader and transparent background */}
    </div>
  }

  const onPageClick = useCallback((event: any) => {
    const target = event.target as HTMLElement

    if (target.childNodes.length > 1) {
      console.log('Too may childs to know which select')
      return
    }

    if (target) {
      const newPagesData: any = [...pagesData]
      // since the Object.keys returns always an array ordered
      // following a set of rules.The focusField index works here and
      // on the fields editor on the right
      let field = Object.keys(
        newPagesData[getComputedPage(currentPage, false)][focusProduct]
      )[focusField]

      if (!field) {
        field = 'set name'
      }

      if (event.shiftKey) {
        newPagesData[getComputedPage(currentPage, false)][focusProduct][field] =
          newPagesData[getComputedPage(currentPage, false)][focusProduct][field]
          + ' ' + target.innerText
      } else {
        newPagesData[getComputedPage(currentPage, false)][focusProduct][field] =
          target.innerText
      }

      setPagesData(newPagesData)

      // focus field
      const max = Object.keys(
        newPagesData[getComputedPage(currentPage, false)][focusProduct]
      ).length - 1

      const newField = focusField + 1 > max
        ? focusField
        : focusField + 1

      setFocusField(newField)
    }
  }, [pagesData, focusField]);

  return <div className="relative h-full w-full flex flex-col
    justify-center items-center" ref={parentRef}
    onClick={(e) => {
      e.preventDefault()
      if (e.shiftKey) {
        console.log('shift + click')
      }
    }}
  >
    <TransformWrapper
      initialScale={0.8}
      minScale={0.8}
      centerOnInit={true}
    >
      <TransformComponent
        wrapperClass="min-w-full min-h-full m-0 p-0"
        contentClass="min-w-full min-h-full"
      >
        {
          fileBlob && <Document
            file={fileBlob}
            className="h-fit w-fit overflow-scroll rounded-2xl z-0"
          >
            <Page
              width={pdfWidth}
              pageNumber={currentPage}
              className="overflow-hidden
          transition-all ease-in-out duration-[0.12s] rounded-2xl z-0"
              onClick={(e) => onPageClick(e)}
              renderTextLayer={true}
              renderAnnotationLayer={false}
              renderForms={false}
              loading={Loader}
            />
          </Document>
        }
      </TransformComponent>
    </TransformWrapper>
    <StorageActions />
  </div>
}

function StorageActions() {
  const [currentPage] = useAtom(CurrentPageAtom)
  const [productsData] = useAtom(ProductsAtom)

  const actions = [
    {
      icon: hardDrive,
      text: 'save changes',
      fn: () => { },
    },
    {
      icon: fileDown,
      text: 'download page data',
      fn: () => {
        const page = productsData[getComputedPage(currentPage, false)]
        const obj = {
          page: getComputedPage(currentPage, false),
          data: page
        }

        const json = JSON.stringify(obj, null, 2)
        const blob = new Blob([json], {
          type: 'application/json'
        })
        const blobUrl = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = blobUrl
        a.download = obj.page

        a.click()
      },
    },
    {
      icon: fileStack,
      text: 'download pdf data',
      fn: () => {
        const pages = [...productsData]
        const obj = {
          pages: pages
        }

        const json = JSON.stringify(obj, null, 2)
        const blob = new Blob([json], {
          type: 'application/json'
        })
        const blobUrl = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = blobUrl
        a.download = getComputedPage(currentPage, false)

        a.click()
      },
    }
  ]

  return (
    <div className="absolute bottom-10 left-1/2 h-fit w-fit flex flex-row
      justify-start items-center p-2 bg-[#292929] rounded-md translate-x-[-50%]
      border border-solid border-[#4E4E4E] gap-1 overflow-visible">
      {
        actions.map(action => {
          return <div
            onClick={action.fn}
            key={action.icon}
            className="relative group py-2 px-3 hover:bg-[#4E4E4E]
              rounded-md cursor-pointer transition-all ease-in-out duration-[0.08s] overflow-visible"
          >
            <Image
              className="opacity-30 transition-all ease-in-out duration-[0.08s] 
                group-hover:opacity-80 group-active:scale-[0.86] select-none"
              src={action.icon}
              alt="Image icon for the action"
              height={23}
              width={23}
            />
            <p
              className="absolute opacity-0 scale-75 top-[-50px] left-1/2 translate-x-[-50%] whitespace-nowrap 
                bg-[#0056ff] px-2 py-1 group-hover:opacity-100 group-hover:scale-100 rounded-md transition-all 
                ease-in-out duration-[0.08s] group-active:scale-[1]"
            >{action.text}</p>
          </div>
        })
      }
    </ div>
  )
}