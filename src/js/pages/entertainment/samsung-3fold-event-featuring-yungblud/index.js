import '../../../bootstrap.js'

import HOIShare from '../../../home-of-innovation/hoiShare';

import ThreeFoldEventPopup from './threeFoldEventPopup';

//import Scroll from './scroll';


class Samsung3Fold {
	constructor() {

		HOIShare()
		 
		this.parallax()

	}

	parallax() {

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


	}
}


new Samsung3Fold()
