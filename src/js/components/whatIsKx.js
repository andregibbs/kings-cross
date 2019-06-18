import smoothscroll from '../polyfill/smoothscroll-polyfill'

export default function whatIsKx() {

	// kick off the polyfill only if browser doesn't support window.scroll
	// window.scroll docs: https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo
	// polyfill docs: http://iamdustan.com/smoothscroll/
	smoothscroll.polyfill();

	// Scroll to a certain element
	$('.whatIsKx__item').click(function() {
		let getScrollEl = $(this).data('scroll')

		window.scroll({
			top: $('.scroll-'+ getScrollEl +'').offset().top,
			left: 0,
			behavior: 'smooth'
		});
	})
}
