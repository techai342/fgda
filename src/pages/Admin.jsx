import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from '@supabase/supabase-js';
const Admin = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [newRequests, setNewRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [freeSlots, setFreeSlots] = useState(0);
  const [totalSlots, setTotalSlots] = useState(0);
  const [loading, setLoading] = useState(true);

  // Supabase Client
  const supabase = createClient(
    "https://psiypllbqopudppugaxe.supabase.co",
    "sb_publishable_PsL-7tSFu4EQU5ZHQgO6UA_Segl7g_e"
  );

  // Real-time subscription
  const subscriptionRef = useRef(null);

  // Initialize
  useEffect(() => {
    initializeData();
    setupRealtime();
    
    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, []);

  // Setup realtime subscription
  const setupRealtime = () => {
    const channel = supabase
      .channel('payment_users_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'payment_users'
      }, async (payload) => {
        console.log('Realtime update:', payload);
        
        if (payload.eventType === 'INSERT' && payload.new.status === 'pending') {
          showNotificationToast();
        }
        
        if (activeTab === 'new') loadNewRequests();
        if (activeTab === 'old') loadHistory();
        if (activeTab === 'slots') {
          loadSlotsGrid();
          updateFreeSlotsCounter();
        }
        
        updateFreeSlotsCounter();
      })
      .subscribe();

    subscriptionRef.current = channel;
  };

  // Initialize all data
  const initializeData = async () => {
    await Promise.all([
      loadNewRequests(),
      loadHistory(),
      loadSlotsGrid(),
      updateFreeSlotsCounter()
    ]);
    setLoading(false);
  };

  // Load new payment requests
  const loadNewRequests = async () => {
    try {
      const { data } = await supabase
        .from('payment_users')
        .select('*')
        .eq('status', 'pending')
        .not('trx_id', 'is', null)
        .order('created_at', { ascending: false });

      if (data) setNewRequests(data);
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  };

  // Load history
  const loadHistory = async () => {
    try {
      const { data: users } = await supabase
        .from('payment_users')
        .select('*')
        .neq('status', 'pending')
        .order('created_at', { ascending: false });

      const slotStatuses = await fetchSlotStatuses();
      const filledMap = {};
      slotStatuses.forEach(s => filledMap[s.id] = s.status);

      if (users) {
        const historyData = users.map(u => {
          const isApproved = u.status === 'approved';
          const assignedId = u.assigned_auth_id;
          let status = 'REJECTED';
          let statusColor = 'text-red-500';

          if (isApproved && assignedId) {
            const slotStatus = filledMap[assignedId];
            if (slotStatus === 'red') {
              status = '🔴 FILLED';
              statusColor = 'bg-red-500/20 text-red-400';
            } else {
              status = '🟡 SENT';
              statusColor = 'bg-yellow-500/20 text-yellow-400';
            }
          }

          return { ...u, displayStatus: status, statusColor, slotStatus: filledMap[assignedId] };
        });

        setHistory(historyData);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  // Fetch slot statuses
  const fetchSlotStatuses = async () => {
    try {
      const { data: auths } = await supabase.from('squad_auth').select('user_id').order('user_id');
      const { data: assigned } = await supabase.from('payment_users').select('assigned_auth_id').eq('status', 'approved');
      const { data: filled } = await supabase.from('squad_registrations').select('auth_user_id');

      const assignedIds = assigned ? assigned.map(a => a.assigned_auth_id) : [];
      const filledIds = filled ? filled.map(f => f.auth_user_id) : [];

      return auths.map(slot => {
        let status = 'green';
        if (assignedIds.includes(slot.user_id)) status = 'yellow';
        if (filledIds.includes(slot.user_id)) status = 'red';
        return { id: slot.user_id, status };
      });
    } catch (error) {
      console.error('Error fetching slots:', error);
      return [];
    }
  };

  // Load slots grid
  const loadSlotsGrid = async () => {
    try {
      const slotData = await fetchSlotStatuses();
      setSlots(slotData);
    } catch (error) {
      console.error('Error loading slots:', error);
    }
  };

  // Update free slots counter
  const updateFreeSlotsCounter = async () => {
    try {
      const { data: auths } = await supabase.from('squad_auth').select('user_id');
      const { data: filled } = await supabase.from('squad_registrations').select('auth_user_id');

      const total = auths ? auths.length : 0;
      const filledCount = filled ? filled.length : 0;
      const free = total - filledCount;

      setTotalSlots(total);
      setFreeSlots(free);
    } catch (error) {
      console.error('Error updating counter:', error);
    }
  };

  // Show notification
  const showNotificationToast = () => {
    setShowNotification(true);
    
    // Play notification sound
    const audio = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3");
    audio.volume = 0.3;
    audio.play().catch(e => console.log("Audio play failed:", e));
    
    setTimeout(() => setShowNotification(false), 5000);
  };

  // Open verification modal
  const openVerify = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setSelectedSlot("");
  };

  // Approve payment
  const approveAction = async () => {
    if (!selectedSlot) {
      alert("Select a slot first!");
      return;
    }

    try {
      const { error } = await supabase
        .from('payment_users')
        .update({ status: 'approved', assigned_auth_id: selectedSlot })
        .eq('id', selectedUser.id);

      if (!error) {
        alert("✅ Payment approved and slot assigned!");
        closeModal();
        loadNewRequests();
        loadSlotsGrid();
        updateFreeSlotsCounter();
      }
    } catch (error) {
      alert("❌ Error approving payment: " + error.message);
    }
  };

  // Reject payment
  const rejectAction = async () => {
    if (!window.confirm("Reject payment?")) return;

    try {
      const { error } = await supabase
        .from('payment_users')
        .update({ status: 'rejected' })
        .eq('id', selectedUser.id);

      if (!error) {
        alert("❌ Payment rejected!");
        closeModal();
        loadNewRequests();
        updateFreeSlotsCounter();
      }
    } catch (error) {
      alert("Error rejecting payment: " + error.message);
    }
  };

  // Reset individual booking
  const resetIndividualBooking = async (userId, authId) => {
    if (!window.confirm(`⚠️ Reset Booking?\n\nThis will delete squad data and reset user to payment screen.`)) return;

    try {
      await supabase.from('squad_registrations').delete().eq('auth_user_id', authId);
      await supabase.from('payment_users').update({
        status: 'new',
        assigned_auth_id: null,
        trx_id: null,
        screenshot_url: null,
        payment_method: null,
        account_name: null
      }).eq('id', userId);

      alert("✅ User booking reset successfully!");
      loadHistory();
      loadSlotsGrid();
      updateFreeSlotsCounter();
      loadNewRequests();
    } catch (error) {
      alert("❌ Error resetting booking: " + error.message);
    }
  };

  // Delete user permanently
  const deletePaymentUser = async (userId, userName) => {
    if (!window.confirm(`🚨 PERMANENT DELETE\n\nDelete "${userName}" permanently?`)) return;

    try {
      const { data: userData } = await supabase
        .from('payment_users')
        .select('assigned_auth_id')
        .eq('id', userId)
        .single();

      if (userData?.assigned_auth_id) {
        await supabase.from('squad_registrations').delete().eq('auth_user_id', userData.assigned_auth_id);
      }

      await supabase.from('payment_users').delete().eq('id', userId);

      alert(`✅ User "${userName}" deleted!`);
      loadHistory();
      loadSlotsGrid();
      updateFreeSlotsCounter();
      loadNewRequests();
    } catch (error) {
      alert("❌ Error deleting user: " + error.message);
    }
  };

  // Reset all slots
  const resetAllSlots = async () => {
    const pin = prompt("🚨 DANGER ZONE - FULL RESET\n\nType 'CONFIRM' to delete ALL data:");
    if (pin !== 'CONFIRM') return;

    try {
      await supabase.from('squad_registrations').delete().neq('id', 0);
      await supabase.from('payment_users').update({
        status: 'new',
        assigned_auth_id: null,
        trx_id: null,
        screenshot_url: null,
        payment_method: null,
        account_name: null
      }).neq('id', 0);

      alert("✅ All slots reset! System fresh.");
      window.location.reload();
    } catch (error) {
      alert("❌ Reset failed: " + error.message);
    }
  };

  // Reset squad data only
  const resetSquadDataOnly = async (authId) => {
    if (!window.confirm(`Clear squad data for slot ${authId}?`)) return;

    try {
      await supabase.from('squad_registrations').delete().eq('auth_user_id', authId);
      alert("✅ Squad data cleared!");
      loadHistory();
      loadSlotsGrid();
      updateFreeSlotsCounter();
    } catch (error) {
      alert("❌ Error clearing data: " + error.message);
    }
  };

  // Render methods
  const renderTabContent = () => {
    switch (activeTab) {
      case 'new':
        return renderNewRequests();
      case 'old':
        return renderHistory();
      case 'slots':
        return renderSlots();
      default:
        return null;
    }
  };

  const renderNewRequests = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {newRequests.length === 0 ? (
        <div className="col-span-full py-20 text-center text-slate-600 font-black uppercase tracking-widest border border-white/5 rounded-3xl">
          No Pending Approvals
        </div>
      ) : (
        newRequests.map((user) => (
          <div key={user.id} className="glass p-6 rounded-[2rem] border-l-4 border-orange-500 hover:bg-white/5 transition group">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-black text-lg text-white uppercase truncate">{user.full_name}</h3>
              <span className="text-[9px] bg-orange-500/20 text-orange-400 px-2 py-1 rounded font-bold">NEW</span>
            </div>
            <div className="space-y-3 mb-6 bg-black/20 p-4 rounded-xl">
              <p className="text-xs text-slate-400 flex justify-between">
                <span>Method:</span> 
                <span className="text-white font-bold">{user.payment_method}</span>
              </p>
              <p className="text-xs text-slate-400 flex justify-between">
                <span>TRX ID:</span> 
                <span className="text-orange-500 font-mono font-bold">{user.trx_id}</span>
              </p>
            </div>
            <button 
              onClick={() => openVerify(user)}
              className="w-full bg-white/10 group-hover:bg-orange-600 hover:text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
            >
              Open Verification
            </button>
          </div>
        ))
      )}
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center glass p-6 rounded-3xl gap-4 border border-red-500/20">
        <div>
          <h3 className="text-white font-black uppercase italic tracking-wider">Danger Zone: Full Tournament Reset</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">⚠️ This will delete ALL registrations and unassign ALL slots.</p>
        </div>
        <button 
          onClick={resetAllSlots}
          className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-900/40"
        >
          🔥 Full Reset (All Slots)
        </button>
      </div>

      <div className="glass rounded-3xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-black/40 text-[10px] font-black uppercase text-slate-400 tracking-wider">
              <tr>
                <th className="p-5">User Name</th>
                <th className="p-5">TRX ID</th>
                <th className="p-5">Assigned Slot</th>
                <th className="p-5">Squad Status</th>
                <th className="p-5">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm font-bold">
              {history.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition border-b border-white/5">
                  <td className="p-5 font-bold text-white">{user.full_name}</td>
                  <td className="p-5 font-mono text-xs text-slate-400">{user.trx_id || '-'}</td>
                  <td className="p-5 font-black text-orange-500">{user.assigned_auth_id || '-'}</td>
                  <td className="p-5 font-black uppercase text-[10px]">
                    <span className={`px-2 py-1 rounded ${user.statusColor}`}>
                      {user.displayStatus}
                    </span>
                  </td>
                  <td className="p-5 flex items-center gap-2">
                    {user.status === 'approved' && user.assigned_auth_id && (
                      <button 
                        onClick={() => resetIndividualBooking(user.id, user.assigned_auth_id)}
                        className="bg-orange-600/20 text-orange-400 px-3 py-1 rounded-lg text-[10px] uppercase hover:bg-orange-600 hover:text-white transition-all mr-2"
                      >
                        Reset Booking
                      </button>
                    )}
                    <button 
                      onClick={() => deletePaymentUser(user.id, user.full_name)}
                      className="text-xs text-slate-500 underline hover:text-red-500"
                    >
                      Delete Record
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSlots = () => (
    <>
      {/* Free Slots Counter */}
      <div className="glass p-6 rounded-3xl mb-8 border border-green-500/20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-white font-black uppercase italic tracking-wider text-lg">Available Slots</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Real-time count of unoccupied slots</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-black text-green-500 text-center">
              <span className={freeSlots > 0 ? 'text-green-500' : 'text-red-500'}>
                {freeSlots}
              </span>
            </div>
            <div className="text-right">
              <div className="text-xs font-black uppercase text-white">Available</div>
              <div className="text-[10px] text-slate-500 font-bold">Out of {totalSlots} Total</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8 glass p-4 rounded-2xl inline-flex">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded shadow-[0_0_10px_#22c55e]"></div>
          <span className="text-[10px] font-black uppercase">Green: Free</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded shadow-[0_0_10px_#eab308]"></div>
          <span className="text-[10px] font-black uppercase">Yellow: Sent (Pending)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded shadow-[0_0_10px_#ef4444]"></div>
          <span className="text-[10px] font-black uppercase">Red: Filled</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {slots.map((slot) => {
          const colorClass = slot.status === 'green' ? 'status-free' : 
                           slot.status === 'yellow' ? 'status-sent' : 'status-filled';
          const label = slot.status === 'green' ? 'Free' : 
                       slot.status === 'yellow' ? 'Sent' : 'Filled';

          return (
            <div key={slot.id} className="glass p-4 rounded-2xl text-center hover:bg-white/5 transition">
              <p className="text-xs font-black text-white mb-2">{slot.id}</p>
              <div className={`slot-bar ${colorClass}`}></div>
              <p className="text-[9px] font-bold uppercase mt-2 opacity-60">{label}</p>
              {(slot.status === 'red' || slot.status === 'yellow') && (
                <button 
                  onClick={() => resetSquadDataOnly(slot.id)}
                  className="mt-2 text-[8px] bg-red-500/20 text-red-400 px-2 py-1 rounded uppercase hover:bg-red-500 hover:text-white w-full transition"
                >
                  Clear Squad Data
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <>
      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full bg-black z-[-2]">
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-80 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://ik.imagekit.io/shaban/SHABAN-1768843573796_wWUQgJ0Uo.jpg')"
          }}
        />
      </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="notification-toast"
          >
            <div className="notification-pulse"></div>
            <span>🎯 New Payment Alert!</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 glass p-6 rounded-3xl shadow-2xl"
        >
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-white italic uppercase tracking-wider">Payment Admin</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">System Online</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="https://admindta.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-manager px-6 py-3 rounded-xl text-white font-black text-xs uppercase tracking-widest flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Squad Manager
            </a>
            <button 
              onClick={() => window.location.reload()}
              className="bg-white/5 hover:bg-white/10 p-3 rounded-xl transition border border-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </motion.header>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-white/10 mb-8 overflow-x-auto pb-1">
          {['new', 'old', 'slots'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 font-black uppercase text-xs whitespace-nowrap transition-all ${
                activeTab === tab 
                  ? 'active-tab border-b-3 border-f97316 text-f97316' 
                  : 'text-slate-500'
              }`}
            >
              {tab === 'new' && 'New Requests'}
              {tab === 'old' && 'History & Reset'}
              {tab === 'slots' && 'Slot Visualizer'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {loading ? (
            <div className="col-span-full py-20 text-center animate-pulse font-bold text-slate-500">
              Loading data...
            </div>
          ) : (
            renderTabContent()
          )}
        </motion.div>
      </div>

      {/* Verification Modal */}
      <AnimatePresence>
        {showModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-5xl p-6 md:p-8 flex flex-col md:flex-row gap-8 overflow-y-auto max-h-[95vh] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Section */}
              <div className="flex-1 bg-black rounded-3xl overflow-hidden border border-white/5 relative group">
                <img 
                  src={selectedUser.screenshot_url} 
                  alt="Payment Screenshot" 
                  className="w-full h-full object-contain"
                />
                <a 
                  href={selectedUser.screenshot_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-all text-white font-bold uppercase text-xs"
                >
                  View Full Size
                </a>
              </div>
              
              {/* Details Section */}
              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-3xl font-black text-white italic uppercase mb-2">Review Payment</h2>
                <p className="text-slate-500 text-xs font-bold uppercase mb-8 border-b border-white/10 pb-4">
                  Verify details before assigning slot
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                    <span className="text-xs text-slate-400 font-black uppercase">Sender Name</span>
                    <span className="font-bold text-white text-lg">{selectedUser.full_name}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                    <span className="text-xs text-slate-400 font-black uppercase">Method</span>
                    <span className="font-bold text-orange-400">{selectedUser.payment_method}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-orange-500/20">
                    <span className="text-xs text-slate-400 font-black uppercase">TRX ID</span>
                    <span className="font-mono font-black text-xl text-orange-500">{selectedUser.trx_id}</span>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-xs font-black text-green-500 uppercase mb-2 tracking-widest">
                    Select Slot to Assign
                  </label>
                  <div className="relative">
                    <select 
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="w-full bg-slate-800 p-4 rounded-xl border border-slate-600 text-white font-bold text-sm focus:border-green-500 outline-none appearance-none"
                    >
                      <option value="">Select a Slot...</option>
                      {slots.map((slot) => {
                        let emoji = '🟢'; let text = 'FREE';
                        if(slot.status === 'yellow') { emoji = '🟡'; text = 'SENT'; }
                        if(slot.status === 'red') { emoji = '🔴'; text = 'FILLED'; }
                        return (
                          <option key={slot.id} value={slot.id}>
                            {emoji} {slot.id} [{text}]
                          </option>
                        );
                      })}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-auto">
                  <button 
                    onClick={approveAction}
                    className="w-full bg-green-600 hover:bg-green-500 py-4 rounded-2xl font-black uppercase text-sm tracking-widest shadow-lg shadow-green-900/30 transition-all"
                  >
                    Confirm & Send Slot
                  </button>
                  <div className="flex gap-3">
                    <button 
                      onClick={rejectAction}
                      className="flex-1 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white py-3 rounded-2xl font-black uppercase text-xs transition-all border border-red-500/20"
                    >
                      Reject Request
                    </button>
                    <button 
                      onClick={closeModal}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 py-3 rounded-2xl font-black uppercase text-xs transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inline CSS for components */}
      <style jsx>{`
        .glass {
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .active-tab {
          border-bottom: 3px solid #f97316;
          color: #f97316;
        }
        .slot-bar {
          height: 8px;
          width: 100%;
          border-radius: 4px;
          margin-top: 6px;
        }
        .status-free {
          background: #22c55e;
          box-shadow: 0 0 10px #22c55e66;
        }
        .status-sent {
          background: #eab308;
          box-shadow: 0 0 10px #eab30866;
        }
        .status-filled {
          background: #ef4444;
          box-shadow: 0 0 10px #ef444466;
        }
        .btn-manager {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          box-shadow: 0 4px 15px rgba(234, 88, 12, 0.3);
          transition: all 0.3s ease;
        }
        .btn-manager:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(234, 88, 12, 0.5);
        }
        .notification-toast {
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: white;
          padding: 16px 24px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(234, 88, 12, 0.5);
          z-index: 1000;
          font-weight: 900;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }
        .notification-pulse {
          width: 10px;
          height: 10px;
          background: #22c55e;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-track {
          background: #0f172a;
        }
      `}</style>
    </>
  );
};

export default Admin;
