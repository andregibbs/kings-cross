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
export default function initListItemHoverEvents(target) {
  // observe this element for mutations
  const targetSelector = target || 'section.home-of-innovation'
  const elToObserve = document.querySelector(targetSelector)

  const observer = new MutationObserver(function (mutations, ob) {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        console.log('added', node, node)
        // loop through added nodes to find ones with list item class
        if (node.className && node.className.length > 1 && node.className.indexOf(selectorToFind) > -1) {
          // create listener
          HOIListItemHover(node)
        } else if (node.className && node.className.indexOf('hoiLinkList') > -1) {
          // console.log('search node')
          // If we are on the search page, the parent container of the search items is passed to the observer
          // here we locate the items to apply the hover states (could also be done with querySelectorAll)
          let items = [].slice.call(node.children[0].children)
          items.forEach((el) => {
            HOIListItemHover(el)
          })
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
