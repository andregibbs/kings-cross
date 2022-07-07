export default ( d ) => class GetDDMMYYYY {
	constructor() {
		var year = d.getFullYear(),
		month = d.getMonth() + 1, // months are zero indexed
		day = d.getDate();

		month = month < 10 ? "0" + month : month
		day = day < 10 ? "0" + day : day

		var str = day +
			"/" + month +
			"/" + year;

		return str;
	}
}
