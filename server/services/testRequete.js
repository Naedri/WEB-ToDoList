const servicesUser = require("./user.js");

    const user={
    email: "jean@mail.com",
    pwd: "blablabla"
  };

  servicesUser.isFreeUser(user.email, (err,result) => {
    if(err){
        console.log(result);
    } else {
        console.log('requete lancée');
        console.log(result);
        if (result.count === '0'){
          console.log('nom user dispo');
          return true;
        }else{
          console.log('nom user non dispo');
          return false;
        }
    }
  });