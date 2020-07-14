
export default function dataPicker(  ) {

  // due to jquery conflicts and differences between staging and aem environments
  // the jquery ui library for the datepicker function is loaded here
  // and attached to whatever jquery $ version is in the global scope

  var s = document.createElement('script')
  s.setAttribute('type', 'text/javascript')
  s.onload = () => {
    createPickers()
  }
  s.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js')
  document.getElementsByTagName("head")[0].appendChild(s)

}

function createPickers() {

	var dateFormat = "mm/dd/yy";

	var from = $( "#from" )
	.datepicker({
		dayNamesMin: [ "S", "M", "T", "W", "T", "F", "S" ],
		defaultDate: "+1w",
		changeMonth: false,
		duration: "slow",
		numberOfMonths: 1,
		altFormat: "dd-mm-yy",
		dateFormat: "dd/mm/yy",
		  beforeShowDay: function(date) {
			var d = date.getTime();
			if (to.datepicker("getDate") && d == to.datepicker("getDate").getTime()) {
				return [true, 'ui-to', ''];
			  }
			if (from.datepicker("getDate") && to.datepicker("getDate") && d < to.datepicker("getDate").getTime() && d > from.datepicker("getDate").getTime()) {
			  return [true, 'highlight-stay', ''];
			} else {
			  return [true, ''];
			}
		  },
		  onSelect: function(selectedDate) {
			var selectedDate = from.datepicker("getDate");
			if (selectedDate != null) {
			  to.datepicker('option', 'minDate', selectedDate).datepicker('refresh');
			}
		  }
	}),
	to = $( "#to" ).datepicker({
		dayNamesMin: [ "S", "M", "T", "W", "T", "F", "S" ],
		defaultDate: "+1w",
		changeMonth: false,
		duration: "fast",
		numberOfMonths: 1,
		altFormat: "dd-mm-yy",
		dateFormat: "dd/mm/yy",
		beforeShow: function(input, inst) {
			$("#ui-datepicker-div td").off();

			$(document).on("mouseenter", "#ui-datepicker-div td", function(e) {

			  $(this).parent().addClass("finalRow");
			  $(".finalRow").parents('.ui-datepicker-group-last').parent().find('.ui-datepicker-group-first').find('tr').last().addClass("finalRowRangeOtherTable");
			  $(".finalRowRangeOtherTable").find("td:not(.ui-datepicker-unselectable)").addClass("highlight");
			  $(".finalRowRangeOtherTable").prevAll().find("td:not(.ui-datepicker-unselectable)").addClass("highlight");

			  $(".finalRow").prevAll().find("td:not(.ui-datepicker-unselectable)").addClass("highlight");
			  $(this).prevAll("td:not(.ui-datepicker-unselectable)").addClass("highlight");
			});

			$(document).on("mouseleave", "#ui-datepicker-div td", function(e) {

				$(this).parent().removeClass("finalRow");
				$("#ui-datepicker-div td").removeClass("highlight");

				$(".finalRowRange").removeClass("finalRowRange").find('.highlight').removeClass("highlight");
				$(".finalRowRangeOtherTable").removeClass("finalRowRangeOtherTable").find('.highlight').removeClass("highlight");

			});
		},
		beforeShowDay: function(date) {
		  var d = date.getTime();
		  if (from.datepicker("getDate") && d == from.datepicker("getDate").getTime()) {
			return [true, 'ui-to', ''];
		  }
		  if (from.datepicker("getDate") && to.datepicker("getDate") && d < to.datepicker("getDate").getTime() && d > from.datepicker("getDate").getTime()) {
			return [true, 'highlight-stay', ''];
		  } else {
			return [true, ''];
		  }
		},
		onSelect: function(selectedDate) {
			setTimeout(function () {
				from.datepicker('option', 'maxDate', $(this).datepicker('getDate'));
			}, 200);


		  $("#ui-datepicker-div td").off();

		$(document).on("mouseenter", "#ui-datepicker-div td", function(e) {

			  $(this).parent().addClass("finalRow");
			  $(".finalRow").parents('.ui-datepicker-group-last').parent().find('.ui-datepicker-group-first').find('tr').last().addClass("finalRowRangeOtherTable");
			  $(".finalRowRangeOtherTable").find("td:not(.ui-datepicker-unselectable)").addClass("highlight");
			  $(".finalRowRangeOtherTable").prevAll().find("td:not(.ui-datepicker-unselectable)").addClass("highlight");

			  $(".finalRow").prevAll().find("td:not(.ui-datepicker-unselectable)").addClass("highlight");
			  $(this).prevAll("td:not(.ui-datepicker-unselectable)").addClass("highlight");
			});

			$("#ui-datepicker-div td").on("mouseleave", function() {

				$(this).parent().removeClass("finalRow");
				$("#ui-datepicker-div td").removeClass("highlight");

				$(".finalRowRange").removeClass("finalRowRange").find('.highlight').removeClass("highlight");
				$(".finalRowRangeOtherTable").removeClass("finalRowRangeOtherTable").find('.highlight').removeClass("highlight");

			});

	  }

	})


	function getDate( element ) {
		var date;
		try {
			date = $.datepicker.parseDate( dateFormat, element.value );
		} catch( error ) {
			date = null;
		}

		return date;
	}





}
