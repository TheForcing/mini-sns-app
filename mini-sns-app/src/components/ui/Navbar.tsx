import { Link } from "react-router-dom";
import { User } from "firebase/auth";

interface NavbarProps {
  links: { to: string; label: string }[];
  logo: React.ReactNode;
  user: { displayName?: string; photoURL?: string } | null;
  onLogout: () => void;
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  links,
  logo,
  user,
  onLogout,
  onSearch,
}) => {
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector("input") as HTMLInputElement;
    if (input?.value) onSearch(input.value);
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-2 bg-white shadow border-b border-gray-200">
      {/* 🔵 Left: Logo */}
      <div className="flex items-center space-x-4">
        <Link
          to="/"
          className="text-blue-600 font-bold text-2xl hover:opacity-90"
        >
          {logo}
        </Link>
      </div>

      {/* 🟢 Center: Search */}
      <div className="flex-1 flex justify-center px-4">
        <form
          onSubmit={handleSearch}
          className="w-full max-w-md flex items-center bg-gray-100 rounded-full px-3 py-1"
        >
          <input
            type="text"
            placeholder="검색..."
            className="flex-1 bg-transparent outline-none px-2 text-sm"
          />
          <button type="submit" className="text-gray-500 hover:text-gray-700">
            🔍
          </button>
        </form>
      </div>

      {/* 🔴 Right: Links + User */}
      <div className="flex items-center space-x-4">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            {l.label}
          </Link>
        ))}

        {user ? (
          <div className="flex items-center space-x-2">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="프로필"
                className="w-8 h-8 rounded-full object-cover border"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                {user.displayName?.charAt(0) ?? "U"}
              </div>
            )}
            <span className="text-sm font-medium">
              {user.displayName ?? "사용자"}
            </span>
            <button
              onClick={onLogout}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm transition"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Link to="/login" className="text-sm text-blue-600 hover:underline">
              로그인
            </Link>
            <Link
              to="/register"
              className="text-sm text-blue-600 hover:underline"
            >
              회원가입
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
