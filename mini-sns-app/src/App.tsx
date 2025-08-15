// src/App.tsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import NotificationList from "./components/NotificationList";
import FollowList from "./components/FollowList";

function App() {
  const handleLogout = async () => {
    await signOut(auth);
    alert("로그아웃되었습니다.");
  };

  return (
    <BrowserRouter>
      <header className="p-4 border-b mb-4">
        <nav className="max-w-3xl mx-auto flex gap-4">
          <Link to="/">Home</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <button
            onClick={handleLogout}
            className="ml-auto text-sm text-red-500"
          >
            Logout
          </button>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/profile/:id/followers"
            element={<FollowList type="followers" />}
          />
          <Route path="/user/:uid" element={<UserProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/notifications" element={<NotificationList />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
