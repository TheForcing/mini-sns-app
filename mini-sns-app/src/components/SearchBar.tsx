import { useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    let q;

    if (search.startsWith("#")) {
      // 해시태그 검색
      const tag = search.replace("#", "").toLowerCase();
      q = query(
        collection(db, "posts"),
        where("hashtags", "array-contains", tag)
      );
    } else {
      // 텍스트 검색 (시작 단어 기준)
      q = query(
        collection(db, "posts"),
        where("content", ">=", search),
        where("content", "<=", search + "\uf8ff")
      );
    }

    const snap = await getDocs(q);
    setResults(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  return (
    <div className="p-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="검색 (#해시태그 가능)"
          className="border p-2 flex-1"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          검색
        </button>
      </div>

      <div className="mt-4">
        {results.map((post) => (
          <div key={post.id} className="p-3 border-b">
            <p>{post.content}</p>
            <div className="flex gap-2 mt-1 text-sm text-blue-500">
              {post.hashtags?.map((tag: string) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
