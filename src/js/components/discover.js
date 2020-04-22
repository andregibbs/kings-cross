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

const SLOTS = { 
    "desktop": {
        1: '#slot_1',
        2: '#slot_2',
        3: '#slot_3'
    },
    "mobile": {
        1: '#slot_1_mobile',
        2: '#slot_2_mobile',
        3: '#slot_3_mobile'
    }
}
const tabs = {
    1: {
        "img" : {
            "src" : "https://images.samsung.com/is/image/samsung/p5/uk/explore/kings-cross/recently1.png?$ORIGIN_PNG$",
            "alt" : ""
        }, 
        "content" : 
            `<h1 class="recently__content__header">Samsung KX Presents: Thread Talks with Caitlin Moran</h1>
            <p><b>To kick off the first in the series of Thread Talks, host and comedian Alex Zane was joined by acclaimed author Caitlin Moran as they celebrated the world of Twitter threads, spats and conversations.</b></p><br>
            <p>The 90-minute event featured an intimate live performance from Caitlin as she reflected on one of her most popular Twitter threads - a look at the downsides of being a man – followed by a Q&A with the audience and Alex Zane which highlighted some of her greatest, weirdest and funniest moments on the platform.</p>
            <p>Thread Talks is a series of six intimate and exclusive ‘in conversation’ events featuring some of the biggest names in the world of journalism, sport, culture and comedy. The acts will perform at the venue’s Centre Stage in front the world’s first vertical 10metre-wide curved Samsung screen.</p>
            <p>Each free event is being hosted in association with Twitter UK and on each night guests will hear from the company’s Director of Planning, David Wilding.</p>`,
        "link" : "https://www.youtube.com/watch?v=V_qo-YXoaJc&list=PLrUG7VyDs_IUJjPkzyWADKvxld8A4Na1n&index=5&t=0s",
        "slot": 1
    },
    2: {
        "img" : {
            "src" : "https://images.samsung.com/is/image/samsung/p5/uk/explore/kings-cross/recently2.png?$ORIGIN_PNG$",
            "alt" : ""
        }, 
        "content" : 
            `<h1 class="recently__content__header">Co-Lab Series: How to monetise your side hustle</h1>
            <p><b>Mercedes Benson is a creative polymath, from becoming an enterprise founder to a social influencer, she is a true all-rounder.</b></p><br>
            <p>In her talk she shared her knowledge and insight on how to turn your passion into a business discussing her own experience by making money from her creativity.</p>
            <p>Joined by a role model of hers, Toni Tone (@t0nit0ne), the duo showcased how best to begin your side hustle. Toni is an online talk show host and social content creator, best known for her social commentary on Twitter as well as her online writing.</p>`,
        "link" : "https://www.youtube.com/channel/UC_v6xPXpnS4LaLEdfMr-Lzw",
        "slot": 2
    },
    3: {
        "img" : {
            "src" : "https://images.samsung.com/is/image/samsung/p5/uk/explore/kings-cross/zonev-300x200.png?$ORIGIN_PNG$",
            "alt" : ""
        }, 
        "content" : 
            `<h1 class="recently__content__header">Zone V</h1>
            <p><b>Zone V is an easy to use interface that works with Samsung Smartphones designed to make even the most important phone features easy. It simplifies access to mobile device apps such as calls and texts, phone and contacts keeping you connected with friends and family.</b></p><br>
            <p>From enlarging text and buttons to creating clearer menus, Zone V makes devices more accessible for those that struggle. For more information on Zone V please visit: <a href="https://zonev.com/" target="_blank">https://zonev.com/.</a></p>`,
        "link" : "https://youtu.be/iYMiu-9aKnI",
        "slot": 3
    }
}


let activeTab = 1;

