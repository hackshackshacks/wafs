import config from './modules/config.js'
import routes from './modules/routes.js'
import pokedex from './modules/pokedex.js'
import game from './modules/game.js'
import helper from './modules/helper.js'
import api from './modules/api.js'
(() => {
  const app = {
    elements: {
      body: document.querySelector('body'),
      sections: document.querySelectorAll('section'),
      navItems: document.querySelectorAll('nav a'),
      radioBtns: document.querySelectorAll('nav input[type="radio"')
    },
    init: function () {
      routes.init()
      config.init()
      this.handleEvents()
      this.getPokemons()
      if (!window.localStorage.getItem('foundPokemons')) {
        window.localStorage.setItem('foundPokemons', config.foundPokemons)
      }
    },
    handleEvents: function () {
      this.elements.navItems.forEach(function (element) {
        element.addEventListener('click', function (event) {
          event.preventDefault()
          window.location.hash = this.hash
        })
      })
      this.elements.radioBtns.forEach((btn, i) => {
        btn.addEventListener('change', () => {
          if (this.elements.radioBtns[i].checked && config.activeGen !== api.gen[i]) {
            config.activeGen = api.gen[i]
            this.getPokemons()
            if (window.location.hash === '#pokedex') {
              pokedex.init()
            }
          }
        })
      })
    },
    getPokemons: function () {
      game.elements.load.classList.remove('hidden')
      pokedex.elements.loader.classList.remove('hidden')
      helper.replaceHTML(game.elements.newGame, `Catching pokemons..`)
      game.elements.newGame.disabled = true
      if (!window.localStorage.getItem(`pokemons${config.activeGen[2]}`)) { // get local data if available
        api.loadGeneration(config.activeGen)
        .then((result) => {
          game.elements.newGame.disabled = false
          helper.replaceHTML(game.elements.newGame, `New game`)
          this.storePokemons(JSON.parse(result).results, false)
        })
        .then(() => {
          game.elements.load.classList.add('hidden')
          pokedex.elements.loader.classList.add('hidden')
        })
      } else {
        helper.replaceHTML(game.elements.newGame, `New game`)
        game.elements.newGame.disabled = false
        game.elements.load.classList.add('hidden')
        pokedex.elements.loader.classList.add('hidden')
        this.storePokemons(JSON.parse(window.localStorage.getItem(`pokemons${config.activeGen[2]}`)), true)
      }
    },
    storePokemons: function (items, local) {
      if (!local) { // use local data
        window.localStorage.setItem(`pokemons${config.activeGen[2]}`, JSON.stringify(items))
      }
      config.pokemons = items.map((item, i) => {
        let obj = {
          id: i + config.activeGen[0],
          name: item.name
        }
        return obj
      })
    }
  }
  app.init()
})()
