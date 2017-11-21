var express = require('express');
var bodyParser = require('body-parser');
var Box = require('box-node-sdk');
var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var boxClientID = process.env.boxClientID;
var boxClientSecret = process.env.boxClientSecret;
var privateKey = process.env.boxPrivateKey;
var publicKeyId = process.env.boxKeyID;
var publicKeyPassphrase = process.env.boxKeyPassphrase;
var boxEnterpriseId = process.env.boxEnterpriseId;
var boxUser = process.env.boxUser;

var sdk = new Box({
    clientID: boxClientID,
    clientSecret: boxClientSecret,
    appAuth: {
        keyID: publicKeyId,
        privateKey: privateKey,
        passphrase: publicKeyPassphrase
    }
});

var client = sdk.getAppAuthClient('enterprise', boxEnterpriseId);
client.asUser(boxUser);

app.use('/', function (req, res) {
    client.users.get(client.CURRENT_USER_ID, null, function (err, userResponse) {
      if (err) {
          res.send(err);
      } else {
          res.send(userResponse);
      }
    });
    //res.send('Hello');
});

app.listen(port, function (err) {
    if (err) console.log(err);
    console.log('Server is running on port ' + port);
});