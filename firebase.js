const firebase = require('firebase');

let config = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID
};

/*  CONEXÃO FIREBASE */
firebase.initializeApp(config);

module.exports.SignUpWithEmailAndPassword = (email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((user) => {
        return JSON.stringify(user)
    })
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
            return {err: 'The password is too weak.'}
        } else {
          return {err: errorMessage }
        }
        return {err: error}
    });
}

module.exports.SignInWithEmailAndPassword = (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
           .catch(function(error) {
             // Handle Errors here.
             var errorCode = error.code;
             var errorMessage = error.message;
             if (errorCode === 'auth/wrong-password') {
               return {err: 'Wrong password.'}
             } else {
               return {err: errorMessage}
             }
             return {err: error}
           });
   }

   module.exports.InputData = (name) => {
     return firebase.database().ref('users').push({
       name
     })
     .then(function() {
      console.log('Synchronization succeeded');
    })
    .catch(function(error) {
      console.log('Synchronization failed');
    });
   }


   /* CONECTANDO ID */
   module.exports.GetData = () => {
     let data = []
    return firebase.database().ref('users').once('value')
    .then((snapshot) => {
      
      snapshot.forEach((childSnapshot)=>{
        data.push({
          id: childSnapshot.key,
          ...childSnapshot.val() 
        })
      })
      console.log(data)
      return data;
    })
  }
return module.exports