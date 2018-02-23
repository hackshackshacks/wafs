const api = {
  gen: [[0, 151, 0], [152, 251, 1], [252, 368, 2]], // stores available generations
  loadGeneration: function (gen) { // load pokemon generation
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('get', `https://pokeapi.co/api/v2/pokemon/?limit=${gen[1]}&offset=${gen[0]}`)
      xhr.onload = () => resolve(xhr.responseText)
      xhr.onerror = () => reject(xhr.statusText)
      xhr.send()
    })
  },
  loadSingle: function (id) { // load single pokemon
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('get', `https://pokeapi.co/api/v2/pokemon/${id}`)
      xhr.onload = () => resolve(xhr.responseText)
      xhr.onerror = () => reject(xhr.statusText)
      xhr.send()
    })
  }
}
export default api
