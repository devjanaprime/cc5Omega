var myApp = angular.module( 'myApp', [] );

myApp.controller( 'MessageBoardController', function( MessageBoardService ){
  var vm = this;
  vm.loggingIn = true;

  vm.getMessages = function(){
    console.log( 'in controller, getMessages');
    MessageBoardService.retrieveMessages().then( function(){
      vm.messages = MessageBoardService.data;
      console.log( 'back in controller with:', vm.messages );
    });
  }; //end getMessages

  vm.logIn = function(){
    console.log( 'in controller logIn' );
    var creds = {
      username: vm.usernameLogin,
      password: vm.passwordLogin
    };
    MessageBoardService.sendLogIn( creds ).then( function(){
      // set name to what was used in login
      vm.name = vm.usernameLogin;
      // clear inputs
      vm.usernameLogin = '';
      vm.passwordLogin = '';
      // use service's loggedIn to manipulate DOM
      vm.hasName = MessageBoardService.loggedIn;
    });
  };

  vm.logOut = function(){
    console.log( 'logging out', vm.name );
    vm.hasName = false;
    vm.name = '';
  };

  vm.register = function(){
    console.log( 'in controller register' );
    // assemble credentialsObject
    var creds = {
      username: vm.usernameRegister,
      password: vm.passwordRegister
    };
    MessageBoardService.sendRegister( creds ).then( function(){
      //clear out inputs when returned from register call
      vm.usernameRegister = '';
      vm.passwordRegister = '';
    }); //end service call
  }; /// end register

  vm.sendMessage = function(){
    // used to toggle name input
    if( !vm.hasName ){
      vm.hasName = true;
    }

    if( vm.body == '' ){
      alert( 'do NOT spam us with your empty messages!!!' );
    } // end empty message
    else{
      // create object to send
      var newMessage = {
        name: vm.name,
        body: vm.body
      }; // end newMessage
      console.log( 'in controller sending:', newMessage );
      MessageBoardService.newMessage( newMessage ).then( function(){
        console.log( 'back in controller after post' );
        vm.getMessages();
        vm.body = '';
      });
    } // end message exxists
  };
  vm.toggleLogin = function(){
    vm.loggingIn = !vm.loggingIn;
  }; // end toggleLogin

});
