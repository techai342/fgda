import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from '@supabase/supabase-js';

const SquadManager = () => {
  const [activeTab, setActiveTab] = useState('reg');
  const [showLogin, setShowLogin] = useState(true);
  const [squadData, setSquadData] = useState([]);
  const [passwordsData, setPasswordsData] = useState([]);
  const [selectedSquad, setSelectedSquad] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showWebManagerMenu, setShowWebManagerMenu] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', isError: false, show: false });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [filledSlots, setFilledSlots] = useState(0);
  const [loading, setLoading] = useState(false);

  // Supabase Client
  const supabase = createClient(
    "https://psiypllbqopudppugaxe.supabase.co",
    "sb_publishable_PsL-7tSFu4EQU5ZHQgO6UA_Segl7g_e"
  );

  // Check if already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('squadAdminLoggedIn');
    if (isLoggedIn === 'true') {
      setShowLogin(false);
      fetchInitialData();
    }
  }, []);

  // Show status message
  const showStatus = (text, isError = false) => {
    setStatusMessage({ text, isError, show: true });
    setTimeout(() => setStatusMessage({ text: '', isError: false, show: false }), 3000);
  };

  // Login handler
  const handleLogin = () => {
    if (loginForm.username === "admin" && loginForm.password === "squad-admin") {
      localStorage.setItem('squadAdminLoggedIn', 'true');
      setShowLogin(false);
      fetchInitialData();
    } else {
      showStatus("Ghalat Username ya Password!", true);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('squadAdminLoggedIn');
    setShowLogin(true);
    setSquadData([]);
    setPasswordsData([]);
  };

  // Fetch initial data
  const fetchInitialData = async () => {
    setLoading(true);
    await Promise.all([
      fetchRegistrations(),
      fetchPasswords()
    ]);
    setLoading(false);
  };

  // Fetch squad registrations
  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('squad_registrations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      setSquadData(data || []);
      setFilledSlots(data?.length || 0);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      showStatus("Database sync failed!", true);
    }
  };

  // Fetch passwords
  const fetchPasswords = async () => {
    try {
      const { data, error } = await supabase
        .from('squad_auth')
        .select('*')
        .order('user_id');

      if (error) throw error;
      
      setPasswordsData(data || []);
    } catch (error) {
      console.error('Error fetching passwords:', error);
    }
  };

  // Delete single squad
  const deleteSingleSquad = async (authId, squadName) => {
    if (!window.confirm(`Are you sure you want to reset data for Team "${squadName}"?`)) return;

    try {
      const { error } = await supabase
        .from('squad_registrations')
        .delete()
        .eq('auth_user_id', authId);

      if (error) throw error;
      
      showStatus(`${squadName} data reset!`);
      fetchRegistrations();
    } catch (error) {
      showStatus("Delete Failed", true);
    }
  };

  // Update password
  const updatePassword = async (userId, newPassword) => {
    try {
      const { error } = await supabase
        .from('squad_auth')
        .update({ password: newPassword })
        .eq('user_id', userId);

      if (error) throw error;
      
      showStatus(`${userId} Password Updated!`);
      fetchPasswords();
    } catch (error) {
      showStatus("Update Failed", true);
    }
  };

  // Show squad details
  const showSquadDetails = (squad) => {
    setSelectedSquad(squad);
    setShowDetailsModal(true);
  };

  // Reset all data
  const handleResetAll = async () => {
    try {
      const { error } = await supabase
        .from('squad_registrations')
        .delete()
        .neq('id', 0);

      if (error) throw error;
      
      showStatus("All data wiped!");
      fetchRegistrations();
      setShowResetModal(false);
    } catch (error) {
      showStatus("Reset Failed", true);
    }
  };

  // Copy all data
  const copyAllData = () => {
    if (squadData.length === 0) {
      showStatus("No data to copy!", true);
      return;
    }

    let fullReport = "🏆 *KHUSHU ARMY TOURNAMENT REPORT* 🏆\n============================\n\n";
    squadData.forEach((s, index) => {
      fullReport += `*${index + 1}. TEAM: ${s.squad_name.toUpperCase()}*\n👤 *LEADER:* ${s.leader_name.toUpperCase()}\n🆔 *UID:* ${s.leader_uid} | 📱 *WA:* ${s.leader_phone}\n👥 *TEAM:* ${s.p2_name || 'Empty'} (${s.p2_uid || '---'}), ${s.p3_name || 'Empty'} (${s.p3_uid || '---'}), ${s.p4_name || 'Empty'} (${s.p4_uid || '---'})\n🔑 *PORTAL ID:* ${s.auth_user_id}\n----------------------------\n`;
    });

    navigator.clipboard.writeText(fullReport);
    showStatus(`${squadData.length} Squads Data Copied!`);
  };

  // Copy single squad data
  const copySquadDetails = (squad) => {
    const text = `🏆 *SQUAD REGISTRATION* 🏆\n\n*SQUAD:* ${squad.squad_name.toUpperCase()}\n*PORTAL ID:* ${squad.auth_user_id}\n\n👤 *LEADER (P1):* ${squad.leader_name.toUpperCase()}\n🆔 *UID:* ${squad.leader_uid}\n📱 *WA:* ${squad.leader_phone}\n\n👥 *TEAMMATES:*\n• P2: ${squad.p2_name || 'Empty'} (${squad.p2_uid || '---'})\n• P3: ${squad.p3_name || 'Empty'} (${squad.p3_uid || '---'})\n• P4: ${squad.p4_name || 'Empty'} (${squad.p4_uid || '---'})\n\n_Verified by Khushu Army Portal_`;
    
    navigator.clipboard.writeText(text);
    showStatus("Squad Details Copied!");
  };

  // Render player info
  const renderPlayer = (number, name, uid) => (
    <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
        Player {number}
      </p>
      <p className="font-black text-white text-base uppercase">
        {name || 'Empty'}
      </p>
      <p className="text-[11px] text-slate-500 font-bold">
        {uid || '---'}
      </p>
    </div>
  );

  // Login Screen
  if (showLogin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-900/95 p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white/10"
        >
          <h2 className="text-xs font-black text-orange-500 tracking-[0.5em] text-center mb-2 uppercase">
            System Access
          </h2>
          <h2 className="text-3xl font-black text-white mb-8 text-center italic uppercase">
            Admin Login
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={loginForm.username}
              onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
              className="w-full p-5 bg-white/5 border border-white/10 focus:border-orange-500 rounded-2xl outline-none transition-all text-white font-bold"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              className="w-full p-5 bg-white/5 border border-white/10 focus:border-orange-500 rounded-2xl outline-none transition-all text-white font-bold"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button
              onClick={handleLogin}
              className="w-full bg-orange-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-orange-500 active:scale-[0.98] transition-all uppercase tracking-widest mt-4"
            >
              Sign In
            </button>
            {statusMessage.show && statusMessage.isError && (
              <p className="text-red-500 text-center font-bold text-sm">
                {statusMessage.text}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full bg-black z-[-2]">
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-75 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://ik.imagekit.io/shaban/SHABAN-1768843573796_wWUQgJ0Uo.jpg')"
          }}
        />
      </div>

      {/* Status Notification */}
      <AnimatePresence>
        {statusMessage.show && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className={`fixed top-4 left-4 right-4 md:left-auto md:right-5 md:w-80 z-[100] p-6 rounded-[2rem] shadow-2xl text-white font-black text-center backdrop-blur-xl ${
              statusMessage.isError ? 'bg-red-600/90' : 'bg-orange-600/90'
            }`}
          >
            {statusMessage.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="glass-panel text-white p-4 md:p-6 shadow-2xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_#f97316]"></div>
            <h1 className="text-lg md:text-xl font-black tracking-[0.2em] uppercase italic">
              Squad Admin
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Web Manager Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowWebManagerMenu(!showWebManagerMenu)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Web Manager
              </button>
              
              {showWebManagerMenu && (
                <div className="absolute right-0 mt-2 w-48 glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/20 z-50">
                  <a
                    href="https://webmanger.vercel.app/"
                    target="_self"
                    className="block px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-orange-600 hover:text-white transition-all border-b border-white/5"
                  >
                    Web Manager 1
                  </a>
                  <a
                    href="https://webmanger2-v1ed.vercel.app/"
                    target="_self"
                    className="block px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-orange-600 hover:text-white transition-all"
                  >
                    Web Manager 2
                  </a>
                </div>
              )}
            </div>

            <a
              href="https://adminpaymentdasboard.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="hidden md:inline">Payment Manager</span>
            </a>
            
            <button
              onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all border border-red-500/20"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-white/5 mb-10 no-scrollbar">
          <button
            onClick={() => setActiveTab('reg')}
            className={`pb-4 px-8 font-black whitespace-nowrap uppercase tracking-widest text-sm transition-all ${
              activeTab === 'reg' 
                ? 'tab-active border-b-4 border-orange-500 text-orange-500' 
                : 'text-slate-500'
            }`}
          >
            Squad List
          </button>
          <button
            onClick={() => setActiveTab('pass')}
            className={`pb-4 px-8 font-black whitespace-nowrap uppercase tracking-widest text-sm transition-all ${
              activeTab === 'pass' 
                ? 'tab-active border-b-4 border-orange-500 text-orange-500' 
                : 'text-slate-500'
            }`}
          >
            Passwords
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mb-10">
          <div className="glass-panel p-6 rounded-[2rem]">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
              Max Capacity
            </p>
            <p className="text-3xl font-black text-white">12</p>
          </div>
          <div className="glass-panel p-6 rounded-[2rem]">
            <p className="text-orange-500/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
              Filled Slots
            </p>
            <p className="text-3xl font-black text-orange-500">{filledSlots}</p>
          </div>
          <div className="glass-panel p-6 rounded-[2rem] col-span-2 md:col-span-1 border-green-500/20">
            <p className="text-green-500/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
              Database
            </p>
            <p className="text-xl font-black text-green-500">Cloud Online</p>
          </div>
        </div>

        {/* Squad List Tab */}
        {activeTab === 'reg' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-black text-white italic uppercase">
                Registered Teams
              </h2>
              <div className="flex w-full sm:w-auto gap-3">
                <button
                  onClick={copyAllData}
                  className="flex-1 sm:flex-none bg-orange-500 text-white px-6 py-3.5 rounded-2xl font-black hover:bg-orange-400 transition-all text-[11px] uppercase tracking-widest shadow-lg"
                >
                  Copy Detailed List
                </button>
                <button
                  onClick={fetchRegistrations}
                  className="flex-1 sm:flex-none bg-white/5 text-white px-6 py-3.5 rounded-2xl font-black hover:bg-white/10 transition-all text-[11px] uppercase tracking-widest border border-white/10"
                >
                  Refresh
                </button>
                <button
                  onClick={() => setShowResetModal(true)}
                  className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-3.5 rounded-2xl font-black border border-red-500/20 transition-all"
                  title="Reset All Data"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="glass-panel rounded-[2.5rem] overflow-hidden">
              {loading ? (
                <div className="p-20 text-center text-slate-500 font-bold animate-pulse uppercase tracking-[0.2em]">
                  Syncing Database...
                </div>
              ) : squadData.length === 0 ? (
                <div className="p-20 text-center italic text-slate-500 uppercase tracking-widest">
                  No registrations found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-white/5 text-slate-400 text-[11px] uppercase font-black tracking-widest border-b border-white/5">
                      <tr>
                        <th className="p-6">Squad Name</th>
                        <th className="p-6">Leader (P1)</th>
                        <th className="p-6">WhatsApp</th>
                        <th className="p-6">Auth ID</th>
                        <th className="p-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {squadData.map((row) => (
                        <tr key={row.id} className="hover:bg-white/5 transition-colors group">
                          <td className="p-6 font-black text-white text-base">
                            {row.squad_name}
                          </td>
                          <td className="p-6 text-slate-400 font-bold text-sm">
                            {row.leader_name}
                          </td>
                          <td className="p-6 text-orange-500 font-black text-sm">
                            {row.leader_phone}
                          </td>
                          <td className="p-6 font-mono text-[10px] text-slate-600 uppercase tracking-tighter">
                            {row.auth_user_id}
                          </td>
                          <td className="p-6 text-right flex items-center justify-end gap-2">
                            <button
                              onClick={() => showSquadDetails(row)}
                              className="bg-orange-600/10 group-hover:bg-orange-600 text-orange-500 group-hover:text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                              View
                            </button>
                            <button
                              onClick={() => deleteSingleSquad(row.auth_user_id, row.squad_name)}
                              className="bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white p-2.5 rounded-xl transition-all border border-red-500/20"
                              title="Delete Team"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Passwords Tab */}
        {activeTab === 'pass' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-black text-white italic uppercase">
              Access Control
            </h2>
            {loading ? (
              <div className="col-span-full py-20 text-center text-slate-500 uppercase font-black tracking-widest">
                Syncing Access...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {passwordsData.map((item) => (
                  <div key={item.user_id} className="glass-panel p-7 rounded-[2rem]">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                        {item.user_id}
                      </p>
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        defaultValue={item.password}
                        id={`in-${item.user_id}`}
                        className="flex-1 bg-black/40 p-3 border border-white/5 rounded-xl text-sm font-bold text-white outline-none focus:border-orange-500 transition-all uppercase"
                      />
                      <button
                        onClick={() => updatePassword(item.user_id, document.getElementById(`in-${item.user_id}`).value)}
                        className="bg-white/5 hover:bg-orange-600 text-white px-4 rounded-xl text-[10px] font-black uppercase transition-all"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </main>

      {/* Squad Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedSquad && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-white/10 rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 md:p-12 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-10">
                <div>
                  <p className="text-orange-500 text-[10px] font-black uppercase tracking-[0.4em] mb-1">
                    Squad Profile
                  </p>
                  <h3 className="text-3xl font-black text-white italic">
                    {selectedSquad.squad_name}
                  </h3>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="bg-white/5 hover:bg-white/10 p-3 rounded-full text-slate-400"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="col-span-full bg-orange-600/10 p-7 rounded-[2rem] border border-orange-500/20 mb-4">
                  <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">
                    Team Leader (P1)
                  </p>
                  <p className="text-2xl font-black text-white italic uppercase">
                    {selectedSquad.leader_name}
                  </p>
                  <p className="text-sm text-slate-400 mt-1 font-bold">
                    UID: {selectedSquad.leader_uid} | WA: {selectedSquad.leader_phone}
                  </p>
                </div>
                {renderPlayer(2, selectedSquad.p2_name, selectedSquad.p2_uid)}
                {renderPlayer(3, selectedSquad.p3_name, selectedSquad.p3_uid)}
                {renderPlayer(4, selectedSquad.p4_name, selectedSquad.p4_uid)}
              </div>
              <div className="mt-10 pt-8 border-t border-white/5 flex gap-4">
                <button
                  onClick={() => copySquadDetails(selectedSquad)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-xs border border-white/10 transition-all"
                >
                  Copy Team Details
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex items-center justify-center p-4"
            onClick={() => setShowResetModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel border-red-500/30 rounded-[3rem] w-full max-w-sm p-10 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-white mb-2 uppercase">
                Erase All Data?
              </h3>
              <p className="text-slate-500 mb-10 text-sm font-bold">
                Ye amal wapis nahi ho sakta. Tamam registrations delete ho jayengi.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleResetAll}
                  className="w-full bg-red-600 text-white font-black py-5 rounded-2xl shadow-lg hover:bg-red-500 transition-all uppercase tracking-widest text-sm"
                >
                  Yes, Delete Everything
                </button>
                <button
                  onClick={() => setShowResetModal(false)}
                  className="w-full bg-white/5 text-slate-400 font-black py-5 rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest text-sm"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inline CSS */}
      <style jsx>{`
        .glass-panel {
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default SquadManager;
