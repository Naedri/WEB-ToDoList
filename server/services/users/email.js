// const utils = require("../../db/utils"); 
const nodemailer = require('nodemailer');
const fs = require('fs');

const text_Welcome = fs.readFileSync(__dirname + "/email_Welcome.txt", "utf8");
const text_Pwd = fs.readFileSync(__dirname + "/email_Pwd.txt", "utf8");
const html_Welcome = fs.readFileSync(__dirname + "/email_Welcome.html", "utf8");
const html_Pwd = fs.readFileSync(__dirname + "/email_Pwd.html", "utf8");

module.exports = {
   sendEmail,
   generateText_Pwd,
   generateText_Welcome,
   generateHtml_Pwd,
   generateHtml_Welcome,
};

async function sendEmail({toArray, subject, text, html}, callback) {
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass // generated ethereal password
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Equipe des comptes VaN" <noreply@van.com>', // sender address
        to: toArray, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html // html body
    });

    console.log("Message sent: %s", info.messageId);

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    callback(false, info);

};

function generateText_Pwd(email, pwd){
    let text = text_Pwd ;
    text = text.replace("#email#", email);
    text = text.replace("#pwd#", pwd);
    return text ;
};

function generateText_Welcome(email, pwd){
    let text = text_Welcome ;
    text = text.replace("#email#", email);
    text = text.replace("#pwd#", pwd);
    return text ;
};

function generateHtml_Pwd(email, pwd){
    let text = html_Pwd ;
    text = text.replace("#email#", email);
    text = text.replace("#pwd#", pwd);
    return text ;
};

function generateHtml_Welcome(email, pwd){
    let text = html_Welcome ;
    text = text.replace("#email#", email);
    text = text.replace("#pwd#", pwd);
    return text ;
};
