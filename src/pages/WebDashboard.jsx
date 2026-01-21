import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from '@supabase/supabase-js';

const WebDashboard = () => {
  const [activeMatchId, setActiveMatchId] = useState(1);
  const [profileData, setProfileData] = useState({
    name: '',
    uid: '',
    cover_url: '',
    profile_url: '',
    reg_status: 'on'
  });
  const [matchData, setMatchData] = useState({
    time: '',
    date: '',
    slots_left: 12,
    banner_url: '',
    rules: ''
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Supabase Client
  const supabase = createClient(
    "https://psiypllbqopudppugaxe.supabase.co",
    "sb_publishable_PsL-7tSFu4EQU5ZHQgO6UA_Segl7g_e"
  );

  // Initialize data
  useEffect(() => {
    initializeData();
  }, []);

  // Load match data when active match changes
  useEffect(() => {
    if (activeMatchId) {
      loadMatch(activeMatchId);
    }
  }, [activeMatchId]);

  const initializeData = async () => {
    await Promise.all([
      loadProfile(),
      loadMatch(1)
    ]);
    setLoading(false);
  };

  // Load profile settings
  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('kashu_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (data && !error) {
        setProfileData({
          name: data.name || '',
          uid: data.uid || '',
          cover_url: data.cover_url || '',
          profile_url: data.profile_url || '',
          reg_status: data.reg_status || 'on'
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  // Load match data
  const loadMatch = async (matchId) => {
    try {
      const { data, error } = await supabase
        .from('kashu_tournaments')
        .select('*')
        .eq('id', matchId)
        .single();

      if (data && !error) {
        setMatchData({
          time: data.time || '',
          date: data.date || '',
          slots_left: data.slots_left || 12,
          banner_url: data.banner_url || '',
          rules: data.rules || ''
        });
      }
    } catch (error) {
      console.error('Error loading match:', error);
    }
  };

  // Save profile
  const saveProfile = async () => {
    try {
      const updates = {
        name: profileData.name,
        uid: profileData.uid,
        cover_url: profileData.cover_url,
        profile_url: profileData.profile_url
      };

      const { error } = await supabase
        .from('kashu_settings')
        .update(updates)
        .eq('id', 1);

      if (!error) {
        showToastMessage("Profile Updated!");
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      showToastMessage("Error saving profile!");
    }
  };

  // Update registration status
  const updateRegStatusOnly = async (status) => {
    try {
      const { error } = await supabase
        .from('kashu_settings')
        .update({ reg_status: status })
        .eq('id', 1);

      if (!error) {
        setProfileData(prev => ({ ...prev, reg_status: status }));
        showToastMessage(`Registrations are now ${status.toUpperCase() === 'ON' ? 'OPEN' : 'CLOSED'}`);
      }
    } catch (error) {
      console.error('Error updating reg status:', error);
    }
  };

  // Save tournament/match data
  const saveTournament = async () => {
    try {
      const updates = {
        time: matchData.time,
        date: matchData.date,
        slots_left: parseInt(matchData.slots_left) || 12,
        banner_url: matchData.banner_url,
        rules: matchData.rules
      };

      const { error } = await supabase
        .from('kashu_tournaments')
        .update(updates)
        .eq('id', activeMatchId);

      if (!error) {
        showToastMessage(`Match ${activeMatchId} Details Updated!`);
      }
    } catch (error) {
      console.error('Error saving tournament:', error);
      showToastMessage("Error saving tournament!");
    }
  };

  // Toast notification
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Handle input changes for profile
  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  // Handle input changes for match
  const handleMatchChange = (field, value) => {
    setMatchData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <>
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-5 right-5 px-6 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg z-50"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.header 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
          >
            <div>
              <h1 className="text-4xl font-black italic text-orange-500 uppercase tracking-tighter">
                Web Dashboard
              </h1>
              <p className="text-slate-400 text-sm">
                Manage your website settings and tournament details
              </p>
            </div>
            <div className="flex items-center gap-3 glass p-2 rounded-2xl">
              <span className="text-xs font-bold uppercase ml-2 text-slate-400">
                Reg Status:
              </span>
              <select 
                value={profileData.reg_status}
                onChange={(e) => updateRegStatusOnly(e.target.value)}
                className="bg-black/50 text-white border-none rounded-lg px-3 py-1 text-sm font-bold cursor-pointer"
              >
                <option value="on">🟢 OPEN</option>
                <option value="off">🔴 CLOSED</option>
              </select>
            </div>
          </motion.header>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* GLOBAL SETTINGS - LEFT SIDEBAR */}
            <div className="lg:col-span-1 space-y-6">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="glass p-6 rounded-[2rem] border-orange-500/20"
              >
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Main Profile
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">
                      Display Name
                    </label>
                    <input 
                      type="text"
                      value={profileData.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                      className="input-style"
                      placeholder="Enter display name"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">
                      Admin UID
                    </label>
                    <input 
                      type="text"
                      value={profileData.uid}
                      onChange={(e) => handleProfileChange('uid', e.target.value)}
                      className="input-style"
                      placeholder="Enter admin UID"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">
                      Cover Image URL
                    </label>
                    <input 
                      type="text"
                      value={profileData.cover_url}
                      onChange={(e) => handleProfileChange('cover_url', e.target.value)}
                      className="input-style"
                      placeholder="Enter cover image URL"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">
                      Profile Image URL
                    </label>
                    <input 
                      type="text"
                      value={profileData.profile_url}
                      onChange={(e) => handleProfileChange('profile_url', e.target.value)}
                      className="input-style"
                      placeholder="Enter profile image URL"
                    />
                  </div>
                  <button 
                    onClick={saveProfile}
                    className="w-full btn-primary py-4 rounded-2xl shadow-lg shadow-orange-600/20 mt-2"
                  >
                    Save Profile
                  </button>
                </div>
              </motion.div>
            </div>

            {/* TOURNAMENT MANAGEMENT - RIGHT PANEL */}
            <div className="lg:col-span-2">
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="glass p-6 md:p-8 rounded-[2rem] border-blue-500/20"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Match Details
                  </h2>
                  <div className="flex gap-2 w-full md:w-auto">
                    <button 
                      onClick={() => setActiveMatchId(1)}
                      className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${
                        activeMatchId === 1 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      Match 1
                    </button>
                    <button 
                      onClick={() => setActiveMatchId(2)}
                      className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${
                        activeMatchId === 2 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      Match 2
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">
                        Match Time
                      </label>
                      <input 
                        type="text"
                        value={matchData.time}
                        onChange={(e) => handleMatchChange('time', e.target.value)}
                        className="input-style"
                        placeholder="e.g. 09:00 PM"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">
                        Match Date
                      </label>
                      <input 
                        type="text"
                        value={matchData.date}
                        onChange={(e) => handleMatchChange('date', e.target.value)}
                        className="input-style"
                        placeholder="e.g. 25-01-2026"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">
                        Total Squad Slots (Free/Total)
                      </label>
                      <input 
                        type="number"
                        value={matchData.slots_left}
                        onChange={(e) => handleMatchChange('slots_left', e.target.value)}
                        className="input-style"
                        placeholder="12"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">
                        Banner URL
                      </label>
                      <input 
                        type="text"
                        value={matchData.banner_url}
                        onChange={(e) => handleMatchChange('banner_url', e.target.value)}
                        className="input-style"
                        placeholder="Enter banner image URL"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">
                        Rules (Multi-line)
                      </label>
                      <textarea 
                        value={matchData.rules}
                        onChange={(e) => handleMatchChange('rules', e.target.value)}
                        rows="5"
                        className="input-style"
                        placeholder="Enter match rules..."
                      />
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={saveTournament}
                  className="w-full btn-secondary py-4 rounded-2xl shadow-lg shadow-blue-600/20 mt-8"
                >
                  Update Match Info
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline CSS */}
      <style jsx>{`
        .glass {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .input-style {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          width: 100%;
          outline: none;
          transition: all 0.3s;
        }
        .input-style:focus {
          border-color: #f97316;
          box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
        }
        .btn-primary {
          background: linear-gradient(135deg, #f97316, #ea580c);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: white;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(249, 115, 22, 0.3);
        }
        .btn-secondary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          font-weight: 800;
          text-transform: uppercase;
          color: white;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn-secondary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </>
  );
};

// AnimatePresence import
import { AnimatePresence } from "framer-motion";

export default WebDashboard;
