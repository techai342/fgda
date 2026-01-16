import { useState } from "react";

const images = [
  "https://ik.imagekit.io/shaban/SHABAN-1768573425069_nIPVZQOaT.jpg",
  "https://ik.imagekit.io/shaban/SHABAN-1768573550507_ArSSmUT0tW.jpg",
  "https://ik.imagekit.io/shaban/SHABAN-1768573642529_UEEpMXFEkV.jpg",
  "https://ik.imagekit.io/shaban/SHABAN-1768573647809_L4RIsxMgI.jpg",
  "https://ik.imagekit.io/shaban/SHABAN-1768573652854__LqIeAU47.jpg",
  "https://ik.imagekit.io/shaban/SHABAN-1768573659591_abaSpAF-y.jpg",
  "https://ik.imagekit.io/shaban/SHABAN-1768573669146_5z2ap9EbK.jpg",
  "https://ik.imagekit.io/shaban/SHABAN-1768573674849_RvEzQQfNI.jpg",
  "https://ik.imagekit.io/shaban/SHABAN-1768573679202_aZrkl8hRt.jpg",
  "https://ik.imagekit.io/shaban/SHABAN-1768573689483_NnwuSUKqm.jpg",
  "https://ik.imagekit.io/shaban/SHABAN-1768573697274_CP3034fDP.jpg",
  "https://ik.imagekit.io/shaban/SHABAN-1768573705488_jYpVaM2u0.jpg"
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
