import helper from './helper.js'
import config from './config.js'
const pokedex = {
  elements: {
    list: document.querySelector('#pokemonList'),
    load: document.querySelector('#loadMore'),
    loader: document.querySelector('#listLoader'),
    search: document.querySelector('#search'),
    submit: document.querySelector('#submitSearch')
  },
  init: function () {
    this.startAmount = 5
    this.offset = 0
    this.handleEvents()
    this.update = setInterval(() => {
      this.render(config.pokemons)
    }, 1000)
  },
  handleEvents: function () {
    this.elements.search.addEventListener('input', () => {
      this.search(this.elements.search.value) // load pokemons with filter
    })
  },
  render: function (arr) {
    helper.emptyElement(this.elements.list)
    if (arr.length > 0) {
      clearInterval(this.update)
      let found = []
      if (window.localStorage.getItem('foundPokemons')) {
        found = JSON.parse(window.localStorage.getItem('foundPokemons'))
      }
      let list = arr.map((pokemon, i) => {
        if (helper.checkArray(found, pokemon.id)) {
          return `
          <li class="pokemon" style="animation-delay: calc(50ms * ${i})">
            <a href="#pokedex/${pokemon.id + 1}">
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id + 1}.png">
              <p>${helper.capitalizeFirst(pokemon.name)}</p>
            </a>
          </li>
          `
        } else {
          return `
          <li class="pokemon pokehidden" style="animation-delay: calc(50ms * ${i})">
            <a>
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id + 1}.png">
              <p>Unknown</p>
            </a>
          </li>
          `
        }
      }).join('')
      this.elements.list.insertAdjacentHTML('beforeend', list)
      this.currentAmount += this.startAmount
    } else {
      this.elements.list.insertAdjacentHTML('beforeend', '<figure><img src="static/assets/images/squirtlecrying.gif"><figcaption>No results. Try another generation</figcaption></figure>')
    }
  },
  search: function (input) {
    let results = config.pokemons.filter((pokemon) => {
      if (pokemon.name.includes(input)) {
        return pokemon
      }
    })
    this.render(results)
  }
}
export default pokedex
