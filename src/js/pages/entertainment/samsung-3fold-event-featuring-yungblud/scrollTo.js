//document.addEventListener('DOMContentLoaded', () => {

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


//});