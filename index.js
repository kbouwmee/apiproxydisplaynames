/* Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */


 // MODULES
var request = require("request");
var rp      = require("request-promise");
var readline = require('readline-sync');

// CONSTANTS
var apigeehost = 'api.enterprise.apigee.com';

// FUNCTIONS
function process(username, password, org)
{
    getAPIProxies(username, password, org);
}

function getAPIProxies(u, p, o)
{
    var url = "https://api.enterprise.apigee.com/v1/organizations/"+o+"/apis";
    var auth = 'Basic '+ new Buffer(u +':'+p).toString('base64');
    var headers = {'Host': apigeehost, 'Authorization': auth}; 

    var options = {
		uri: url,
		headers: headers,
		json: true 	
	};

    rp(options).then(function(parsedBody) 
    { 
        parsedBody.forEach(function(e) 
        { 
            getRevs(u, p, o, e)
        })
    });
}

function getRevs(u, p, o, proxy)
{
    var url = "https://api.enterprise.apigee.com/v1/organizations/"+o+"/apis/"+proxy+"/revisions";
    var auth = 'Basic '+ new Buffer(u +':'+p).toString('base64');
    var headers = {'Host': apigeehost, 'Authorization': auth}; 

    var options = {
		uri: url,
		headers: headers,
		json: true 	
	};

    rp(options).then(function(parsedBody) 
    { 
        //parsedBody.forEach(function(e) 
        //{ 
            var max = parsedBody.reduce(function(a, b) {
                return Math.max(a, b);
            });
            getDisplayName(u, p, o, proxy, max)
        //})
    });
}

function getDisplayName(u, p, o, proxy, r) 
{
    var url = "https://api.enterprise.apigee.com/v1/organizations/"+o+"/apis/"+proxy+"/revisions/"+r;
    var auth = 'Basic '+ new Buffer(u +':'+p).toString('base64');
    var headers = {'Host': apigeehost, 'Authorization': auth, 'Accept': 'application/json'}; 

    var options = {
		uri: url,
		headers: headers,
		json: true 	
	};

	rp(options).then(function(parsedBody) { console.log(proxy + " = " + parsedBody.displayName)});
    
}


// MAIN SCRIPT
console.log("=======================");
console.log("API PROXY DISPLAY NAMES");
console.log("=======================");
// read username, password and org
var username = readline.question("Username?     ");
var password = readline.question("Password?     ", {
    hideEchoBack: true // The typed text on screen is hidden by `*` (default).
  });
var org      = readline.question("Organization? ");
console.log("=======================");
console.log("Internal name = Displayname");
console.log("=======================");
process(username, password, org);