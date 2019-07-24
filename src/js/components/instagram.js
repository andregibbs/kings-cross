export default function instagram( htag ) {

	const data = {
		base_url: 'https://api.instagram.com/v1/',
		client_id : '318415d8f95e4064b7bd7d9ec4d41f0b',
		access_token: 'access_token=5877715366.1677ed0.9afa1db322c94026a5a5969d80fe0c07',
		public_content: '?code=a0830478eb4c4fda8d64e74f29b549fa',
		user_owner: 'cheil_uk',
		user_owner_id: '5877715366',
		html_container: '#instagram',
		placeholderSrc: '/assets/images/careers/instagram-vid-holder.jpg'
	}

	function init(){
		recent();
	}

	function recent() {
		// https://api.instagram.com/v1/users/self/media/recent/?access_token=5877715366.b061f7f.d5a1b1e128064edd8411a6d0723ebfc7
		// http://instagram.pixelunion.net/#access_token=5877715366.1677ed0.9afa1db322c94026a5a5969d80fe0c07
		const endpoint = data.base_url + 'users/self/media/recent/?' + data.access_token + '&count=20'

		getJson( endpoint )
	}

	function getJson( url ) {
		$.ajax({
		type: 'get',
		url: url,
		async: true,
		dataType: 'jsonp',
		success: function ( response ) {

			//console.log( response );

			response.data.forEach(element => {
				var date = new Date(parseInt(element.created_time) * 1000);
				var locale = "en-GB"

				//console.log( 'instagram element ', element );

			});

		},
		complete: function () {
			doWhatYouWnat()
		}
		})
	}

	function doWhatYouWnat() {
		// do what you want!!!!
	}

	init()

}
