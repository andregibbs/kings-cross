import handleTemplate from "./handleTemplate";
import instagram from "./instagram";
import upcomingEvents from "./upcomingEvents";
import getUrlVars from "./getUrlVars";
import createDropDown from "./createDropDown";
import doLogFunction from '../dev/doLog';
var doLog = doLogFunction();

export default function places() {

   let placeId = 'ChIJWxPGhs8bdkgRzKDWW8BKbSk';
   let requiredData = 'opening_hours';
   let apiKey = 'AIzaSyBu9auy0x9Og1YGPl__MkoxswdFd6vxB7M';
   let sebnPlacesApiurl =  'https://sebnapi.nl/uk/kings-cross-google-apis/places-api/?placeId='+placeId+'&fields='+requiredData+'&apiKey='+apiKey;


  //https://sebnapi.nl/uk/kings-cross-google-apis/places-api/?placeId=ChIJWxPGhs8bdkgRzKDWW8BKbSk&fields=opening_hours&apiKey=AIzaSyBu9auy0x9Og1YGPl__MkoxswdFd6vxB7M
	
  $.get(sebnPlacesApiurl).success(function (data) { 
      
      let openingTimeHtml = '<h4 class="fz18">Opening Hours:</h4>';
      
      if( data.data.status ==  "OK" ) {
      	
        let storeOpeningTimes = data.data.result.opening_hours.weekday_text;

      	$.each(storeOpeningTimes, function(index, storeOpeningTime) {

          let spaceless = storeOpeningTime.replace(/\s/g, '').replace('AM', 'am').replace('PM', 'pm').replace('-', ' - ')     
          let altered = spaceless.replace(/:00/g, "").split('–').join(' – ').replace(':', ': ');
          console.log('naooo')
      		openingTimeHtml += ' <p><span class="fz18 bold">'+altered.substr(0, altered.indexOf(':'))+': </span><span class="fz18">'+altered.split(': ').pop()+'</span></p>';
      	});

      	$('.findkx__openings').html(openingTimeHtml);
      	
      }

  });
}
