const fs = require('fs')
const { filterPdfJson } = require('../reducer/filter/filter.js')
const { parseFile } = require('../reducer/parser/index.js')
const { generator } = require('../reducer/prompt/generator.js')
const { generateGPTResponse } = require('../chatgpt/chatgpt.js')
const { cSort } = require('../reducer/csort/csort.js')

exports.pdfReducer = async (_path, queryParams) => {
  try {
    const pdfJSON = await parseFile(_path)
    const filteredJson = filterPdfJson(pdfJSON, queryParams)
    // const sortedJson = cSort(filteredJson)
    const prompt = generator(filteredJson)
    if (queryParams.debug) return prompt

    const gptResponse = generateGPTResponse(prompt, queryParams)
    return gptResponse
  } catch (err) {
    console.error('Something went wront parsing pdf file :', err)
  } finally {
    fs.unlinkSync(_path)
  }
}
