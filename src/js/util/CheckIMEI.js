export default function checkIMEI(imei) {
    var reg = /^\d{15}$/;

    if (!reg.test(imei)) {
        return false;
    }

    var sumOfFourteen = 0;

    for (var i = 0; i < imei.length - 1; i++) {

        if ((i + 1) % 2 == 0) {

            if (imei[i] * 2 > 9) {
                var tempDigit = (parseInt(imei[i]) * 2).toString();
                sumOfFourteen += parseInt(tempDigit[0]) + parseInt(tempDigit[1]);
            } else {
                sumOfFourteen += parseInt(imei[i]) * 2;
            }

        } else {
            sumOfFourteen += parseInt(imei[i]);
        }

    }

    if (imei[imei.length - 1] == (Math.ceil(sumOfFourteen / 10) * 10 - sumOfFourteen)) {
        // doLog("Last digit correct");
        return true;
    } else {
        // doLog("Last digit false");
        return false;
    }

}
