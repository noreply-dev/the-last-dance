const fs = require('fs')
const path = require('path')
const { Router } = require('express')
const { _400, _500, _200 } = require('../lib/http')
const uploadController = require('../controllers/upload.controller')
const { PDFDocument } = require('pdf-lib')

const router = Router()

async function resolvePdfUrl(req, res, next) {
  const basePath = path.join(__dirname, '../../../../')
  const body = req.body
  console.log(body)

  if (!body.pdfName
    || !body.firstProduct
    || isNaN(body.targetPage)
    || !body.pdfPath) {
    return _400(res, 'Unsuficient params to post this endpoint')
  }

  const pdfData = fs.readFileSync(path.join(basePath, body.pdfPath))
  const tempPdfPath = path.join(__dirname, '../.temp/', Date.now() + '.pdf')

  try {
    if (!pdfData) {
      throw new Error('Readed pdf data is empty')
    }
    const file = await fileFromPdfPage(pdfData, body.targetPage)

    fs.writeFileSync(tempPdfPath, file)
  } catch (err) {
    console.log(err)
    return _500(res, 'Cannot write file to the temp folder')
  }

  req.file = {
    filename: body.pdfName,
    path: tempPdfPath,
    page: body.targetPage,
  }
  req.firstProduct = body.firstProduct
  next()
}

router.post('/', resolvePdfUrl, async (req, res) => {
  const { query, file, firstProduct } = req
  console.log('query params', query)

  if (!file) {
    return _400(res, 'A file is required to post this endpoint')
  }

  console.log('file', file)
  return _200(res, 'WItrhout me')

  query.firstProduct = { ...firstProduct }
  const gptResponse = await uploadController.pdfReducer(file.path, query)

  if (!gptResponse) {
    return _500(res, 'Something went wrong parsing the file.')
  }

  return _200(res, undefined, gptResponse)
})

router.post('/page', async (req, res) => {
  const { query } = req
  console.log('query params', query)
  const file = req.file

  if (!file) {
    return _400(res, 'A file is required to post this endpoint')
  }

  // mimetype: 'application/pdf',
  if (file.mimetype.split('/')[1] !== 'pdf') {
    return _400(res, 'Filetype is not supported by the service')
  }

  if (query?.page) {
    setTimeout(() => {
      const page = cachedResponses[Number(query.page) - 1]
      return _200(res, undefined, page)
    }, 6000)
    fs.unlinkSync(file.path)

    return
  }

  const gptResponse = await uploadController.singlePagePdfReducer(file.path, query)

  if (!gptResponse) {
    return _500(res, 'Something went wrong parsing the file.')
  }

  return _200(res, undefined, gptResponse)
})

module.exports = router

async function fileFromPdfPage(file, pageIndex) {
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
  return pdfBytes
}
