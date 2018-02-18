/* TODO
- App
    - Variabelen (generaties definieren)
    - Init (routes, events)
    - Preventdefault a
    - Pokemons ophalen en lokaal opslaan
- Routes
- Game
    - Elementen
    - Variables (score, tijd, Pokemons)
    - Init (startwaarden vastleggen
    - Handleevents (buttons)
    - Randomize (helper?)
    - Start game
    - Countdown
    - Validate input
    - Reset
    - Render
- Pokedex
    - Elementen
    - Variabelen
    - Init (nextpokemons (eerste 5))
    - Handleevents
    - nextPokemons
    - Filter (search)
    - Render
- Detail
    - Elementen
    - Init
    - loadPokemon(-> api)
- Api
    - loadGeneration (all pokerons uit bepaalde generatie)
    - loadSingle
- Helper
    - capitalize
    - randomize
    - render
*/

(() => {
  const app = {
    pokemons: [],
    activeGen: [0, 151],
    elements: {
      sections: document.querySelectorAll('section'),
      navItems: document.querySelectorAll('nav a'),
      radioBtns: document.querySelectorAll('input[type="radio"')
    },
    init: function () {
      routes.init()
      this.handleEvents()
      this.getPokemons()
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
          if (this.elements.radioBtns[i].checked && this.activeGen !== api.gen[i]) {
            this.activeGen = api.gen[i]
            this.getPokemons()
          }
        })
      })
    },
    getPokemons: function () { // todo fix local storage
      // if (false) {
      //   this.storePokemons(JSON.parse(window.localStorage.getItem('pokemons')))
      // } else {
      game.elements.load.classList.remove('hidden')
      game.elements.newGame.disabled = true
      api.loadGeneration(this.activeGen)
      .then((result) => {
        game.elements.newGame.disabled = false
        this.storePokemons(JSON.parse(result).results)
        // window.localStorage.setItem('pokemons', result.results) // Get data and store locally
      })
      .then(() => {
        game.elements.load.classList.add('hidden')
      })
      // }
    },
    storePokemons: function (items) {
      this.pokemons = []
      this.pokemons = items.map((item, i) => {
        let obj = {
          id: i + 1,
          name: item.name
        }
        return obj
      })
    }
  }
  const routes = {
    init: function () {
      routie({
        'game': () => {
          game.init()
          this.toggle()
        },
        'pokedex': () => {
          this.toggle()
          game.end()
        },
        'pokedex/:pokemon?': (i) => {
          detail.init(Number(i) + 1)
        },
        '': () => {
          routie('game')
        },
        '*': () => {
          routie('game')
        }
      })
    },
    toggle: function () {
      let active = document.querySelector(`${window.location.hash}`)
      app.elements.sections.forEach((section) => {
        section.classList.remove('active')
      })
      active.classList.add('active')
    }
  } // sections
  const game = {
    count: false,
    gameTime: 10, // seconds
    score: 0,
    currentPokemon: null,
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
    }, // todo empty
    handleEvents: function () {
      this.elements.submit.addEventListener('click', () => {
        this.end()
      }) // todo
      this.elements.newGame.addEventListener('click', () => {
        this.start()
      })
    },
    start: function () {
      let rnd = helper.randomize(app.activeGen[0], app.activeGen[1])
      this.currentPokemon = app.pokemons[rnd]
      this.countdown()
      this.toggleState('ingame')
      this.render(this.currentPokemon) // returns number between min and max
      let sound = new Audio("../app/static/assets/sounds/pokemon_sound.mp3") // because spamming is fun
      sound.play()
    },
    end: function () {
      game.toggleState()
      // reset timer
      clearInterval(this.count)
      this.count = false
      game.elements.output.innerHTML = game.gameTime
      this.validate()
    },
    toggleState: function (state) {
      if (state === 'ingame') {
        this.elements.wrapper.classList.add('ingame')
      } else {
        this.elements.wrapper.classList.remove('ingame')
      }
    },
    validate: function () {
      if (this.elements.input.value.toLowerCase() === this.currentPokemon.name) { // validate input value and update score
        this.elements.message.innerHTML = 'Nice!'
        this.score++
        this.elements.score.innerHTML = `Score: ${this.score}`
      } else {
        this.elements.message.innerHTML = 'Too bad!'
      }
    },
    countdown: function () {
      let time = this.gameTime
      if (!this.count) {
        this.count = setInterval(() => { // set variable to setinterval function
          time--
          this.elements.output.innerHTML = time // todo innerhtml to innertext??
          if (time <= 0) {
            this.end() // end game when time is up
          }
        }, 1000)
      }
    },
    render: function (pokemon) {
      this.elements.image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id + app.activeGen[0]}.png`
      this.elements.name.innerHTML = `It's ${helper.capitalize(this.currentPokemon.name)}`
      this.elements.input.classList.remove('hidden')
      this.elements.submit.classList.remove('hidden')
    }
  }
  const pokedex = {}
  const detail = {}
  const api = {
    gen: [[0, 151], [152, 251], [252, 368]],
    loadGeneration: function (gen) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('get', `https://pokeapi.co/api/v2/pokemon/?limit=${gen[1]}&offset=${gen[0]}`)
        xhr.onload = () => resolve(xhr.responseText)
        xhr.onerror = () => reject(xhr.statusText)
        xhr.send()
      })
    }
  }
  const helper = {
    randomize: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min) // number between min and max
    },
    capitalize: function (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  }
  app.init()
})()