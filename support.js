//-------------Start Facebook API calling support --------------//
 function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    if (response.status === 'connected') {

      testAPI();
    } else if (response.status === 'not_authorized') {
      
      // The person is logged into Facebook, but not your app.
      //document.getElementById('status').innerHTML = 'Please log ' +
        //'into this app.';
    } else {
      
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      //document.getElementById('status').innerHTML = 'Please log ' +
        //'into Facebook.';
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
      document.getElementById('eventsBtn');
      document.getElementById('eventsBtn').classList.remove("disabled");
      var element = document.getElementById("fbBtn");
      element.parentNode.removeChild(element);
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
    //1499711090349840 // UF hackathoners
    //1695957843991327 //ftp


    var count = 0;
    for(var i =0; i<groupIDs.length; i++)
    {
      loadPageEvents(groupIDs[i],function(tempEvents) //store async using callback
      {
        console.log(tempEvents);
        var temp = filterDesc(tempEvents.data)
        totalEvents = totalEvents.concat(temp);
        //TODO add filtering functions 
        count++; 
        if(count == groupIDs.length)
        {
          console.log(totalEvents);
          callBack(totalEvents); // stores it once all are loaded
        }
      }); 
    }
}
//filter data to only show a week out, and nothing before
function filterDate(events)
{
  console.log("filtering by date...");
  var temp = [];
  var current = new Date();
  for(var i=0; i < events.length; i++)
  {
    var eventTime = new Date(events[i].start_time);
    if(current.getTime() <  eventTime.getTime() && eventTime.getTime() < (current.getTime() + 604800000))
    {
      temp.unshift( events[i]);//add to list list
    }
  }
  console.log(temp);
  return temp;
}
//given a keyword in desc filter it based on that.
function filterDesc(events)
{
  var key = "white"; //key that says they do not want to be on the list serve
  console.log("filtering by desc...");
  var temp = [];
  for(var i=0; i < events.length; i++)
  { 
    var addToList = true;
    if(events[i].description != null)
    {
       var desc = events[i].description.split(" ");
      for(var j = 0; j <  desc.length; j++)
      {
        if(desc[j] == key)
        {
            addToList = false; 
        }
      }
      if(addToList)
      {
        temp.unshift( events[i]);
      }
    } 
    else
    {
      temp.unshift( events[i]);
    }  
  }
  //console.log(temp);
  return temp;
}
function generateHTML(){
  console.log("grabbing");
  var temp = document.getElementById("emailPreview").innerHTML
  return temp; 
}
//TODO: add function for filtering by date
//----  fix problem of havig to click in order for the events to appear
//----  Test its functionality
//----  Polish, add options for filtering events, add select events
//----  Make beautiful
//----  Add all sigs numbers

//--------------END EVENT SUPPORT---------------//
//------------UI ANGULAR PORTION---------------///
var app = angular.module("main",  ['angularMoment']); 
app.controller("myEmail", function($scope) {
  $scope.greeting = "This is our weekly update, where we keep you up-to-date on upcoming ACM events and happenings. Remember to join the Facebook group UF ACM to stay connected with us and catch even more opportunities!";
  $scope.title = "Hello UFACM!";
  $scope.footer = '<div style="text-align:center;"><a href="http://www.ufacm.com">Website</a><a href="https://www.facebook.com/groups/ufacm/">Facebook Page</a>';
  $scope.getEvents = function() {
    loadAllEvents(function(events){
      $scope.events = events;
      console.log("Events:"); 
      console.log($scope.events);
      $scope.$apply();
      $scope.generatedCode = generateHTML();
      $scope.$apply();
    });
    
  };
  $scope.updateCode =function(){
      console.log("updating codebase...");
      setTimeout(function(){// used to delay for actual html being changed before getting posted 
        $scope.generatedCode = generateHTML();
        console.log("pushing:");
        $scope.$apply();
       }, 0);

      console.log("moving on");
  }

    

  $scope.generatedCode = generateHTML();
});

app.filter("trust", ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
}]);
    


