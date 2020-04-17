const servicesUser = require("./user.js");

//js
//pour tester
//enoyer un seul element

    const user={
    email: "jean@mailcom",
    pwd: "blablabla"
  };

  let free = false ;

  servicesUser.isFreeUser(user.email, (err,result) => {
    if(err){
        console.log(result);
    } else {
        console.log('ok');
    }
  });

  