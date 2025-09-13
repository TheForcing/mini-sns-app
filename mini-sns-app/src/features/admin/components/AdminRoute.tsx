import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

const AdminRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let unsubDoc: (() => void) | undefined;
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setIsAdmin(false);
        setChecking(false);
        return;
      }
      const userRef = doc(db, "users", user.uid);
      unsubDoc = onSnapshot(
        userRef,
        (snap) => {
          const d = snap.data() as any;
          setIsAdmin(Boolean(d?.isAdmin));
          setChecking(false);
        },
        (err) => {
          console.error("AdminRoute: user snapshot error", err);
          setIsAdmin(false);
          setChecking(false);
        }
      );
    });

    return () => {
      unsubAuth();
      if (unsubDoc) unsubDoc();
    };
  }, []);

  if (checking) {
    return <div className="p-6 text-center">권한 확인 중...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
