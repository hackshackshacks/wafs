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
      this.initPage()
    },
    initPage: () => {
      sections.toggle(window.location.hash)
    }
  }
  /* Handle routes */
  const routes = {
    init: () => {
      window.addEventListener('hashchange', () => {
        sections.toggle(window.location.hash)
        api.singlePoke(Math.floor(Math.random() * 100 + 1)).then((result) => {
          console.log(JSON.parse(result).name)
        })
      })
    }
  }
  /* Render & toggle sections */
  const sections = {
    blocks: h.qsa('section'),
    toggle: (route) => {
      let active = h.qs(`${route}`)
      sections.blocks.forEach((block)=> {
        block.classList.remove('active')
      })
      active.classList.add('active')
    }
  }
  const api = {
    singlePoke: (i) => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open("GET", `https://pokeapi.co/api/v2/pokemon/${i}/`)
        xhr.onload = () => resolve(xhr.responseText)
        xhr.onerror = () => reject(xhr.statusText)
        xhr.send()
      })
    }
  }
  app.init()
})()
