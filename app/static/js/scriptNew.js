(() => {
  const app = {
    elements: {
      sections: document.querySelectorAll('section'),
      navItems: document.querySelectorAll('nav a'),
      radioBtns: document.querySelectorAll('input[type="radio"')
    },
    init: function () {
      this.pokemons = []
      this.activeGen = [0, 151]
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
            if (window.location.hash === '#pokedex') {
              pokedex.init()
            }
          }
        })
      })
    },
    getPokemons: function () { // todo fix local storage
      // if (false) {
      //   this.storePokemons(JSON.parse(window.localStorage.getItem('pokemons')))
      // } else {
      game.elements.load.classList.remove('hidden')
      pokedex.elements.loader.classList.remove('hidden')
      game.elements.newGame.disabled = true
      api.loadGeneration(this.activeGen)
      .then((result) => {
        game.elements.newGame.disabled = false
        this.storePokemons(JSON.parse(result).results)
        // window.localStorage.setItem('pokemons', result.results) // Get data and store locally
      })
      .then(() => {
        game.elements.load.classList.add('hidden')
        pokedex.elements.loader.classList.add('hidden')
      })
      // }
    },
    storePokemons: function (items) {
      this.pokemons = []
      this.pokemons = items.map((item, i) => {
        let obj = {
          id: i + this.activeGen[0],
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
          pokedex.init()
          this.toggle()
        },
        'pokedex/:pokemon?': (i) => {
          detail.init(Number(i))
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
    toggle: function (i) {
      let active
      i ? active = document.querySelector(`#detail`) : active = document.querySelector(`${window.location.hash}`)
      app.elements.sections.forEach((section) => {
        section.classList.remove('active')
      })
      active.classList.add('active')
    }
  } // sections
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
      this.score = 0
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
      this.elements.image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id + 1}.png`
      this.elements.name.innerHTML = `It's ${helper.capitalizeFirst(this.currentPokemon.name)}`
      this.elements.input.classList.remove('hidden')
      this.elements.submit.classList.remove('hidden')
    }
  }
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
        this.render(app.pokemons)
      }, 1000)
    },
    handleEvents: function () {
      this.elements.search.addEventListener('input', () => {
        this.search(this.elements.search.value) // load pokemons with filter
      })
    },
    render: function (arr) {
      if (app.pokemons.length > 1) {
        clearInterval(this.update)
        let list = arr.map((pokemon, i) => `
        <li>
          <a href="#pokedex/${pokemon.id + 1}">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id + 1}.png">
            <p>${helper.capitalizeFirst(pokemon.name)}</p>
          </a>
        </li>
        `).join('')
        this.elements.list.innerHTML = list
        this.currentAmount += this.startAmount
      }
    },
    search: function (input) {
      let results = app.pokemons.filter((pokemon) => {
        if (pokemon.name.includes(input)) {
          return pokemon
        }
      })
      this.render(results)
    }
  }
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
      api.loadSingle(id).then((result) => {
        this.elements.loader.classList.add('hidden')
        this.render(JSON.parse(result))
      }).catch(() => {
        routie('error')
      })
    },
    render: function (data) {
      // this.elements.wrapper.classList.add('hidden')
      let types = ''
      data.types.forEach((type) => {
        types += `<div class="type">${type.type.name}</div>`
      })
      let template = `
        <h1>${helper.capitalizeFirst(data.name)}</h1>
        <img src=${data.sprites.front_default}>
        <img src=${data.sprites.back_default}>
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
    },
    loadSingle: function (id) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('get', `https://pokeapi.co/api/v2/pokemon/${id}`)
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
    capitalizeFirst: function (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  }
  app.init()
})()