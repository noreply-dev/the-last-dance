exports.findContexts = (grid, pages) => {
  const lines = Math.round(pages.height)
  const columns = Math.round(pages.width)
  const CONTEXT_MARGIN = Math.round((4 * Math.round(lines)) / 100)
  console.log(CONTEXT_MARGIN, Math.round(lines))

  const contexts = []

  // iterate over the grid, here, happens the ✨ magic ✨
  for (let y = lines - 1; y >= 0; y--) {
    for (let x = 0; x < columns; x++) {
      if (grid[y][x] !== 0) {
        const area = [] // searching area of a module
        const leftStart = x - CONTEXT_MARGIN // area left limit
        let rightEnd = x + CONTEXT_MARGIN // area right limit (this one decreases since is a diagonal)

        // check line and get only the non-zero values
        for (let top = y + CONTEXT_MARGIN; top >= y; top--, rightEnd--) {
          if (top >= lines) continue // avoid index out of bounds

          const slice = top === y
            ? grid[top].slice(leftStart, rightEnd) // avoid the module detects itself
            : grid[top].slice(leftStart, rightEnd + 1)

          // if there is something more than 0 get the closest one
          if (/[^0]/.exec(slice.join(''))) {
            area.push(...slice.filter(item => item !== 0))
          }
        }

        // if there are contexts around
        if (area.length) {
          // Get the closest context to the module
          const distances = area.map(context => {
            // 0 because any modules and context cell types stores
            // an array of elements if more than one element is on the same position
            // get the closest corner of the two elements
            const xA = Math.min(
              context.xStart - grid[y][x][0].xStart,
              context.xEnd - grid[y][x][0].xEnd,
              context.xStart - grid[y][x][0].xStart,
              context.xEnd - grid[y][x][0].xEnd
            )

            const xSum = Math.pow(xA, 2)
            const ySum = Math.pow(context.yStart - grid[y][x][0].yEnd, 2)
            return Math.sqrt(xSum + ySum)
          })

          // sort distances and get the closest
          const sortedDistances = [...distances].sort((a, b) => a - b)
          const closestDistanceIndex = distances.indexOf(sortedDistances[0])

          const closestContext = area[closestDistanceIndex]

          if (!grid[y][x][0].isRef) {
            if (Array.isArray(contexts[closestContext.context])) {
              // Push to the context
              contexts[closestContext.context].push(...grid[y][x])
            } else {
              contexts[closestContext.context] = [...grid[y][x]]
            }
          }

          // convert module to a context cell
          grid[y][x] = {
            xStart: grid[y][x][0].xStart,
            xEnd: grid[y][x][0].xEnd,
            yStart: grid[y][x][0].yStart,
            yEnd: grid[y][x][0].yEnd,
            context: closestContext.context
          }
        } else { // if no contexts around, create context
          const currContext = contexts.length

          // if it is a module, push the module directly
          if (!grid[y][x][0].isRef) {
            contexts[currContext] = [...grid[y][x]]
          }

          grid[y][x] = {
            xStart: grid[y][x][0].xStart,
            xEnd: grid[y][x][0].xEnd,
            yStart: grid[y][x][0].yStart,
            yEnd: grid[y][x][0].yEnd,
            context: currContext
          }
        }
      }
    }
  }

  return contexts
}

/*
exports.findContexts = (grid, pages) => {
  const lines = Math.round(pages.height)
  const columns = Math.round(pages.width)
  const CONTEXT_MARGIN = Math.round((6 * Math.round(lines)) / 100)

  const contexts = []

  // iterate over the grid, here, happens the ✨ magic ✨
  for (let y = lines - 1; y >= 0; y--) {
    for (let x = 0; x < columns; x++) {
      if (grid[y][x] !== 0) {
        const area = [] // searching area of a module
        const leftStart = x - CONTEXT_MARGIN // area left limit
        let rightEnd = x + CONTEXT_MARGIN // area right limit (this one decreases since is a diagonal)

        // check line and get only the non-zero values
        for (let top = y + CONTEXT_MARGIN; top >= y; top--, rightEnd--) {
          if (top >= lines) continue // avoid index out of bounds

          const slice = top === y
            ? grid[top].slice(leftStart, rightEnd) // avoid the module detects itself
            : grid[top].slice(leftStart, rightEnd + 1)

          // if there is something more than 0 get the closest one
          if (/[^0]/.exec(slice.join(''))) {
            area.push(...slice.filter(item => item !== 0))
          }
        }

        // if there are contexts around
        if (area.length) {
          // Get the closest context to the module
          const distances = area.map(context => {
            // 0 because any modules and context cell types stores
            // an array of elements if more than one element is on the same position
            const xA = Math.min(
              context.xStart - grid[y][x][0].xStart,
              context.xEnd - grid[y][x][0].xEnd,
              context.xStart - grid[y][x][0].xStart,
              context.xEnd - grid[y][x][0].xEnd
            )

            const xSum = Math.pow(xA, 2)
            const ySum = Math.pow(context.yStart - grid[y][x][0].yEnd, 2)
            return Math.sqrt(xSum + ySum)
          })

          // sort distances and get the closest
          const sortedDistances = [...distances].sort((a, b) => a - b)
          const closestDistanceIndex = distances.indexOf(sortedDistances[0])
          const closestContext = area[closestDistanceIndex]

          // Push to the context and convert the current module
          // to a context cell
          contexts[closestContext.context].push(...grid[y][x])
          grid[y][x] = {
            xStart: grid[y][x][0].xStart,
            xEnd: grid[y][x][0].xEnd,
            yStart: grid[y][x][0].yStart,
            yEnd: grid[y][x][0].yEnd,
            context: closestContext.context
          }
        } else { // if no contexts around, create context
          const currContext = contexts.length

          contexts[currContext] = [...grid[y][x]]
          grid[y][x] = {
            xStart: grid[y][x][0].xStart,
            xEnd: grid[y][x][0].xEnd,
            yStart: grid[y][x][0].yStart,
            yEnd: grid[y][x][0].yEnd,
            context: currContext
          }
        }
      }
    }
  }

  return contexts
}
*/
