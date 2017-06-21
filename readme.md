CC5 love solve
===

Master is current with the "parts" on their own branches.

part 1: basic node/express/angular project
---

part 2: server responding to requests
---

part 3: mongo db connected
---

part 4: a few more features
---

part 5: adding auth basics with bcrypt
---

Auth. intro with Bcrypt
===


Step 1: Setup
---

In terminal, npm install the packages we'll need:

```
npm install bcrypt --save
```

- bcrypt is our encryption package that makes rainbow table and brute-force attacks more difficult using a "salt work factor" more on that below

Require these in our main server file.

Create a POST for your index route and make sure it is receiving data correctly. Create a /register route and similarly test a POST to it.

Part 2: setting up Mongo
---

Create a user model in ```modules/user.js```:

```
var mongoose = require( 'mongoose' );

mongoose.connect( 'localhost:27017/omegaMessages' );
var userSchema = new mongoose.Schema({
  username: String,
  password: String
});

var userModel = mongoose.model( 'userModel', userSchema );

module.exports = userModel;
```

This is the user model that we'll be saving to our database. Since it will be needed in both the index route (for login) and the register route (for new users) we put it in a module.

Part 3: register new users:
---

in your register route:

```
var express = require( 'express' );
var router = express.Router();
var bodyParser = require( 'body-parser' );
var bcrypt = require( 'bcrypt' );
var user = require( '../user' );

router.post( '/', function( req, res ) {
  console.log( 'in register post:', req.body );

  var newUser = req.body;

  bcrypt.genSalt( 12, function( err, salt ){
      console.log( 'salt:', salt );
      // hash the password along with our new salt
      bcrypt.hash( newUser.password, salt, function( err, hash ) {
        console.log( 'hash:', hash );
          if( err ){
            console.log( 'err:', err );
            res.send( err );
          }
          else{
            // use new hashed password
            newUser.password = hash;
            user( newUser ).save();
            res.send( 'yep' );
          }
      });
  });

});

module.exports = router;

```

Require and use the route in your main server file:

```
var register = require( './modules/routes/register' );
```

```
app.use( '/register', register );
```

This creates a new salt with a work value of 12. Then uses that salt to create a hash of our given password. If it is successful, it saves the user in our DB with the hashed password.

We now need an input area on our index.html:

```
<h2>Register</h2>
<div>
 <input type="text" ng-model='CONTROLLERASNAME.usernameRegister' placeholder="username"/>
 <input type="password" ng-model='CONTROLLERASNAME.passwordRegister' placeholder="password"/>
 <button ng-click='CONTROLLERASNAME.register()'>Register</button>
</div>
```
As well as a controller function to capture the info in our controller:

```
vm.register = function(){
  console.log( 'in controller logIn' );
  var credentials = {
    username: vm.usernameRegister,
    password: vm.passwordRegister
  }; //end credentials object
  SERVICENAME.register( credentials );
}; // end logIn
```

This is calling our service function which uses http to connect to our new route:

```
sv.register = function( creds ){
  console.log( 'service creds:', creds );
  $http({
    method: 'POST',
    url: '/register',
    data: creds
  }).then( function( response ) {
    console.log( 'back from auth request with:', response );
  });
}; //end logIn
```

If everything went well, we can now add new users and see that their passwords are the appropriate hash. You never want to save raw password text in a database.

Part 4: login existing users
---

So now that we've got users saved to our db with hashed passwords how do we check their passwords on login?

In your index.js router, make sure bcrypt and our user model are required:

```
var bcrypt = require( 'bcrypt' );
var user = require( '../user' );
```

now we'll update the POST to check the hashed passwords of login attempts if the user exists:

```
router.post( '/', function( req, res ){
  console.log( 'in base url post:', req.body );

  user.findOne( { username: req.body.username }, function( err, user ){
    if( user != undefined ){
      console.log( 'user:', user );
      bcrypt.compare( req.body.password, user.password, function(err, isMatch) {
         if( err ){
           console.log( 'error checking pass' );
           res.sendStatus( 400 );
         }
         else{
           if( isMatch ){
             res.send( user );
           }
           else{
             res.sendStatus( false );
           }
         }
      });
    }
  }); //end find user
}); // end base url post
```
Next, we'll need a login section of the page that will send this route the user's login credentials:

```
<h2>Log In</h2>
<div>
 <input type="text" ng-model='CONTROLLERASNAME.usernameLogin' placeholder="username"/>
 <input type="password" ng-model='CONTROLLERASNAME.passwordLogin' placeholder="password"/>
 <button ng-click='CONTROLLERASNAME.logIn()'>Log In</button>
</div>

```

As usual, we'll need a controller function to handle the click and collect the user info:

```
vm.logIn = function(){
	console.log( 'in controller logIn' );
	var credentials = {
	  username: vm.usernameLogin,
	  password: vm.passwordLogin
	}; //end creds
	MessageBoardService.logIn( credentials ).then( function(){
	  console.log( 'back in controller' );
	});
}; //end
```

and a service function to make the http call to authenticate:

```
sv.logIn = function( credentials ){
    console.log( 'in service logIn:', credentials );
    return $http({
      method: 'POST',
      url: '/',
      data: credentials
    }).then( function( response ){
      console.log( 'back from logIn post with:', response );
    }); //end http
}; // end register
```

If all went well, we'll be able to create new users which get saved in the database with the hashed password & users will be able to log in with their normal password.
