(function () {
  /* Helper functions */
  const h = {
    qs: function (el) {
      return document.querySelector(el)
    },
    qsa: function (el) {
      return document.querySelectorAll(el)
    }
  }
  /* Initialize application */
  const app = {
    init: function () {
      routes.init()
      this.handleEvents()
      this.initPage()
    },
    initPage: function () {
      sections.toggle(window.location.hash)
    },
    handleEvents: function () { 
      h.qsa('nav a').forEach((link) => {
        link.addEventListener('click', (e) => {
          e.preventDefault() // prevent jump
          sections.toggle(e.target.hash)
          window.location.hash = e.target.hash // set url to match hash
        })
      })
    }
  }
  /* Handle routes */
  const routes = {
    init: function () {
      window.addEventListener('hashchange', () => {
        sections.toggle(window.location.hash)
      })
    }
  }
  /* Render & toggle sections */
  const sections = {
    blocks: h.qsa('section'),
    toggle: function (route) {
      let active = h.qs(`${route}`)
      this.blocks.forEach((block) => {
        block.classList.remove('active')
      })
      active.classList.add('active')
    }
  }
  app.init()
}) ()
