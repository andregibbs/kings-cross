export default function nav() {

	const nav = $('.nav')
	const navHeight = nav.height()
	const navOffset = nav.offset().top;

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
