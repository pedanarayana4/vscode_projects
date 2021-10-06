const functions = require("firebase-functions");
const admin = require("firebase-admin");
const logger = functions.logger;
admin.initializeApp();

exports.addMessage = functions.https.onRequest(async (req, res) => {
    const original = req.query.text;
    const writeResult = await admin
        .firestore()
        .collection("messages")
        .add({
            original: original
        });
    logger.log("***********newly added adding message to firestore *****************")
    res.json({
        result: `Message with ID: ${writeResult.id} added.`
    });
});
exports.makeUppercase = functions.firestore.document("/messages/{documentId}")
    .onCreate((snap, context) => {
        // Grab the current value of what was written to Firestore.
        const original = snap.data().original;
        logger.log("Uppercasing", context.params.documentId, original);

        const uppercase = original.toUpperCase();
        logger.log("converted to uppercase")
            logger.log("***********newly added uppercase *****************")

        return snap.ref.set({
            uppercase
        }, {
            merge: true
        });
    });