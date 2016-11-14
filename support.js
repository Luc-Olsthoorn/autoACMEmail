 function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    if (response.status === 'connected') {

      testAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '188955321471151',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.8' // use graph api version 2.8
  });


  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
  }
var events;
function loadEvents()
{

  FB.getAuthResponse();
  FB.api(
  '/494011427297346/events',
  'GET',
  {},
  function(res) {
    events = res;
  });
}
var temp = [];
function filter()
{
  var current = new Date();


  events = events.data;
  for(var i=0; i < events.length; i++)
  {
    console.log("is less than ")
    var eventTime = new Date(events[i].start_time);
    if(current.getTime() <  eventTime.getTime() && eventTime.getTime() < (current.getTime() + 604800000))
    {
      temp.unshift( events[i]);
    }
  }
  console.log("tttt");
  console.log(temp);
}
//------------------------------///
var app = angular.module("main",  ['angularMoment']); 
app.controller("myEmail", function($scope) {
  $scope.greeting = "This is our weekly update, where we keep you up-to-date on upcoming ACM events and happenings. Remember to join the Facebook group UF ACM to stay connected with us and catch even more opportunities!";
  $scope.title = "Hello UFACM!";
  $scope.getEvents = function() {
    loadEvents();
    filter();
    $scope.events = temp;
    console.log($scope.events);
    console.log(events);
  };
  $scope.generateHTML= function(){
    generateHTML();
  };
});

    


