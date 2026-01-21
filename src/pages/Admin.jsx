import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Admin() {
  const [activeTab, setActiveTab] = useState('new');
  const [newRequests, setNewRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simple Admin Dashboard UI
  return (
    <motion.div
      className="min-h-screen bg-black text-white p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="glass p-6 rounded-3xl mb-8 border border-cyan-500">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400 italic uppercase tracking-wider">
                Admin Dashboard
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-sm text-gray-400">System Online</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => window.open("https://admindta.vercel.app/", "_blank")}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl text-white font-bold hover:shadow-[0_0_20px_orange] transition-all flex items-center gap-2"
              >
                <span>👥</span>
                Squad Manager
              </button>
              
              <button 
                onClick={() => window.location.reload()}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition"
              >
                🔄
              </button>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-white/10 mb-8">
          <button
            onClick={() => setActiveTab('new')}
            className={`pb-4 px-2 font-bold ${activeTab === 'new' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500'}`}
          >
            New Requests
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-4 px-2 font-bold ${activeTab === 'history' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500'}`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab('slots')}
            className={`pb-4 px-2 font-bold ${activeTab === 'slots' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500'}`}
          >
            Slot Manager
          </button>
        </div>

        {/* Tab Content */}
        <div className="glass p-6 rounded-2xl border border-white/10">
          {activeTab === 'new' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">New Payment Requests</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Sample Request Cards */}
                <div className="p-4 rounded-xl border border-orange-500/30 bg-black/50">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-white">John Doe</h3>
                    <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded">NEW</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-400">Method: <span className="text-white">Bank Transfer</span></p>
                    <p className="text-gray-400">TRX ID: <span className="text-cyan-400">TRX123456</span></p>
                  </div>
                  <button className="w-full mt-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-bold">
                    Verify Payment
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Payment History</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black/40">
                    <tr>
                      <th className="p-3 text-left">User</th>
                      <th className="p-3 text-left">TRX ID</th>
                      <th className="p-3 text-left">Slot</th>
                      <th className="p-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/10">
                      <td className="p-3">Alice Smith</td>
                      <td className="p-3 text-cyan-400">TRX789012</td>
                      <td className="p-3">A-01</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                          Approved
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'slots' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Slot Management</h2>
              <div className="mb-6 p-4 rounded-xl bg-black/50 border border-green-500/30">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white">Available Slots</h3>
                    <p className="text-sm text-gray-400">Real-time slot status</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-green-500">12</div>
                    <div className="text-sm text-gray-400">out of 50 total</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(slot => (
                  <div key={slot} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-center">
                    <div className="font-bold text-white">Slot {slot}</div>
                    <div className="h-2 w-full bg-green-500 rounded mt-2"></div>
                    <div className="text-xs text-gray-400 mt-1">Available</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 rounded-xl bg-black/50 border border-gray-700">
          <h3 className="font-bold text-white mb-2">📌 Admin Instructions:</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• For full admin panel, click "Squad Manager" button above</li>
            <li>• This is a simplified admin interface</li>
            <li>• Complete admin panel available at: https://admindta.vercel.app/</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
