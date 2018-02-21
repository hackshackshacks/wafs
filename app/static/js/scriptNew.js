(() => {
  const app = {
    elements: {
      body: document.querySelector('body'),
      sections: document.querySelectorAll('section'),
      navItems: document.querySelectorAll('nav a'),
      radioBtns: document.querySelectorAll('nav input[type="radio"')
    },
    init: function () {
      this.pokemons = []
      this.activeGen = [0, 151, 0]
      routes.init()
      this.handleEvents()
      this.getPokemons()
      this.foundPokemons = []
      if (!window.localStorage.getItem('foundPokemons')) {
        window.localStorage.setItem('foundPokemons', this.foundPokemons)
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
    getPokemons: function () {
      game.elements.load.classList.remove('hidden')
      pokedex.elements.loader.classList.remove('hidden')
      helper.replaceHTML(game.elements.newGame, `Catching pokemons..`)
      game.elements.newGame.disabled = true
      if (!window.localStorage.getItem(`pokemons${this.activeGen[2]}`)) { // get local data if available
        api.loadGeneration(this.activeGen)
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
        this.storePokemons(JSON.parse(window.localStorage.getItem(`pokemons${this.activeGen[2]}`)), true)
      }
    },
    storePokemons: function (items, local) {
      if (!local) { // use local data
        window.localStorage.setItem(`pokemons${this.activeGen[2]}`, JSON.stringify(items))
      }
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
      app.elements.body.className = ''
      app.elements.body.classList.add(window.location.hash.replace('#', ''))
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
      let rnd = helper.randomize(app.activeGen[0], app.activeGen[1])
      this.currentPokemon = app.pokemons[rnd]
      this.countdown()
      this.toggleState('ingame')
      this.render(this.currentPokemon)
      let sound = new Audio("../app/static/assets/sounds/pokemon_sound.mp3") // because spamming is fun
      sound.play()
    },
    end: function () {
      game.toggleState()
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
        app.foundPokemons.push(this.currentPokemon.id)
        window.localStorage.setItem(`foundPokemons`, JSON.stringify(app.foundPokemons)) // todo
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
      helper.emptyElement(this.elements.list)
      if (arr.length > 0) {
        clearInterval(this.update)
        let found = JSON.parse(window.localStorage.getItem('foundPokemons'))
        let list = arr.map((pokemon, i) => {
          if (helper.checkArray(found, pokemon.id)) {
            return `
            <li>
              <a href="#pokedex/${pokemon.id + 1}">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id + 1}.png">
                <p>${helper.capitalizeFirst(pokemon.name)}</p>
              </a>
            </li>
            `
          } else {
            return `
            <li>
              <a class="pokeHidden">
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
      console.log(data.sprites)
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
      console.log(data)
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
  const api = {
    gen: [[0, 151, 0], [152, 251, 1], [252, 368, 2]],
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
    },
    emptyElement: function (element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild)
      }
    },
    replaceHTML: function (element, string) {
      this.emptyElement(element)
      element.insertAdjacentHTML('beforeend', string)
    },
    checkArray: function (arr, value) {
      let hasValue = false
      arr.forEach((item, i) => {
        if (arr[i] === value) {
          hasValue = true
        }
      })
      return hasValue
    }
  }
  app.init()
})()
