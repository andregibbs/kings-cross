export default function handleTemplate ( id, options ) {

	var element = document.getElementById( id ).innerHTML;

	element = multiReplace(element, '[', '{');
	element = multiReplace(element, ']', '}');

	var template = Handlebars.compile( element );

	return template( options );

}

// Replace [[]] to {{}} from the html template
function multiReplace ( element, from, to) {
	while (element.indexOf(from) > -1) {
		element = element.replace(from, to);
	}
	return element;
}
