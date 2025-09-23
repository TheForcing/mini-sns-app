import React, { useState } from "react";

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesSelected }) => {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const fileArr = Array.from(files);

    // 미리보기 생성
    const newPreviews = fileArr.map(
      (file) =>
        file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : "/file-icon.png" // 이미지 아닌 경우 기본 아이콘 표시
    );

    setPreviews(newPreviews);
    onFilesSelected(fileArr);
  };

  return (
    <div className="w-full">
      {/* 업로드 영역 */}
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
      >
        <svg
          className="w-10 h-10 text-gray-400 mb-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 16a4 4 0 01-.88-7.903A5.5 5.5 0 1115.9 6h.1a5 5 0 010 10h-1m-4 4v-6m0 0l-2 2m2-2l2 2"
          />
        </svg>
        <p className="text-gray-600 text-sm">
          사진이나 파일을 드래그하거나 클릭하여 업로드
        </p>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {/* 미리보기 영역 */}
      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {previews.map((src, idx) => (
            <div
              key={idx}
              className="relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center"
            >
              {src.endsWith(".png") || src.startsWith("blob:") ? (
                <img
                  src={src}
                  alt="preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-gray-500 text-sm">파일</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
