import * as functions from 'firebase-functions';
import { changeNotification } from './models/notification'; 
import Firebase from './Firebase';
import { DocumentData } from '@google-cloud/firestore';

export const createNotification = functions.https.onRequest((req, res) => {
    

    if(req.method === 'POST'){

        const notifications: changeNotification[] = req.body

        notifications.forEach(x => {
            Firebase.firestore().collection('notifications').add(x).then(() =>{
                console.log(`${x} + added to the database`)
            }).catch((err) =>{
                res.status(400).send(err)
            });
        });

        res.status(201).send('items added to the database')
    }else{
        res.status(405).send("This HTTP Method is not allowed");
    }
});

export const getNotifications = functions.https.onRequest((req, res) => {
    
    if(req.method === 'GET'){
        const uid = req.query.uid;

        if(uid !== null){
            let notifications: DocumentData[] = []
            Firebase.firestore().collection('notifications')
            .where('userid', '==', uid).get().then((data) => {

                if(data.empty){
                    res.status(400).send("no notifications for this user")
                }else{
                    data.forEach(doc => {
                        notifications.push(doc.data())
                    })
                    res.status(200).send(notifications)
                }
            }).catch((err) =>{
                console.log(err)
                res.status(400).send(err)
            })
        }else {
            res.status(400).send("a name is needed.")
        } 
    }else{
        res.status(405).send("This HTTP Method is not allowed");
    }
})

export const editNotification = functions.https.onRequest((req, res) => {
    
    const notification: changeNotification = req.body

    if(req.method === 'PATCH'){
        const nRef = Firebase.firestore().collection('notifications')
        .where('userid', '==', notification.userid)
        .where('jobofferid', '==', notification.jobofferid)


        Firebase.firestore().runTransaction(t => {
            return t.get(nRef)
            .then(data => {
                data.forEach(doc => {
                    t.update(doc.ref, {read: true})
                })
            })
        }).then(result => {
            console.log('Transaction Success')
            res.status(200).send('notification updated')
        }).catch(err => {
            console.log(err)
            res.status(500).send('Something went wrong')
        })
    }else{
        res.status(405).send('This HTTP Method is not allowed')
    }
})
