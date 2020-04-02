import firebase from "firebase"; // 4.8.1

// FireBase constructor
class Fire {
  constructor() {
    this.init();
    this.observeAuth();
  }

  // !First lesson end

  // !Secound Lesson start
  // Main initiation
  init = () => {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        //  "Api key"
      });
    }
  };

  // Authorization on press: anonymously
  observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

  // Autorizacijos patikrinimas, prisijungimas anonimiškai
  onAuthStateChanged = user => {
    if (!user) {
      try {
        firebase.auth().signInAnonymously();
      } catch ({ message }) {
        alert(message);
      }
    }
  };

  // Pasiimti kątik prisijungusio vartotojo ID
  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  // Pasiimti vartotojų jau parašytas SMS
  get ref() {
    return firebase.database().ref("messages");
  }

  // Timestamping/laiko nustatymas ant SMS
  parse = snapshot => {
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: _id } = snapshot;
    const timestamp = new Date(numberStamp);
    const message = {
      _id,
      timestamp,
      text,
      user
    };
    return message;
  };

  on = callback =>
    this.ref
      .limitToLast(20)
      .on("child_added", snapshot => callback(this.parse(snapshot)));

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
        timestamp: this.timestamp
      };
      this.append(message);
    }
  };
  // Firebase push to database
  append = message => this.ref.push(message);

  // close the connection to the Backend when message is wrote
  // Ryšio su databasze uždarymas
  off() {
    this.ref.off();
  }
}

Fire.shared = new Fire();
export default Fire;
