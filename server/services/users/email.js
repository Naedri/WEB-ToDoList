//"use strict";
const nodemailer = require("nodemailer"); //envoie des mail par le service mail
const fs = require('fs'); //lecture des templates
const path = require('path'); //take from parent folder files not in .js
require('dotenv').config({path: __dirname + '/.env'}); // fait reference aux log du service mail

//template
let text_Welcome = fs.readFileSync(path.join(__dirname, '../../public/mail') + '/email_Welcome.txt', 'utf8');
let text_Pwd = fs.readFileSync(path.join(__dirname, '../../public/mail') + '/email_Pwd.txt', 'utf8');
let html_Welcome = fs.readFileSync(path.join(__dirname, '../../public/mail') + '/email_Welcome.html', 'utf8');
let html_Pwd = fs.readFileSync(path.join(__dirname, '../../public/mail') + '/email_Pwd.html', 'utf8');

//step1 : choose one lines between 124 to 127 ones your email service by comment modification
//step1.1 : if you have choosen gmail, you will have to accept lesssercure apps at https://myaccount.google.com/lesssecureapps
//step2 : create a new file in this folder with the following name : .env
/* step3 : indicate in the .env file your mail login details, with for example :
    EMAIL_gmail = smith@gmail.com
    PASSWORD_gmail = 1234
    EMAIL_ethereal = smith@ethereal.email
    PASSWORD_ethereal = 1234
    EMAIL_mailtrap = 4321
    PASSWORD_mailtrap = 1234
*/

module.exports = {
   sendEmail,
   generateText_Pwd,
   generateText_Welcome,
   generateHtml_Pwd,
   generateHtml_Welcome,
};

function generateText_Pwd(pwd){
    let text = text_Pwd ;
    text = text.replace("#pwd#", pwd);
    return text ;
};

function generateText_Welcome(email){
    let text = text_Welcome ;
    text = text.replace("#email#", email);
    return text ;
};

function generateHtml_Pwd(pwd){
    let text = html_Pwd ;
    text = text.replace("#pwd#", pwd);
    return text ;
};

function generateHtml_Welcome(email){
    let text = html_Welcome ;
    text = text.replace("#email#", email);
    return text ;
};

//get logDetails for transporterOptions of nodemailer
function getLogDetails(mailService){
    let logDetails ;
    switch (mailService) {
        case 'mailtrap':
            logDetails = {
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                    user: process.env.EMAIL_mailtrap,
                    pass: process.env.PASSWORD_mailtrap,
                }
              };
            break;
        case 'gmail':
            logDetails = {
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_gmail,
                    pass: process.env.PASSWORD_gmail,
                }
              };
            break;
        case 'ethereal':
            logDetails = {
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: process.env.EMAIL_ethereal,
                    pass: process.env.PASSWORD_ethereal,
                    }
            };
            break;
        default:
            logDetails = false ;
    }
    return logDetails;
};


// get the name of the email adresse emitter according the transporterOptions  choice
function getFromMailOptions(fromMail){
    let fromMailOptions ;
    switch (fromMail) {
        case 'mailtrap':
            fromMailOptions = '"Equipe des comptes VaN" <noreplyvan@inbox.mailtrap.io>' ;
            break;
        case 'gmail':
            fromMailOptions = '"Equipe des comptes VaN" <noreplyvan@gmail.com>' ;
            break;
        case 'ethereal':
            fromMailOptions = '"Equipe des comptes VaN" <noreplyvan@ethereal.email>' ;
            break;
        default:
            fromMailOptions = false ;
    }
    return fromMailOptions;
};


// async..await is not allowed in global scope, must use a wrapper
async function sendEmail(emaillDetails, callback){

    //which email service do you choose
    //const choice = "gmail";
    //const choice = "mailtrap";
    const choice = "ethereal";

  // create reusable transporter object using the default SMTP transport
    const transporterOptions = getLogDetails(choice);
    const transporter = await nodemailer.createTransport(transporterOptions, (err, result) => {
        if (err) {
            console.log("ERROR transporter");
            console.log(err);
            callback(true, err);
        } else {
            console.log("NO ERROR transporter");
            console.log(result);
            callback(undefined, result);
        }
    });

    // send mail with defined transport object
    const fromMailOptions = getFromMailOptions(choice);
    const details = emaillDetails;
    const mailOptions = {
        from: fromMailOptions, // sender address
        to: details.to, // list of receivers
        subject: details.subject, // Subject line
        text: details.text, // plain text body
        html: details.html, // html body
    };
    await transporter.sendMail(mailOptions, (err, result) => {
        if (err) {
            console.log("ERROR sendMail");
            console.log(err);
            callback(true, err);
        } else {
            console.log("NO ERROR sendMail");
            //console.log(result);

            console.log("Message sent: %s", result.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
          
            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
          
            callback(undefined, result);
        }
    });
};