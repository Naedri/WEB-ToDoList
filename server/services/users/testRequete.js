const serviceUser = require("./user.js");
const ServiceEmail = require("./email");

const user={
  email1: "adrien.jallais@gmail.com",
  email2:"naedri@netcourrier.com",
  password: "aqwzsxed",
  password2:"azertyui"
};

/*
const email2 = user.email;
const subject = "Welcome on Board of ToDoList App";
const pwd = user.encrypted_password;
const text = ServiceEmail.generateText_Welcome(email2,pwd);
const html = ServiceEmail.generateHtml_Welcome(email2,pwd);

ServiceEmail.sendEmail( { email2, subject, text, html}, callback => {
  if (err1) {
      callback(true, err1);
  } else {
      const info = result1;
      callback(undefined, info);
  }
});
*/
/*
serviceUser.getDetails(user.email, (err, result) => {
  if(err){
    console.log(result);
} else {
    console.log(result);
  }
});
*/


/*
INSERT INTO USERS (email, encrypted_password)
    VALUES ('adrien@protonmail.com','aqwzsxed');
*/

/*
serviceUser.sendEmailWelcome(user.email, (err, result) => {
  if(err){
    console.log(result);
} else {
    console.log(result);
  }
});
*/

/*
serviceUser.updatePassword(user.email, user.password, user.password2, (err, result) => {
  if(err){
    console.log(result);
} else {
    let state = result ? ' ' : ' not ' ;
    console.log('user'+ state + 'update');
    console.log(result);
  }
});
*/


/*
serviceUser.updateEmail(user, (err, result)=>{
  if(err){
    console.log("ERROR");
    console.log(result);
} else {
    console.log("NO error");
    let state = result ? ' ' : ' not ' ;
    console.log('user'+ state + 'update');
    console.log(result);
  }
});
*/
  
  /*
  serviceUser.authenticate(user,(err, result)=>{
    if(err){
      console.log(result);
  } else {
      let state = result ? result : ' not ' ;
      console.log('user '+ state + ' authenticated');
      console.log(result);
    }
  });
  */

  /*
  serviceUser.create(user,(err, result)=>{
    if(err){
      console.log(result);
  } else {
      console.log("ATTENTION RESULTAT de create api js arrive");
      let state = result ? '' : 'not' ;
      console.log('user '+ state + ' created');
      console.log(result);
    }
  });
*/

  /*
 serviceUser.isFree(user.email, (err,result) => {
    if(err){
        console.log(result);
    } else {
        console.log('sending query');
        console.log(result);
        if (result.count === '0'){
          console.log('email available');
        }else{
          console.log('email busy');
        }
    }
  });
  */

