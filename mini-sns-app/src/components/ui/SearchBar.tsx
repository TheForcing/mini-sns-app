import { useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!search.trim()) return;

    setLoading(true);
    let q;

    if (search.startsWith("#")) {
      // 해시태그 검색
      const tag = search.replace("#", "").toLowerCase();
      q = query(
        collection(db, "posts"),
        where("hashtags", "array-contains", tag)
      );
    } else {
      // 텍스트 검색 (부분 일치)
      q = query(
        collection(db, "posts"),
        where("content", ">=", search),
        where("content", "<=", search + "\uf8ff")
      );
    }

    try {
      const snap = await getDocs(q);
      setResults(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("검색 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* 검색창 */}
      <div className="flex items-center bg-gray-100 rounded-full shadow-sm px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition">
        <span className="text-gray-500 mr-2">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="검색어 입력 (#해시태그 가능)"
          className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
        />
        <button
          onClick={handleSearch}
          className="ml-2 px-5 py-1.5 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
        >
          검색
        </button>
      </div>

      {/* 결과 */}
      <div className="mt-6 space-y-4">
        {loading && <p className="text-gray-500">검색 중...</p>}

        {!loading && results.length === 0 && search && (
          <p className="text-gray-400">검색 결과가 없습니다.</p>
        )}

        {results.map((post) => (
          <div
            key={post.id}
            className="p-4 bg-white rounded-xl shadow hover:shadow-md transition border border-gray-100"
          >
            <p className="text-gray-800">{post.content}</p>
            {post.hashtags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {post.hashtags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
