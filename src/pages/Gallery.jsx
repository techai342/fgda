import { useState } from "react";

const images = [
  "https://via.placeholder.com/300",
  "https://via.placeholder.com/301",
  "https://via.placeholder.com/302",
];

export default function Gallery() {
  const [i, setI] = useState(0);

  return (
    <div className="flex flex-col items-center p-10">
      <img
        src={images[i]}
        className="rounded-full w-64 h-64 border-4 border-purple-500"
      />
      <div className="flex gap-4 mt-4">
        <button onClick={() => setI((i - 1 + images.length) % images.length)}>◀</button>
        <button onClick={() => setI((i + 1) % images.length)}>▶</button>
      </div>
    </div>
  );
}