export default function discover(events) {

    const sliderConfig = {
        lazyLoad: 'ondemand',
        slidesToShow: 3,
        infinite: true,
        centerMode: true,
        centerPadding: '0px',
        slidesToScroll: 1,
        initialSlide: indexToGet,
        dots: false,
        focusOnSelect: true,
        prevArrow: false,
        nextArrow: false,
        speed: 1000
    }

    const altSliderConfig = {
            lazyLoad: 'ondemand',
            dots: true,
            infinite: false,
            speed: 500,
            fade: false
            
    }
    const recentlySliderConfig = {
        lazyLoad: 'ondemand',
        slidesToShow: 2,
        infinite: true,
        centerMode: true,
        centerPadding: '30px',
        slidesToScroll: 1,
        dots: false,
        focusOnSelect: true,
        speed: 1000,
        asNavFor: '.slider-discover-recently-descriptions',
        autoplay: true,
        autoplaySpeed: 10000,
        prevArrow: false,
        nextArrow: false,
    }
    const recentlyDescriptionsSliderConfig = {
        lazyLoad: 'ondemand',
        dots: false,
        infinite: true,
        speed: 1000,
        fade: true,
        asNavFor: '.slider-discover-recently',
        prevArrow: false,
        nextArrow: false,
}
    slider(events, '.slider-discover-alt', altSliderConfig, 'homeKv');
    slider(events, '.slider-discover', sliderConfig, 'homeKv');
    slider(events, '.slider-discover-recently', recentlySliderConfig, 'homeKv');
    slider(events, '.slider-discover-recently-descriptions', recentlyDescriptionsSliderConfig, 'homeKv');
    var indexToGet = $('.slider .slick-slide').index($('#center_on_me'));
    window.$(document).ready(function() {
        // $('.slider-discover-recently').on('beforeChange', function(event, slick, currentSlide, nextSlide){
        //     console.log(currentSlide, nextSlide === 2);

        //     if(nextSlide === 2){
        //         console.log('swiping')
        //         $('.slider-discover-recently').slick('goTo', '0')
        //     }
        //   });
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

    function isMobile(){
        return parseInt(window.innerWidth) <= 768
    }

    function getTabIndexBySlot(j){
        return Object.keys(tabs).filter((i)=>{return tabs[i].slot === parseInt(j)? true: false})[0];
    }

    function getActiveTabIndex(){
        return getTabIndexBySlot(1);
    }

    function swapActiveTab(newTab, oldTab){
        let swapOutDest = tabs[newTab].slot;
        tabs[oldTab].slot = swapOutDest;
        tabs[newTab].slot = 1
        return swapOutDest
    }

    function fadeOut(element){
        element.removeClass('flyout')
        element.removeClass('fadeIn')
        element.addClass('fadeOut')
    }

    function fadeIn(element){
        element.removeClass('fadeOut')
        element.addClass('fadeIn')     
    }

    $('.community-tabs').on("click", '.tab', (e)=>{
        const tab =  $(e.target).closest('.tab')
        $('.tab.is-active').removeClass('is-active')
        tab.addClass('is-active')
        $('.community-events > .event.is-active').removeClass('is-active')
        $('.community-events > .event[data-tab='+tab.attr('data-tab')+']').addClass('is-active')
    })

    // slider
  let settings_slider = {
    dots: false,
    arrows: false,
    slidesToShow: $('.community-tabs').children().length - 1,
    initialSlide: $('.community-tabs').children().map((idx)=>{if($(this).hasClass('is-active')){return idx}})[0]
    // more settings
  }
  //$('.community-tabs').slick()
  slick_on_mobile( $('.community-tabs'), settings_slider);

// slick on mobile
  function slick_on_mobile(slider, settings){
    $(window).on('load resize', function() {
      if ($(window).width() > 767) {
        if (slider.hasClass('slick-initialized')) {
          slider.slick('unslick');
        }
        return
      }
      if (!slider.hasClass('slick-initialized')) {
        return slider.slick(settings);
      }
    });
  };


    tabTriggerBtns.forEach(function(tabTriggerBtn, index) {
        tabTriggerBtn.addEventListener('click', function() {
            const slot1 = $(SLOTS.desktop[1])
            const slot2 = $(SLOTS.desktop[2])
            const slot3 = $(SLOTS.desktop[3])
            const slot1_mobile = $(SLOTS.mobile[1])
            const slot2_mobile = $(SLOTS.mobile[2])
            const slot3_mobile = $(SLOTS.mobile[3])
           
            const floating_content_text = $('#floating__content__text')
            const floating_content_text_mobile = $('#floating__content__text__mobile')
            const floating_content_tab = $("#floating__content__tab")
            const floating_content_tab_mobile = $("#floating__content__tab_mobile")
            const floating_content_container = $("#floating__content")
            const floating_content_container_mobile = $("#floating__content_mobile")
            const floating_content_button = $("#slot_1_button")
            const floating_content_button_mobile = $("#slot_1_button_mobile")
            const floating_content = [floating_content_text, floating_content_button, floating_content_container, floating_content_tab, floating_content_text_mobile, floating_content_button_mobile, floating_content_container_mobile, floating_content_tab_mobile]
            const header = $('.recently__header')
            const oldActiveTabIndex = getActiveTabIndex()
            const newActiveTabIndex = getTabIndexBySlot(this.dataset.tabTrigger)
            const destination = swapActiveTab(newActiveTabIndex, oldActiveTabIndex)
            const timeScale = 1;
            if(!isMobile()){
                setTimeout(()=> {
                    fadeOut(slot2_mobile)
                    fadeOut(slot2)
                    fadeOut(header)
                }, 0*timeScale);
                setTimeout(()=> {
                    
                    fadeOut(slot1)
                    fadeOut(slot1_mobile)
                }, 150*timeScale);
                setTimeout(()=> {
                    fadeOut(slot3)
                    fadeOut(slot3_mobile)
                    floating_content.map((element)=>{
                        fadeOut(element)
                    })
                }, 250)*timeScale;
                setTimeout(()=> {
                    $(SLOTS.desktop[destination]).attr('src', tabs[getTabIndexBySlot(destination)].img.src)
                    $(SLOTS.mobile[destination]).attr('src', tabs[getTabIndexBySlot(destination)].img.src)
                    
                }, 950*timeScale);
                setTimeout(()=> {
                    slot1.children('img').attr('src', tabs[newActiveTabIndex].img.src)
                    slot1_mobile.children('img').attr('src', tabs[newActiveTabIndex].img.src)
                    floating_content_button.attr('href', tabs[newActiveTabIndex].link)
                    floating_content_button_mobile.attr('href', tabs[newActiveTabIndex].link)
                    
    
                    fadeIn(slot1)
                    fadeIn(slot1_mobile)
                    floating_content.map((element)=>{
                        fadeIn(element)
                    })
                    fadeIn(slot3)
                    fadeIn(slot3_mobile)
    
                    floating_content_text.html(tabs[newActiveTabIndex].content)
                    floating_content_text_mobile.html(tabs[newActiveTabIndex].content)             
                }, 1150*timeScale);
                setTimeout(()=> {
                    let elements = [slot2, slot2_mobile, header]
                    elements.map((e)=>{
                        fadeIn(e)
                    })
                }, 1130*timeScale);
            }
            
            
            // var currentTabData = document.querySelector('.tab-content[data-tab-content="' + activeTab + '"]');
            
            
            // document.querySelector('.tab-content[data-tab-content="' + oldActiveTab + '"]').classList.remove('is-active');

            // this.classList.add('is-active');

            // setTimeout(function() {
            //     var oldTab = document.querySelector('.tab-content.is-open').classList
            //     console.log(oldTab)
            //     oldTab.remove('is-open')
			// 	$(newImg).attr('src', oldImgSrc);
				
            //     currentTabData.classList.add('is-open');
            // }, 900);

            // $('.flyout').not('.floating__image').addClass('flyout__on')
            // $(".floating__image img").attr('src', newImgSrc);
            // $(".floating__image").removeClass('fadeIn');
            // setTimeout(function() {
            //     $('.flyout').removeClass('flyout__on')
            // }, 1000);

            // setTimeout(function() {
            //     $(".floating__image").addClass('fadeIn');
            //     $(".floating__image img").show();
            // }, 1600);
        });
        
    });




}