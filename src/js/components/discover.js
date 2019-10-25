import slider from './slider'

// export default function discover( events ) {

// 	const sliderConfig = {
// 		lazyLoad: 'ondemand',
// 		dots: true,
// 		infinite: false,
// 		speed: 500,
// 		fade: false,
// 		cssEase: 'linear'
// 	}

// 	slider( events, '.slider-discover', sliderConfig, 'homeKv' );

// 	window.$( document ).ready(function() {
// 		setTimeout(function(){
// 			if(window.location.hash == "#whitepaper") {
// 				$("#slick-slide01").click();
// 			}
// 		},300);
// 	});



// 	//video

// 	// $("video").click(function(e){

// 	// 	// handle click if not Firefox (Firefox supports this feature natively)
// 	// 	if (typeof InstallTrigger === 'undefined') {

// 	// 		// get click position 
// 	// 		var clickY = (e.pageY - $(this).offset().top);
// 	// 		var height = parseFloat( $(this).height() );

// 	// 		// avoids interference with controls
// 	// 		if (clickY > 0.82*height) return;

// 	// 		// toggles play / pause
// 	// 		this.paused ? this.play() : this.pause();
// 	// 	}
// 	// });

// }




export default function discover(events) {

    const sliderConfig = {
        lazyLoad: 'ondemand',
        slidesToShow: 3,
        infinite: true,
        centerMode: true,
        slidesToScroll: 1,
        initialSlide: indexToGet,
        dots: false,
        focusOnSelect: true,
        prevArrow: false,
        nextArrow: false
    }

    slider(events, '.slider-discover', sliderConfig, 'homeKv');
    var indexToGet = $('.slider .slick-slide').index($('#center_on_me'));
    window.$(document).ready(function() {
        setTimeout(function() {
            if (window.location.hash == "#whitepaper") {
                $("#slick-slide01").click();
            }
        }, 300);
    });


    // 	var tabTriggerBtns = document.querySelectorAll('.tab-item');

    //     tabTriggerBtns.forEach(function(tabTriggerBtn, index){
    //      tabTriggerBtn.addEventListener('click', function(){
    // 		var flyout = document.querySelectorAll('.flyout');

    //         var currentTabData = document.querySelector('.tab-content[data-tab-content="' + this.dataset.tabTrigger + '"]');

    // 		// add fade out animation and remove 


    //         // remove classess
    //         document.querySelector('.tab-content.is-open').classList.remove('is-open');
    //         document.querySelector('.is-active').classList.remove('is-active');
    // 		// add classes

    // 		currentTabData.classList.add('is-open', 'flyout__on');
    // 		// currentTabData.classList.add('is-open', 'flyout__on');
    // 		this.classList.add('flyout', 'is-active');
    // 		// this.classList.add('flyout__on');
    //     });
    // });

    var tabTriggerBtns = document.querySelectorAll('.tab-item');

    tabTriggerBtns.forEach(function(tabTriggerBtn, index) {
        tabTriggerBtn.addEventListener('click', function() {
			
            var oldImgSrc = $('.floating__image img').attr('src')
            var newImg = $('.tab-item[data-tab-trigger="' + this.dataset.tabTrigger + '"]')
            var newImgSrc = $('.tab-item[data-tab-trigger="' + this.dataset.tabTrigger + '"]').attr('src');
            var currentTabData = document.querySelector('.tab-content[data-tab-content="' + this.dataset.tabTrigger + '"]');


            document.querySelector('.is-active').classList.remove('is-active');

            this.classList.add('is-active');

            setTimeout(function() {
                document.querySelector('.tab-content.is-open').classList.remove('is-open');
				$(newImg).attr('src', oldImgSrc);
				
                currentTabData.classList.add('is-open');
            }, 900);

            $('.flyout').not('.floating__image').addClass('flyout__on')
            $(".floating__image img").attr('src', newImgSrc);
            $(".floating__image").removeClass('fadeIn');
            setTimeout(function() {
                $('.flyout').removeClass('flyout__on')
            }, 1000);

            setTimeout(function() {
                $(".floating__image").addClass('fadeIn');
                $(".floating__image img").show();
            }, 1600);




        });
    });




}