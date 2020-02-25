<?php

error_reporting(-1);

function isSebnServer() {
	$host = $_SERVER['HTTP_HOST'];
	if (strpos($host, 'sebn') !== false || strpos($host, 'samsung-kx.com') !== false) {
		return true;
	}
	else {
		return false;
	}
}

function isSebnLIVEServer() {
	$host = $_SERVER['HTTP_HOST'];
	// return $host == 'kx-content-sharing-server.samsung.com';
	return $host == 'sebnapi.nl' || $host == 'samsung-kx.com' || $host == 'www.samsung-kx.com';
}

// aws details ...
$_REGION = 'eu-west-2';
$_AWS_ACCESS_KEY_ID = 'AKIAJKZN5DXUYODHENKA';
$_AWS_SECRET_ACCESS_KEY = '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';
$_BUCKET = 'kxuploads';
if (!isSebnLIVEServer()) {
	// if NOT the live server ...
	// $_BUCKET = 'kxuploads-test';
}
$_FOLDER = 'sot/'; // include trailing slash
$_FILENAME_STAGING = 'results-new.json';
$_FILENAME = 'results.json';

?>