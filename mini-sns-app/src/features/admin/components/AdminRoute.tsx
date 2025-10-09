// src/features/admin/AdminRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";

interface Props {
  children: React.ReactElement;
  fallback?: React.ReactElement;
}

const AdminRoute: React.FC<Props> = ({
  children,
  fallback = <div>로딩 중...</div>,
}) => {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u: User | null) => {
      if (!u) {
        setIsAdmin(false);
        setChecking(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, "users", u.uid));
        const role = snap.exists() ? (snap.data() as any).role : undefined;
        setIsAdmin(role === "admin");
      } catch (err) {
        console.error("admin check error", err);
        setIsAdmin(false);
      } finally {
        setChecking(false);
      }
    });
    return () => unsub();
  }, []);

  if (checking) return fallback;
  if (!isAdmin) return <Navigate to="/feed" replace />;
  return children;
};

export default AdminRoute;
