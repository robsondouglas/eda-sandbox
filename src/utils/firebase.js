// Import the functions you need from the SDKs you need
const { initializeApp }  = require("firebase/app");
const firebaseConfig    = require('./firabase.json');

const app           = initializeApp(firebaseConfig);
const messaging    = app.messaging();


module.exports = messaging;

