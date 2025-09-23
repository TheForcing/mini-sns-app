// src/features/post/components/CreatePostWithUpload.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { db, auth, storage } from "../firebase";
import { useNavigate } from "react-router-dom";

type Attachment = {
  url: string;
  path: string;
  name: string;
  contentType: string | null;
};

const MAX_FILES = 5;
const MAX_FILE_MB = 10; // 파일 1개 최대 10MB (필요시 조정)

const CreatePostWithUpload: React.FC = () => {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // create object URL previews
    const urls = files.map((f) =>
      f.type.startsWith("image/") ? URL.createObjectURL(f) : ""
    );
    setPreviews(urls);

    // cleanup on unmount / files change
    return () => {
      urls.forEach((url) => url && URL.revokeObjectURL(url));
    };
  }, [files]);

  const onFilesSelected = (selected: FileList | null) => {
    if (!selected) return;
    const arr = Array.from(selected);

    // validate count
    if (files.length + arr.length > MAX_FILES) {
      alert(`최대 ${MAX_FILES}개 까지 업로드 가능합니다.`);
      return;
    }

    // validate size
    for (const f of arr) {
      if (f.size > MAX_FILE_MB * 1024 * 1024) {
        alert(`${f.name} 파일이 너무 큽니다. (최대 ${MAX_FILE_MB}MB)`);
        return;
      }
    }

    setFiles((prev) => [...prev, ...arr]);
  };

  // drag & drop handlers
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFilesSelected(e.dataTransfer.files);
  };
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFile = (postId: string, file: File) => {
    return new Promise<Attachment>((resolve, reject) => {
      const safeName = `${Date.now()}_${file.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      )}`;
      const path = `posts/${postId}/${safeName}`;
      const sRef = storageRef(storage, path);
      // metadata: include uploader uid for future rules (optional)
      const metadata = {
        contentType: file.type,
        customMetadata: { uid: auth.currentUser?.uid ?? "" },
      };

      const task = uploadBytesResumable(sRef, file, metadata);

      task.on(
        "state_changed",
        (snapshot) => {
          const pct = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgressMap((prev) => ({ ...prev, [file.name]: pct }));
        },
        (error) => {
          console.error("Upload error", error);
          reject(error);
        },
        async () => {
          try {
            const url = await getDownloadURL(task.snapshot.ref);
            resolve({
              url,
              path,
              name: file.name,
              contentType: file.type || null,
            });
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!content.trim() && files.length === 0) {
      alert("내용 또는 파일을 입력하세요.");
      return;
    }

    setUploading(true);

    try {
      // 1) 먼저 포스트 문서 생성 (attachments는 빈 배열으로 생성)
      const postRef = await addDoc(collection(db, "posts"), {
        content: content.trim(),
        author: {
          uid: auth.currentUser.uid,
          displayName: auth.currentUser.displayName || "익명",
          photoURL: auth.currentUser.photoURL || null,
        },
        authorId: auth.currentUser.uid, // 규칙 호환성
        authorName: auth.currentUser.displayName || "익명",
        createdAt: serverTimestamp(),
        likes: [],
        commentsCount: 0,
        attachments: [],
      });

      // 2) files 업로드 (병렬 처리)
      const attachments: Attachment[] = [];
      for (const file of files) {
        // sequential로 진행해도 되지만, 여기선 하나씩 진행하여 progress를 더 잘 보여줌
        const result = await uploadFile(postRef.id, file);
        attachments.push(result);
      }

      // 3) post 문서에 attachments 업데이트
      if (attachments.length > 0) {
        await updateDoc(doc(db, "posts", postRef.id), { attachments });
      }

      // 4) 완료 처리 (초기화 및 리다이렉트)
      setContent("");
      setFiles([]);
      setProgressMap({});
      alert("게시글이 성공적으로 업로드되었습니다.");
      navigate(`/post/${postRef.id}`);
    } catch (err: any) {
      console.error("게시글 업로드 중 오류:", err);
      alert(err?.message || "업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="무슨 생각을 하고 있나요?"
          className="w-full border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
          disabled={uploading}
        />

        {/* 파일 업로드 영역 */}
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          className="border-2 border-dashed border-gray-200 rounded-lg p-3 transition hover:border-blue-300"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              사진/파일 업로드 (최대 {MAX_FILES}개)
            </div>
            <div>
              <button
                type="button"
                className="px-3 py-1 text-sm bg-gray-100 rounded"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                파일 선택
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => onFilesSelected(e.target.files)}
              />
            </div>
          </div>

          {/* 선택 파일 리스트 / previews */}
          {files.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-3">
              {files.map((f, idx) => (
                <div key={idx} className="border rounded p-2 relative">
                  <div className="h-24 bg-gray-50 rounded overflow-hidden flex items-center justify-center">
                    {f.type.startsWith("image/") && previews[idx] ? (
                      <img
                        src={previews[idx]}
                        alt={f.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="text-xs text-gray-600 text-center">
                        <div className="font-medium">{f.name}</div>
                        <div className="text-xs text-gray-400">
                          {(f.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 파일명 & remove */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-gray-600 truncate max-w-[120px]">
                      {f.name}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="text-red-500 text-xs"
                      disabled={uploading}
                    >
                      삭제
                    </button>
                  </div>

                  {/* 진행률 바 */}
                  {progressMap[f.name] != null && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded h-2">
                        <div
                          className="bg-blue-500 h-2 rounded"
                          style={{ width: `${progressMap[f.name]}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {progressMap[f.name]}%
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setContent("");
              setFiles([]);
              setProgressMap({});
            }}
            className="px-4 py-2 rounded-md bg-gray-100 text-sm"
            disabled={uploading}
          >
            취소
          </button>

          <button
            type="submit"
            disabled={uploading}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              uploading
                ? "bg-gray-300 text-gray-600"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            }`}
          >
            {uploading ? "업로드 중..." : "게시하기"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostWithUpload;
