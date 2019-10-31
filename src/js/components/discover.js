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
    1: '#slot_1',
    2: '#slot_2',
    3: '#slot_3'
}
const tabs = {
    1: {
        "img" : {
            "src" : "https://images.samsung.com/is/image/samsung/p5/uk/explore/kings-cross/recently1.png?$ORIGIN_PNG$",
            "alt" : ""
        }, 
        "content" : 
            `<p>Samsung KX Presents: Thread Talks with Caitlin Moran</p>
            <p>To kick off the first in the series of Thread Talks, host and comedian Alex Zane was joined by acclaimed author Caitlin Moran as they celebrated the world of Twitter threads, spats and conversations.</p>
            <p>The 90-minute event featured an intimate live performance from Caitlin as she reflected on one of her most popular Twitter threads - a look at the downsides of being a man – followed by a Q&A with the audience and Alex Zane which highlighted some of her greatest, weirdest and funniest moments on the platform.</p>
            <p>Thread Talks is a series of six intimate and exclusive ‘in conversation’ events featuring some of the biggest names in the world of journalism, sport, culture and comedy. The acts will perform at the venue’s Centre Stage in front the world’s first vertical 10metre-wide curved Samsung screen.</p>
            <p>Each free event is being hosted in association with Twitter UK and on each night guests will hear from the company’s Director of Planning, David Wilding.</p>
            <button>Learn More</button>`,
        "slot": 1
    },
    2: {
        "img" : {
            "src" : "https://images.samsung.com/is/image/samsung/p5/uk/explore/kings-cross/recently2.png?$ORIGIN_PNG$",
            "alt" : ""
        }, 
        "content" : 
            `<p>Co–Lab 3: How to monetise your side hustle</p>
            <p>Mercedes Benson is a creative polymath, from becoming an enterprise founder to a social influencer, she is a true all-rounder. In her talk she shared her knowledge and insight on how to turn your passion into a business discussing her own experience by making money from her creativity.</p>
            <p>Joined by a role model of hers, Toni Tone (@t0nit0ne), the duo showcased how best to begin your side hustle. Toni is an online talk show host and social content creator, best known for her social commentary on Twitter as well as her online writing.</p>															
            <button>Learn More</button>`,
        "slot": 2
    },
    3: {
        "img" : {
            "src" : "https://images.samsung.com/is/image/samsung/p5/uk/explore/kings-cross/recently3.png?$ORIGIN_PNG$",
            "alt" : ""
        }, 
        "content" : 
            `<p>Real parents of Kings Cross</p>
            <p>For our very first Co–Lab event, we paired together two juxtaposing influencers and challenged them to make a positive impact on the local community.</p>
            <p>Straight-talking ‘Mother of All List’s’ Clemmie Telford was paired with photographer Matt Cuzen who is known for his fantasy-style photography.</p>
            <p>Their Co–Lab explored the stories of King’s Cross parents and their connection to the local area through a powerful photo series with a surreal twist. Many of the parents who featured in the photo series attended the talk and spoke about their experience with meeting up with two absolute strangers for this project!</p>
            <p>The photo series can be viewed at #SamsungKX for a limited time.</p>
            <button>Learn More
            </button>`,
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

    function getTabIndexBySlot(j){
        return Object.keys(tabs).filter((i)=>{return tabs[i].slot === parseInt(j)? true: false})[0];
    }

    function getActiveTabIndex(){
        return getTabIndexBySlot(1);
    }

    function swapActiveTab(newTab, oldTab){
        // if(tabs[oldTab].slot === 1){
            let swapOutDest = tabs[newTab].slot;
            console.log('oldtab ', oldTab, 'newTab ', newTab, 'swap out destination slot: ', swapOutDest);
            console.log(tabs[oldTab], tabs[newTab])
            tabs[oldTab].slot = swapOutDest;
            tabs[newTab].slot = 1
            return swapOutDest
        // }
        
    }


    tabTriggerBtns.forEach(function(tabTriggerBtn, index) {
        tabTriggerBtn.addEventListener('click', function() {
            let oldActiveTabIndex = getActiveTabIndex()
            console.log('oldActiveTabIndex: ', oldActiveTabIndex)
            console.log('trigger: ', this.dataset.tabTrigger)
            let newActiveTabIndex = getTabIndexBySlot(this.dataset.tabTrigger)
            console.log('newActiveTabIndex: ', newActiveTabIndex)
            
            let destination = swapActiveTab(newActiveTabIndex, oldActiveTabIndex)

            console.log(tabs)
            $('#floating__content').html(tabs[newActiveTabIndex].content)
            $('#slot_1').attr('src', tabs[newActiveTabIndex].img.src)
            $(SLOTS[destination]).attr('src', tabs[getTabIndexBySlot(destination)].img.src)
            Object.keys(tabs).map((key)=>{console.log('index: ', key, 'slot: ', tabs[key].slot)})
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