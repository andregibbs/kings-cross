/* Components */
import FetchData from './components/fetchData'
// import Nav from './components/nav'
// import Cookie from './components/cookie-popup'

$( document ).ready( function() {
	//
	// Your generic code
	//
    // xxx.init();
	// xxx.init();

	FetchData.init()

	switch ( window.location.pathname ) {
		case '/':
            // Home.init();
            break;

		case "/about/":
            // Your init here
            break;

		case "/work/":
            // Work.init();
			break;

        case "/legal/":
            // Legal.init();
            break;
		default: {
			// article
			// if( window.location.pathname.indexOf("/blog/") > -1 ) {
			// 	Blog.init();
			// }
		}
	}

})
