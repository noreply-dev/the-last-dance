/* eslint-disable no-labels */
exports.genPageGrid = (page) => {
  const lines = Math.round(page.height)
  const columns = Math.round(page.width)

  let grid = Array.from({ length: lines }, () => Array.from({ length: columns }, () => 0))

  page.entities.forEach(entity => {
    // skip iteration when no coordinates are available
    if (isNaN(entity.xStart) || isNaN(entity.yStart) ||
      isNaN(entity.xEnd) || isNaN(entity.yEnd)) {
      console.error('⚠ Some coordinates are not defined in the entity')
      return
    }

    let xStart = Math.round(entity.xStart)
    let xEnd = Math.round(entity.xEnd)
    let yStart = Math.round(entity.yStart)
    let yEnd = Math.round(entity.yEnd)

    if (xStart >= columns) xStart = columns - 1 // if more than total width, set the total width -1
    if (xStart < 0) xStart = 0 // if less than 0, set 0

    if (xEnd >= columns) xEnd = columns - 1 // if more than total width, set the total - 1
    if (xEnd < 0) xEnd = 0 // if less than 0, set 0

    if (yStart >= lines) yStart = lines - 1 // if more than total height, set the total - 1
    if (yStart < 0) yStart = 0 // if less than 0, set 0

    if (yEnd >= lines) yEnd = lines - 1 // if more than total height, set the total -1 -1
    if (yEnd < 0) yEnd = 0 // if less than 0, set 0

    // fill the cells
    lines:
    for (let line = yStart; line <= yEnd; line++) {
      columns:
      for (let column = xStart; column <= xEnd; column++) {
        // start module
        if (line === yStart && column === xStart) {
          grid = fillCell(grid, line, column, entity, false)
          continue columns
        }

        grid = fillCell(grid, line, column, entity, true)
      }
    }
  })

  // return page grid
  return grid
}

const fillCell = (grid, y, x, entity, isRef) => {
  // if it's already a module
  if (grid[y][x] !== 0) {
    grid[y][x].push({
      ...entity,
      isRef
    })
    return grid
  }

  // if it's a cell, pass to module
  grid[y][x] = [{
    ...entity,
    isRef
  }]

  return grid
}
