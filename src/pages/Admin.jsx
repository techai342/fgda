import { useEffect } from "react";

export default function Admin() {
  useEffect(() => {
    // HTML content inject karna agar zaroorat ho
    // Ya phir iframe mein load karna
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-cyan-400">Admin Dashboard</h1>
        
        {/* Iframe ya phir direct HTML embed */}
        <div className="border border-cyan-500 rounded-xl overflow-hidden">
          <iframe 
            src="/admin.html" 
            title="Admin Portal"
            className="w-full h-[80vh] border-0"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>
        
        <div className="mt-4 text-sm text-gray-400">
          <p>Admin portal loaded in iframe. For full functionality, consider integrating directly with React.</p>
        </div>
      </div>
    </div>
  );
}
