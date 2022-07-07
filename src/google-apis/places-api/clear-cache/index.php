<?php
	
	$message = "Apcu Cache key 'store_opening_times' not exist";

	if( apcu_exists('store_opening_times') ) {
		
		apcu_delete('store_opening_times');
		$message = "Apcu Cache key 'store_opening_times' Cleared Successfully";

	} 
	
?>
<!DOCTYPE html>
<html>
<head>
	<title>Store opening time Clear cache</title>
</head>
<body>
	<h3 style="text-align: center; padding: 40px;"><?php echo $message; ?></h3>
</body>
</html>