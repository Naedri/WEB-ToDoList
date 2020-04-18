const servicesUser = require("./user.js");

    const user={
    email: "jean2@chocomail.com",
    pwd: "blablabla"
  };


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

