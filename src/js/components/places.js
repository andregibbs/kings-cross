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
   let specialOpeningTimesUrl = 'https://kxuploads.s3.eu-west-2.amazonaws.com/sot/results.json';

   if (location.host != "www.samsung.com") {
      specialOpeningTimesUrl = 'https://kxuploads.s3.eu-west-2.amazonaws.com/sot/results-new.json';
   }

  //https://sebnapi.nl/uk/kings-cross-google-apis/places-api/?placeId=ChIJWxPGhs8bdkgRzKDWW8BKbSk&fields=opening_hours&apiKey=AIzaSyBu9auy0x9Og1YGPl__MkoxswdFd6vxB7M

  



  let storeOpeningTimesHtml = "";
  
  $.get(sebnPlacesApiurl).success(function (data) { 
      
      let openingTimeHtml = '<h4 class="fz16">Opening Hours:</h4>';
      
      if( data.data.status ==  "OK" ) {
        
        let storeOpeningTimes = data.data.result.opening_hours.weekday_text;

        $.each(storeOpeningTimes, function(index, storeOpeningTime) {
          console.log(storeOpeningTime)
          let spaceless = storeOpeningTime.replace(/\s/g, '').replace('AM', 'am').replace('PM', 'pm').replace('-', ' - ').replace('day', '').replace('tur', 't').replace('nes', '')     
          let altered = spaceless.replace(/:00/g, "").split('–').join(' – ').replace(':', ': ');
          console.log('naooo0000000ooooooo')
          openingTimeHtml += ' <p><span class="fz16 bold">'+altered.substr(0, altered.indexOf(':'))+': </span><span class="fz16">'+altered.split(': ').pop()+'</span></p>';
        });

        storeOpeningTimesHtml +=openingTimeHtml;

      }

  }).done(function() {
        
        $.getJSON( specialOpeningTimesUrl, function( data ) {

            let specialOpeningTimeHtml = '';
            console.log(data);
            $.each(data, function(index, specialOpeningTime) {

                specialOpeningTimeHtml += '<p><span class="fz16 bold">'+specialOpeningTime+'</span></p>';

            });

            storeOpeningTimesHtml +=  "<br>" + specialOpeningTimeHtml;

        }).always(function() {

          $('.findkx__openings').html(storeOpeningTimesHtml);

        });
  });



}
