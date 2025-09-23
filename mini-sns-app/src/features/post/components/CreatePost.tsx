import { useState } from "react";
import { db, storage, auth } from "../../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ImagePlus } from "lucide-react";
import FileUploader from "./FileUploader";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handlePost = async () => {
    if (!content.trim() && !imageFile) return alert("내용을 입력해주세요!");
    setLoading(true);

    try {
      let imageUrl: string | null = null;

      if (imageFile) {
        const imageRef = ref(storage, `posts/${Date.now()}-${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      const user = auth.currentUser;

      await addDoc(collection(db, "posts"), {
        content,
        image: imageUrl,
        authorId: user?.uid,
        authorName: user?.displayName || "익명",
        authorPhoto: user?.photoURL || "https://i.pravatar.cc/40",
        createdAt: serverTimestamp(),
        likes: 0,
        commentsCount: 0,
      });

      setContent("");
      setImageFile(null);
      setPreview(null);
    } catch (err) {
      console.error("게시글 작성 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 border mb-6">
      {/* 상단 영역 */}
      <div className="flex items-start gap-3">
        <img
          src={auth.currentUser?.photoURL || "https://i.pravatar.cc/40"}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="무슨 생각을 하고 계신가요?"
          className="w-full resize-none border-none focus:ring-0 focus:outline-none text-gray-800"
          rows={3}
        />
      </div>

      {/* 이미지 미리보기 */}
      {preview && (
        <div className="mt-3 relative">
          <img
            src={preview}
            alt="preview"
            className="rounded-lg max-h-[300px] object-cover border"
          />
          <button
            onClick={() => {
              setImageFile(null);
              setPreview(null);
            }}
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t">
        <label className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-blue-500">
          <ImagePlus className="w-5 h-5" />
          <span className="text-sm">사진 추가</span>
          <FileUploader onFilesSelected={setFiles} />
        </label>

        <button
          onClick={handlePost}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "게시 중..." : "게시하기"}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
