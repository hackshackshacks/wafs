import helper from './helper.js'
import config from './config.js'

const game = {
  elements: {
    load: document.querySelector('#gameLoader'), // game loader element
    image: document.querySelector('#img'), // image element
    output: document.querySelector('#counter'), // counter output element
    input: document.querySelector('#guess'), // user guess input element
    submit: document.querySelector('#submitGuess'), // submit guess button
    message: document.querySelector('#message'), // win or lose message element
    name: document.querySelector('#pokemonName'), // pokemon name element
    newGame: document.querySelector('#newGame'), // new game button
    wrapper: document.querySelector('.game') // wrapper element
  },
  init: function () {
    this.handleEvents()
    this.count = false
    this.gameTime = 10 // seconds
    this.startSound = new Audio('static/assets/sounds/pokemon_sound.mp3')
    this.endSound = new Audio('static/assets/sounds/pokemon_sound_end.mp3')
    this.startSound.volume = 0.2
    this.endSound.volume = 0.2
  },
  handleEvents: function () {
    this.elements.submit.addEventListener('click', () => {
      this.end()
    })
    this.elements.newGame.addEventListener('click', () => {
      this.start()
    })
  },
  start: function () { // start the game
    this.toggleState('ingame')
    let rnd = helper.randomize(config.activeGen[0], config.activeGen[1])
    this.currentPokemon = config.pokemons[rnd] // set currentpokemon as random from config.pokemons array
    this.countdown()
    this.startSound.play()
    this.elements.input.value = '' // reset input field
    this.render(this.currentPokemon)
  },
  end: function () { // end the game
    this.startSound.pause()
    this.startSound.currentTime = 0
    this.endSound.play()
    this.toggleState()
    // reset timer
    clearInterval(this.count) // stop counting
    this.count = false
    helper.replaceHTML(game.elements.output, game.gameTime)
    this.validate()
  },
  toggleState: function (state) { // add ingame class based on state in order to hide and show the elements
    if (state === 'ingame') {
      this.elements.wrapper.classList.add('ingame')
      this.elements.input.focus()
    } else {
      this.elements.wrapper.classList.remove('ingame')
    }
  },
  validate: function () { // check if input matches pokemon name
    if (this.elements.input.value.toLowerCase() === this.currentPokemon.name) { // valid
      helper.replaceHTML(this.elements.output, 'Amazing!')
      this.storeFound(this.currentPokemon.id)
    } else { // invalid
      helper.replaceHTML(this.elements.output, `Too bad!`)
    }
    let foundPokemons = JSON.parse(window.localStorage.getItem(`foundPokemons`))
    config.renderFound(foundPokemons.length) // render score
  },
  countdown: function () { // countdown timer
    let time = this.gameTime
    helper.replaceHTML(this.elements.output, time) // render time
    if (!this.count) {
      this.count = setInterval(() => { // set variable to setinterval function
        time--
        helper.replaceHTML(this.elements.output, time)
        if (time <= 0) {
          this.end() // end game when time is up
        }
      }, 1000)
    }
  },
  storeFound: function (pokemon) { // update the foundPokemons array in local storage
    let found = window.localStorage.getItem(`foundPokemons`)
    found = JSON.parse(found)
    found.push(pokemon)
    window.localStorage.setItem(`foundPokemons`, JSON.stringify(found))
  },
  render: function (pokemon) { // render pokemon image and name
    this.elements.image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id + 1}.png`
    helper.replaceHTML(this.elements.name, `It's ${helper.capitalizeFirst(this.currentPokemon.name)}`)
  }
}

export default game
