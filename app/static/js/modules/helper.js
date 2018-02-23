const helper = {
  randomize: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min) // number between min and max
  },
  capitalizeFirst: function (string) { // capitalize first character of string
    return string.charAt(0).toUpperCase() + string.slice(1)
  },
  emptyElement: function (element) { // empty an html element
    while (element.firstChild) {
      element.removeChild(element.firstChild)
    }
  },
  replaceHTML: function (element, string) { // empty html and insert new value
    this.emptyElement(element)
    element.insertAdjacentHTML('beforeend', string)
  },
  checkArray: function (arr, value) { // check if value is in array
    let hasValue = false
    arr.forEach((item, i) => {
      if (arr[i] === value) {
        hasValue = true
      }
    })
    return hasValue
  }
}
export default helper
