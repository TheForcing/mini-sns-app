import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { formatRelativeTime } from "../utils/time";

const UserProfile = () => {
  const { uid } = useParams();
  const [userData, setUserData] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const userRef = doc(db, "users", uid!);
      const userSnap = await getDoc(userRef);
      setUserData(userSnap.exists() ? userSnap.data() : null);

      const q = query(collection(db, "posts"), where("author.uid", "==", uid));
      const postSnap = await getDocs(q);
      setPosts(postSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    fetchData();
  }, [uid]);

  if (!userData)
    return <p className="text-center mt-4">사용자 정보를 불러오는 중...</p>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="flex items-center space-x-3 mb-4">
        <img
          src={userData.photoURL || "/default-avatar.png"}
          className="w-12 h-12 rounded-full"
        />
        <h2 className="text-xl font-bold">{userData.displayName}</h2>
      </div>

      <h3 className="text-lg font-semibold mb-2">작성한 게시글</h3>
      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.id} className="border p-3 rounded">
            <p className="mb-1">{post.content}</p>
            <span className="text-sm text-gray-500">
              {formatRelativeTime(post.createdAt)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfile;
