// src/features/reactions/ReactionBar.tsx
import { useState } from "react";

const emojis = ["👍", "❤️", "😂", "😮", "😢", "😡"];

interface Props {
  onReact?: (emoji: string) => void;
}

const ReactionBar = ({ onReact }: Props) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [hover, setHover] = useState(false);

  const handleClick = (emoji: string) => {
    setSelected(emoji);
    onReact?.(emoji);
    setHover(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-sm"
      >
        {selected ? selected : "좋아요"}
      </button>

      {hover && (
        <div
          className="absolute bottom-full mb-2 flex gap-2 bg-white border rounded-full shadow-lg p-2"
          onMouseLeave={() => setHover(false)}
        >
          {emojis.map((emoji) => (
            <button
              key={emoji}
              className="text-2xl hover:scale-125 transition"
              onClick={() => handleClick(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReactionBar;
