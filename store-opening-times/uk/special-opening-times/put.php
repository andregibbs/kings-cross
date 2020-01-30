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

// save the actual file ...
$result = $s3->putObject([
	'Bucket' => $_BUCKET,
	'Key'    => $_FOLDER.$fileName,
	'Body'   => json_encode($json),
	'ContentType' => 'application/json'		
]);

echo json_encode($result->get('@metadata'));

?>