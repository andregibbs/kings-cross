var cheillondon = cheillondon || {};

cheillondon.scraper = (function() {

	'use strict';

	var main = {

		TAG: 'scraper',

		cheilStatics: [],
		cheilStaticsDetail: [],

		kdContentDivId: "kdContent",

		kdProductListDivId: "kdProductList",

		prefix: '',

		doLog: function(msg, o) {

			var debugParam = main.getParam('debug');

			msg = main.TAG + ' - ' + msg;

			if (debugParam) {
				if (o) {
					console.log(msg, o);
				}
				else {
					console.log(msg);
				}
			}

		},

        getParam: function(param) {
            var pageURL = window.location.search.substring(1);
            var URLVariables = pageURL.split('&');

            // main.doLog('Query string values:');

            for (var i = 0; i < URLVariables.length; i++) {
                var queryString = URLVariables[i].split('=');

                // main.doLog('Key: ' + queryString[0] + ', Value:  ' + queryString[1]);

                if (queryString[0] == param) {
                    return queryString[1];
                }
            }
        },

		getCB: function() {

			// get cache buster

			var now = new Date();

			var year = now.getFullYear(),
			        month = now.getMonth() + 1, // months are zero indexed
			        day = now.getDate(),
			        hour = now.getHours(),
			        minute = now.getMinutes(),
			        second = now.getSeconds();

			month = month < 10 ? "0" + month : month
			day = day < 10 ? "0" + day : day
			hour = hour < 10 ? "0" + hour : hour
			minute = minute < 10 ? "0" + minute : minute
			second = second < 10 ? "0" + second : second

			var cb = year + "" + month + "" + day + "" + hour + "" + minute + "" + second;

			return cb;

		},

		init: function() {

			main.doLog('cheillondon.scraper.main.init');

			if (document.getElementById(main.kdProductListDivId) != null) {
				main.removeKdProductList();
			}

			var cb = main.getCB();

			var site = window.location.pathname.split('/')[1];

			var bits = window.location.pathname.split('/');
			var path = bits.join('_');
			if (path.indexOf('_') == 0) {
				path = path.substring(1);
			}

			console.log(path);

			// var main.prefix = 'star_buyingtool_' + cb + '_' + site + '_';
			//var main.prefix = 'star_' + cb.substring(0,8) + '_' + site +'_' + cb.substring(8);
			// main.prefix = site +'_' + cb;
			main.prefix = path + cb;

			main.doScrape();
		},

		doScrape: function() {

			var src = window.location.href;

			$.get(src, function(data) {

				// main.doLog(data);

				var $data = $(data);

				main.cheilStatics = $data.find('.cheil-static');

	            if (main.cheilStatics.length == 0) {


	            	main.doLog('XXXXX no cheil-static class divs so using old way XXXXX');


	            	// SO ... use the old way - to make it 'backward compatible' :)

					var codeclone = $data.find('.cm-g-static-content.section').eq(1);

					// force the 'old way' into cheilStatics

					main.cheilStatics.push(codeclone);

					// main.processScrape(codeclone);

				}

            	main.doLog('XXXXX');
            	main.doLog(main.cheilStatics.length);
            	main.doLog('XXXXX');

            	// main.doLog('XX OUTER XX');
            	// main.doLog(main.cheilStatics.eq(0)[0].outerHTML);
            	// main.doLog('XX OUTER XX');

            	// need to loop through them and allow access to html/css & js for each

				$(main.cheilStatics).each(function(csIndex) {

					main.cheilStaticsDetail.push(
						{
							jsFiles: [],
							cssFiles: [],
							aemCodeToPaste: '',
							jsCodeToPaste: '',
							jsInnerToPaste: '',
							jsFilesProcessed: 0,
							cssFilesProcessed: 0
						}
					);

					main.processScrape(csIndex, $(this));

				})

				// check all js and css have been replaced
				main.checkAllProcessed();

			}, 'text')
			.done(function() {
				main.doLog("doScrape - done");
			})
			.fail(function() {
				main.doLog("doScrape - fail");
			})
			.always(function() {
				main.doLog("doScrape - always");
			});

		},

		checkAllProcessed: function() {

			main.doLog("checkAllProcessed - before");

			var allProcessed = true;

			// loop thru details and if #processed < length - allProcessed set to false

			$(main.cheilStaticsDetail).each(function(csdIndex) {

				// main.doLog('this');
				// main.doLog(main.cheilStaticsDetail[csdIndex]);
				// main.doLog('this');

				main.doLog("js - " + main.cheilStaticsDetail[csdIndex].jsFilesProcessed + " of " + main.cheilStaticsDetail[csdIndex].jsFiles.length);

				if (main.cheilStaticsDetail[csdIndex].jsFilesProcessed < main.cheilStaticsDetail[csdIndex].jsFiles.length) {
					allProcessed = false;
				}

				main.doLog("css - " + main.cheilStaticsDetail[csdIndex].cssFilesProcessed + " of " + main.cheilStaticsDetail[csdIndex].cssFiles.length);

				if (main.cheilStaticsDetail[csdIndex].cssFilesProcessed < main.cheilStaticsDetail[csdIndex].cssFiles.length) {
					allProcessed = false;
				}

			});

			main.doLog("checkAllProcessed - after");

			if (allProcessed) {

				// main.drawInterface();

        main.loadHtmlAndCss()
        main.loadJs()


			}
			else {

				setTimeout(function() {
					main.checkAllProcessed();
				}, 500);

			}

		},

		processScrape: function(csIndex, codeclone) {

			// main.doLog($(codeclone).html());

			// get a list of script elements withjin the cloned code
			// var scripts = $(codeclone).find('script[src]');
			var scripts = $(codeclone).find('script');

			main.doLog(scripts.length + ' scripts found to be replaced');

			var jsIndex = 0;
			$(scripts).each(function() {


				if (this.type && (this.type == 'text/x-handlebars-template' || this.type == 'application/ld+json') {
					main.doLog('EXCLUDING TEMPLATE - ' + this.type + ' ' + this.id);
				}
				else {

					if (this.src) {

						main.doLog(this);

						if (this.src.indexOf(window.location.hostname) > -1) {

							// only process local files

							main.doLog('PROCESSING - ' + this.src);

							// add a place holder to be replaced below
							$('<js' + jsIndex + '/>').insertBefore(this);
							// remove the element that will be replaced
							this.parentNode.removeChild(this);
							// push the js src to the js array
							main.cheilStaticsDetail[csIndex].jsFiles.push({'src':this.src});

							jsIndex++;

						}
						else {

							// exclude non-local files

							main.doLog('EXCLUDING - ' + this.src);

						}

					}
					else {

						// no src attribute so we need to take the innerHtml

						// add a place holder to be replaced below
						$('<js' + jsIndex + '/>').insertBefore(this);

						var jsInnerToPaste = this.innerHTML;

						// remove the element
						this.parentNode.removeChild(this);

						// push the js inner to the js array
						main.cheilStaticsDetail[csIndex].jsFiles.push({'inner':jsInnerToPaste});

						jsIndex++;

					}

				}

			});

			// get a list of css elements withjin the cloned code
			var csss = $(codeclone).find('link[rel="stylesheet"]');

			main.doLog(csss.length + ' csss found to be replaced');

			var cssIndex = 0;
			$(csss).each(function() {

			  	main.doLog(this);

				// if (this.href.indexOf('slick-carousel') == -1) {
				if (this.href.indexOf(window.location.hostname) > -1) {

					// only process local files

					main.doLog('PROCESSING - ' + this.href);

					// add a place holder to be replaced below
					$('<css' + cssIndex + '/>').insertBefore(this);
					// remove the element that will be replaced
					this.parentNode.removeChild(this);
					// push the css href to the css array
					main.cheilStaticsDetail[csIndex].cssFiles.push(this.href);

					cssIndex++;

				}
				else {

					// exclude non-local files

					main.doLog('EXCLUDING - ' + this.href);

				}

			});

			if ($(codeclone).hasClass('cheil-static')) {

				// so outer, containing div is included
				main.cheilStaticsDetail[csIndex].aemCodeToPaste = $(codeclone)[0].outerHTML;

			}
			else {
				main.cheilStaticsDetail[csIndex].aemCodeToPaste = $(codeclone).html();
			}

			main.processJS(csIndex, 0);

			main.processCSS(csIndex, 0);

		},

		processJS: function(csIndex, i) {

			if (i < main.cheilStaticsDetail[csIndex].jsFiles.length) {

				main.doLog(i, main.cheilStaticsDetail[csIndex].jsFiles[i]);

				if (main.cheilStaticsDetail[csIndex].jsFiles[i].src) {
					main.replaceJS(csIndex, i, main.cheilStaticsDetail[csIndex].jsFiles[i].src);
				}
				else {
					main.replaceJSInner(csIndex, i, main.cheilStaticsDetail[csIndex].jsFiles[i].inner);
				}

			}

		},

		processCSS: function(csIndex, i) {

			if (i < main.cheilStaticsDetail[csIndex].cssFiles.length) {

				main.doLog(i + ' ' + main.cheilStaticsDetail[csIndex].cssFiles[i]);

				main.replaceCSS(csIndex, i, main.cheilStaticsDetail[csIndex].cssFiles[i]);


			}

		},

		replaceJS: function(csIndex, index, src) {

		  $.get(src, function(data) {

			main.doLog('JS - got - ' + csIndex + ' ' + index);

		    // remove the script code
		    main.cheilStaticsDetail[csIndex].aemCodeToPaste = main.cheilStaticsDetail[csIndex].aemCodeToPaste.replace('<js' + index + '></js' + index + '>', '');

		    // add the js code to the variable holding all js code
		    main.cheilStaticsDetail[csIndex].jsCodeToPaste += '\n\n' + '// js' + index + ' ' + src + '\n\n' + data + '\n\n';

			main.cheilStaticsDetail[csIndex].jsFilesProcessed = main.cheilStaticsDetail[csIndex].jsFilesProcessed + 1;

		    // check if need to process next
		    main.processJS(csIndex, index + 1);


		  }, 'text')
		  .done(function() {
		    main.doLog("JS - done - " + csIndex + ' ' + index + ' ' + src);
		  })
		  .fail(function() {
		    main.doLog("JS - fail - " + csIndex + ' ' + index + ' ' + src);
		  })

		  .error(function(jqXHR, textStatus, errorThrown) {
		    main.doLog("JS - error - " + csIndex + ' ' + index + ' ' + textStatus + ' ' + errorThrown);
		  })

		  .always(function() {
		    main.doLog("JS - always - " + csIndex + ' ' + index + ' ' + src);
		  });

		},

		replaceJSInner: function(csIndex, index, inner) {

		    // remove the script code
		    main.cheilStaticsDetail[csIndex].aemCodeToPaste = main.cheilStaticsDetail[csIndex].aemCodeToPaste.replace('<js' + index + '></js' + index + '>', '');

		    // added because when babel precompiles 'stuff' there is a missing ';' - which means code breaks on samsung.com
		    var lastFour = inner.substr(inner.length - 4);
		    if (lastFour == '([])') {
		    	inner += ';';
		    }

		    // add the js code to the variable holding all js code
		    main.cheilStaticsDetail[csIndex].jsCodeToPaste += '\n' + '// js' + index  + ' inner' + '\n' + inner + '\n';

			main.cheilStaticsDetail[csIndex].jsFilesProcessed = main.cheilStaticsDetail[csIndex].jsFilesProcessed + 1;

		    // check if need to process next
		    main.processJS(csIndex, index + 1);

		},

		replaceCSS: function(csIndex, index, src) {

		  $.get(src, function(data) {

		    main.cheilStaticsDetail[csIndex].aemCodeToPaste = main.cheilStaticsDetail[csIndex].aemCodeToPaste.replace('<css' + index + '></css' + index + '>', '<!-- css' + index + ' ' + src + ' -->\n\n<style>\n' + data + '\n</' + 'style>\n');

			main.cheilStaticsDetail[csIndex].cssFilesProcessed = main.cheilStaticsDetail[csIndex].cssFilesProcessed + 1;

		    // check if need to process next
		    main.processCSS(csIndex, index + 1);


		  }, 'text')
		  .done(function() {
		    main.doLog("CSS - done - " + csIndex + ' ' + index + ' ' + src);
		  })
		  .fail(function() {
		    main.doLog("CSS - fail - " + csIndex + ' ' + index + ' ' + src);
		  })
		  .always(function() {
		    main.doLog("CSS - always - " + csIndex + ' ' + index + ' ' + src);
		  });

		},

		removeKdProductList: function() {
			//alert("removing");
		    document.body.removeChild(document.getElementById(main.kdProductListDivId));
			//alert("removed");
		},

		copyToClipboard: function() {

		  var htmlDiv = document.querySelector('#' + main.kdContentDivId);
		  var range = document.createRange();
		  range.selectNode(htmlDiv);
		  window.getSelection().addRange(range);

		  try {
		    // Now that we've selected the anchor text, execute the copy command
		    var successful = document.execCommand('copy');
		    var msg = successful ? 'successful' : 'unsuccessful';
		    alert('Copy command was ' + msg);
		  } catch(err) {
		    alert('Oops, unable to copy');
		  }

		  // Remove the selections - NOTE: Should use
		  // removeRange(range) when it is supported
		  window.getSelection().removeAllRanges();


		},

		loadHtmlAndCss: function() {
		  var myContentDiv = $('#' + main.kdContentDivId);
		  // myContentDiv.html('<pre>' + main.htmlEncode(main.cheilStaticsDetail[$('.csindex.selected').index()].aemCodeToPaste) + '</pre>');
      // main.scrapedHTML = main.htmlEncode(main.cheilStaticsDetail[0].aemCodeToPaste)
      var scrapeEl = document.createElement('div')
      // scrapeEl.innerHTML = main.cheilStaticsDetail[0].aemCodeToPaste
      main.scrapedHTML = main.cheilStaticsDetail[0].aemCodeToPaste
		},

		loadJs: function() {
		  // var myContentDiv = $('#' + main.kdContentDivId);
		  // myContentDiv.html('<pre>' + main.htmlEncode(main.cheilStaticsDetail[$('.csindex.selected').index()].jsCodeToPaste) + '</pre>');
      // main.scrapedJS = main.htmlEncode(main.cheilStaticsDetail[0].jsCodeToPaste)
      // var x = $("div").html('<pre>' + main.htmlEncode(main.cheilStaticsDetail[0].jsCodeToPaste) + '</pre>')
      // var scrapeEl = document.createElement('div')
      // scrapeEl.innerHTML = main.cheilStaticsDetail[0].jsCodeToPaste
      main.scrapedJS = main.cheilStaticsDetail[0].jsCodeToPaste
		},

		htmlEncode: function(value){

			var valueWithoutComments = value.replace(/(?!\/\*\$)(\/\*([\s\S]*?)\*\/)/gm, '');

			return $('<div/>').text(valueWithoutComments).html();

		},

		saveHtmlAndCss: function() {

			var index = $('.csindex.selected').index();

			var htmlAndCss = main.cheilStaticsDetail[index].aemCodeToPaste;

			var htmlAndCss = htmlAndCss.replace(/(?!\/\*\$)(\/\*([\s\S]*?)\*\/)/gm, '');

			// var filename = main.prefix + cb + '.html';
			var filename = main.prefix + '-' + index + '.html';

			alert('saving - ' + filename);

			var blob = new Blob([htmlAndCss], {type: "text/html;charset=utf-8"});
			//
			saveAs(blob, filename);

		},

		saveJs: function() {

			var index = $('.csindex.selected').index();

			var js =  main.cheilStaticsDetail[index].jsCodeToPaste;

			var js = js.replace(/(?!\/\*\$)(\/\*([\s\S]*?)\*\/)/gm, '');

			// var filename = main.prefix + cb + '.js';
			var filename = main.prefix + '-' + index + '.js.txt';

			alert('saving - ' + filename);

			var blob = new Blob([js], {type: "text/plain;charset=utf-8"});
			//
			saveAs(blob, filename);

		},

		saveAll: function() {
			main.saveHtmlAndCss();
			main.saveJs();
		},


		drawInterface: function() {

			// .....

			var myDiv = document.createElement('div');
			myDiv.setAttribute("id", main.kdProductListDivId);
			myDiv.style.position = 'absolute';
			myDiv.style.left = '10px';
			myDiv.style.right = '10px';
			myDiv.style.top = '10px';
			myDiv.style.padding = '10px';
			myDiv.style.zIndex = 9999;
			myDiv.style.background = "#e5e5e5";
			var myLinkDiv = document.createElement('div');
			myLinkDiv.style.padding = '10px';
			myLinkDiv.style.background = "#e0e0e0";

		  	// close ...
		  	var myLink = document.createElement('a');
			var myLinkText = document.createTextNode("close");
			myLink.appendChild(myLinkText);
			myLink.title = "Close";
			myLink.href = "javascript:cheillondon.scraper.main.removeKdProductList();";
		  	myLink.style.cssFloat = "right"
			myLinkDiv.appendChild(myLink);
		  	// ... close


			var myIndexSpan = document.createElement('span');

		  	// loop thru main.cheilStatics - 'select' the first one - this will be the selector for each static div
			$(main.cheilStatics).each(function(csIndex) {

				if (csIndex > 0) {
					myLinkDiv.append(' ');
				}

				var myIndexLink = document.createElement('a');
				myIndexLink.style.paddingLeft = '10px';
				myIndexLink.style.paddingRight = '10px';
				myIndexLink.classList.add('csindex');
				var myIndexLinkText = document.createTextNode(csIndex);
				myIndexLink.appendChild(myIndexLinkText);
				myIndexLink.title = "Show details for csIndex - " + csIndex;
				myIndexLink.href = "javascript:void(0);";
				myIndexSpan.appendChild(myIndexLink);

			})


			myLinkDiv.appendChild(myIndexSpan);

			myLinkDiv.append(' - ');

			// copy ...
			var myCopyLink = document.createElement('a');
			var myCopyLinkText = document.createTextNode("Copy to Clipboard");
			myCopyLink.appendChild(myCopyLinkText);
			myCopyLink.title = "Copy to Clipboard";
			myCopyLink.href = "javascript:cheillondon.scraper.main.copyToClipboard();";
			myLinkDiv.appendChild(myCopyLink);
			// ... copy

			// loadAll ...

			myLinkDiv.append(' | ');

			var myLoadHtmlAndCssLink = document.createElement('a');
			var myLoadHtmlAndCssLinkText = document.createTextNode("Load HTML & CSS");
			myLoadHtmlAndCssLink.appendChild(myLoadHtmlAndCssLinkText);
			myLoadHtmlAndCssLink.title = "Load HTML & CSS";
			myLoadHtmlAndCssLink.href = "javascript:cheillondon.scraper.main.loadHtmlAndCss();";
			myLinkDiv.appendChild(myLoadHtmlAndCssLink);
			// ... loadAll

			// loadJs ...

			myLinkDiv.append(' | ');

			var myLoadJsLink = document.createElement('a');
			var myLoadJsLinkText = document.createTextNode("Load JS");
			myLoadJsLink.appendChild(myLoadJsLinkText);
			myLoadJsLink.title = "Load JS";
			myLoadJsLink.href = "javascript:cheillondon.scraper.main.loadJs();";
			myLinkDiv.appendChild(myLoadJsLink);
			// ... loadAll

			// save ...

			myLinkDiv.append(' | ');

			var myLoadSaveLink = document.createElement('a');
			var myLoadSaveLinkText = document.createTextNode("Save");
			myLoadSaveLink.appendChild(myLoadSaveLinkText);
			myLoadSaveLink.title = "Save";
			myLoadSaveLink.href = "javascript:cheillondon.scraper.main.saveAll();";
			myLinkDiv.appendChild(myLoadSaveLink);
			// ... loadAll

			myDiv.appendChild(myLinkDiv);

			var myContentDiv = document.createElement('div');
			myContentDiv.setAttribute("id", main.kdContentDivId);
			myContentDiv.style.padding = '10px';
			myContentDiv.style.background = "#ffffff";
			myContentDiv.style.fontSize = "8px";

			myDiv.appendChild(myContentDiv);
			document.body.appendChild(myDiv);


			// now some lazy jquery
			$('.csindex').eq(0).addClass('selected');
			$('.csindex').eq(0).css('background-color', "#fff");
			$('.csindex').on('click', function() {
				$('.csindex').removeClass('selected');
				$('.csindex').css('background-color', "#e5e5e5");
				$(this).addClass('selected');
				$(this).css('background-color', "#fff");
				$('#' + main.kdContentDivId).html('');
			});

			// .....

		}



	};

	return {
		main : main

	};

})();

cheillondon.scraper.main.init();






/* should/could be an injected file ... */




/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 2014-08-29
 *
 * By Eli Grey, http://eligrey.com
 * License: X11/MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs
  // IE 10+ (native saveAs)
  || (typeof navigator !== "undefined" &&
      navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(navigator))
  // Everyone else
  || (function(view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof navigator !== "undefined" &&
	    /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = doc.createEvent("MouseEvents");
			event.initMouseEvent(
				"click", true, false, view, 0, 0, 0, 0, 0
				, false, false, false, false, 0, null
			);
			node.dispatchEvent(event);
		}
		, webkit_req_fs = view.webkitRequestFileSystem
		, req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		, fs_min_size = 0
		// See https://code.google.com/p/chromium/issues/detail?id=375297#c7 for
		// the reasoning behind the timeout and revocation flow
		, arbitrary_revoke_timeout = 10
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			if (view.chrome) {
				revoker();
			} else {
				setTimeout(revoker, arbitrary_revoke_timeout);
			}
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, FileSaver = function(blob, name) {
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, blob_changed = false
				, object_url
				, target_view
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					// don't create more object URLs than needed
					if (blob_changed || !object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (target_view) {
						target_view.location.href = object_url;
					} else {
						var new_tab = view.open(object_url, "_blank");
						if (new_tab == undefined && typeof safari !== "undefined") {
							//Apple do not allow window.open, see http://bit.ly/1kZffRI
							view.location.href = object_url
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				}
				, abortable = function(func) {
					return function() {
						if (filesaver.readyState !== filesaver.DONE) {
							return func.apply(this, arguments);
						}
					};
				}
				, create_if_not_found = {create: true, exclusive: false}
				, slice
			;
			filesaver.readyState = filesaver.INIT;
			if (!name) {
				name = "download";
			}
			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				save_link.href = object_url;
				save_link.download = name;
				click(save_link);
				filesaver.readyState = filesaver.DONE;
				dispatch_all();
				revoke(object_url);
				return;
			}
			// Object and web filesystem URLs have a problem saving in Google Chrome when
			// viewed in a tab, so I force save with application/octet-stream
			// http://code.google.com/p/chromium/issues/detail?id=91158
			// Update: Google errantly closed 91158, I submitted it again:
			// https://code.google.com/p/chromium/issues/detail?id=389642
			if (view.chrome && type && type !== force_saveable_type) {
				slice = blob.slice || blob.webkitSlice;
				blob = slice.call(blob, 0, blob.size, force_saveable_type);
				blob_changed = true;
			}
			// Since I can't be sure that the guessed media type will trigger a download
			// in WebKit, I append .download to the filename.
			// https://bugs.webkit.org/show_bug.cgi?id=65440
			if (webkit_req_fs && name !== "download") {
				name += ".download";
			}
			if (type === force_saveable_type || webkit_req_fs) {
				target_view = view;
			}
			if (!req_fs) {
				fs_error();
				return;
			}
			fs_min_size += blob.size;
			req_fs(view.TEMPORARY, fs_min_size, abortable(function(fs) {
				fs.root.getDirectory("saved", create_if_not_found, abortable(function(dir) {
					var save = function() {
						dir.getFile(name, create_if_not_found, abortable(function(file) {
							file.createWriter(abortable(function(writer) {
								writer.onwriteend = function(event) {
									target_view.location.href = file.toURL();
									filesaver.readyState = filesaver.DONE;
									dispatch(filesaver, "writeend", event);
									revoke(file);
								};
								writer.onerror = function() {
									var error = writer.error;
									if (error.code !== error.ABORT_ERR) {
										fs_error();
									}
								};
								"writestart progress write abort".split(" ").forEach(function(event) {
									writer["on" + event] = filesaver["on" + event];
								});
								writer.write(blob);
								filesaver.abort = function() {
									writer.abort();
									filesaver.readyState = filesaver.DONE;
								};
								filesaver.readyState = filesaver.WRITING;
							}), fs_error);
						}), fs_error);
					};
					dir.getFile(name, {create: false}, abortable(function(file) {
						// delete file if it already exists
						file.remove();
						save();
					}), abortable(function(ex) {
						if (ex.code === ex.NOT_FOUND_ERR) {
							save();
						} else {
							fs_error();
						}
					}));
				}), fs_error);
			}), fs_error);
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name) {
			return new FileSaver(blob, name);
		}
	;
	FS_proto.abort = function() {
		var filesaver = this;
		filesaver.readyState = filesaver.DONE;
		dispatch(filesaver, "abort");
	};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module !== null) {
  module.exports = saveAs;
} else if ((typeof define !== "undefined" && define !== null) && (define.amd != null)) {
  define([], function() {
    return saveAs;
  });
}
