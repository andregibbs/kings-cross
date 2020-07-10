import navBurgerAnimation from '../animation/nav-burger-animation.json'

export default function nav() {

	const nav = $j('.nav')
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
      // console.log('frame', frame)
    })
  }

  // mobile burger toggle
  const mobileBurgerMenu = $j(".navigation-mobile__item--toggle");
  $j(mobileBurgerMenu).click(function () {
    if ($j(".sidedrawer").hasClass("opened")) {
      $j(".sidedrawer").removeClass("opened");
      // $j("#content").css("margin-left", "0");

      if (burgerAnimation) {
        burgerAnimation.playSegments([95, 125], true);
      }

    } else {
      $j(".sidedrawer").addClass("opened");
      // $j("#content").css("margin-left", "260px");
      if (burgerAnimation) {
        burgerAnimation.playSegments([30, 60], true);
        // burgerAnimation.play()
      }
    }
  });

	$j(window).scroll(function() {
		if( $j(this).scrollTop() >= navOffset ) {
			nav.addClass("nav--sticky")
			$j('#content').css('paddingTop', navHeight)
		} else {
			nav.removeClass("nav--sticky")
			$j('#content').css('paddingTop', '')
		}
	})

}
