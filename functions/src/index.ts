import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const createNotification = functions.https.onRequest((request, response) => {
    response.send("This will create notifications for certain users!");
});

export const getNotifications = functions.https.onRequest((request, response) => {
    response.send("this returns all notifications for a user")
})

export const editNotification = functions.https.onRequest((request, response) => {
    response.send("this marks a notification as read")
})
