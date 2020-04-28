// const utils = require("../../db/utils"); 
//const nodemailer = require('nodemailer');
//"use strict";

const nodemailer = require("nodemailer"); //envoie des mail par le service mail
const fs = require('fs'); //lecture des templates
require('dotenv').config({path: __dirname + '/.env'}); // fait reference aux log du service mail

//const bodyParser = require('bodyParser');

let text_Welcome = fs.readFileSync(__dirname + "/email_Welcome.txt", "utf8");
let text_Pwd = fs.readFileSync(__dirname + "/email_Pwd.txt", "utf8");
let html_Welcome = fs.readFileSync(__dirname + "/email_Welcome.html", "utf8");
let html_Pwd = fs.readFileSync(__dirname + "/email_Pwd.html", "utf8");

module.exports = {
   sendEmail,
   generateText_Pwd,
   generateText_Welcome,
   generateHtml_Pwd,
   generateHtml_Welcome,
};


/*
var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "e273f2d70ba7b4",
      pass: "e5ac0cd3d6e2f1"
    }
  });

      // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>" // html body
    });


  var mailOptions = {
    from: '"Example Team" <from@example.com>',
    to: 'user1@example.com, user2@example.com',
    subject: 'Nice Nodemailer test',
    text: 'Hey there, it’s our first message sent with Nodemailer ;) ', 
    html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer'
};
*/

// async..await is not allowed in global scope, must use a wrapper
function sendEmail(emaillDetails, callback){

  // create reusable transporter object using the default SMTP transport
    const transporterOptions = {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
            }
    }
    const transporter = nodemailer.createTransport(transporterOptions, (err, result) => {
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
    const details = emaillDetails;
    const mailOptions = {
        from: '"Equipe des comptes VaN" <brain26@ethereal.email>', // sender address
        to: details.to, // list of receivers
        subject: details.subject, // Subject line
        text: details.text, // plain text body
        html: details.html, // html body
    };
    const info = transporter.sendMail(mailOptions, (err, result) => {
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


//sendEmail().catch(console.error);

/*
async function sendEmail({toArray, subject, text, html}, callback) {
    //let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
        let transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "e273f2d70ba7b4",
              pass: "e5ac0cd3d6e2f1"
            }
          });


    // send mail with defined transport object
    let mailOptions = {
        from: '"Equipe des comptes VaN" <82516d8128-8952c0@inbox.mailtrap.io>', // sender address
        to: toArray, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html // html body
    };


    let info = transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });



    let info = await transporter.sendMail({
        from: '"Equipe des comptes VaN" <noreply@van.com>', // sender address
        to: toArray, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html // html body
    });
    

    //console.log("Message sent: %s", info.messageId);

    // Preview only available when sending through an Ethereal account
    //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    callback(false, info);

};
*/

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
