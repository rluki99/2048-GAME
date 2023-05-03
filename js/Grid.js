// Define constants for the grid size, cell size, and gap between cells
const GRID_SIZE = 4
const CELL_SIZE = 20
const CELL_GAP = 2

// Define the Grid class
export default class Grid {
  #cells

  // Constructor for the Grid class
  constructor(gridElement) {
    // Set CSS properties for grid size, cell size, and cell gap
    gridElement.style.setProperty("--grid-size", GRID_SIZE)
    gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`)
    gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`)

    // Create cell elements and initialize them as Cell objects
    this.#cells = createCellElements(gridElement).map((cellElement, index) => {
      return new Cell(
        cellElement,
        index % GRID_SIZE,
        Math.floor(index / GRID_SIZE)
      )
    })
  }

  // Getter method for the cells property
  get cells() {
    return this.#cells
  }

  // Getter method for the cellsByRow property
  get cellsByRow() {
    // Convert flat array of cells to 2D array, with rows as outer array and columns as inner array
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || []
      cellGrid[cell.y][cell.x] = cell
      return cellGrid
    }, [])
  }

  // Getter method for the cellsByColumn property
  get cellsByColumn() {
    // Convert flat array of cells to 2D array, with columns as outer array and rows as inner array
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || []
      cellGrid[cell.x][cell.y] = cell
      return cellGrid
    }, [])
  }

  // Private getter method for the emptyCells property
  get #emptyCells() {
    // Filter cells that don't have a tile
    return this.#cells.filter(cell => cell.tile == null)
  }

  // Method to get a random empty cell
  randomEmptyCell() {
    // Select a random index from the empty cells array
    const randomIndex = Math.floor(Math.random() * this.#emptyCells.length)
    // Return the empty cell at the selected index
    return this.#emptyCells[randomIndex]
  }
}

// Define the Cell class
class Cell {
  #cellElement
  #x
  #y
  #tile
  #mergeTile

  // Constructor for the Cell class
  constructor(cellElement, x, y) {
    this.#cellElement = cellElement
    this.#x = x
    this.#y = y
  }

  // Getter method for the x property
  get x() {
    return this.#x
  }

  // Getter method for the y property
  get y() {
    return this.#y
  }

  // Getter method for the tile property
  get tile() {
    return this.#tile
  }

  // Setter method for the tile property
  set tile(value) {
    this.#tile = value
    // If the tile is null, return
    if (value == null) return
    // Set the tile's x and y coordinates to match the cell's coordinates
    this.#tile.x = this.#x
    this.#tile.y = this.#y
  }

  // Getter method for the mergeTile property
  get mergeTile() {
    return this.#mergeTile
  }

  // Setter method for the mergeTile property
  set mergeTile(value) {
    this.#mergeTile = value
    if (value == null) return
    this.#mergeTile.x = this.#x
    this.#mergeTile.y = this.#y
  }

  // Method to check if the cell can accept a tile
  canAccept(tile) {
    return (
      this.tile == null || // If the cell doesn't have a tile, it can accept any tile
      (this.mergeTile == null && this.tile.value === tile.value) // If the cell has a tile, it can accept a tile with the same value if it doesn't have a merge tile
    )
  }

  // Method to merge tiles in the cell
  mergeTiles() {
    if (this.tile == null || this.mergeTile == null) return  // If the cell doesn't have a tile or merge tile return
    this.tile.value = this.tile.value + this.mergeTile.value
    this.mergeTile.remove()
    this.mergeTile = null
  }
}

// Helper function to create cell elements for the grid
function createCellElements(gridElement) {
  const cells = []
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement("div")
    // Create a new div element for the cell
    cell.classList.add("cell")
    // Add the "cell" class to the cell element
    cells.push(cell)
    // Add the cell element to the cells array
    gridElement.append(cell)
    // Append the cell element to the grid element
  }
  return cells
  // Return the array of cell elements
}
