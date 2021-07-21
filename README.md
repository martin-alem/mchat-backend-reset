Password Reset microservice

Endpoints:
•	Reset/
•	Reset/verify.
•	Reset/verify/resend.
•	Reset/change.
•	Reset/ping.

Reset/
•	This endpoint accepts post request with a payload containing a 10 digit us phone number.
•	The phone number is checked if it exists in the login table, and it is in the active state.
•	The phone number is checked in password reset table to make sure it does not exist, or the status is complete.
•	The reset limit is checked if it as reached 5 in a day.
•	Generate a 6 digits code and send using Twilio API.
•	If successful, the code is persisted in Password Reset table together with the timestamp and response sent back.
•	The status in login table should be inactive.

Reset/verify.
•	This endpoint accepts a post request with a payload containing a 6 digits code and 10 digits us phone number.
•	The code is checked in Password Reset table and makes sure it corresponds to the phone number and the time difference is not  more than 5mins.
•	If everything ok, verification was successful, and response sent back.

Reset/verify/resend.
•	This endpoint accepts a post request with a payload containing a phone number.
•	This number is checked in reset table.
•	If resend limit is already 2 , request cannot be sent otherwise, code is generated, sent and old value and timestamp updated.
Reset/change.
