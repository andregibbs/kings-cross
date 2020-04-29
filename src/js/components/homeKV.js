// Revamped homeKV
// Script contains step configurations for the svg animations

function homeKV() {

  // animation frame variable
  let animFrame;

  // delcare easings
  const easing = {
    easeOutCirc: (x) => {
      return Math.sqrt(1 - Math.pow(x - 1, 2))
    },
    easeInSine: (x) => {
      return 1 - Math.cos((x * Math.PI) / 2)
    }
  }

  // declare selector for later use
  const homeKV_SVG = document.querySelector('.homeKV__CrossSVG')

  // stores rect data for animations
  let rects = getRects();

  // Function to fetch Elements we require rect data for
  function getRects() {
    return {
      body: document.querySelector('body').getBoundingClientRect(),
      header: document.querySelector('.homeKV__Header').getBoundingClientRect(),
      nav: document.querySelector('.homeKV__Nav').getBoundingClientRect(),
    }
  }

  // update rects when page is resized
  window.addEventListener('resize', () => {
    console.log('update rects', rects)
    rects = getRects()
  })


  // Process Steps
  // loops through the provided steps
  // and calculates its values based on scroll position

  function processSteps(steps, scroll) {
    let values = {} // will contain the calculated transform values
    steps.forEach((step, i) => {
      // loop through steps,
      // find active step if scroll position is less than current scroll
      if (scroll >= step.scroll) {
        let nextStep = steps[i+1] // next step
        let progress = 1; // progress between steps, default as 1 for use in last step
        // if on last step, force final values
        if (!nextStep) {
          let prevStep = steps[i-1];
          // loop through keys and calculate values based on progress between steps
          Object.keys(step.values).forEach((key, i) => {
            values[key] = ((step.values[key] - prevStep.values[key]) * progress) + prevStep.values[key];
          });
        } else {
          // calculate progress on animation using scroll pos between current and next step
          progress = ((scroll - step.scroll) / (nextStep.scroll - step.scroll))
          let eased = step.easing(progress)
          // loop through value keys
          Object.keys(step.values).forEach((key, i) => {
            values[key] = ((nextStep.values[key] - step.values[key]) * progress) + step.values[key];
          });
        }
      }
    })
    return values
  }

  // main animate function
  // process all step configs on frame
  function animate(e) {
    // store scroll variable
    const scroll = window.scrollY;

    // define each animation step for the main cross transformation
    let mainCrossSteps = [
      {
        scroll: 0, // start scroll position of step,
        easing: easing.easeOutCirc, // easing to use
        values: {
          y: -((rects.header.height * 0.3) + (rects.nav.height / 2)), // values to transform
          x: -(Math.min(1440, window.innerWidth) / 4),
          rotate: 20,
          scale: 2,
        }
      },
      {
        // for responsiveness this scroll position is dynamic an based of element dimensions
        // this position is for the center point of the nav items
        scroll: (rects.nav.top - rects.body.top) - ((window.innerHeight - rects.nav.height) / 2) - (window.innerHeight / 4),
        easing: easing.easeInSine,
        values: {
          y: -75,
          x: 0,
          rotate: 0,
          scale: 1,
        }
      },
      {
        // for responsiveness this scroll position is dynamic an based of element dimension
        // this position is for the center point of the nav items
        scroll: (rects.nav.top - rects.body.top) - ((window.innerHeight - rects.nav.height) / 2) + (window.innerHeight / 6),
        easing: easing.easeInSine,
        values: {
          y: 75,
          x: 0,
          rotate: 0,
          scale: 1,
        }
      },
      {
        // last scroll is after 50% of the nav items are out of view
        scroll: ((rects.nav.top - rects.body.top) - ((window.innerHeight - rects.nav.height) / 2)) + (window.innerHeight * 0.5),
        values: {
          y: (rects.nav.height / 3),
          x: 0,
          rotate: -90,
          scale: 2,
        }
      }
    ]

    // get values for cross transform
    const mainCrossValues = processSteps(mainCrossSteps, scroll);
    // set transform style
    homeKV_SVG.style.transform = `translate(${mainCrossValues['x'].toFixed(2)}px ,${mainCrossValues['y'].toFixed(2)}px) rotateZ(${mainCrossValues['rotate'].toFixed(2)}deg) scale(${mainCrossValues['scale'].toFixed(2)})`

  }

  // On scroll event
  function onScroll(e) {
    cancelAnimationFrame(animFrame);
    animFrame = requestAnimationFrame(animate);
  }
  window.addEventListener('scroll', onScroll);

  // trigger animation once for initial style
  animate();

}

export default homeKV;
