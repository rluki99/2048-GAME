// Import the Grid and Tile classes from their respective files
import Grid from "./Grid.js"
import Tile from "./Tile.js"

// Get the game board element from the HTML
const gameBoard = document.getElementById("game-board")

// Create a new grid object and add two new tiles to it
const grid = new Grid(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)

// Set up the input event listener
setupInput()

// Add an event listener for keyboard input
function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true })
}

// Handle keyboard input
async function handleInput(e) {
  switch (e.key) {
    // If the user pressed the "up" arrow key
    case "ArrowUp":
      // If the grid cannot move up, set up input and return
      if (!canMoveUp()) {
        setupInput()
        return
      }
      // Move the tiles up
      await moveUp()
      break
    // If the user pressed the "down" arrow key
    case "ArrowDown":
      // If the grid cannot move down, set up input and return
      if (!canMoveDown()) {
        setupInput()
        return
      }
      // Move the tiles down
      await moveDown()
      break
    // If the user pressed the "left" arrow key
    case "ArrowLeft":
      // If the grid cannot move left, set up input and return
      if (!canMoveLeft()) {
        setupInput()
        return
      }
      // Move the tiles left
      await moveLeft()
      break
    // If the user pressed the "right" arrow key
    case "ArrowRight":
      // If the grid cannot move right, set up input and return
      if (!canMoveRight()) {
        setupInput()
        return
      }
      // Move the tiles right
      await moveRight()
      break
    // If the user pressed any other key, set up input and return
    default:
      setupInput()
      return
  }

  // Merge any tiles that can be merged
  grid.cells.forEach(cell => cell.mergeTiles())

  // Add a new tile to the grid
  const newTile = new Tile(gameBoard)
  grid.randomEmptyCell().tile = newTile

  // If there are no more moves available, show the "You lose" modal
  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    // Wait for the new tile to finish its transition before showing the modal
    newTile.waitForTransition(true).then(() => {
      showModal()
    })
    return
  }

  // Set up input for the next move
  setupInput()
}

// Move the tiles up
function moveUp() {
  return slideTiles(grid.cellsByColumn)
}

// Move the tiles down
function moveDown() {
  return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
}

// Move the tiles left
function moveLeft() {
  return slideTiles(grid.cellsByRow)
}

// Move the tiles right
function moveRight() {
  return slideTiles(grid.cellsByRow.map(row => [...row].reverse()))
}

// Slide the tiles in the specified cells
function slideTiles(cells) {
  return Promise.all(
    cells.flatMap(group => {
      const promises = []
      for (let i = 1; i < group.length; i++) {
        const cell = group[i]
        if (cell.tile == null) continue
        // If the cell does not have a tile, continue to the next cell
        let lastValidCell
        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = group[j]
          if (!moveToCell.canAccept(cell.tile)) break
          // If the cell cannot accept the tile, break out of the loop
          lastValidCell = moveToCell
        }

        if (lastValidCell != null) {
          promises.push(cell.tile.waitForTransition())
          // Wait for the tile to finish its transition
          if (lastValidCell.tile != null) {
            lastValidCell.mergeTile = cell.tile
            // Merge the tiles if the last valid cell already has a tile
          } else {
            lastValidCell.tile = cell.tile
            // Move the tile to the last valid cell
          }
          cell.tile = null
          // Remove the tile from the current cell
        }
      }
      return promises
    })
  )
}

// Check if the grid can move up
function canMoveUp() {
  return canMove(grid.cellsByColumn)
}

// Check if the grid can move down
function canMoveDown() {
  return canMove(grid.cellsByColumn.map(column => [...column].reverse()))
}

// Check if the grid can move left
function canMoveLeft() {
  return canMove(grid.cellsByRow)
}

// Check if the grid can move right
function canMoveRight() {
  return canMove(grid.cellsByRow.map(row => [...row].reverse()))
}

// Check if the grid can move in a certain direction
function canMove(cells) {
  return cells.some(group => {
    return group.some((cell, index) => {
      if (index === 0) return false
      // if the cell is the first in the group, return false
      if (cell.tile == null) return false
      // if the cell does not have a tile, return false
      const moveToCell = group[index - 1]
      return moveToCell.canAccept(cell.tile)
      // return true if the cell can accept the tile
    })
  })
}

// Show the 'you lose' modal 
function showModal() {
  const modal = document.createElement("div")
  modal.classList.add("modal")

  const modalContent = document.createElement("div")
  modalContent.classList.add("modal-content")
  modal.appendChild(modalContent)

  const message = document.createElement("p")
  message.textContent = "You lose"
  modalContent.appendChild(message)

  const okButton = document.createElement("button")
  okButton.textContent = "OK"
  okButton.addEventListener("click", () => {
    modal.remove()
  })
  modalContent.appendChild(okButton)

  const retryButton = document.createElement("button")
  retryButton.textContent = "TRY AGAIN"
  retryButton.addEventListener("click", () => {
    location.reload()
  })
  modalContent.appendChild(retryButton)

  document.body.appendChild(modal)
}
