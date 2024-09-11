global.XMLHttpRequest = require("xhr2");
const emailjs = require("emailjs-com");

async function sendMail(email) {
    try {
        await emailjs.send(
            process.env.EMAIL_SERVICE,
            process.env.EMAIL_TEMPLATE,
            {
                to_name: email,
                to_email: email,
                message: `Congratz your email [ ${email} ] has been registered on Nusa Foods. start your cheff journey NOW!`,
            },
            process.env.EMAIL_API
        );
    } catch (err) {
        console.log("ERROR", err);
    }
}
module.exports = {
    sendMail,
};
