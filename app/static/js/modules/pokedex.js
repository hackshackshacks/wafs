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
    this.offset = 0
    this.handleEvents()
    if (config.pokemons) { // render if pokemons are availabe
      this.render(config.pokemons)
    } else { // render until data is available
      this.update = setInterval(() => {
        this.render(config.pokemons)
      }, 1000)
    }
  },
  handleEvents: function () {
    this.elements.search.addEventListener('input', () => {
      this.search(this.elements.search.value) // load pokemons with filter
    })
  },
  render: function (arr) {
    helper.emptyElement(this.elements.list)
    if (arr.length > 0) {
      clearInterval(this.update) // remove update
      let found = []
      if (window.localStorage.getItem(`foundPokemons`) !== null) {
        found = JSON.parse(window.localStorage.getItem('foundPokemons'))
      }
      let list = arr.map((pokemon, i) => { // Add list item for each pokemon
        if (helper.checkArray(found, pokemon.id)) { // create list item for discovered pokemon
          return `
          <li class="pokemon" style="animation-delay: calc(50ms * ${i})">
            <a href="#pokedex/${pokemon.id + 1}">
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id + 1}.png">
              <p>${helper.capitalizeFirst(pokemon.name)}</p>
            </a>
          </li>
          `
        } else { // create list item for undiscovered pokemon
          return `
          <li class="pokemon pokehidden" style="animation-delay: calc(50ms * ${i})">
            <a>
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id + 1}.png">
              <p>Unknown</p>
            </a>
          </li>
          `
        }
      }).join('') // remove spaces
      this.elements.list.insertAdjacentHTML('beforeend', list)
    } else { // load nothing found image
      this.elements.list.insertAdjacentHTML('beforeend', '<figure><img src="static/assets/images/squirtlecrying.gif"><figcaption>No results. Try another generation</figcaption></figure>')
    }
  },
  search: function (input) {
    let results = config.pokemons.filter((pokemon) => { // filter pokemon based on input value
      if (pokemon.name.includes(input)) {
        return pokemon
      }
    })
    this.render(results) // render search results
  }
}
export default pokedex
