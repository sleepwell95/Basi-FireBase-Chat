import firebase from 'firebase'; // 4.8.1

// FireBase constructor
class Fire {
  constructor() {
    this.init();
    this.observeAuth();
  }

  // Main initiation
  init = () => {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: 'AIzaSyCS0iryF3w_-4uAUdPF7YJXcG7i04gZyk8',
        authDomain: 'rn-chatapp-7da93.firebaseapp.com',
        databaseURL: 'https://rn-chatapp-7da93.firebaseio.com',
        projectId: 'rn-chatapp-7da93',
        storageBucket: 'rn-chatapp-7da93.appspot.com',
        messagingSenderId: '354433016001',
        appId: '1:354433016001:web:14f191582e94ea076c3440',
        measurementId: 'G-BPJV9H36EW',
      });
    }
  };

  // Authorization on press: anonymously
  observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

  onAuthStateChanged = user => {
    if (!user) {
      try {
        firebase.auth().signInAnonymously();
      } catch ({ message }) {
        alert(message);
      }
    }
  };

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get ref() {
    return firebase.database().ref('messages');
  }

  // Timestamping
  parse = snapshot => {
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: _id } = snapshot;
    const timestamp = new Date(numberStamp);
    const message = {
      _id,
      timestamp,
      text,
      user,
    };
    return message;
  };

  on = callback =>
    this.ref
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }
  // send the message to the Backend
  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        timestamp: this.timestamp,
      };
      this.append(message);
    }
  };

  append = message => this.ref.push(message);

  // close the connection to the Backend when message is wrote
  off() {
    this.ref.off();
  }
}

Fire.shared = new Fire();
export default Fire;
