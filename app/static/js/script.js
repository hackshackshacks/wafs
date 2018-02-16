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
        },
        'overview/:pokemon?': (i) => {
          detail.init(Number(i) + 1)
        }
      })
    }
  }
  /* Toggle sections */
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
      submit: h.qs('#submitGuess'),
      message: h.qs('#message'), // win or lose message element
      name: h.qs('#pokemonName'),
      score: h.qs('#score'),
      newGame: h.qs('#newGame')
    },
    count: false,
    maxTime: 10,
    score: 0,
    pokemons: [],
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
      api.getPokemons(151, 0).then((result) => {
        let data = JSON.parse(result)
        game.pokemons = data.results
        console.log(data.results)
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
      loader: h.qs('#listLoader'),
      search: h.qs('#search'),
      submit: h.qs('#submitSearch')
    },
    handleEvents: () => {
      overview.els.load.addEventListener('click', () => {
        overview.loadPokemons(overview.startAmount, overview.offset)
      })
      overview.els.search.addEventListener('change', () => {
        overview.search() // load pokemons with filter
      })
    },
    startAmount: 5,
    offset: 0,
    pokemons: [],
    loadPokemons: (limit, offset) => {
      overview.els.loader.classList.remove('hidden')
      api.getPokemons(limit, offset).then((result) => {
        let data = JSON.parse(result)
        overview.els.loader.classList.add('hidden')
        data.results.forEach((item, i) => {
          let obj = {
            id: overview.offset + i,
            name: item.name
          }
          overview.pokemons.push(obj)
        })
        overview.offset += overview.startAmount
        overview.render()
      })
    },
    search: () => {
      detail.els.list.classList.add('hidden')
      overview.els.loader.classList.remove('hidden')
      api.getPokemons(151).then((result) => {
        overview.pokemons = []
        let data = JSON.parse(result)
        overview.els.loader.classList.add('hidden')
        detail.els.list.classList.remove('hidden')
        let value = overview.els.search.value
        function filterbyname (item, i) {
          if (item.name.includes(value)) {
            let obj = {
              id: i,
              name: item.name
            }
            overview.pokemons.push(obj)
          }
        }
        data.results.filter(filterbyname)
        overview.render()
      })
    },
    render: () => {
      let list = overview.pokemons.map((pokemon, i) => `
        <li>
          <a href="#overview/${pokemon.id + 1}">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id + 1}.png">
            <p>${pokemon.name}</p>
          </a>
        </li>
      `).join('')
      overview.els.list.innerHTML = list
      overview.currentAmount += overview.startAmount
    }
  }
  const detail = {
    init: (pokemon) => {
      sections.toggle('#detail')
      detail.loadPokemon(pokemon)
    },
    els: {
      list: h.qs('#detailList'),
      loader: h.qs('#detailLoader')
    },
    pokemon: {},
    loadPokemon: (index) => {
      detail.els.loader.classList.remove('hidden')
      detail.els.list.classList.add('hidden')
      api.getPokemon(index).then((result) => {
        let data = JSON.parse(result)
        detail.pokemon = data
        detail.render()
        detail.els.loader.classList.add('hidden')
        detail.els.list.classList.remove('hidden')
      }).catch((err) => {
        console.log(err)
      })
    },
    render: () => {
      let info = `
        <li>Name: ${detail.pokemon.pokemon.name}</li>
        <li>Id: ${detail.pokemon.id - 1}</li>
        <li><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${detail.pokemon.id - 1}.png"></li>
      `
      detail.els.list.innerHTML = info
    }
  }
  const api = {
    getPokemons: (amount, offset) => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('get', `https://pokeapi.co/api/v2/pokemon/?limit=${amount}&offset=${offset}`)
        xhr.onload = () => resolve(xhr.responseText)
        xhr.onerror = () => reject(xhr.statusText)
        xhr.send()
      })
    },
    getPokemon: (index) => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('get', `https://pokeapi.co/api/v1/sprite/${index}/`)
        xhr.onload = () => resolve(xhr.responseText)
        xhr.onerror = () => reject(xhr.statusText)
        xhr.send()
      })
    }
  }
  app.init()
})()
