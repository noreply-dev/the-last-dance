'use client'

import style from './pdf.module.css'
import { useContext, useEffect, useState } from "react";
import { pdfjs } from 'react-pdf'
import { Document, Page } from "react-pdf"
import { WorkspaceContext, getComputedPage } from '../../context/WorkspaceContext';
import Image from 'next/image';
import { FocusFieldAtom, FocusProductAtom, ProductsAtom, ProductsSchemasAtom } from '../../context/ProductsContext';
import { useAtom } from 'jotai'
import { fileBlobAtom } from 'pages';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function PdfPreview() {
  const [fileBlobUrl] = useAtom(fileBlobAtom)
  const { workspace, setWorkspace } = useContext(WorkspaceContext)

  const [pagesSchemas, setPagesSchemas] = useAtom(ProductsSchemasAtom)
  const [pagesData, setPagesData] = useAtom(ProductsAtom)
  const [focusProduct, setFocusProduct] = useAtom(FocusProductAtom)
  const [focusField, setFocusField] = useAtom(FocusFieldAtom)


  const [numPages, setNumPages] = useState(0)
  const [innerWidth, _] = useState(0)
  const [pdfWidth, setPdfWidth] = useState(0) // -140 are the 70 · 2 padding

  useEffect(() => {
    setPdfWidth(getSideViewPx(window.innerWidth) - 100)
  }, []) // eslint-disable-line

  function getSideViewPx(width: number) {
    return (15 / 100) * width
  }

  function pdfLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setWorkspace({
      ...workspace,
      currentPage: 1
    })
  }

  function changePage(index: any) {

    // pages data
    const oldData = [...pagesData]
    if (!oldData[index] || !oldData[index].length) { // i is based on machine index and is the target page
      oldData[index] = [{}] // initialize page products array
    }

    console.log(oldData)

    setPagesData(oldData)

    // pages schemas 
    const oldSchemas = [...pagesSchemas]
    if (!oldSchemas[index]) {
      oldSchemas[index] = ""
    }
    setPagesSchemas(oldSchemas)

    // focusing states
    setFocusProduct(0)
    setFocusField(0)

    setWorkspace({
      ...workspace,
      currentPage: index + 1
    })
  }

  return (
    <div className="h-full w-full overflow-scroll px-[50px]">
      <Document file={fileBlobUrl} onLoadSuccess={pdfLoadSuccess}
        className={style.document}>
        {
          Array.from(new Array(numPages), () => 0).map((_, i) => {
            const current = workspace.currentPage === i + 1
            const isValidated = workspace.pagesIndexes.includes(i + 1)

            return (
              <div
                className='relative h-fit w-full m-0 flex flex-col justify-start
                items-center pt-6'
                key={i}
              >
                <Page
                  onClick={() => changePage(i)}
                  pageNumber={i + 1}
                  width={pdfWidth}
                  className={`mb-[15px] rounded-md overflow-hidden
                    cursor-pointer transition-all ease-in-out duration-[0.12s]
                    ${current ? 'opacity' : 'opacity-60'}`}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  renderForms={false}
                />
                {
                  isValidated &&
                  <div
                    className={`absolute bottom-[32px] right-[-5px] 
                      h-[18px] w-[18px] rounded-full grid place-items-center
                      animate-validated transition-all ease-in-out duration-[0.12s]
                      bg-[#00F327]`}
                  >
                    <Image src="/check.svg" alt='check icon for validated pdf pages'
                      height={12} width={12} />
                  </div>
                }
                <p
                  className={`h-fit w-fit text-[17px] transition-all ease-in-out duration-[0.12s]
                    ${current ? 'text-white' : 'text-[#343434]'}`}
                >{i + 1}</p>
              </div>
            )
          })
        }
      </Document >
    </div >
  )
}