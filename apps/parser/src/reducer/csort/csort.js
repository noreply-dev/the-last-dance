const { genPageGrid } = require('./fill')
const { findContexts } = require('./search')

exports.cSort = (_pages) => {
  const pages = []

  // possibly memory leak too many nested loops
  _pages.pages.forEach(page => {
    const grid = genPageGrid(page) // generate the modules map
    const contexts = findContexts(grid, page) // get the contexts array

    pages.push(contexts)
  })

  _pages.pages = pages

  // return pages
  return _pages
}
