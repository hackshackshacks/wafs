import api from '/static/js/modules/api.js'

const detail = {
  elements: {
    wrapper: document.querySelector('.pokemon'),
    loader: document.querySelector('#detailLoader')
  },
  init: function (id) {
    this.loadPokemon(id)
    this.pokemon = {}
  },
  loadPokemon: function (id) {
    this.elements.loader.classList.remove('hidden')
    while (this.elements.wrapper.firstChild) {
      this.elements.wrapper.removeChild(this.elements.wrapper.firstChild) // empty section
    }
    if (window.localStorage.getItem(`pokemon${id}`)) { // get local data if available
      this.elements.loader.classList.add('hidden')
      this.render(JSON.parse(window.localStorage.getItem(`pokemon${id}`)))
    } else {
      api.loadSingle(id).then((result) => {
        this.elements.loader.classList.add('hidden')
        let res = this.handleData(JSON.parse(result))
        window.localStorage.setItem(`pokemon${id}`, JSON.stringify(res))
        this.render(res)
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  handleData: function (data) { // function to create usable object out of data
    let pokemon = {
      name: data.name,
      height: data.height,
      weight: data.weight,
      sprites: {
        front: data.sprites.front_default,
        back: data.sprites.back_default
      },
      types: []
    }
    data.types.forEach((type, i) => {
      pokemon.types[i] = type.type.name
    })
    return pokemon
  },
  render: function (data) {
    let types = ''
    data.types.forEach((type) => {
      types += `<div class="type ${type}">${type}</div>`
    })
    let template = `
      <h1>${helper.capitalizeFirst(data.name)}</h1>
      <img src=${data.sprites.front} class="sprite front">
      <img src=${data.sprites.back} class="sprite back">
      <div class="pokemon_info">
        <div>
          <h3>Height</h3>
          <p>${data.height}</p>
        </div>
        <div>
          <h3>Weight</h3>
          <p>${data.weight}</p>
        </div>
        <div class="types">${types}</div>
      </div>
    `
    this.elements.wrapper.insertAdjacentHTML('beforeend', template)
  }
}
export default detail
