    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
    import { getFirestore, collection, addDoc, getDocs, doc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
    import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries
  
    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyD7o35jWsWjL2Ztuv9TK8C8V1duI6h_yoQ",
      authDomain: "puzzlegame-a3cec.firebaseapp.com",
      projectId: "puzzlegame-a3cec",
      storageBucket: "puzzlegame-a3cec.firebasestorage.app",
      messagingSenderId: "397914192255",
      appId: "1:397914192255:web:c88ef2b21590fd0f34c24a"
    };
  
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    signInAnonymously(auth).then(() => {
        // Signed in..
        console.log('Signed in');
    }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });

function DatabaseCall(SaveScoreToDatabase, name, mistakes, finished) {
    onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        console.log('User is signed in');

        // Add a new document with a generated id.
        console.log("IMPORTANT" + SaveScoreToDatabase);
        if (SaveScoreToDatabase == 1) {
            addDoc(collection(db, "spellingbee"), {
                uid: uid,
                name: name.value,
                mistakes: mistakes,
                finishedWords: finished,
                lettersPerSecond: lps.textContent,
            }).then(() => {
                console.log("Document written with ID: ", uid);
            }).catch((error) => {
                console.error("Error adding document: ", error);
            });
        }

        const usersSnapshot = await getDocs(collection(db, "spellingbee"));
        const leaderboardList = document.getElementById('leaderboard-list');
        leaderboardList.innerHTML = '';

for (const userDoc of usersSnapshot.docs) {
const userDocRef = doc(db, "spellingbee", userDoc.id);
const subcollectionSnapshot = await getDocs(collection(userDocRef, "knownSubcollectionName"));

const userData = userDoc.data();
const userName = userData.name;
const userMistakes = userData.mistakes;
const userFinishedWords = userData.finishedWords;
const userLPS = userData.lettersPerSecond;
const listItem = document.createElement('li');
listItem.innerHTML = `<span id="lspam">${userName}</span><span id="lspam">${userMistakes}</span><span id="lspam">${userFinishedWords}</span><span id="lspam">${userLPS}</span>`;
listItem.setAttribute('data-user-score', userFinishedWords);
await console.log(listItem.getAttribute('data-user-score'));
leaderboardList.appendChild(listItem);

}
await sortList();

function sortList() {
var list, i, switching, b, shouldSwitch;
list = document.getElementById("leaderboard-list");
switching = true;
/* Make a loop that will continue until
no switching has been done: */
while (switching) {
// start by saying: no switching is done:
switching = false;
b = list.getElementsByTagName("LI");
// Loop through all list-items:
for (i = 0; i < (b.length - 1); i++) {
  // start by saying there should be no switching:
  shouldSwitch = false;
  /* check if the next item should
  switch place with the current item: */
  console.log(b[i].getAttribute('data-user-score'));
  console.log(b[i + 1]);
  if (Number(b[i].getAttribute('data-user-score')) < Number(b[i + 1].getAttribute('data-user-score'))) {
    /* if next item is numerically
    lower than current item, mark as a switch
    and break the loop: */
    shouldSwitch = true;
    break;
  }
}
if (shouldSwitch) {
  /* If a switch has been marked, make the switch
  and mark the switch as done: */
  b[i].parentNode.insertBefore(b[i + 1], b[i]);
  switching = true;
}
}
}

    } else {
        console.log('Firebase had a small error');
    }
})};
window.DatabaseCall = DatabaseCall;
DatabaseCall(0);
