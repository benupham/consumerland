import IconCache from 'ol/style/iconImageCache';

import {view} from './index.js';

// import firebase from 'firebase';
// import 'firebase/firestore';

// console.log(firebase);
// var config = {
//   apiKey: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCUFgoPiEDHkDo6\n7vhSsi73Yxe9ih3vqzt1Qiy49uiHFEi8HOxeADJ2MJThd7CTJjQRTSUpL38tRR60\nPN0IpEMDl84IIwOFRLyEQItb5qJ/obohVx8aFXgCFld5zKwxna8rd0DvvNQLIkRP\nhCD97L2sIP5M4WBLuzs0j15OBdecjlT450MPlETHvsOb0fQW40OokxOIepmSMR15\nKCr/nthiJQdAJePpNx0D+s3G5PsxmTvO838oLlkeIHkGiRVVABNJbshbiQ/xNdBP\n7okhbciZ1zloY2Nh258f2P/BI2HGz6F1F6K/0ISdMvQNT/J4ot8f/uwiSkjussz5\nRjvbKEKlAgMBAAECggEAAJaFh0awJgPXzQ9jak7thc/LRPrj6Rw0J7utLH8fDDv4\nK2Qu3YD3+3dwV+SM1reXCzEdJt9/VY8JxT4mDRhgKAb+61s1YHEDpAjJ27jFER48\nxXT5mUgg+BG5WsNg6++C2C9oiBjd6T0eznUpWKjCMXb7yTelTCn3XSRrKF4BtswO\nVOcmk5HPiUtOlmX0oJ8GKN+UDmOpF42CCXFfpCZfpDYJtOqgB3hqm9s5v3YWtlZd\nNV9br8dMWONCFKN7NLIJZqBYMrnWPqRB4drS9s1T3R1t8Arm2YWadz0V48GK4lSq\n7vjZS5pmKYTaUt0heYunNy1k4Vp6D1GzcbfMSaJWoQKBgQDEr0PuSNoPbORmfW7g\n5cIAdsDnMxdq+z817x30jM42UP+Y7kiykrZgayhwROLjlxqmFZsm1VFESM2/Bvkm\nSD8mVtFx5UsxBYyHUJPYWrC4S7o67NfGbA7eXrIurgHrP3/NFPOOV8HHTuQIUwcS\neCpKXnQBzLh2wog+mi0A0poZUQKBgQDAvsxj4PrBF6/TQSEQhC7Casm9VgR5XBlz\nE7hVakwqT5T2eyNymMCbKQqw4Is7g8q23s399da0GNIpDxoHwI0cXHvHq68bhBQl\nHmwV1/MChKMFU5QC2+prdaEamCbObDTLzjCbKirwQ2bB1+n0xPcqLhMvluwin6Wx\nukiolWV/FQKBgE4Qsom1aLeOpOj5CDVDfEjq2Y3qfXT83A3wJpeV+5MbexecHEak\nbLbAUYCeFt/2baFWGgrDyEmuC9uyTNmg+0+gTelC9SEz7p8WoFfTRykfBX+12b7r\nzMr+EwLsFd7liThBBJqOwl71NRUIv1nZUA/MhYbhVqXseF9AmnQlIvzBAoGAWvx2\njZuRo38j/+yZyCsty5cPfrJRUFy6osknViLkq4B/yE7er+UN3vDj3BVThJe1JNhO\nk1jurnudEcbQOeKaek3qHJqeAbY6sD8JNNKJI6IrNoN6tlLL+UhA8cXrY7xOu/qs\nlUK1nE+k/VKIXYRxTNcNNYTgGYQVeq1+SR6lF/UCgYBoU4Z8HYWL1USR+zIq3Vyn\n+HHvAzRw/tl5idVJA6RELrsBcnDyIy0Sxl+EY5nOsl0krn3oby9MLRq15yeHivl0\nzTaSEdlk1d6oAEyiOhH5jCVdJ/CwBIyTU8O4rJsCpxs1MoORLyYt12fQLfbkqcWa\nQDnZuw0tPcohMbrBZ5hIAA==\n-----END PRIVATE KEY",
//   authDomain: "consumerland-2bb67.firebaseapp.com",
//   projectId: "consumerland-2bb67"
// };
// const app = firebase.initializeApp(config);
// const db = app.firestore();



/*
* Utilities
* 
*/

// Call to the Express server for locally saved JSON feature data
export const getFeatureJson = function (types) {
  if (typeof types === 'string' ) types = [types];
  const q = types.join(',');
  return fetch('/api?type=' + q, {
    mode: 'no-cors'
  })
  .then(res => res.json())
  .catch(err => console.log(err));   
} 

// Call to Firebase Firestore for database stored JSON feature data
export function getFeaturesFromFirestore(type) {
  const features = [];
  return db.collection(type).get()
  .catch(err => console.log(err));
}



export const iconcache = new IconCache();

export const styleCache = {};

export function textFormatter(str, width, spaceReplacer, maxLength = null) {
  if (maxLength !== null) {
    str = str.length > maxLength ? str.substr(0, maxLength - 1) + '...' : str.substr(0);
  }
  if (str.length > width) {
    var p = width;
    while (p > 0 && (str[p] != ' ' && str[p] != '-')) {
      p--;
    }
    if (p > 0) {
      var left;
      if (str.substring(p, p + 1) == '-') {
        left = str.substring(0, p + 1);
      } else {
        left = str.substring(0, p);
      }
      var right = str.substring(p + 1);
      return left + spaceReplacer + textFormatter(right, width, spaceReplacer, maxLength);
    }
  }
 
  return str;    
}

export const debounce = (fn, time) => {
  let timeout;

  return function() {
    const functionCall = () => fn.apply(this, arguments);
    
    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  }
}

export const dataTool = document.querySelector('#data-tool');

export const flyTo = function (location, done) {
  var duration = 2000;
  var zoom = view.getZoom();
  var parts = 2;
  var called = false;
  function callback(complete) {
    --parts;
    if (called) {
      return;
    }
    if (parts === 0 || !complete) {
      called = true;
      done(complete);
    }
  }
  view.animate({
    center: location,
    duration: duration
  }, callback);
  view.animate({
    zoom: zoom - 1,
    duration: duration / 2
  }, {
    zoom: zoom,
    duration: duration / 2
  }, callback);
}

