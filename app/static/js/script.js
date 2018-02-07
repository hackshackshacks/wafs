(function () {
  /* Initialize application */
  const app = {
    init: function () {
      routes.init()
      sections.toggle(window.location.hash)
      document.querySelectorAll('nav a').forEach((link) => {
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
    blocks: document.querySelectorAll('section'),
    toggle: function (route) {
      let active = document.querySelector(`${route}`)
      this.blocks.forEach((block) => {
        block.classList.remove('active')
      })
      active.classList.add('active')
    }
  }
  app.init()
})()
