import { useEffect, useState } from "react";

export default function AdminPortal() {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    // Admin HTML ko fetch karen
    fetch("/admin.html")
      .then(res => res.text())
      .then(data => {
        // Supabase credentials ko secure tarike se handle karein
        const processed = data
          .replace('const SB_URL = "https://psiypllbqopudppugaxe.supabase.co"', 
                   `const SB_URL = "${import.meta.env.VITE_SUPABASE_URL || 'YOUR_URL'}"`)
          .replace('const SB_KEY = "sb_publishable_PsL-7tSFu4EQU5ZHQgO6UA_Segl7g_e"',
                   `const SB_KEY = "${import.meta.env.VITE_SUPABASE_KEY || 'YOUR_KEY'}"`);
        setHtmlContent(processed);
      });
  }, []);

  const openInNewTab = () => {
    window.open("/admin.html", "_blank");
  };

  return (
    <div className="p-6">
      <div className="glass p-6 rounded-2xl border border-cyan-500">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">Admin Portal</h2>
        
        <div className="flex gap-4 mb-6">
          <button 
            onClick={openInNewTab}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold hover:shadow-[0_0_20px_cyan] transition"
          >
            🔗 Open Admin in New Tab
          </button>
          
          <a 
            href="https://admindta.vercel.app/" 
            target="_blank"
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-bold hover:shadow-[0_0_20px_orange] transition"
          >
            👥 Open Squad Manager
          </a>
        </div>

        <div className="text-sm text-gray-400">
          <p>Admin portal will open in a new tab for full functionality.</p>
          <p className="mt-2">Ensure Supabase credentials are properly configured in environment variables.</p>
        </div>
      </div>
    </div>
  );
}
