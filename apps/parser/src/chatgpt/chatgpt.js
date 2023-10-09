const { connectToGPT } = require('./connection')
const { initialize, generatePage, singplePagePdf } = require('./prompts')

exports.generateGptResponse = async (_pages) => {
  const pages = _pages.split('-------------------')

  const openai = await connectToGPT()
  console.log('Generating each page data\n')
  const firstPage = await createContext(openai, pages)
  console.log('- page 1')

  // the chat generated a bad json file
  if (!firstPage?.products) {
    return undefined
  }

  const gptPagesResponse = await getPages(openai, firstPage.products, pages)
  return gptPagesResponse // json array with pages || undefined
}

// first prompt, here we pass the context and the first page
async function createContext(openai, pages) {
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-16k',
      messages: [{
        role: 'user', content: initialize(pages[0])
      }]
    })
    const gptResponse = completion.data.choices[0].message.content
    return JSON.parse(gptResponse)
  } catch (error) {
    if (error.response) {
      console.log(error.response.status)
      console.log(error.response.data)
    } else {
      console.log(error.message)
    }

    return undefined
  }
}

// Generate all the pages json
async function getPages(openai, firstPage, pages) {
  const json = []
  json.push(firstPage)

  // ignore file spec on the 0 position and first page on the 1 position
  for (let i = 1; i < pages.length; i++) {
    console.log('- page ', i + 1)
    const page = await getPage(openai, i, pages[i])

    if (!page?.products) {
      return undefined
    }

    json.push(page.products)
  }
  console.log('\n✓ Done!')

  return json
}

// generate a page json and return
async function getPage(openai, pageNumber, page) {
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-16k',
      messages: [{
        role: 'user', content: generatePage(pageNumber, page)
      }]
    })
    const gptResponse = completion.data.choices[0].message.content
    return JSON.parse(gptResponse)
  } catch (error) {
    if (error.response) {
      console.log(error.response.status)
      console.log(error.response.data)
    } else {
      console.log(error.message)
    }

    return undefined
  }
}

exports.gptSinglePagePdf = async (_pages, madLibs) => {
  // since the pdf is parsed like if it has more than 1 page
  const pages = _pages.split('-------------------')

  console.log(pages)

  const openai = await connectToGPT()
  console.log('Generating page data ⟳')
  console.log('- Using ChatGPT model', madLibs.model)

  let gptResponse

  try {
    const completion = await openai.createChatCompletion({
      model: Number(madLibs.model) === 3 ? 'gpt-3.5-turbo-16k' : 'gpt-4',
      messages: [{
        role: 'user', content: singplePagePdf(pages[0], madLibs)
      }]
    })
    gptResponse = completion.data.choices[0].message.content
    gptResponse = JSON.parse(gptResponse)
  } catch (error) {
    console.log('Bad chatGPT response, not valid JSON 𐄂')
    return undefined
  }

  // the chat generated a bad json file
  if (!(gptResponse?.products)) {
    console.log('Bad chatGPT response 𐄂')
    return undefined
  } else {
    console.log('Generated succesfully ✓')
  }

  return gptResponse // the returned value will be the products or undefined
}
