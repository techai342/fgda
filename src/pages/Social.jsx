const socials = [
  { name: "Instagram", url: "https://instagram.com" },
  { name: "GitHub", url: "https://github.com" },
];

export default function Social() {
  return (
    <div className="grid grid-cols-2 gap-4 p-10">
      {socials.map(s => (
        <a
          key={s.name}
          href={s.url}
          target="_blank"
          className="p-4 border border-cyan-400 rounded-xl hover:shadow-[0_0_20px_cyan]"
        >
          {s.name}
        </a>
      ))}
    </div>
  );
}