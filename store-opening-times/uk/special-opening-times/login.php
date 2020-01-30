<?php session_start(); /* Starts the session */
	
	/* Check Login form submitted */	
	if(isset($_POST['Submit'])){
		/* Define username and associated password array */
		$logins = array('Mohan' => 'momo', 'Kevin' => 'helmet','Sabrina' => 'sabsab');
		
		/* Check and assign submitted Username and Password to new variable */
		$Username = isset($_POST['username']) ? $_POST['username'] : '';
		$Password = isset($_POST['password']) ? $_POST['password'] : '';
		
		/* Check Username and Password existence in defined array */		
		if (isset($logins[$Username]) && $logins[$Username] == $Password){
			/* Success: Set session variables and redirect to Protected page  */
			$_SESSION['UserData']['Username']=$logins[$Username];
			header("location:index.php");
			exit;
		} else {
			/*Unsuccessful attempt: Set error message */
			$msg="<span style='color:red'>Invalid Login Details</span>";
		}
	}
?>

<!DOCTYPE html>
<html>
<head>
	<title>Login page</title>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">

	<link href="css/login.css" rel="stylesheet">
</head>
<body>
	<div class="wrapper fadeInDown">
		<div id="formContent">
		<!-- Tabs Titles -->
			<h3>Login</h3>
			<!-- Login Form -->
			<form action="login.php" method="post" name="Login_Form">
			  <input type="text" id="login" class="fadeIn first" name="username" placeholder="Username">
			  <input type="password" id="password" class="fadeIn second" name="password" placeholder="Password">
			  <input type="submit" name="Submit" class="fadeIn third" value="Login">
			</form>

			<!-- Remind Passowrd -->
		    <div id="formFooter" class="fadeIn fourth">
		      	<?php if(isset($msg)) { ?>
				
					<p class="alert alert-warning"><?php echo $msg;?></p>
				
				<?php } ?>
		    </div>


		</div>
	</div>

</body>
</html>