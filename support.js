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
  js.src = "http://connect.facebook.net/en_US/sdk.js";
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
function loadPageEvents(groupID, callback) {
  FB.getAuthResponse();
  FB.api(
  '/' + groupID +'/events',
  'GET',
  {},
  function(res) {
    //console.log("ASYNC call made");
    var events = res.data;
    //console.log(events);
    callback(events);
  });
}
//loads all the events from all the sigs
function loadAllEvents(callback)
{
  var groupIDs = [];

  groupIDs.push("494011427297346"); //ACM
  groupIDs.push("1050011381726686");//GatorVR
  groupIDs.push("1499711090349840"); // UF hackathoners
  groupIDs.push("1695957843991327"); //ftp
  groupIDs.push("1117503371616849"); // AI
  groupIDs.push("1831203810447278"); // ftg
  groupIDs.push("99733850610"); // UF Programming team
  groupIDs.push("420010478012940");// SEC
  groupIDs.push("271624353233715"); //DAS
  groupIDs.push("171633596576554"); //SIT
  groupIDs.push("162833737423706"); // Open source Club

  // collect all events together into a single array
  var events = [];

  var count = 0;

  console.log("loading events");
  // This is happening asynchronously, so run callback once all results gathered
  for (var i = 0; i < groupIDs.length; i++) {
    loadPageEvents(groupIDs[i], function(pageEvents) {
      var filtered = pageEvents.filter(checkEvent);
      events = events.concat(filtered);
      count++;
      if (count == groupIDs.length) {
        // Sort the events
        events = events.sort(function(a, b) {
          if (moment(a.start_time).isBefore(moment(b.start_time))) {
            return -1;
          }
          if (moment(a.start_time).isAfter(moment(b.start_time))) {
            return 1;
          }
          return 0;
        });

        callback(events);
      }
    });
  }
}

// Returns true if the event occurs within 7 days, else false
function checkEventTime(eventStart) {
  var now        = moment();
  var today      = now.startOf('day');
  var nextWeek   = moment(today).add(7,'days');
  var eventStart = moment(eventStart);

  return now.isBefore(eventStart) && eventStart.isBefore(nextWeek);
}

// return true if the description contains the keyword, else false
function checkEventKeyword(description, key) {
  console.log(description);
  if (!description)  return false;
  var words = description.split(" ");

  for (var i = 0; i < words.length; i++) {
     if (words[i] == key) {
       return true;
     }
  }

  return false;
}

// Returns true to include event in the listing, else false
function checkEvent(evnt) {
  var privateKeyword = "iiiiiiiiii"
  // Filter out bad events
  if (!checkEventTime(evnt.start_time)
      || checkEventKeyword(evnt.description, privateKeyword)) {
    return false;
  }

  return true;
}

function getPreviewHTML() {
  return document.getElementById("emailPreview").innerHTML;
}

//--------------END EVENT SUPPORT---------------//
//------------UI ANGULAR PORTION---------------///
var app = angular.module("main",  ['angularMoment']);

app
.controller("myEmail", function($scope) {
  $scope.greeting = "<link href='https://fonts.googleapis.com/css?family=Roboto:400,200,300' rel='stylesheet' type='text/css'><style>.event{margin: 1em 0em;}p{font-family: 'Roboto', sans-serif;margin-bottom: 0.75em}h1{font-family: 'Roboto', sans-serif;font-weight: 300;}h2{font-family: 'Roboto', sans-serif;font-weight: 400; margin-bottom: 0.75em;}h3{font-family: 'Roboto', sans-serif;font-weight: 100; margin-bottom:.75em}</style>This is our weekly update, where we keep you up-to-date on upcoming ACM events and happenings. Remember to join the Facebook group UF ACM to stay connected with us and catch even more opportunities!";
  $scope.title = "Hello UFACM!";
  $scope.footer = '<div style="text-align:center; margin-top:1em"><a href="http://www.ufacm.xyz" style="margin-right:2em">Our Website</a><a href="https://www.facebook.com/groups/ufacm/">Facebook Page</a></div>';
  $scope.generatedCode = getPreviewHTML();

  // The directive needs to be able to hook into this method
  $scope.getEvents = function(callback) {
    loadAllEvents(function(events) {
      // Sort the events pulled from Facebook
      $scope.events = events;
      console.log("sorted events.");
      console.log(events);
      callback();
    });
  };

  $scope.updateCode = function() {
    $scope.generatedCode = getPreviewHTML();
  };
})
.directive('eventFetcher', function() {
  return {
    restrict: 'A',
    scope: false,
    link: function(scope, elm, attrs) {
      elm.bind('click', function(e) {
        console.log("Hello")
        // Update the events in the DOM
        scope.getEvents(function() {
          scope.$apply();
          // Update the code for the preview
          scope.updateCode();
          scope.$apply();
        });
      });
    }
  };
});

app.filter("trust", ['$sce', ($sce) => {
  return (htmlCode) => {
    return $sce.trustAsHtml(htmlCode);
  }
}]);
