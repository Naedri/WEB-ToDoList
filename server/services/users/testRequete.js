const servicesUser = require("./user.js");

const user={
  email: "a@mail.com",
  email2:"jacobin@gmail.com",
  password: "aqwzsxed",
  password2:"azertyui"
};


/*
servicesUser.updatePassword(user.email, user.password, user.password2, (err, result) => {
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
servicesUser.updateEmail(user.email, user.email2, (err, result)=>{
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
  servicesUser.authenticate(user,(err, result)=>{
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
  servicesUser.create(user,(err, result)=>{
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
 servicesUser.isFree(user.email, (err,result) => {
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

