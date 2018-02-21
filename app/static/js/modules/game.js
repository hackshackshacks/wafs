import helper from 'app/static/js/modules/helper.js'
import config from 'app/static/js/modules/config.js'

const game = {
  elements: {
    load: document.querySelector('#gameLoader'),
    image: document.querySelector('#img'),
    output: document.querySelector('#counter'), // counter output element
    input: document.querySelector('#guess'), // user guess input element
    submit: document.querySelector('#submitGuess'),
    message: document.querySelector('#message'), // win or lose message element
    name: document.querySelector('#pokemonName'),
    score: document.querySelector('#score'),
    newGame: document.querySelector('#newGame'),
    wrapper: document.querySelector('.game')
  },
  init: function () {
    this.handleEvents()
    this.count = false
    this.gameTime = 10 // seconds
    if (window.localStorage.getItem(`score`) > 0) {
      this.score = window.localStorage.getItem(`score`)
    } else {
      this.score = 0
    }
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
    let rnd = helper.randomize(config.activeGen[0], config.activeGen[1])
    this.currentPokemon = config.pokemons[rnd]
    this.countdown()
    this.toggleState('ingame')
    this.render(this.currentPokemon)
    let sound = new Audio('static/assets/sounds/pokemon_sound.mp3') // because spamming is fun
    sound.play()
  },
  end: function () {
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
      this.score++
      config.foundPokemons.push(this.currentPokemon.id)
      window.localStorage.setItem(`foundPokemons`, JSON.stringify(config.foundPokemons)) // todo
      window.localStorage.setItem(`score`, this.score)
      helper.replaceHTML(this.elements.score, `Score: ${this.score}`)
    } else {
      helper.replaceHTML(this.elements.score, `Too bad!`)
    }
    this.elements.input.value = ''
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
  render: function (pokemon) {
    this.elements.image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id + 1}.png`
    helper.replaceHTML(this.elements.name, `It's ${helper.capitalizeFirst(this.currentPokemon.name)}`)
  }
}

export default game
