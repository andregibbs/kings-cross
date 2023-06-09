import smoothscroll from '../polyfill/smoothscroll-polyfill';
import upcomingEvents from "./upcomingEvents";
import newParallax from './parallax';
import atvImg from './atvImg';
import doLogFunction from '../dev/doLog';
var doLog = doLogFunction();

export default function whatIsKx(events) {

	// kick off the polyfill only if browser doesn't support window.scroll
	// window.scroll docs: https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo
	// polyfill docs: http://iamdustan.com/smoothscroll/
	smoothscroll.polyfill();

  // filter private events
  events = events.filter((event) => {
    return !event.extra.private
  })


	upcomingEvents(events, 212);

	// Scroll to a certain element
	// $j('.whatIsKx__item').click(function() {
	// 	let getScrollEl = $j(this).data('scroll')
  //
	// 	window.scroll({
	// 		top: $j('.scroll-'+ getScrollEl +'').offset().top,
	// 		left: 0,
	// 		behavior: 'smooth'
	// 	});
	// })
	// var testParallax =  new newParallax('.para');
	// parllaxText();
	// $j(document).scroll(function() {
	// 	parllaxText();
  //
  //
  //
	// })
  //
	// function parllaxText() {
  //
	// 	let paratext = $j("#parallax__container").find(".parallax__text");
	// 	let paraHight = ($j("#parallax__container").outerHeight() + $j("#parallax__container").offset().top);
	// 	let opacity = (1 - window.scrollY / paraHight * 2);
	// 	// paratext.css('opacity', opacity);
	// 	doLog(paratext);
	// 	paratext[0].style.opacity = opacity;
  //
	// }

	//video

		// $j("video").click(function(e){

		// 	// handle click if not Firefox (Firefox supports this feature natively)
		// 	if (typeof InstallTrigger === 'undefined') {

		// 		// get click position
		// 		var clickY = (e.pageY - $j(this).offset().top);
		// 		var height = parseFloat( $j(this).height() );

		// 		// avoids interference with controls
		// 		if (clickY > 0.82*height) return;

		// 		// toggles play / pause
		// 		this.paused ? this.play() : this.pause();
		// 	}
		// });


		//passion point images

		atvImg();
}
