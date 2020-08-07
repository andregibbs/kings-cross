function HOIListItemHover(el) {
  // console.log('hov', el)

  const descriptionElement = el.querySelector('.hoiList__ItemTitleDescription')

  // only want to configure hover event for elements with description
  if (!descriptionElement) {
    // console.log('no desc')
    return
  }

  // set max height to natural height
  el.addEventListener('mouseenter', (e) => {
    let height = descriptionElement.scrollHeight;
    descriptionElement.style.maxHeight = `${height}px`
  })

  // reset height
  el.addEventListener('mouseleave', (e) => {
    descriptionElement.style.maxHeight = null
  })

}

const selectorToFind = 'hoiList__Item'
export default function initListItemHoverEvents() {
  // observe this element for mutations
  const elToObserve = document.querySelector('section.home-of-innovation')

  const observer = new MutationObserver(function (mutations, ob) {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        // loop through added nodes to find ones with list item class
        if (node.className && node.className.length > 1 && node.className.indexOf(selectorToFind) > -1) {
          // create listener
          HOIListItemHover(node)
        }
      })
    })
  });

  // start observer
  observer.observe(elToObserve, {
    childList: true,
    subtree: true
  });

}
