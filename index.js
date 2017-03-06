var githubHandles = ["emilyb7", "jsms90", "shiryz", "sofer"];

// TO DO: put your github access token here
var access_token = "";

function createTableRow (user) {
  var tr = document.createElement("tr");
  var values = Object.keys(user);
  var cols = values.map(function(v){
    var td = document.createElement("td");
    td.innerHTML = user[v];
    return td;
  });
  cols.forEach(function(c) {
    tr.appendChild(c);
  });
  return tr;
}

// generic request function takes a url and a callback
function request(url, cb) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      cb(null, xhr.responseText);
    } else {
      console.log("waiting for response");
    }
  };
  xhr.open("GET", url, true);
  xhr.send();
}

// callback: returns an object containing username, full name and number of people following
function getUser(username, cb) {
  var url = "https://api.github.com/users/" + username //+ "?access_token=" + access_token;
  request(url, function(error, data) {
    if (error) {
      console.log(error);
    } else {
      var userObject = JSON.parse(data);
      return cb({
        username: username,
        name: userObject.name,
        following: userObject.following,
      });
    }
  });
}

// TO DO: write a function "getAllUsers" which returns details of all your users
// this function should only return something when all the data has been retrieved from the API!

function getAllUsers(arr, cb) {
  var result = [];
  arr.forEach(function(user) {
    getUser(user, function(obj) {
      result = result.concat([obj]);
      if (result.length === arr.length) {
        cb(result)
      }
    });
  });
}

// TO DO: bonus - make sure the users are sorted in order of the number people they're following
// adapt the final callback below to include this new function!
function sortUsers(arr) {
  return arr.sort(function(a, b) {
    return b.following - a.following;
  })
}

// called when all the data has been retrieved
function finalCallback(arr) {
  var sortedUsers = sortUsers(arr.slice(0));
  var rows = sortedUsers.map(createTableRow);
  rows.forEach(function(r) {
    document.querySelector("table").appendChild(r);
  })
}

getAllUsers(githubHandles, finalCallback);