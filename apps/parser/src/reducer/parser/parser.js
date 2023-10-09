const pdfLib = require('pdfjs-dist')

const translator = {
  showText: 'text',
  paintImageXObject: 'image',
  'constructPath-rectangle': 'rectangle'
}

const debugContent = {
  data: '',
  page: 0
}

const debug = (operatorType, args, page, _debug) => {
  if (_debug) {
    const operator = `
            --------- ${operatorType} ----------
            ${JSON.stringify(args)}  
        `

    if (debugContent.page !== page) {
      debugContent.data += '//////////////// PAGE ' + page + ' ////////////////'
      debugContent.page = page
    }

    debugContent.data += operator
  }
}

const getPdfJson = async (pdfPath, _debug) => {
  const pdf = await pdfLib.getDocument({
    url: pdfPath,
    useSystemFonts: true
  }).promise
  const metadata = await pdf.getMetadata()

  const numPages = pdf.numPages
  const pages = []

  // Iterate over each page
  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const pageEntities = await getPageEntities(page, pageNum, _debug)

    pages.push({
      height: page.getViewport({ scale: 1.0 }).height,
      width: page.getViewport({ scale: 1.0 }).width,
      data: pageEntities
    })
  }

  const sortedPages = sortpages(pages)

  const pdfJSON = {
    pagesCount: numPages,
    pdfVersion: metadata.info.PDFFormatVersion,
    creator: metadata.info.Creator,
    producer: metadata.info.Producer,
    fileSize: (metadata.contentLength / 1024 / 1024).toFixed(2),
    pages: sortedPages
  }

  return [pdfJSON, debugContent]
}

// Iterate over the page entities and return entities array
const getPageEntities = async (page, pageNum, _debug) => {
  const operatorList = await page.getOperatorList()
  const entities = []
  const fontData = {
    size: 1,
    ascent: 0,
    descent: 0
  }

  for (let i = 0; i < operatorList.fnArray.length; i++) {
    // Retrieve the name of the command
    const commandName = Object.keys(pdfLib.OPS).find(key => pdfLib.OPS[key] === operatorList.fnArray[i])

    const args = operatorList.argsArray[i]

    if (commandName === 'setFont') {
      const fontIdentifier = args[0]
      const fontFamily = page.commonObjs.get(fontIdentifier)

      // set current texts font config
      fontData.size = args[1]
      fontData.ascent = fontFamily.ascent
      fontData.descent = fontFamily.descent

      continue
    }

    if (commandName === 'showText') {
      // args is an array of arguments. In case of showText, the first argument is the text
      // spreaded on multiple chars inside an array. We need to concatenate them to get the full text
      const text = args[0].reduce((total, p) => total + (p.unicode ? p.unicode : ''), '')
      const textWidth = args[0].reduce((total, p) => total + (p.width ? p.width * 0.01 : 0), 0)

      // Get the text transform operator data
      const textPreviousArgs = operatorList.argsArray[i - 1]
      const textPreviousOperator = operatorList.fnArray[i - 1]
      const textPreviousOperatorName = Object.keys(pdfLib.OPS).find(key => pdfLib.OPS[key] === textPreviousOperator)

      // Append text until some entity have positioning
      // operator
      if (
        textPreviousOperatorName !== 'setTextMatrix' &&
        textPreviousOperatorName !== 'moveText' &&
        entities.length) {
        const oldText = entities[entities.length - 1].args.plainText
        entities[entities.length - 1].args.plainText = oldText + text
        continue
      }

      let xStart = 'N/A'
      let xEnd = 'N/A'
      let yStart = 'N/A'
      let yEnd = 'N/A'

      let scale = [1, 1]

      if (textPreviousOperatorName === 'setTextMatrix' && textPreviousArgs.length) {
        xStart = textPreviousArgs[4]
        yStart = textPreviousArgs[5]

        scale = [
          textPreviousArgs[0],
          textPreviousArgs[3]
        ]
      } else if (textPreviousOperatorName === 'moveText' && textPreviousArgs.length) {
        // Set the next entity scale
        scale = [
          entities[entities.length - 1].args.scale[0],
          entities[entities.length - 1].args.scale[1]
        ]

        // Tm data (TextArray)
        const Tx = entities[entities.length - 1].args.x
        const Ty = entities[entities.length - 1].args.y
        const scaleX = scale[0]
        const scaleY = scale[1]

        // Td data (MoveText)
        const TdX = textPreviousArgs[0]
        const TdY = textPreviousArgs[1]

        // Calculate text new coordinates
        xStart = (TdX * scaleX) + Tx
        yStart = (TdY * scaleY) + Ty
      }

      // end coordinates
      xEnd = xStart + textWidth // x + textWidth
      yEnd = yStart + ((fontData.ascent - fontData.descent) * fontData.size * scale[1]) // (fontAscent - fontDescent) * fontSize * a

      entities.push({
        type: translator[commandName],
        args: {
          plainText: text,
          xStart,
          xEnd,
          yStart,
          yEnd,
          scale
        }
      })

      continue
    }

    if (commandName === 'paintImageXObject') {
      const imageName = args[0]
      const width = args[1]
      const height = args[2]

      const transformArgs = operatorList.argsArray[i - 2]
      const transformCommand = operatorList.fnArray[i - 2]
      const transformCommandName = Object.keys(pdfLib.OPS).find(key => pdfLib.OPS[key] === transformCommand)

      let x = 'N/A'
      let y = 'N/A'

      if (transformCommandName === 'transform' && transformArgs.length) {
        x = transformArgs[4]
        y = transformArgs[5]
      }

      entities.push({
        type: translator[commandName],
        args: {
          imageName,
          width,
          height,
          x,
          y
        }
      })
    }

    if (commandName === 'constructPath') {
      const op = args[0][0]
      if (op !== 19) continue // if it is not a rectangle

      const rectangleArgs = args[1]
      entities.push({
        type: translator[commandName + '-rectangle'],
        args: {
          x: rectangleArgs[0],
          y: rectangleArgs[1],
          height: rectangleArgs[2],
          width: rectangleArgs[3]
        }
      })
    }

    debug(commandName, args, pageNum, _debug)
  }

  return [...entities]
}

const sortpages = (pages) => {
  for (let i = 0; i < pages.length; i++) {
    const curr = pages[i].data

    curr.sort((a, b) => b.args.y - a.args.y || a.args.x - b.args.x)

    for (let i = 0; i < curr.length; i++) {
      if (Math.abs((curr[i].args.y - curr[i - 1]?.args?.y)) < 1) {
        curr[i].args.y = curr[i - 1].args.y
      }
    }

    curr.sort((a, b) => b.args.y - a.args.y || a.args.x - b.args.x)

    pages[i].data = [...curr]
  }

  return pages
}

module.exports = {
  getPdfJson
}
