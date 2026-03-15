import React, { useState, useEffect } from 'react'
import { Stethoscope, Users, LayoutDashboard, Settings, UserCircle } from 'lucide-react'
import AdminDashboard from './features/admin/AdminDashboard'
import SelectionGrid from './features/selection/SelectionGrid'

// --- Mock Data for Testing ---
const MOCK_CANDIDATES = [
  { id: 'u1', name: 'Dr. Mustafa (Rank 1)', score: 92.0, rank: 1 },
  { id: 'u2', name: 'Dr. Amr (Rank 2)', score: 91.6, rank: 2 },
  { id: 'u3', name: 'Dr. Ahmed (Rank 3)', score: 90.5, rank: 3 },
  { id: 'u4', name: 'Dr. Sara (Rank 4)', score: 88.0, rank: 4 },
];

const MOCK_SPECIALTIES = [
  { id: 's1', name: 'Cardiology', total_seats: 1 },
  { id: 's2', name: 'Dermatology', total_seats: 1 },
  { id: 's3', name: 'General Surgery', total_seats: 2 },
  { id: 's4', name: 'Pediatrics', total_seats: 3 },
];

function App() {
  const [view, setView] = useState('welcome');
  const [currentUser, setCurrentUser] = useState(MOCK_CANDIDATES[0]);
  const [selections, setSelections] = useState([]); // Array of { user_id, department_id, user_score, user_name, user_rank }

  // Handle Seat Selection with Cascading Logic
  const handleSelectSeat = (deptId) => {
    if (!deptId) {
      // Release current seat
      setSelections(prev => prev.filter(s => s.user_id !== currentUser.id));
      return;
    }

    // 1. Remove user from any previously held seat
    let newSelections = selections.filter(s => s.user_id !== currentUser.id);

    // 2. Add current user to the new seat
    const newEntry = {
      user_id: currentUser.id,
      department_id: deptId,
      user_name: currentUser.name,
      user_score: currentUser.score,
      user_rank: currentUser.rank
    };

    // 3. Eviction Logic: If the department is now over capacity, 
    // remove the person with the LOWEST score in that department.
    const deptCapacity = MOCK_SPECIALTIES.find(d => d.id === deptId).total_seats;
    const currentOccupants = [...newSelections.filter(s => s.department_id === deptId), newEntry]
      .sort((a, b) => b.user_score - a.user_score);

    if (currentOccupants.length > deptCapacity) {
      const evicted = currentOccupants[currentOccupants.length - 1];
      // Only proceed if the current user isn't the one being evicted 
      // (though UI prevents taking a seat reserved by higher scores)
      newSelections = [
        ...newSelections.filter(s => s.department_id !== deptId), // Remove all from this dept
        ...currentOccupants.slice(0, deptCapacity) // Add back only those within capacity (highest scores)
      ];
      
      if (evicted.user_id === currentUser.id) {
        alert("You cannot take this seat; it is reserved for higher ranking candidates.");
        return;
      }
    } else {
      newSelections.push(newEntry);
    }

    setSelections(newSelections);
  };

  return (
    <div className="app-container">
      <header className="main-header">
        <div className="logo" onClick={() => setView('welcome')} style={{cursor: 'pointer'}}>
          <Stethoscope className="icon-pulse" />
          <h1>Aura<span>Medical</span></h1>
        </div>
        
        {/* Mock User Selector for Testing */}
        <div className="user-switcher">
          <UserCircle size={20} className="text-muted" />
          <select 
            value={currentUser.id} 
            onChange={(e) => setCurrentUser(MOCK_CANDIDATES.find(u => u.id === e.target.value))}
          >
            {MOCK_CANDIDATES.map(u => (
              <option key={u.id} value={u.id}>Testing as: {u.name}</option>
            ))}
          </select>
        </div>

        <nav>
          <button className={`nav-item ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button className={`nav-item ${view === 'admin' ? 'active' : ''}`} onClick={() => setView('admin')}>
            <Settings size={20} /> Admin
          </button>
        </nav>
      </header>

      <main className="main-content">
        {view === 'welcome' && (
          <section className="welcome-hero animate-fade-in">
            <div className="hero-badge">Medical Residency Matching</div>
            <h2>Surgical Precision in Selection.</h2>
            <p>A transparent, high-performance platform for residency matching based on scores and merit.</p>
            <div className="action-group">
              <button className="btn-primary" onClick={() => setView('dashboard')}>Enter Live Session</button>
              <button className="btn-secondary" onClick={() => setView('admin')}>Setup Room (Admin)</button>
            </div>
          </section>
        )}

        {view === 'admin' && <AdminDashboard />}

        {view === 'dashboard' && (
          <div className="dashboard-view animate-fade-in">
            <div className="dashboard-header mb-8">
              <h2>Live Specialty Selection</h2>
              <p>Specialties are shown as "Available" based on your current rank.</p>
            </div>
            
            <SelectionGrid 
              user={currentUser} 
              specialties={MOCK_SPECIALTIES} 
              selections={selections}
              onSelect={handleSelectSeat}
            />
          </div>
        )}
      </main>

      <footer className="main-footer">
        <p>© 2026 AuraMedical Platform. Designed for Surgeons. Real-time Cascading Priority Enabled.</p>
      </footer>

      <style jsx="true">{`
        .user-switcher {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          padding: 0.5rem 1rem;
          border-radius: 100px;
          border: 1px solid var(--sterile-gray);
        }
        .user-switcher select {
          border: none;
          background: transparent;
          font-weight: 700;
          color: var(--teal-dark);
          outline: none;
          cursor: pointer;
        }
        .mb-8 { margin-bottom: 2rem; }
      `}</style>
    </div>
  )
}

export default App
