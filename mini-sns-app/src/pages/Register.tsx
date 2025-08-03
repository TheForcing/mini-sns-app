import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Register = () => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, pw);
      alert("회원가입 성공!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-2 font-bold">회원가입</h2>
      <form onSubmit={handleRegister} className="space-y-2">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="border p-2 w-full"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          가입하기
        </button>
      </form>
    </div>
  );
};

export default Register;