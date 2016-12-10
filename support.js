//-------------Start Facebook API calling support --------------//
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
//---------------END FACEBOOK SUPPORT ------------------//
//---------------START EVENT SUPPORT -------------------//
//loads a single page based on its code
function loadPageEvents(groupID, callBack)
{
  FB.getAuthResponse();
  FB.api(
  '/' + groupID +'/events',
  'GET',
  {},
  function(res) {
    console.log("ASYNC call made");
    var tempEvents = res;
    console.log(tempEvents);
    callBack(tempEvents);
  });
}
//loads all the events from all the sigs
function loadAllEvents(callBack)
{
    var totalEvents = [];
    var groupIDs = [];
    groupIDs.push("494011427297346"); //ACM 
    groupIDs.push("1050011381726686");//GatorVR
    var count = 0;
    for(var i =0; i<groupIDs.length; i++)
    {
      loadPageEvents(groupIDs[i],function(tempEvents) //store async using callback
      {
        console.log(tempEvents);
        totalEvents = totalEvents.concat(tempEvents.data);
        //TODO add filtering functions 
        count++; 
        if(count == groupIDs.length)
        {
          console.log(totalEvents);
          callBack(totalEvents);
        }
      }); 
    }
}
//filter data to only show a week out, and nothing before
function filterDate(events)
{
  console.log("filtering...");
  var temp = [];
  var current = new Date();
  events = events.data;
  for(var i=0; i < events.length; i++)
  {
    var eventTime = new Date(events[i].start_time);
    if(current.getTime() <  eventTime.getTime() && eventTime.getTime() < (current.getTime() + 604800000))
    {
      temp.unshift( events[i]);
    }
  }
  console.log(temp);
  return temp;
}
//--------------END EVENT SUPPORT---------------//
//------------UI ANGULAR PORTION---------------///
var app = angular.module("main",  ['angularMoment']); 
app.controller("myEmail", function($scope) {
  $scope.greeting = "This is our weekly update, where we keep you up-to-date on upcoming ACM events and happenings. Remember to join the Facebook group UF ACM to stay connected with us and catch even more opportunities!";
  $scope.title = "Hello UFACM!";
  $scope.getEvents = function() {
    loadAllEvents(function(events){
      $scope.events = events; 
      console.log($scope.events);
    });
    
  };
  $scope.generateHTML= function(){
    generateHTML();
  };
});

    


