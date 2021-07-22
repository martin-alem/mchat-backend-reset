/**
 * Utility functions
 * 6/28/2021
 * Martin Alemajoh
 */

class Helper {

	/**
	 * Return a formatted data: MM-DD-YYYY
	 */
	static getDate() {
		const date = new Date();
		return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
	}

	static passwordGenerator(length) {
		let password = "";
		for (let i = 0; i < length; i++) {
			const random = Math.floor(Math.random() * 127) + 32;
			let str = String.fromCharCode(random);
			password += str;
		}

		return password;
	}

	/**
	 * Generates code of number length.
	 * @param {number} number length of code to generate
	 * @returns {string} a string representing the code.
	 */
	static getCode(number) {
		let code = "";
		for (let i = 0; i < number; i++) {
			const random = Math.floor(Math.random() * 10);
			code += random.toString(10);
		}

		return code;
	}


	/**
	 * Gets a color
	 * @param {string} flag type of log message
	 * @returns {string} a string representing the color.
	 */
	static getColor(flag) {
		let color;
		switch (flag) {
			case "INFO":
				color = "green";
				break;
			case "WARNING":
				color = "yellow";
				break;
			case "ERROR":
				color = "red";
				break;
			default:
				color = "blue";

		}
		return color;
	}

	/**
	 * Builds an html template
	 * @param {string} href 
	 * @param {string} type 
	 * @returns 
	 */
	static async buildEmailTemplate(name) {
		const Crud = require("./Crud"); //prevent circular dependencies
		const template = await Crud.read(`${name}.html`);
		return template;
	}
}

module.exports = Helper;
