<?php

require_once 'config.php';

require_once 'vendor/autoload.php';


$s3 = new Aws\S3\S3Client([
	'region'  => $_REGION,
	'version' => 'latest',
	'credentials' => [
	    'key'    => $_AWS_ACCESS_KEY_ID,
	    'secret' => $_AWS_SECRET_ACCESS_KEY,
	]
]);

$filesFileExists = $s3->doesObjectExist($_BUCKET, $_FOLDER.$_FILENAME_STAGING);


if ($filesFileExists) {

	try {
	    $result = $s3->getObject(array(
	        'Bucket' => $_BUCKET,
	        'Key'    => $_FOLDER.$_FILENAME_STAGING
	    ));
	    $body = $result['Body'];


	    $bodyAsString = (string) $result['Body'];
	    // echo $body;
	    // echo $bodyAsString;
	    $json = json_decode($bodyAsString, true);
	}
	catch (Exception $e) {
	    //echo 'Oops, something went wrong';  
	    $json = [];
	}
}
else {
	//echo 'file does not exists';
	$json = [];
}