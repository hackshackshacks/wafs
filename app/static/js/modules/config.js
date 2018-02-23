import helper from './helper.js'
const config = {
  elements: {
    discovered: document.querySelectorAll('.discovered')
  },
  init: function () {
    this.pokemons = []
    this.activeGen = [0, 151, 0]
    window.localStorage.setItem(`foundPokemons`, JSON.stringify([]))
  },
  updateDiscovered: function (amount) {
    this.elements.discovered.forEach((element) => {
      helper.replaceHTML(element, `Discovered: ${amount}/${620}`)
    })
  }
}
export default config
