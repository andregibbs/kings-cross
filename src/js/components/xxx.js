import { deviceType } from './helpers';
import { isIOSAndLessThan11 } from './helpers';
import ObjPolyfill from './objectFit-polyfill';

export default {

	init() {
        this.initBanners();
		this.checkIfIOS()
		//this.initViewMode();
		//ObjPolyfill.initVideo();
	},
	initBanners() {
		var _self = this,
			body = $('body'),
			banner = $('section.banner');

		if( !banner.length ) return false;

		body.addClass("has-banner");

		$(window).on('scroll', function(){
            let bodyScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
			let bannerOffset = bodyScrollTop - parseInt( $('.banner__inner').height() ) - parseInt( $('html').css('padding-top') ) + parseInt( $('.borders__border--top').height() );

			if( bannerOffset > 0 ) {
                body.addClass('sticky-banner');
			} else {
				body.removeClass('sticky-banner');
			}

		});
    },
    
    checkIfIOS() {
        if( isIOSAndLessThan11() ) {
            // console.log("IOS Device AND less than iOS 11")
            $('.banner__inner').find('.banner-video').remove()
            var page = window.location.pathname.split('/')[1]; 
            if (page) {
	            $('.banner__inner').append('<div class="banner-image"><img style="height:100%;" src="/assets/images/banner/fallback-' + page + '.jpg" alt="' + page + '" /></div>')
            }
        }
    },

	initScroll() {
		var _self = this,
			body = $('body'),
			banner = $('section.banner'),
			bannerInner = $('.banner__inner'),
			nextEl = banner.next(),
			nextElViewTop = 0,
			cssMaxHeight = parseInt(bannerInner.css('max-height'));

		if( !banner.length ) return false;

		function doResizeBanner() {
			nextElViewTop = nextEl.offset().top - $(window).scrollTop();
			bannerInner.css('height', nextElViewTop );
			cssMaxHeight = parseInt(bannerInner.css('max-height'));

			if(nextElViewTop < (cssMaxHeight - 50)) {
				banner.addClass('small-title');
			} else {
				banner.removeClass('small-title');
			}

			ObjPolyfill.initVideo();
		}


		//
		// Scroll event listener
		// --------------------------------------------------------------------------
		$(window).scroll( doResizeBanner );

		//
		// Resize event listener
		// --------------------------------------------------------------------------
		$(window).on('resize', doResizeBanner );
	}

}