export default function getParam(param) {
    var pageURL = window.location.search.substring(1);
    var URLVariables = pageURL.split('&');
    for (var i = 0; i < URLVariables.length; i++) {
        var queryString = URLVariables[i].split('=');
        if (queryString[0] == param) {
            return queryString[1];
        }
    }
}