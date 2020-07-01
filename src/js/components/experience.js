
import getUrlVars from './getUrlVars';
import slider from './slider';
import handleTemplate from "./handleTemplate";
import doLogFunction from '../dev/doLog';
var doLog = doLogFunction();

export default function experience(  ) {

    const id = getUrlVars()["id"];
    var options = {
        djgalaxy: [],
        galaxygraffiti: [],
        collageme: [],
        messagetree: [],
        threeDme: [],
        yourselfieyourartwork: []
    }

    // LOCAL
    // var server = 'https://kx-content-sharing-server.samsung.com/';
    // ONLINE
    // var server = 'https://kxuploads-test.herokuapp.com/';
    // SEBN staging
    // var server = 'https://sebnapi.sebnstaging.nl/uk/kx/';
    // var server = 'https://stg.samsung-kx.com/uk/kx/';
    // SEBN live
    // var server = 'https://sebnapi.nl/uk/kx/';
    var server = 'https://samsung-kx.com/uk/kx/';

	// needs to be https ...
	var s3domain = 'https://kxuploads.s3.eu-west-2.amazonaws.com/';
	// live
	// var s3domain = 'https://kxuploads-live.s3.eu-west-2.amazonaws.com/uploads/';



	if (id) {
        doLog('id in url - ' + id);

        $('form#dataid [name=id]').val(id)

        $('#files').html('');
        $.ajax({
            url: server + 'get.php',
            type: 'POST',

            // Form data
            data: new FormData($('form#dataid')[0]),

            // Tell jQuery not to process data or worry about content-type
            // You *must* include these options!
            cache: false,
            contentType: false,
            processData: false,

            success: function (data) {
                console.log(id, data)
                processFiles(data);
            },
            error: function () {
                alert("error");
            }
        });
	}






function getFile(file) {
    doLog(file);
    var filename = file.name;
    var fileexperience = file.experience;
    var thumb = filename;
    if (file.thumb) {
        thumb = file.thumb;
    }

    var ext = filename.substr(filename.lastIndexOf('.') + 1);

    doLog(fileexperience);
    var html = '';
    switch(ext.toLowerCase()) {
        case 'jpg':
        case 'png':
        case 'gif':
        case 'svg':
            // image - jpg, png, gif
            html += '<div class="image">' +
                '<img src="' + s3domain + 'uploads/' + thumb + '"/>' +
                '</div>';
            break;
        case 'mp4':
        case 'ogv':
        case 'webm':
            // video - mp4, ogv, webm
            html += '<div class="experience__video">' +
                '<video controls poster="'+s3domain+'uploads/'+thumb+'">' +
                '<source src="' + s3domain + 'uploads/' + filename + '" type="video/' + (ext == 'ogv' ? 'ogg' : ext) + '">' +
                'Your browser does not support the video tag.' +
                '</video>' +
                '</div>';
            break;
        case 'mp3':
            // sound = mp3
            html += '<div class="audio">' +
                '<audio controls>' +
                '<source src="' + s3domain + 'uploads/' + filename + '" type="audio/' + (ext == 'mp3' ? 'mpeg' : ext) + '">' +
                'Your browser does not support the audio element.' +
                '</audio>' +
                '</div>';
            break;
        default:
            // anything else - link
            html += '<div class="link">' +
                '<a href="' + s3domain + 'uploads/' + filename + '" target="_blank">' + filename + '</a>' +
                '</div>';
            break;
    }
   // html += '</div>';

   // html += '<div class="download">';
    //html += '<iframe src="' + s3domain + 'download/button.html?id=' + filename + '" scrolling="no" frameborder="0"></iframe>';
   // html += '</div>';

    var fileConfig = {
        filename: filename,
        thumb: thumb,
        fileexperience: fileexperience,
        ext: ext,
        s3domain: s3domain,
        html: html
    }

    // fix for broken graffiti experience name
    if (fileexperience == 'default') {
      fileexperience = 'galaxygraffiti'
    }

    if(fileexperience == '3dme') {
        options.threeDme.push(fileConfig);
    } else {
        options[fileexperience].push(fileConfig);
    }


}

function processFiles(data) {
	doLog('xxxxx processFiles');
    var message = '';
    if (data.success) {
        if (data.files) {
            for (var i=0; i<data.files.length; i++) {
                getFile(data.files[i]);
            }
        }
        else {
            message = 'no files';
        }
    }
    else {
        message = 'no data';
    }

    //pass data to handlebars
    doLog(options);
    for(var key in options) {
        if(options[key].length > 0) {
            options[key].forEach(slide => {
                $('.'+key).append(handleTemplate("experience", slide))
                $('.'+key+'_title').show();
                $('.'+key).show();
            })
            const sliderConfig = {
                lazyLoad: 'ondemand',
                dots: false,
                infinite: false,
                slidesToShow: 3,
                arrows: false,
                dots: true,
                speed: 500,
                fade: false,
                cssEase: 'linear',
                responsive: [
                  {
                    breakpoint: 768,
                    settings: {
                      slidesToShow: 1,
                      dots: true,
                    }
                  }
                ]
            };

            slider( 'experience-page', '.'+key, sliderConfig, 'experience' );

        }
    }


}




}





