<?php

/***********************************************
Using this Api call we will get Store opening times from google maps api

It get the Store opeinging times from google Api and Cached it for an hour using apcu Cache with the key 'store_opening_times'

Request the following url to clear the cache 

https://sebnapi.nl/uk/kings-cross-google-apis/places-api/clear-cache/


***********************************************/

header('Content-type: text/json');
header('Content-type: application/json');

$data = $_GET;
//$data = json_decode($data['data'], true);

//var_dump($data);
$query['place_id'] = isset($data['placeId']) ? $data['placeId'] : null;
$query['fields'] = isset($data['fields']) ? $data['fields'] : null;
$query['key'] = isset($data['apiKey']) ? $data['apiKey'] : null;
/* */
if ( isset($query['place_id']) && isset($query['key'] ) ) {

  /** remove empty value array elements **/
  $query = array_filter($query);
  $queryString = http_build_query($query);


  //$url ="https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJWxPGhs8bdkgRzKDWW8BKbSk&fields=opening_hours&key=AIzaSyBu9auy0x9Og1YGPl__MkoxswdFd6vxB7M";

  $url = 'https://maps.googleapis.com/maps/api/place/details/json?'.$queryString;


 // $file = dirname(__FILE__).'/data/store-opening-times.txt';



  $placesData = get_places_data($url);



  $data = json_decode($placesData, TRUE);

  $responseArray = array(
    'status' => 'success',
    'data' => $data,
  );
} else {
  $responseArray = array(
    'status' => 'error',
    'message' => 'Missing Place Id or Api Key.',
    'data' => array(),
  );
}


function get_places_data($url,$hours = 1) {

  $timeToLive = $hours * 60 * 60; 
  
  if( apcu_exists('store_opening_times') ) {
  
    return apcu_fetch('store_opening_times');

  } else {

    $content = file_get_contents($url);
    apcu_store('store_opening_times', $content, $timeToLive);
    return $content;

  }

}

echo json_encode($responseArray);


/* gets the contents of a file if it exists, otherwise grabs and caches */




/*function get_places_data($file,$url,$hours = 1) {
  //vars
  $current_time = time(); 

  $expire_time = $hours * 60 * 60; 


  //decisions, decisions
  if(file_exists($file) && ($current_time - $expire_time < filemtime($file))) {
    echo 'Data retrived from cached file';
    exit;

    return file_get_contents($file);
  }
  else {

    $content = file_get_contents($url);
    file_put_contents($file,$content);
    //echo 'retrieved fresh from '.$url.':: '.$content;
    return $content;
  }
}*/



?>
