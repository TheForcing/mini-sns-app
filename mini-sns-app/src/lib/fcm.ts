// src/lib/fcm.ts
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { db, firebaseApp, auth } from "../firebase"; // firebaseApp, db, auth가 export 되어 있어야 함
import { doc, updateDoc } from "firebase/firestore";

/**
 * requestFcmToken: 사용자에게 권한 요청 후 토큰을 획득하고 users/{uid}.fcmToken에 저장
 * - vapidKey: Firebase 콘솔 -> Cloud Messaging -> 웹 구성에서 복사
 */
export async function requestFcmToken(vapidKey: string) {
  try {
    const messaging = getMessaging(firebaseApp);
    const token = await getToken(messaging, { vapidKey });
    if (!token) return null;

    const user = auth.currentUser;
    if (user) {
      // Firestore에 토큰 저장
      await updateDoc(doc(db, "users", user.uid), { fcmToken: token }).catch(
        async (e) => {
          // docs 없으면 set 또는 retry
          // 단순 로깅
          console.warn("fcm token save fail", e);
        }
      );
    }
    return token;
  } catch (err) {
    console.error("FCM token request error:", err);
    return null;
  }
}

/**
 * listenForegroundMessages: 앱 포그라운드에서 푸시를 수신할 때의 콜백
 */
export function listenForegroundMessages(cb: (payload: any) => void) {
  try {
    const messaging = getMessaging(firebaseApp);
    onMessage(messaging, (payload) => {
      cb(payload);
    });
  } catch (e) {
    console.warn("onMessage init failed", e);
  }
}
