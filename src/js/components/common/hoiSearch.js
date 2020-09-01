import Fuse from 'fuse.js'

const searchFile = '/uk/explore/kings-cross/hoi-search.json'
const input = document.querySelector('#search')
let data;
let fuse;

export default function HOISearch() {
  console.log('fudge')
  fetch(searchFile)
    .then(r => r.json())
    .then(data => {
      fuse = new Fuse(data, {
        includeScore: true,
        // includeMatches: true, // debug: show search
        threshold: 0.25, // word accuracy level
        distance: 1500, // length of value to search
        findAllMatches: true, // search for multiple
        keys: ['title','description','values']
      })
      console.log(data, fuse)
    })

  input.addEventListener('input', (e) => {
    const value = input.value
    // if (value.length > 2) {
    const results = fuse.search(value)
    console.clear()
    console.log(value,results,fuse)
      renderResults(results)
    // } else {
      // renderResults([])
    // }
  })


  function renderResults(results) {
    const el = document.querySelector('#results')
    el.textContent = ''

    results.forEach(r => {
      // console.log(r)
      var newEl = document.createElement('div')
      // newEl.className = "result"
      newEl.href = r.item.url
      // newEl.style.backgroundImage = `url('${r.item.image}')`
      newEl.innerText = `${r.item.title}, Score: ${r.score}`
      el.appendChild(newEl)
    })
  }
}
