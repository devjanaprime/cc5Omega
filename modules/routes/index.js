var express = require( 'express' );
var router = express.Router();
var path = require( 'path' );
var bodyParser = require( 'body-parser' );
var user = require( '../user' );
var bcrypt = require( 'bcrypt' );

router.use( bodyParser.urlencoded( { extended: true } ) );
router.use( bodyParser.json() );

router.get( '/', function( req, res ){
  console.log( 'base url hit' );
  res.sendFile( path.resolve( 'public/views/index.html' ) );
});

router.post( '/', function( req, res ){
  console.log( 'base url post hit:', req.body );
  user.findOne( { username: req.body.username }, function( err, user ){
    if( err ){
      console.log( 'find user error:', err );
      res.sendStatus( 400 );
    } // end error
    else{
      if( user != undefined ){
        // user found, compare raw text to hash
        console.log( 'comparing:', req.body.password, user.password );
        bcrypt.compare( req.body.password, user.password, function( err, isMatch ){
            if( err ){
              console.log( 'compare error:', err );
              res.sendStatus( 400 );
            }
            else{
              console.log( 'found u!' );
              if( isMatch ){
                res.send( 'hooray' );
              }
              else {
                res.send( 'bummer' );
              }
            }
        }); //end compare
      } //end found user
      else{
        console.log( 'no user found' );
        res.send( 400 );
      }
    } // end no error
  }); //end looking for user
});

module.exports = router;
