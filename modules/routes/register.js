var express = require( 'express' );
var router = express.Router();
var bodyParser = require( 'body-parser' );
var user = require( '../user' );
var bcrypt = require( 'bcrypt' );

router.use( bodyParser.urlencoded( { extended: true } ) );
router.use( bodyParser.json() );

router.post( '/', function( req, res ){
  console.log( 'in register post:', req.body );
  // use bcrypt to generate a salt
  bcrypt.genSalt( 12, function( err, salt ){
    if( err ){
      console.log( 'salt err:', err );
      res.sendStatus( 400 );
    } // end error
    else{
      console.log( 'salt:', salt );
      bcrypt.hash( req.body.password, salt, function( err, hash ){
        if( err ){
          console.log( 'hash err:', err );
          res.sendStatus( 400 );
        } //end error
        else{
          console.log( 'hash:', hash );
          // only save hashed password
          var newUser = {
            username: req.body.username,
            password: hash
          };
          console.log( 'saving user:', newUser );
          // save newUser to db
          user( newUser ).save();
          res.sendStatus( 201 );
        } // end no error
      }); // end hash
    } // end no error
  }); // end gen salt
}); //end post

module.exports = router;
