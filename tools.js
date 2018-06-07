module.exports = {

	/**
	 * Public method used to get a random value from array.
	 * @param {array<any>}
	 * @returns {any}
	 */
	getRandomValue: function (items) {
		return items[Math.floor(Math.random() * items.length)];
	},

	/**
	 * Public method used to get random int.
	 * @param {number} int
	 * @param {number} int
	 * @returns {number}
	 */
	getRandomInt: function (min, max) {
		return Math.round(Math.random() * max) + min;
	},

	/**
	 * Public method used to get nice date.
	 * @param {string} date
	 * @returns {string}
	 */
	niceDate: function (date) {
		var _date = new Date(date);
		return _date.getUTCDate() + "/" + Number(_date.getUTCMonth() + 1) + "/" + _date.getUTCFullYear();
	}

};
