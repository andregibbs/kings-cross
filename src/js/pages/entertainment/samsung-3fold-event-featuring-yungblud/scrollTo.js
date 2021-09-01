document.addEventListener('DOMContentLoaded', () => {

function goToSection(section, anim) {
  gsap.to(window, {
    scrollTo: {y: section, offsetY: 130, autoKill: false},
    duration: 1
  });
  
  if(anim) {
    anim.restart();
  }
}

document.querySelectorAll(".slide").forEach(section => {
  ScrollTrigger.create({
    trigger: section,
    onEnter: () => goToSection(section),
  });
  
  ScrollTrigger.create({
    trigger: section,
    start: "bottom bottom",
    onEnterBack: () => goToSection(section),
  });
});


gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll(".parallax").forEach(section => {

    gsap.from(section, {

        y: 200,
        duration: 1,
        scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'top 4%',
            scrub: false,
            toggleActions: "restart pause pause reset",
        } 

    });

});

gsap.from(".parallax-toplayer", {

    y: 200,
    duration: 1,
    scrollTrigger: {
        trigger: ".topLayer",
        start: '25% bottom',
        end: 'bottom top',
        scrub: false,
        toggleActions: "restart pause pause reset",
    } 

});






/*gsap.from(".top-image", {

    y: 200,
    duration: 1,
    scrollTrigger: {
        trigger: ".top-image",
        start: 'top 96%',
        end: 'top 4%',
        scrub: false,
        toggleActions: "restart pause pause reset",
        markers: {
            "startColor": "purple",
            "endcolor": "fuchsia",
            "fontSize": "3rem",
        },
        
    } 

});

gsap.from(".mid-bg", {

    y: 200,
    duration: 1,
    scrollTrigger: {
        trigger: ".mid-bg",
        start: 'top 96%',
        end: 'top 4%',
        scrub: false,
        toggleActions: "restart pause pause reset",
    } 

});*/












/*    function goToSection(section, anim) {
        gsap.to(window, {
            scrollTo: {y: section, offsetY: 100, autoKill: false},
            duration: 1
        });

        if(anim) {
            anim.restart();
        }
    }

    document.querySelectorAll(".slide").forEach(section => {
        
        let tween = gsap.to(".top-image", {
            y:200,
        })

       
        ScrollTrigger.create({
            trigger: section,
            onEnter: () => goToSection(section),
        });

        ScrollTrigger.create({
            trigger: section,
            start: "bottom bottom",
            toggleActions: "restart pause reverse pause",
            onEnterBack: () => goToSection(section),
        });

    });
*/




















/*
     let tween = gsap.to(".top-image", {y:200}),
     st = ScrollTrigger.create({
        trigger: ".top-image",
        start: "top center",
        end: "+=500",
        animation: tween
      });
*/

    
/*
    let controller = new ScrollMagic.Controller();

    let timeline = new TimelineMax();
    timeline
    .from('.top-image', 6, {
        top: '40px',
        autoAlpha: 0
    }, '-=4')
    
    let scene = new ScrollMagic.Scene({
        triggerElement: 'section',
        duration: '200%',
        triggerHook: 0
    })
    .setTween(timeline)
    .setPin('section')
    .addTo(controller);*/


    /*gsap.registerPlugin(ScrollTrigger);

    gsap.from('.top-image', {
        y: 200,
        duration: 2,
        autoAlpha: 0,
        ScrollTrigger: {
            trigger:".midSection",
            markers: true,
            toggleActions: "restart pause reverse pause"
        }

    });*/


});