global.__base = __dirname + '/';
const functions = require("firebase-functions");

var cats = require(__base + 'cats');

exports.api = functions.https.onRequest((req, res) => {
    return cats.api(req, res);
}); // api
