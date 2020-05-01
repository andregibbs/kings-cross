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
    },
    easeInCirc: (x) => {
      return 1 - Math.sqrt(1 - Math.pow(x, 2));
    },
    linear: (x) => {
      return x
    }
  }

  // declare selector for later use
  const homeKV_SVG = document.querySelector('.homeKV__CrossSVG');
  const homeKV_HeaderImage = document.querySelector('.homeKV__HeaderImage');
  const homeKV_Title = document.querySelector('.homeKV__Title');
  const homeKV_BlackVertical = document.querySelector('.homeKV__CrossSVG #svg_black_vertical');
  const homeKV_BlackHorizontal = document.querySelector('.homeKV__CrossSVG #svg_black_horizontal');
  const navItemHeaders = document.querySelectorAll('.homeKV__NavItemText');
  const navItems = document.querySelectorAll('.homeKV__NavItem');

  // stores rect data for animations
  let rects = getRects();

  // Function to fetch any elements we require for rect data
  // rect data inlcudes, element positioning and dimensions
  // elementrect.top - bodyrect.top = scroll top position of element
  function getRects() {
    return {
      body: document.querySelector('body').getBoundingClientRect(),
      header: document.querySelector('.homeKV__Header').getBoundingClientRect(),
      nav: document.querySelector('.homeKV__Nav').getBoundingClientRect(),
    }
  }

  // Process Steps
  // loops through the provided steps
  // and calculates its values based on scroll position

  function processSteps(steps, scroll) {
    let values = {} // will contain the calculated transform values
    // loop through steps
    steps.forEach((step, i) => {
      // find active step if step scroll position is less than page scroll
      if (scroll >= step.scroll) {
        let nextStep = steps[i+1] // next step
        let progress = 1; // progress between steps, declare as 1 here for use in last step
        // if on last step, force final values
        if (!nextStep) {
          let prevStep = steps[i-1];
          // loop through keys and calculate values based on progress between steps
          Object.keys(step.values).forEach((key, i) => {
            values[key] = (((step.values[key] - prevStep.values[key]) * progress) + prevStep.values[key]).toFixed(2);
          });
        } else {
          // calculate progress on animation using scroll pos between current and next step
          progress = ((scroll - step.scroll) / (nextStep.scroll - step.scroll))
          let eased = step.easing(progress)
          // loop through value keys
          Object.keys(step.values).forEach((key, i) => {
            values[key] = (((nextStep.values[key] - step.values[key]) * progress) + step.values[key]).toFixed(2);
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
    const mobile = window.innerWidth <= 768;

    // TODO: may need to offset all these values with the gnb height
    // scrollto centering of the nav seems to be off

    // define each animation step for the main cross transformation
    const mainCrossSteps = [
      {
        scroll: 0, // start scroll position of step,
        easing: easing.easeOutCirc, // easing to use
        values: {
          y: -((rects.header.height * 0.2) + (rects.nav.height / 2)), // values to transform
          x: -(Math.min(1440, window.innerWidth) / 4),
          rotate: 35,
          scale: 2.5,
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
        scroll: ((rects.nav.top - rects.body.top) + rects.nav.height),
        values: {
          y: (rects.nav.height / 3),
          x: 0,
          rotate: -90,
          scale: 1.5,
        }
      }
    ]

    const headerImageSteps = [
      {
        scroll: 0, // start scroll position of step,
        easing: easing.easeInCirc, // easing to use
        values: {
          scale: 1,
          opacity: 1
        }
      },
      {
        scroll: (rects.nav.top - rects.body.top) - ((window.innerHeight - rects.nav.height) / 2),
        easing: easing.easeInCirc, // easing to use
        values: {
          scale: 1.2,
          opacity: 0
        }
      }
    ]

    const headerTitleSteps = [
      {
        scroll: 0, // start scroll position of step,
        easing: easing.easeOutCirc, // easing to use
        values: {
          y: -(window.innerHeight / 16),
        }
      },
      {
        scroll: (rects.nav.top - rects.body.top) - ((window.innerHeight - rects.nav.height) / 2) - (window.innerHeight / 4),
        easing: easing.easeOutCirc, // easing to use
        values: {
          y: (rects.header.height / 2) + (rects.nav.height / 4),
        }
      }
    ]

    const verticalBlackSteps = [
      {
        scroll: 0, // start scroll position of step,
        easing: easing.linear, // easing to use
        values: {
          opacity: 1,
        }
      },
      {
        scroll: (rects.nav.top - rects.body.top) - ((window.innerHeight - rects.nav.height) / 2) - (window.innerHeight / 4),
        easing: easing.linear, // easing to use
        values: {
          opacity: 1
        }
      }
    ]

    const horizontalBlackSteps = [
      {
        scroll: window.innerHeight * 0.5, // start scroll position of step,
        easing: easing.linear, // easing to use
        values: {
          opacity: 1,
        }
      },
      {
        scroll: (rects.nav.top - rects.body.top) - ((window.innerHeight - rects.nav.height) / 2) - (window.innerHeight / 4),
        easing: easing.linear, // easing to use
        values: {
          opacity: 0,
        }
      },
      {
        scroll: (rects.nav.top - rects.body.top) - ((window.innerHeight - rects.nav.height) / 2) + (window.innerHeight / 4),
        easing: easing.linear, // easing to use
        values: {
          opacity: 0,
        }
      },
      {
        scroll: ((rects.nav.top - rects.body.top) - ((window.innerHeight - rects.nav.height) / 2)) + (window.innerHeight * 0.5),
        easing: easing.linear, // easing to use
        values: {
          opacity: 1
        }
      }
    ]

    const navItemHeaderSteps = [
      {
        scroll: (rects.nav.top - rects.body.top) - (rects.header.height / 2),
        easing: easing.easeOutCirc, // easing to use
        values: {
          x: 150,
          opacity: 0
        }
      },
      {
        scroll: (rects.nav.top - rects.body.top) - ((window.innerHeight - rects.nav.height) / 2) - (window.innerHeight / 4),
        easing: easing.easeOutCirc, // easing to use
        values: {
          x: 0,
          opacity: 1
        }
      }
    ]

    // get values for cross transform
    const mainCrossValues = processSteps(mainCrossSteps, scroll);
    // set transform style
    homeKV_SVG.style.transform = `translate(${mainCrossValues['x']}px ,${mainCrossValues['y']}px) rotateZ(${mainCrossValues['rotate']}deg) scale(${mainCrossValues['scale']})`

    const headerImageValues = processSteps(headerImageSteps, scroll);
    // homeKV_HeaderImage.style.transform = `scale(${headerImageValues['scale']})`
    // homeKV_HeaderImage.style.transform = `translate(0, ${scroll * 0.8}px) scale(${headerImageValues['scale']})`
    // homeKV_HeaderImage.style.opacity = headerImageValues['opacity']

    const headerTitleValues = processSteps(headerTitleSteps, scroll);
    homeKV_Title.style.transform = `translate(0 ,${headerTitleValues['y']}px)`

    // const verticalBlackValues = processSteps(verticalBlackSteps, scroll)
    // homeKV_BlackVertical.style.opacity = verticalBlackValues.opacity

    const horizontalBlackValues = processSteps(horizontalBlackSteps, scroll)
    // homeKV_BlackHorizontal.style.opacity = horizontalBlackValues.opacity
    navItems.forEach((el) => {
      el.style.opacity = 1 - horizontalBlackValues.opacity
    })


    const navItemHeaderValues = processSteps(navItemHeaderSteps, scroll)
    navItemHeaders.forEach((el, i) => {
      let button = el.querySelector('.btn')
      let x = navItemHeaderValues.x
      let opacity = navItemHeaderValues.opacity
      switch (i) {
        case 0:
          x = x * -1
          x = Math.min(x + 50, 0)
          break;
        case 1:
          x = Math.max(x - 50, 0)
          break;
        case 2:
          x = x * -1
          break;
        default:
      }
      el.style.transform = `translate(${x}%, 0)`
      el.style.opacity = opacity
    });


  }

  // click events
  document.querySelector('.homeKV__ScrollLink').addEventListener('click', (e) => {
    e.preventDefault();
    window.scroll({
			top: (rects.nav.top - rects.body.top) - ((window.innerHeight - rects.nav.height) / 2),
			left: 0,
			behavior: 'smooth'
		});
  })

  // window events
  // On scroll event
  function onScroll(e) {
    cancelAnimationFrame(animFrame);
    animFrame = requestAnimationFrame(animate);
  }
  window.addEventListener('scroll', onScroll);

  // update rects object and reanimate when page is resized
  window.addEventListener('resize', () => {
    rects = getRects()
    animate()
  })

  // trigger animation once for initial style
  animate();

}

export default homeKV;
