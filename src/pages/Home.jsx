import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.div
      className="flex flex-col items-center p-10"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <img
        src="https://via.placeholder.com/200"
        className="rounded-full border-4 border-cyan-400 shadow-[0_0_20px_cyan]"
      />
      <h1 className="text-3xl mt-4">Your Name</h1>
      <p className="text-cyan-400">Frontend Developer</p>
    </motion.div>
  );
}