import smoothscroll from '../polyfill/smoothscroll-polyfill';
import upcomingEvents from "./upcomingEvents";

export default function whatIsKx(events) {

	// kick off the polyfill only if browser doesn't support window.scroll
	// window.scroll docs: https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo
	// polyfill docs: http://iamdustan.com/smoothscroll/
	smoothscroll.polyfill();


	upcomingEvents(events, 212);

	// Scroll to a certain element
	$('.whatIsKx__item').click(function() {
		let getScrollEl = $(this).data('scroll')

		window.scroll({
			top: $('.scroll-'+ getScrollEl +'').offset().top,
			left: 0,
			behavior: 'smooth'
		});
	})
	parllax();
	$(document).scroll(function() {
		parllax();



	})

	function parllax() {

		let parent = $("#parallax__container");
		let children = $("#parallax__container").children();
		let paratext = $("#parallax__container").find(".parallax__text");
		let paraHight = ($("#parallax__container").outerHeight() + $("#parallax__container").offset().top);

		for (let i = 0; i < children.length; i++) {
			children[i].style.transform =
			  "translateY(-" +
			  (window.pageYOffset / i ) / children.length * 2 +
			  "px)";
		  }

		 paratext.css('opacity', (1 - window.scrollY / paraHight * 4));

	}

	//video

		$("video").click(function(e){

			// handle click if not Firefox (Firefox supports this feature natively)
			if (typeof InstallTrigger === 'undefined') {
		
				// get click position 
				var clickY = (e.pageY - $(this).offset().top);
				var height = parseFloat( $(this).height() );
		
				// avoids interference with controls
				if (clickY > 0.82*height) return;
		
				// toggles play / pause
				this.paused ? this.play() : this.pause();
			}
		});
}
