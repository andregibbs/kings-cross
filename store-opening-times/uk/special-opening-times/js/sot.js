$(document).ready(function(){
	$('[data-toggle="tooltip"]').tooltip();
	var actions = '<a class="add" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>';
		actions += '<a class="edit" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>';
		actions += '<a class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>';
	// Append table with add row form on add new button click
    $(".add-new").click(function(){
		$(this).attr("disabled", "disabled");
		$('tr.no-data').hide();
		var index = $("table tbody tr:last-child").index();
        var row = '<tr>' +
            '<td class="store-opening-time"><input type="text" class="form-control" name="store-opening-time" id="store-opening-time"></td>' +
			'<td>' + actions + '</td>' +
        '</tr>';
    	$("table").append(row);		
		$("table tbody tr").eq(index + 1).find(".add, .edit").toggle();
        $('[data-toggle="tooltip"]').tooltip();
    });
	// Add row on add button click
	$(document).on("click", ".add", function(){
		var empty = false;
		var input = $(this).parents("tr").find('input[type="text"]');
        input.each(function(){
			if(!$(this).val()){
				$(this).addClass("error");
				empty = true;
			} else{
                $(this).removeClass("error");
            }
		});
		$(this).parents("tr").find(".error").first().focus();
		if(!empty){
			input.each(function(){
				$(this).parent("td").html($(this).val());
			});			
			$(this).parents("tr").find(".add, .edit").toggle();
			$(".add-new").removeAttr("disabled");
		}		
    });
	// Edit row on edit button click
	$(document).on("click", ".edit", function(){		
        $(this).parents("tr").find("td:not(:last-child)").each(function(){
			$(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
		});		
		$(this).parents("tr").find(".add, .edit").toggle();
		$(".add-new").attr("disabled", "disabled");
    });
	// Delete row on delete button click
	$(document).on("click", ".delete", function(){
        $(this).parents("tr").remove();
		$(".add-new").removeAttr("disabled");
    });

    /** Update new slots on staging **/
	$(document).on("click", ".publish-qa", function() {

		$('.table-footer .col-sm-12 .alert').hide();

		var sots =  new Array();;

		if ( $('.store-opening-time').length ) {
			$('.store-opening-time').each(function() {
				sots.push($(this).text());
			});
		}

		$.post( "update-sot-s.php", { 'sots[]': sots }).done(function( data ) {

		  	console.log(data);
		  	//alert(data);
		  	var data = $.parseJSON(data);
		  	if (typeof data =='object' && data.statusCode == 200) {
		  		console.log( data.message );
		  		$('.table-footer .col-sm-12 .alert-success.qa').show();
		  	} else {
		  		console.log( data.message );
		  		$('.table-footer .col-sm-12 .alert-danger.qa').show();
		  	}

		}, "json").fail(function() {

            // just in case posting your form failed
            $('.table-footer .col-sm-12 .alert-danger').show();
            console.log( "Posting failed." );

             
        });

        return false;

	});

	/** Update new slots on live **/
	$(document).on("click", ".publish-live", function() {

		$('.table-footer .col-sm-12 .alert').hide();

		$.post( "update-sot-l.php").done(function( data ) {

		  	console.log(data);
		  	//alert(data);
		  	var data = $.parseJSON(data);
		  	if (typeof data =='object' && data.statusCode == 200) {
		  		console.log( data.message );
		  		$('.table-footer .col-sm-12 .alert-success.live').show();
		  	} else {
		  		console.log( data.message );
		  		$('.table-footer .col-sm-12 .alert-danger.live').show();
		  	}

		}, "json").fail(function() {

            // just in case posting your form failed
            $('.table-footer .col-sm-12 .alert-danger').show();
            console.log( "Posting failed." );

             
        });

	});

});