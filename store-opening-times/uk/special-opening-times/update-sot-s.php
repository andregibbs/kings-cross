<?php
	// add data
	include_once('validate-login.php');
	require_once 'config.php';

	$json = isset($_POST['sots']) ? $_POST['sots'] : [] ;

	$fileName = $_FILENAME_STAGING;
	require_once 'put.php';

	exit;   	