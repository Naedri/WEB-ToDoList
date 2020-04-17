const servicesUser = require("./user.js");

    const user={
    email: "jean@chocomail.com",
    pwd: "blablabla"
  };

  servicesUser.isFree(user.email, (err,result) => {
    if(err){
        console.log(result);
    } else {
        console.log('sending query');
        console.log(result);
        if (result.count === '0'){
          console.log('email available');
          return true;
        }else{
          console.log('email busy');
          return false;
        }
    }
  });

  servicesUser.create( user , (err,result) => {

  });