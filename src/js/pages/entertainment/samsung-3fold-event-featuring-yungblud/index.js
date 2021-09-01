import '../../../bootstrap.js'

import HOIShare from '../../../home-of-innovation/hoiShare';

import ThreeFoldEventPopup from './threeFoldEventPopup';


import Scroll from './scrollTo';


class Samsung3Fold {
	constructor() {

		HOIShare()
		 
		//this.parallax()

	}
	

	/*goToSection(section, anim) {
		gsap.to(window, {
			scrollTo: {y: section, autoKill: false},
			duration: 1
		});

		if(anim) {
			anim.restart();
		}
	}


	parallax() {

		let $this = this;

		document.addEventListener('DOMContentLoaded', () => {
		
			document.querySelectorAll(".slide").forEach(section => {
				ScrollTrigger.create({
					trigger: section,
					onEnter: () => $this.goToSection(section),
				});

				ScrollTrigger.create({
					trigger: section,
					start: "bottom bottom",
					onEnterBack: () => $this.goToSection(section),
				});
			});

		});
*/





		/*const parallax = document.getElementById("parallax");

		window.addEventListener('scroll', function() {

			let offset =window.pageYOffset;
			parallax.style.backgroundPositionY = offset*0.7+"px";

			console.log(offset);
			console.log(offset*0.7+"px");

		})*/

		/*window.addEventListener("scroll", function(event) {

			var topDistance = this.pageYOffset;
			var layers = document.querySelectorAll("[data-type='parallax']");

			for (var i = 0; i < layers.length; i++) {

				var layer = layers[i];
				var depth = layer.getAttribute("data-depth");
				var translate3d = 'translate3d(0, ' + -(topDistance * depth) + 'px, 0)';
				layer.style['-webkit-transform'] = translate3d;
				layer.style['-moz-transform'] = translate3d;
				layer.style['-ms-transform'] = translate3d;	
				layer.style['-o-transform'] = translate3d;
				layer.style.transform = translate3d;

			}
		});*/

		//console.log(com.greensock.plugins.ScrollToPlugin.version);

		/*document.addEventListener('DOMContentLoaded', () => {

			let controller = new ScrollMagic.Controller();

			let timeline = new TimelineMax();
			timeline
			.to('#topKVVideo', 6, {
				y: -700
			}, '-=6')
			.to('#middleSection', 6, {
				y:-300
			}, '-=6')
			.to('#bottomBanner', 6, {
				y:-100
			}, '-=6')

			let scene = new ScrollMagic.Scene({
				triggerElement: 'section',
				duration: '200%',
				triggerHook: 0
			})
			.setTween(timeline)
			.setPin('section')
			.addTo(controller);

		})


	}*/
}


new Samsung3Fold()
