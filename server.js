// requires
var express = require( 'express' );
var app = express();
var index = require( './modules/routes/index' );
var messages = require( './modules/routes/messages' );
var register = require( './modules/routes/register' );
// uses
app.use( express.static( 'public' ) );
app.use( '/', index );
app.use( '/messages', messages );
app.use( '/register', register );

// globals
var port = process.env.PORT || 8765;

// spin up server
app.listen( port, function(){
  console.log( 'server up on:', port );
}); // end spin up
