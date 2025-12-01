/**
 * ═══════════════════════════════════════════════════════════════
 * FIREBASE CONFIGURATION
 * ═══════════════════════════════════════════════════════════════
 */

const firebaseConfig = {
  apiKey: "AIzaSyCTzKnW3F2xONaSjnnkHZI0JRs_Z9Dq2VQ",
  authDomain: "nicolas-portfolio-eaf2e.firebaseapp.com",
  projectId: "nicolas-portfolio-eaf2e",
  storageBucket: "nicolas-portfolio-eaf2e.firebasestorage.app",
  messagingSenderId: "516157460066",
  appId: "1:516157460066:web:4d865df2ef87b6aece0b3b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

console.log('✅ Firebase initialisé');
