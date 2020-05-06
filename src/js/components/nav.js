import navBurgerAnimation from '../animation/nav-burger-animation.json'

export default function nav() {

	const nav = $('.nav')
	const navHeight = nav.height()
	const navOffset = nav.offset().top;

  const burgerAnimatonEl = document.querySelector('.navigation-mobile__item--toggle a')
  let burgerAnimation = false;
  // burger menu anim
  if (lottie) {
    burgerAnimation = lottie.loadAnimation({
      container: burgerAnimatonEl, // the dom element that will contain the animation
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: navBurgerAnimation // the path to the animation json
    });

    burgerAnimation.setSpeed(1.3);

    burgerAnimation.addEventListener('enterFrame', (frame) => {
      console.log('frame', frame)
    })
  }

  // mobile burger toggle
  const mobileBurgerMenu = $(".navigation-mobile__item--toggle");
  $(mobileBurgerMenu).click(function () {
    if ($(".sidedrawer").hasClass("opened")) {
      $(".sidedrawer").removeClass("opened");
      // $("#content").css("margin-left", "0");

      if (burgerAnimation) {
        burgerAnimation.playSegments([95, 125], true);
      }

    } else {
      $(".sidedrawer").addClass("opened");
      // $("#content").css("margin-left", "260px");
      if (burgerAnimation) {
        burgerAnimation.playSegments([30, 60], true);
        // burgerAnimation.play()
      }
    }
  });

	$(window).scroll(function() {
		if( $(this).scrollTop() >= navOffset ) {
			nav.addClass("nav--sticky")
			$('#content').css('paddingTop', navHeight)
		} else {
			nav.removeClass("nav--sticky")
			$('#content').css('paddingTop', '')
		}
	})

}
