(function () {
  /* Helper functions */
  const h = {
    qs: (el) => {
      return document.querySelector(el)
    },
    qsa: (el) => {
      return document.querySelectorAll(el)
    }
  }
  /* Initialize application */
  const app = {
    init: function () {
      routes.init()
      this.handleEvents()
    },
    handleEvents: () => {
      h.qsa('nav a').forEach(function (element) {
        element.addEventListener('click', function (event) {
          event.preventDefault()
          location.hash = this.hash
        })
      })
    }
  }
  /* Handle routes */
  const routes = {
    init: function () {
      routie({
        'game': () => {
          game.init()
        },
        'overview': () => {
          overview.init()
        }
      })
    }
  }
  /* Render & toggle sections */
  const sections = {
    blocks: h.qsa('section'),
    toggle: (route) => {
      let active = h.qs(`${route}`)
      sections.blocks.forEach((block) => {
        block.classList.remove('active')
      })
      active.classList.add('active')
    }
  }
  const game = {
    els: {
      load: h.qs('#gameLoader'),
      image: h.qs('#img'),
      output: h.qs('#counter'), // counter output element
      input: h.qs('#guess'), // user guess input element
      submit: h.qs('#submit'),
      message: h.qs('#message'), // win or lose message element
      name: h.qs('#pokemonName'),
      score: h.qs('#score'),
      newGame: h.qs('#newGame')
    },
    count: false,
    maxTime: 10,
    score: 0,
    pokemons: {},
    currentPokemon: {},
    init: () => {
      sections.toggle(window.location.hash)
      game.handleEvents()
      game.loadPokemons()
    },
    handleEvents: () => {
      game.els.submit.addEventListener('click', game.validate)
      game.els.newGame.addEventListener('click', () => {
        game.reset()
        game.start()
      })
    },
    loadPokemons: () => {
      api.getPokemons(151).then((result) => {
        let data = JSON.parse(result)
        game.pokemons = data.results
        game.start()
      })
    },
    start: () => {
      sections.blocks[0].classList.remove('revealed')
      let rnd = Math.floor(Math.random() * game.pokemons.length)
      game.currentPokemon = {
        name: game.pokemons[rnd].name,
        url: game.pokemons[rnd].url,
        index: rnd
      }
      game.els.image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${rnd + 1}.png`
      game.els.load.classList.add('hidden')
      game.countdown()
    },
    countdown: () => {
      let time
      time = game.maxTime
      if (!game.count) {
        game.count = setInterval(() => { // countdown function
          time--
          game.els.output.innerHTML = time
          if (time <= 0) {
            game.validate()
          }
        }, 1000)
      }
    },
    validate: () => {
      game.reset()
      sections.blocks[0].classList.add('revealed')
      game.els.name.innerHTML = `It's ${game.currentPokemon.name}`
      if (game.els.input.value === game.currentPokemon.name) {
        game.els.message.innerHTML = 'Nice!'
        game.score++
        game.els.score.innerHTML = `Score: ${game.score}`
      } else {
        game.els.message.innerHTML = 'Too bad!'
      }
    },
    reset: () => {
      clearInterval(game.count)
      game.count = false
      game.els.output.innerHTML = game.maxTime
    }
  }
  const overview = {
    init: () => {
      sections.toggle(window.location.hash)
      overview.handleEvents()
      overview.loadPokemons(overview.startAmount)
    },
    els: {
      list: h.qs('#pokemonList'),
      load: h.qs('#loadMore'),
      loader: h.qs('#listLoader')
    },
    handleEvents: () => {
      overview.els.load.addEventListener('click', () => {
        overview.loadPokemons(overview.currentAmount)
      })
    },
    startAmount: 5,
    currentAmount: 5,
    pokemons: {},
    loadPokemons: (limit) => {
      overview.els.loader.classList.remove('hidden')
      api.getPokemons(limit).then((result) => {
        let data = JSON.parse(result)
        overview.pokemons = data.results
        overview.fillList()
        overview.els.loader.classList.add('hidden')
      })
    },
    fillList: () => {
      let list = overview.pokemons.map((pokemon, i) => `
        <li>
          <a href="#${i}">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i + 1}.png">
            <p>${pokemon.name}</p>
          </a>
        </li>
      `).join('')
      overview.els.list.innerHTML = list
      overview.currentAmount += overview.startAmount
    }
  }
  const api = {
    getPokemons: (limit) => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('get', `https://pokeapi.co/api/v2/pokemon/?limit=${limit}`)
        xhr.onload = () => resolve(xhr.responseText)
        xhr.onerror = () => reject(xhr.statusText)
        xhr.send()
      })
    }
  }
  app.init()
})()
