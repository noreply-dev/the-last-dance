// client-side 
import { getFileDataUri } from "./sessionFs";
import { PDFDocument } from 'pdf-lib'

export async function fileFromPdfPage(pageIndex: number) {
  const file = getFileDataUri() // pdf url

  // type checking
  if (typeof file !== 'string') return null

  // initialize pdf-lib document and document slice 
  const pdfDoc = await PDFDocument.load(file) // load

  // If file has only one page return the file
  if (pdfDoc.getPageCount() <= 1) {
    const pdfBytes = await pdfDoc.save()

    // convert to a file 
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    const pageFile = new File([blob], `${Date.now()}.pdf`, { type: "application/pdf" })

    return pageFile
  }

  const singlePagePdf = await PDFDocument.create() // create

  // get the page and push the page
  const [copiedPage] = await singlePagePdf.copyPages(pdfDoc, [pageIndex])
  singlePagePdf.addPage(copiedPage)

  // save pdf content
  const pdfBytes = await singlePagePdf.save()

  // convert to a file 
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  const pageFile = new File([blob], `${Date.now()}.pdf`, { type: "application/pdf" })

  console.log('working file', pageFile)
  return pageFile
}