import Fuse from 'fuse.js'

const searchFile = '/uk/explore/kings-cross/hoi-search.json'
const input = document.querySelector('#search')
let data;
let fuse;

export default function HOISearch() {
  console.log('fudge')
  fetch(searchFile)
    .then(r => r.json())
    .then(json => {
      data = json
      fuse = new Fuse(data, { includeScore: true, ignoreLocation: true, ignoreFieldNorm: true, threshold: 0.25, keys: ['title','description','values']})
      console.log(data, fuse)
    })

  input.addEventListener('input', (e) => {
    const value = input.value
    // if (value.length > 2) {
    const results = fuse.search(value)
    console.log(value,results)
      renderResults(results)
    // } else {
      // renderResults([])
    // }
  })


  function renderResults(results) {
    const el = document.querySelector('#results')
    el.textContent = ''

    results.forEach(r => {
      var newEl = document.createElement('a')
      newEl.className = "result"
      newEl.href = r.item.url
      newEl.style.backgroundImage = `url('${r.item.image}')`
      newEl.innerText = `${r.item.title}, ${r.item.url}`
      el.appendChild(newEl)
    })
  }
}
