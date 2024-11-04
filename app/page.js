"use client"
import Image from "next/image";
import { useEffect , useState } from "react";
import { messaging } from "./lib/firebaseConfig"
import {getToken , onMessage } from "firebase/messaging"

export default function Home() {

  const [token, setToken] = useState(null);

async function requestPermission(){
  const permission = await Notification.requestPermission();
  if(permission === 'granted'){
    const token1 = await getToken(messaging, {vapidKey:'BOjJVfx5XTZYSnq96m7XCyJuRS9xfQO4hwOYiXHt0yf1HRArKs6Xrun8w18_rFFzLoBat8sOC_DUIvloZ4WJjas'})
    console.log("Token gen",token1);
    setToken(token1);
  }
  else if(permission==='denied'){
    alert("You denied this notification");
  }
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}


useEffect(()=>{
requestPermission();

   // Listen for messages when the app is in the foreground
   onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    // Show a notification if the app is in the foreground
    const notificationTitle = payload.notification.title || 'Notification';
    const notificationOptions = {
      body: payload.notification.body || 'You have a new message.',
      icon: '/path-to-your-icon.png', // Update the path to your actual icon
    };

    new Notification(notificationTitle, notificationOptions);
  });

},[])

  return (
   <>

   {token}
   </>
  );
}
