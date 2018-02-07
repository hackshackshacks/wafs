(function () {
  /* Initialize application */
  const app = {
    init: function () {
      routes.init()
      sections.toggle(helpers.getHash())
    }
  }
  /* Handle routes */
  const routes = {
    init: function () {
      window.addEventListener('hashchange', () => {
        sections.toggle(helpers.getHash())
      })
    }
  }
  /* Render & toggle sections */
  const sections = {
    toggle: function (route) {
      let blocks = document.querySelectorAll('section')
      let active = document.querySelector(`.${route}`)
      blocks.forEach((block) => {
        block.classList.remove('active')
      })
      active.classList.add('active')
    }
  }
  /* helper functions */
  const helpers = {
    getHash: function () {
      return window.location.hash.split('#')[1]
    }
  }
  app.init()
})()
