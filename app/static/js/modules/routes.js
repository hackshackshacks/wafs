import game from './game.js'
import pokedex from './pokedex.js'
import detail from './detail.js'

const routes = {
  elements: {
    body: document.querySelector('body')
  },
  init: function () { // create routes
    routie({
      'game': () => {
        game.init()
        this.toggle()
      },
      'pokedex': () => {
        pokedex.init()
        this.toggle()
      },
      'pokedex/:pokemon?': (i) => {
        detail.init(Number(i)) // initialize detail with parameter of pokemon id
        this.toggle(i)
      },
      'error': () => {
        this.toggle()
      },
      '': () => {
        routie('game')
      },
      '*': () => {
        routie('game')
      }
    })
  },
  toggle: function (i) { // toggle the active page
    this.elements.body.className = ''
    this.elements.body.classList.add(window.location.hash.replace('#', ''))
  }
}
export default routes
