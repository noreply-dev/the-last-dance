const CLUSTERING_MINIMUN = 0

exports.generator = (obj) => {
  let pdfPrompt = ''

  // get the pdf metadata
  /*
    Object.keys(obj).forEach(key => {
      if (key !== "pages") {
        pdfPrompt += '\n' + key + '      ' + obj[key]
      }
    })

    pdfPrompt += '\n' // add new line when pdf info setted
  */

  // operators args priority
  const args = ['type', 'x', 'y', 'plainText']

  // Generate pages sections
  obj.pages.forEach((page, index) => {
    page.entities.forEach(op => {
      // avoid context with less than the clustering minimun
      // if (context.length <= CLUSTERING_MINIMUN) return

      delete op.xStart
      delete op.xEnd
      delete op.yStart
      delete op.yEnd
      delete op.isRef
      delete op.type

      // order op line based on the priority array
      const opLine = []
      Object
        .keys(op)
        .sort((a, b) => {
          const aIndex = args.indexOf(a)
          const bIndex = args.indexOf(b)
          return aIndex - bIndex
        })
        .forEach(key => {
          opLine.push(op[key])
        })

      pdfPrompt += opLine.join('      ') + '\n'

      // this is for context for the moment the context has been removed
      /* context.forEach(op => {
        // remove unneccesary data of the op
        delete op.xStart
        delete op.xEnd
        delete op.yStart
        delete op.yEnd
        delete op.isRef
        delete op.type

        // order op line based on the priority array
        const opLine = []
        Object
          .keys(op)
          .sort((a, b) => {
            const aIndex = args.indexOf(a)
            const bIndex = args.indexOf(b)
            return aIndex - bIndex
          })
          .forEach(key => {
            opLine.push(op[key])
          })

        pdfPrompt += opLine.join('      ') + '\n'
      }) */
      // Set a difference between context
      pdfPrompt += '\n\n'
    })
    pdfPrompt += '-------------------\n'
  })

  return pdfPrompt
}
