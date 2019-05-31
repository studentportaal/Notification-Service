import * as functions from 'firebase-functions';
import { changeNotification } from './models/notification'; 
import Firebase from './Firebase';
import { DocumentData } from '@google-cloud/firestore';

export const createNotification = functions.https.onRequest((req, res) => {
    
    res.set('Access-Control-Allow-Origin', '*');

    if(req.method === 'POST'){

        const notifications: changeNotification[] = req.body

        const promises: Promise<any>[] = []
        notifications.forEach(x => {
            promises.push(Firebase.firestore().collection('notifications').add(x))
            Promise.all(promises).then(() =>{
                res.status(201).send('items added to the database')
            }).catch((err) =>{
                res.status(400).send(err)
            });
        });

       
    }else if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', req.header('Access-Control-Request-Headers'));
        res.header('Access-Control-Allow-Methods', req.header('Access-Control-Request-Method'));
        res.status(204).send('');
    }

});

export const getNotifications = functions.https.onRequest((req, res) => {

    res.set('Access-Control-Allow-Origin', '*');
    
    if(req.method === 'GET'){
        const uid = req.query.uid;

        if(uid !== null){
            const notifications: DocumentData[] = []
            Firebase.firestore().collection('notifications')
            .where('userid', '==', uid)
            .get().then((data) => {
                if(data.empty){
                    res.status(204).send('')
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
    }else if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', req.header('Access-Control-Request-Headers'));
        res.header('Access-Control-Allow-Methods', req.header('Access-Control-Request-Method'));
        res.status(204).send('');
    }
})

export const editNotification = functions.https.onRequest((req, res) => {
    
    res.set('Access-Control-Allow-Origin', '*');



    if(req.method === 'PATCH'){

        const notifications: changeNotification[] = req.body

        const promises: Promise<any>[] = []

        notifications.forEach((x) =>{
             const nRef = Firebase.firestore().collection('notifications')
            .where('userid', '==', x.userid)
            .where('jobofferid', '==', x.jobofferid)

            promises.push(Firebase.firestore().runTransaction(t => {
                return t.get(nRef)
                .then(data => {
                    data.forEach(doc => {
                        t.update(doc.ref, {read: true})
                    })
                })
            }))
        })
        Promise.all(promises).then(() => {
            console.log('Transaction Success')
            res.status(200).send('notifications updated')
        }).catch(err => {
            console.log(err)
            res.status(500).send('Something went wrong')
        })
    }else if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', req.header('Access-Control-Request-Headers'));
        res.header('Access-Control-Allow-Methods', req.header('Access-Control-Request-Method'));
        res.status(204).send('');
    }
})
