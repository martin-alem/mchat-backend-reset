/**
 * Send SMS messages to a phone number using Twilio.
 * 2/28/2021
 * Martin Alemajoh
 */

const Client = require("twilio");
const path = require("path")
const Logger = require(path.join(__dirname, "../utils/Logger"))

const twilio = {
    "accountSid": process.env.TWILIO_ACCOUNT_SID,
    "authToken": process.env.TWILIO_AUTH_TOKEN,
    "number": process.env.TWILIO_NUMBER,
}

class SendSMS {
    static client = new Client(twilio.accountSid, twilio.authToken);

    /**
     * Sends an SMS message
     * @param {string} recipientPhone recipients phone number
     * @param {string} message message to be sent
     * @returns {object} object containing the response.
     */
    static async send(recipientPhone, message) {
        try {
            const result = await SendSMS.client.messages.create({
                body: message,
                from: twilio.number,
                to: recipientPhone
            });
            Logger.logError("SMS successfully sent", __filename, new Date());
            return result;
        } catch (error) {
            Logger.logError(err.message, __filename, new Date());
            return { "errorCode": "Error", "status": "failure" };
        }

    }
}

module.exports = SendSMS;