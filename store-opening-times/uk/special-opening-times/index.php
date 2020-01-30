<?php
	require_once('validate-login.php');
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Special store opening times </title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto|Varela+Round|Open+Sans">
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<link rel="stylesheet" type="text/css" href="css/sot.css">
<script type="text/javascript" src='js/sot.js'></script>

</head>
	<body>
	    <div class="container fadeInDown">
	        <div class="table-wrapper">
	        	<div class="logout-btn">
                    <a href="logout.php">
                    	<button type="button" id="logout" class="btn btn-primary">Logout</button>
                	</a>
                </div>
	            <div class="table-title">
	                <div class="row">
	                    <div class="col-sm-8"><h2>Special Store opening times</h2></div>
	                    <div class="col-sm-4">
	                        <button type="button" class="btn btn-info add-new"><i class="fa fa-plus"></i> Add New</button>
	                    </div>
	                </div>
	            </div>
	            <table class="table table-bordered">
	                <thead>
	                    <tr>
	                        <th>Store opening times</th>
	                        <th>Actions</th>
	                    </tr>
	                </thead>
	                <tbody>
	                	<?php
	           
	                				require_once('get.php');

								    if ( count($json) > 0 ) {

										foreach ( $json as $value ) {
						?>				
										<tr>
					                        <td class="store-opening-time"><?php echo $value ?></td>
					                        <td>
												<a class="add" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>
					                            <a class="edit" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>
					                            <a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>
					                        </td>
					                    </tr>
						<?php		
										}
									} else {
						?>				

										<tr class="no-data">
									   		<td colspan="2">No data available</td>
									   	</tr>

						<?php			}

								
						?>
									

						
	                </tbody>
	            </table>
	            <div class="table-footer">
	            	<div class="row">
	                    <div class="col-sm-6">
	            			<button type="submit" class="btn btn-info publish-qa">Publish to QA</button>
	            		</div>
	            		<div class="col-sm-6">
	            			<button type="submit" class="btn btn-info publish-live">Publish to Live</button>
	            		</div>
	            	</div>
	            	<div class="row">
	                    <div class="col-sm-12">
	            			<br />
	            			<div class="alert alert-success qa" role="alert">
							  	Store opening time Successfully published on staging
							</div>
							<div class="alert alert-danger qa" role="alert">
							  	There is some issues publishing Store opening time on staging. <br />
							  	Please try again later.
							</div>
							<div class="alert alert-success live" role="alert">
							  	Store opening time Successfully published on live
							</div>
							<div class="alert alert-danger live" role="alert">
							  	There is some issues publishing Store opening time on staging. <br />
							  	Please try again later.
							</div>
	            		</div>
	            	</div>
	            </div>
	        </div>
	    </div>     
	</body>
</html>