/*





<script type="text/javascript">


// LOCAL
// var server = 'http://kx-content-sharing-server.samsung.com/';
// ONLINE
// var server = 'https://kxuploads-test.herokuapp.com/';
// SEBN staging
// var server = 'https://sebnapi.sebnstaging.nl/uk/kx/';
// SEBN live
var server = 'https://sebnapi.nl/uk/kx/';


// needs to be https ...
var s3domain = 'https://kxuploads.s3.eu-west-2.amazonaws.com/uploads/';
// live
// var s3domain = 'https://kxuploads-live.s3.eu-west-2.amazonaws.com/uploads/';

// LOCAL
// var server = 'http://kx-content-sharing-server.samsung.com/';
// ONLINE
// var server = 'https://kxuploads-test.herokuapp.com/';

function getFile(file) {

    var filename = file.name;
    var fileexperience = file.experience;

    var ext = filename.substr(filename.lastIndexOf('.') + 1);
    var html = '<div class="container _' + fileexperience + '">';
    switch(ext.toLowerCase()) {
        case 'jpg':
        case 'png':
        case 'gif':
            // image - jpg, png, gif
            html += '<div class="image">' +
                '<img src="' + s3domain + filename + '"/>' +
                '</div>';
            break;
        case 'mp4':
        case 'ogv':
        case 'webm':
            // video - mp4, ogv, webm
            html += '<div class="video">' +
                '<video controls>' +
                '<source src="' + s3domain + filename + '" type="video/' + (ext == 'ogv' ? 'ogg' : ext) + '">' +
                'Your browser does not support the video tag.' +
                '</video>' +
                '</div>';
            break;
        case 'mp3':
            // sound = mp3
            html += '<div class="audio">' +
                '<audio controls>' +
                '<source src="' + s3domain + filename + '" type="audio/' + (ext == 'mp3' ? 'mpeg' : ext) + '">' +
                'Your browser does not support the audio element.' +
                '</audio>' +
                '</div>';
            break;
        default:
            // anything else - link
            html += '<div class="link">' +
                '<a href="' + s3domain + filename + '" target="_blank">' + filename + '</a>' +
                '</div>';
            break;
    }
    html += '</div>';
    return html;
}

function processFiles(data) {
    var html = '';
    if (data.success) {
        if (data.files) {
            for (var i=0; i<data.files.length; i++) {
                html += getFile(data.files[i]);
            }
        }
        else {
            html = 'no files';
        }
    }
    else {
        html = 'no data';
    }
    $('#files').html(html);
}

function getParam(param) {
    var pageURL = window.location.search.substring(1);
    var URLVariables = pageURL.split('&');
    for (var i = 0; i < URLVariables.length; i++) {
        var queryString = URLVariables[i].split('=');
        if (queryString[0] == param) {
            return queryString[1];
        }
    }
}

$(document).ready(function () {

	doLog('ready....');
    // check for id in url - if exists - load the data
    var idParam = getParam('id');
    if (idParam) {
        doLog('id in url - ' + idParam);

        $('form#dataid [name=id]').val(idParam)

        $('#files').html('');
        $.ajax({
            url: server + 'get.php',
            type: 'POST',

            // Form data
            data: new FormData($('form#dataid')[0]),

            // Tell jQuery not to process data or worry about content-type
            // You *must* include these options!
            cache: false,
            contentType: false,
            processData: false,

            success: function (data) {
                processFiles(data);
            },
            error: function () {
                alert("error");
            }
        });

    }
});

</script>

*/
