const fs = require('fs')
const { getPdfJson } = require('./parser')

exports.parseFile = async (path, output) => {
  const getDebug = false
  const [pdfJSON, debugContent] = await getPdfJson(path, getDebug)

  if (output) {
    try {
      fs.writeFileSync(output, debugContent.data)
    } catch (err) {
      throw new Error(err)
    }
  }

  return getDebug ? debugContent : pdfJSON
}
