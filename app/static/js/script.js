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
      h.qs('#randomize').addEventListener('click', () => {
        app.reset()
      })
    },
    counter: (name) => {
      const el = h.qs('#counter')
      const input = h.qs('#guess')
      const wl = h.qs('.super')
      let time = 10
      let countdown = setInterval(() => {
        time--
        el.innerHTML = time
        if (time <= 0) {
          clearInterval(countdown)
          sections.blocks[0].classList.add('revealed')
          if (input.value === name) {
            wl.innerHTML = 'You win!'
          } else {
            wl.innerHTML = 'You lose!'
          }
        }
      }, 1000)
    },
    reset: () => {
      sections.blocks[0].classList.remove('revealed')
      api.loadSingle()
    }
  }
  /* Handle routes */
  const routes = {
    init: function () {
      api.loadSingle()
      routie({
        'start': () => {
          sections.toggle(window.location.hash)
          api.loadSingle()
        },
        'list': () => {
          sections.toggle(window.location.hash)
          api.loadList()
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
  const api = {
    getPoke: (i) => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open("GET", `https://pokeapi.co/api/v2/pokemon/${i}`)
        xhr.onload = () => resolve(xhr.responseText)
        xhr.onerror = () => reject(xhr.statusText)
        xhr.send()
      })
    },
    loadSingle: () => {
      const load = h.qs('.imgWrap img:nth-child(1)')
      load.classList.remove('hidden')
      rnd = Math.floor(Math.random() * 100 + 1)
      api.getList().then((result) => {
        let data = JSON.parse(result)
        let pokemon = data.results[rnd - 1]
        h.qs('#img').src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${rnd}.png`
        load.classList.add('hidden')
        Transparency.render(h.qs('#random'), pokemon)
        app.counter(pokemon.name)
      })
    },
    getList: () => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open("GET", `https://pokeapi.co/api/v2/pokemon/?limit=100`)
        xhr.onload = () => resolve(xhr.responseText)
        xhr.onerror = () => reject(xhr.statusText)
        xhr.send()
      })
    },
    loadList: () => {
      api.getList().then((result) => {
        let data = JSON.parse(result)
        let pokemon = data.results
        Transparency.render(document.getElementById('pokemons'), pokemon)
      })
    }
  }
  app.init()
})()
