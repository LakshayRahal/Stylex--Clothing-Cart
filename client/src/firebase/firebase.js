// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcIU6159uX-W8flYEYsSQ2zQgkkwK3l6M",
  authDomain: "ecommerce-a696d.firebaseapp.com",
  projectId: "ecommerce-a696d",
  storageBucket: "ecommerce-a696d.firebasestorage.app",
  messagingSenderId: "804325164604",
  appId: "1:804325164604:web:ed6fd7b70d9a62b1b12539",
  measurementId: "G-J3JVSLHQ72"
};



const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
