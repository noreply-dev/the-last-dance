/* eslint-disable no-labels */
const getConfig = (_config) => {
  const config = {
    ignoreOperators: ['image', 'rectangle'],
    remapOperatorsKeys: [],
    ignoreFrontPages: true
  }

  const currConfig = {
    ...config,
    ..._config
  }

  const newOperators = {}

  currConfig.remapOperatorsKeys.forEach((curr) => {
    const keys = curr.split('.')
    newOperators[keys[0]] = keys[1]
  })

  currConfig.remapOperatorsKeys = { ...newOperators }

  return currConfig
}

exports.filterPdfJson = (pdf, queryParams) => {
  if (!pdf) {
    console.error('The pdf json is empty')
    return undefined
  }

  const config = getConfig(queryParams)

  const filteredJson = {
    pagesCount: pdf.pagesCount,
    pdfVersion: pdf.pdfVersion,
    pages: []
  }

  page:
  for (let i = 0; i < pdf.pages.length; i++) {
    const page = pdf.pages[i]
    let entities = []

    entity:
    for (let x = 0; x < page.data.length; x++) {
      const entity = page.data[x]

      // ingore entities based on the config
      if (config.ignoreOperators.includes(entity.type)) {
        continue entity
      }

      // op.args.x => op.x
      Object.keys(entity.args).forEach(arg => {
        entity[arg] = entity.args[arg]
      })

      delete entity.args

      // format each operator type
      switch (entity.type) {
        case 'text':
          delete entity.scale
          break

        case 'image':
          // ignore the images that fills all the page
          if (config.ignoreFrontPages && (entity.height + 120) >= page.height && (entity.width + 150) >= page.width) {
            entities = []
            continue page
          }

          delete entity.height
          delete entity.width
          break

        case 'rectangle':
          delete entity.height
          delete entity.width
          break
      }

      // if the new name for this operator has been specified, change.
      if (config.remapOperatorsKeys[entity.type]) {
        entity.type = config.remapOperatorsKeys[entity.type]
      }

      // remove the duplicated entities extracted from the pdf
      for (let i = 0; i < entities.length; i++) {
        const curr = entities[i]
        if (JSON.stringify(curr) === JSON.stringify(entity)) {
          continue entity
        }
      }

      entities.push(entity)
    }

    // if length is more than 0 push
    if (entities.length > 0) {
      filteredJson.pages.push({
        entities,
        height: pdf.pages[i].height,
        width: pdf.pages[i].width
      })
    }
  }

  return filteredJson
}
