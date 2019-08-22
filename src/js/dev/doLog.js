export default function doLog() {
    //Initial check to not waste performance on every console log called
    if (location.href.indexOf("?") != -1) {
        var debugRegex = /\?debug+=(\w+)|&debug=(\w+)/gm;
        if (debugRegex.exec(location.href) != null) {
            debugRegex.lastIndex = 0;
            var truth = ['true', '1'];
            // if (debugRegex.exec(location.href)[1] == 'true' || debugRegex.exec(location.href)[2] == 'true') {
            var regexResults = debugRegex.exec(location.href);
            if (regexResults.filter(value => truth.includes(value)).length >= 1) {
                // console.info("Debug mode %cON", "color: green; font-weight: bold;");
                return Function.prototype.bind.call(console.log, console, "Debug:");
            } else {
                return function () {/*Do nothing*/ };
            }
        } else {
            return function () {/*Do nothing*/ };
        }
    } else {
        return function () {/*Do nothing*/ };
    }
}