"use client";
import { useEffect } from "react";
import axios, { getToken } from "@/lib/axios";

function PushNotificationProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    (async () => {
      const isSubscribed = await navigator.serviceWorker.ready
        .then(async (registration) => {
          const subscription = await registration.pushManager.getSubscription();
          return subscription !== null;
        })
        .catch(() => false);
      const token = await getToken("accessToken");
      if (!isSubscribed && token) await registerAndSubscribe();
    })();
  });

  async function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  async function registerAndSubscribe() {
    try {
      // 1) Register service worker
      if (!("serviceWorker" in navigator))
        throw new Error("Service workers not supported");
      await navigator.serviceWorker.register("/sw.js");

      // 2) Request Notification permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      // 3) Fetch public VAPID key from server
      const {
        data: { publicKey },
      } = await axios.get("/notifications/push/vapid-public-key");
      if (!publicKey) return;

      // 4) Get service worker registration and subscribe
      const registration = await navigator.serviceWorker.ready;
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: await urlBase64ToUint8Array(publicKey),
      };
      const pushSubscription = await registration.pushManager.subscribe(
        subscribeOptions
      );

      // 5) Send subscription to server
      await axios.post("/notifications/push/subscribe", {
        body: JSON.stringify({ subscription: pushSubscription }),
      });

      //   localStorage.setItem("notificationSubscrib", JSON.stringify(data));
    } catch (err) {
      console.error(err);
    }
  }

  return <>{children}</>;
}

export default PushNotificationProvider;
