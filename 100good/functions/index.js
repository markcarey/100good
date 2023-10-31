global.__base = __dirname + '/';
const functions = require("firebase-functions");

var good = require(__base + 'good');

exports.goodApi = functions.runWith({secrets: ["GOOD_HOT_PRIV"]}).https.onRequest((req, res) => {
    return good.api(req, res);
}); // goodApi

exports.goodNewUser = functions.runWith({secrets: ["GOOD_HOT_PRIV"]}).firestore.document('users/{address}').onCreate((snap, context) => {
    return good.newUser(snap, context);
}); // goodNewUser

exports.goodNewOrUpdatedPost = functions.runWith({secrets: ["GOOD_HOT_PRIV"]}).firestore.document('posts/{id}').onWrite((change, context) => {
    return good.newOrUpdatedPost(change, context);
}); // goodNewOrUpdatedPost

exports.goodNewLike = functions.firestore.document('posts/{postId}/likes/{likeId}').onCreate((snap, context) => {
    return good.newLike(snap, context);
}); // goodNewLike
exports.goodNewComment = functions.firestore.document('posts/{postId}/comments/{commentId}').onCreate((snap, context) => {
    return good.newComment(snap, context);
}); // goodNewComment
exports.goodNewRepost = functions.firestore.document('posts/{postId}/reposts/{repostId}').onCreate((snap, context) => {
    return good.newRepost(snap, context);
}); // goodNewRepost

exports.goodUpdateUser = functions.runWith({secrets: ["GOOD_HOT_PRIV"]}).firestore.document('users/{address}').onUpdate((change, context) => {
    return good.updateUser(change, context);
});

exports.goodCronMint = functions.runWith({secrets: ["GOOD_HOT_PRIV"]}).pubsub.schedule('every 1 minutes').onRun((context) => {
    return good.cronMint(context);
}); // goodCronMint

exports.goodCronDeploy = functions.runWith({secrets: ["GOOD_HOT_PRIV"]}).pubsub.schedule('every 2 minutes').onRun((context) => {
    return good.cronDeploy(context);
}); // goodCronDeploy





