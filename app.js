// This example uses an expressjs web app to access the Box nodejs SDK.

var express = require('express');
var bodyParser = require('body-parser');
var Box = require('box-node-sdk');
var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Box app secrets stored as environment variables.
var boxClientID = process.env.boxClientID;
var boxClientSecret = process.env.boxClientSecret;
var privateKey = process.env.boxPrivateKey;
var publicKeyId = process.env.boxKeyID;
var publicKeyPassphrase = process.env.boxKeyPassphrase;
var boxEnterpriseId = process.env.boxEnterpriseId;
var boxUser = process.env.boxUser;

// Set the sdk up - https://github.com/box/box-node-sdk/#app-auth-client
var sdk = new Box({
    clientID: boxClientID,
    clientSecret: boxClientSecret,
    appAuth: {
        keyID: publicKeyId,
        privateKey: privateKey,
        passphrase: publicKeyPassphrase
    }
});

// Create a client.
var client = sdk.getAppAuthClient('enterprise', boxEnterpriseId);
// Set the managed user to impersonate - https://developer.box.com/reference/as-user#as-user-1
client.asUser(boxUser);

// Create an index route for the express application.
app.use('/', function (req, res) {
    // Execute a Box API call when the index route is requested.
    client.users.get(client.CURRENT_USER_ID, null, function (err, userResponse) {
      if (err) {
          res.send(err);
      } else {
          res.send(userResponse); // This returns the raw JSON from Box's API.
      }
    });
});

app.listen(port, function (err) {
    if (err) console.log(err);
    console.log('Server is running on port ' + port);
});