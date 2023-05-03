// Define the Tile class
export default class Tile {
  // Private class properties
  #tileElement
  #x
  #y
  #value

  // Constructor method
  constructor(tileContainer, value = Math.random() > 0.5 ? 2 : 4) {
    // Create a new div element and add the "tile" class to it
    this.#tileElement = document.createElement("div")
    this.#tileElement.classList.add("tile")
    // Add the tile element to the specified container
    tileContainer.append(this.#tileElement)
    // Set the value of the tile
    this.value = value
  }

  // Getter method for the value property
  get value() {
    return this.#value
  }

  // Setter method for the value property
  set value(v) {
    // Update the value of the tile
    this.#value = v
    // Update the text content of the tile element
    this.#tileElement.textContent = v
    // Calculate the background lightness based on the power of 2 of the tile value
    const power = Math.log2(v)
    const backgroundLightness = 100 - power * 9
    // Set the --background-lightness custom CSS property of the tile element
    this.#tileElement.style.setProperty(
      "--background-lightness",
      `${backgroundLightness}%`
    )
    // Set the --text-lightness custom CSS property of the tile element
    this.#tileElement.style.setProperty(
      "--text-lightness",
      `${backgroundLightness <= 50 ? 90 : 10}%`
    )
  }

  // Setter method for the x property
  set x(value) {
    this.#x = value
    // Set the --x custom CSS property of the tile element
    this.#tileElement.style.setProperty("--x", value)
  }

  // Setter method for the y property
  set y(value) {
    this.#y = value
    // Set the --y custom CSS property of the tile element
    this.#tileElement.style.setProperty("--y", value)
  }

  // Method to remove the tile element from the DOM
  remove() {
    this.#tileElement.remove()
  }

  // Method that returns a Promise that resolves when the transition or animation of the tile element ends
  waitForTransition(animation = false) {
    return new Promise(resolve => {
      this.#tileElement.addEventListener(
        animation ? "animationend" : "transitionend",
        resolve,
        {
          once: true,
        }
      )
    })
  }
}
