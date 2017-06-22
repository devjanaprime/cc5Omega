myApp.service( 'MessageBoardService', function( $http ){
  var sv = this;

  sv.retrieveMessages = function(){
    console.log( 'in service, retrieveMessages' );
    return $http({
      method: 'GET',
      url: '/messages'
    }).then( function( response ){
      console.log( 'in service back from server with:', response );
      sv.data = response.data;
    }); // end http
  }; //end retrieveMessages

  sv.sendLogIn = function( credentials ){
    console.log( 'in service sendLogIn' );
    return $http({
      method: 'POST',
      url: '/',
      data: credentials
    }).then( function( response ){
      console.log( 'back from login attempt:', response );
      if( response.data == 'hooray' ){
        console.log( 'logged in!' );
        sv.loggedIn = true;
      } // end logged in
      else{
        sv.loggedIn = false;
      }
    }); // end http
  };

  sv.sendRegister = function( credentials ){
    console.log( 'in service sendRegister' );
    // removed temp data
    return $http({
      method: 'POST',
      url: '/register',
      data: credentials
    }).then( function( response ){
      console.log( 'back from register attempt:', response );
    }); // end http
  };

  sv.newMessage = function( messageObject ){
    console.log( 'in service sending:', messageObject );
    return $http({
      method: 'POST',
      url: '/messages',
      data: messageObject
    }).then( function( response ){
      console.log( 'back from post with:', response );
    }); // end http
  }; // end newMessage
}); //end service
