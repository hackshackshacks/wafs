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
  var sections = {
    sections: app.rootElement.querySelectorAll("body>section"),
    toggle: function(route) {
      for (let i = 0; i < this.sections.length; i++) {
        this.sections[i].classList.remove("active");
        // Checking if the id is the same as the route
        if (this.sections[i].id == route) {
          this.sections[i].classList.add("active");
        }
      }
    }
  }

  // Start the Aplication
  app.init();
})()
