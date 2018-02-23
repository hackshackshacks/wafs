import helper from './helper.js'
import config from './config.js'

const game = {
  elements: {
    load: document.querySelector('#gameLoader'),
    image: document.querySelector('#img'),
    output: document.querySelector('#counter'), // counter output element
    input: document.querySelector('#guess'), // user guess input element
    submit: document.querySelector('#submitGuess'),
    message: document.querySelector('#message'), // win or lose message element
    name: document.querySelector('#pokemonName'),
    newGame: document.querySelector('#newGame'),
    wrapper: document.querySelector('.game')
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
  start: function () {
    this.toggleState('ingame')
    let rnd = helper.randomize(config.activeGen[0], config.activeGen[1])
    this.currentPokemon = config.pokemons[rnd]
    this.countdown()
    this.startSound.play()
    this.elements.input.value = ''
    this.render(this.currentPokemon)
  },
  end: function () {
    this.startSound.pause()
    this.startSound.currentTime = 0
    this.endSound.play()
    this.toggleState()
    // reset timer
    clearInterval(this.count)
    this.count = false
    helper.replaceHTML(game.elements.output, game.gameTime)
    this.validate()
  },
  toggleState: function (state) {
    if (state === 'ingame') {
      this.elements.wrapper.classList.add('ingame')
      this.elements.input.focus()
    } else {
      this.elements.wrapper.classList.remove('ingame')
    }
  },
  validate: function () {
    if (this.elements.input.value.toLowerCase() === this.currentPokemon.name) { // validate input value and update score
      helper.replaceHTML(this.elements.output, 'Amazing!')
      this.updateFound(this.currentPokemon.id)
    } else {
      helper.replaceHTML(this.elements.output, `Too bad!`)
    }
    if (window.localStorage.getItem(`foundPokemons`) !== null) {
      let foundPokemons = JSON.parse(window.localStorage.getItem(`foundPokemons`))
      config.updateDiscovered(foundPokemons.length)
    }
  },
  countdown: function () {
    let time = this.gameTime
    helper.replaceHTML(this.elements.output, time)
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
  updateFound: function (pokemon) {
    let found = window.localStorage.getItem(`foundPokemons`)
    found = JSON.parse(found)
    found.push(pokemon)
    window.localStorage.setItem(`foundPokemons`, JSON.stringify(found))
  },
  render: function (pokemon) {
    this.elements.image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id + 1}.png`
    helper.replaceHTML(this.elements.name, `It's ${helper.capitalizeFirst(this.currentPokemon.name)}`)
  }
}

export default game
