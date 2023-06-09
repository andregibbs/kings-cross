import doLogFunction from '../dev/doLog';
var doLog = doLogFunction();

export default function createDropDown( select ) {
// Iterate over each select element
$j(select).each(function () {

    // Cache the number of options
    var $this = $j(this),
        numberOfOptions = $j(this).children('option').length;

    // Hides the select element
    $this.addClass('s-hidden');

    // Wrap the select element in a div
    $this.wrap('<div class="select"></div>');

    // Insert a styled div to sit over the top of the hidden select element
    $this.after('<div class="styledSelect"></div>');

    // Cache the styled div
    var $styledSelect = $this.next('div.styledSelect');

    // Show the first select option in the styled div


    // Insert an unordered list after the styled div and also cache the list
    var $list = $j('<ul />', {
        'class': 'options'
    }).insertAfter($styledSelect);

    // Insert a list item into the unordered list for each select option
    for (var i = 0; i < numberOfOptions; i++) {
        $j('<li />', {
            text: $this.children('option').eq(i).text(),
            rel: $this.children('option').eq(i).val()
        }).appendTo($list);
    }

    // Cache the list items
    var $listItems = $list.children('li');

       $styledSelect.text($this.children('option').eq(0).text());
    $styledSelect.attr("rel", $listItems.eq(0).attr("rel"));

    // Show the unordered list when the styled div is clicked (also hides it if the div is clicked again)
    $styledSelect.click(function (e) {
        e.stopPropagation();
        if($styledSelect.hasClass("active")){
            $styledSelect.removeClass('active');
            $list.hide();
        }
        else{
            doLog("XXXXX");
            $j('div.styledSelect.active').each(function () {
                $j(this).removeClass('active').next('ul.options').hide();
            });
            $j(this).toggleClass('active').next('ul.options').toggle();
        }
    });

    // Hides the unordered list when a list item is clicked and updates the styled div to show the selected list item
    // Updates the select element to have the value of the equivalent option
    $listItems.click(function (e) {
        e.stopPropagation();
        $styledSelect.text($j(this).text()).removeClass('active');
        $styledSelect.attr("rel", $j(this).attr("rel"));
        $this.val($j(this).attr('rel'));
        $list.hide();
        /* alert($this.val()); Uncomment this for demonstration! */
    });

    // Hides the unordered list when clicking outside of it
    $j(document).click(function () {
        $styledSelect.removeClass('active');
        $list.hide();
    });

});

}
