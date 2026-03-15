import React, { useState } from 'react';
import { Upload, Plus, Trash2, Save, FileSpreadsheet, Stethoscope } from 'lucide-react';
import { parseCandidatesExcel } from '../../utils/excel';

const AdminDashboard = ({ room, onUpdate }) => {
  const [specialties, setSpecialties] = useState([]);
  const [newSpecialty, setNewSpecialty] = useState({ name: '', total_seats: 1 });
  const [candidates, setCandidates] = useState([]);
  const [isImporting, setIsImporting] = useState(false);

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const data = await parseCandidatesExcel(file);
      setCandidates(data);
      alert(`Successfully imported ${data.length} candidates.`);
    } catch (err) {
      console.error(err);
      alert('Error importing Excel file. Please check the format.');
    } finally {
      setIsImporting(false);
    }
  };

  const addSpecialty = () => {
    if (!newSpecialty.name) return;
    setSpecialties([...specialties, { ...newSpecialty, id: Date.now() }]);
    setNewSpecialty({ name: '', total_seats: 1 });
  };

  const removeSpecialty = (id) => {
    setSpecialties(specialties.filter(s => s.id !== id));
  };

  return (
    <div className="admin-container animate-fade-in">
      <div className="section-header">
        <h2>Admin Control Center</h2>
        <p>Manage specialties and import candidate rankings.</p>
      </div>

      <div className="admin-grid">
        {/* Candidate Import Card */}
        <div className="admin-card">
          <div className="card-header">
            <FileSpreadsheet className="text-teal" />
            <h3>Candidate Database</h3>
          </div>
          <div className="card-content">
            <p className="description">Upload the official rankings excel file (e.g., candidates.xlsx).</p>
            <label className="upload-zone">
              <Upload size={32} />
              <span>{isImporting ? 'Processing...' : 'Click to upload Excel'}</span>
              <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} hidden />
            </label>
            {candidates.length > 0 && (
              <div className="stats-badge success">
                {candidates.length} Candidates Loaded
              </div>
            )}
          </div>
        </div>

        {/* Specialty Management Card */}
        <div className="admin-card">
          <div className="card-header">
            <Stethoscope className="text-teal" />
            <h3>Specialty Selection</h3>
          </div>
          <div className="card-content">
            <div className="inline-form">
              <input 
                type="text" 
                placeholder="Specialty Name" 
                value={newSpecialty.name}
                onChange={(e) => setNewSpecialty({...newSpecialty, name: e.target.value})}
              />
              <input 
                type="number" 
                min="1"
                value={newSpecialty.total_seats}
                onChange={(e) => setNewSpecialty({...newSpecialty, total_seats: parseInt(e.target.value)})}
              />
              <button className="btn-icon" onClick={addSpecialty}>
                <Plus size={20} />
              </button>
            </div>

            <div className="specialty-list">
              {specialties.length === 0 ? (
                <p className="empty-state">No specialties added yet.</p>
              ) : (
                specialties.map(s => (
                  <div key={s.id} className="specialty-item">
                    <span className="name">{s.name}</span>
                    <span className="badge">{s.total_seats} Seats</span>
                    <button className="btn-delete" onClick={() => removeSpecialty(s.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="admin-actions">
        <button className="btn-primary">
          <Save size={20} /> Initialize Live Session
        </button>
      </div>

      <style jsx="true">{`
        .admin-container {
          max-width: 1000px;
          margin: 0 auto;
        }
        .section-header {
          margin-bottom: 2rem;
        }
        .section-header h2 {
          font-size: 2rem;
          color: var(--text-main);
        }
        .admin-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        @media (max-width: 768px) {
          .admin-grid { grid-template-columns: 1fr; }
        }
        .admin-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid var(--sterile-gray);
          box-shadow: var(--shadow-sm);
        }
        .card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--sterile-gray);
          padding-bottom: 1rem;
        }
        .card-header h3 {
          font-size: 1.2rem;
          margin: 0;
        }
        .upload-zone {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 2rem;
          border: 2px dashed var(--sterile-gray);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: var(--text-muted);
        }
        .upload-zone:hover {
          border-color: var(--teal-primary);
          background: rgba(13, 148, 136, 0.05);
          color: var(--teal-dark);
        }
        .description {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }
        .inline-form {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .inline-form input {
          padding: 0.6rem;
          border: 1px solid var(--sterile-gray);
          border-radius: 8px;
          outline: none;
        }
        .inline-form input[type="text"] { flex: 2; }
        .inline-form input[type="number"] { flex: 1; }
        .btn-icon {
          background: var(--teal-primary);
          color: white;
          border: none;
          padding: 0.6rem;
          border-radius: 8px;
          cursor: pointer;
        }
        .specialty-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .specialty-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          background: var(--medical-bg);
          border-radius: 8px;
        }
        .specialty-item .name { font-weight: 600; }
        .specialty-item .badge {
          font-size: 0.8rem;
          background: white;
          padding: 0.2rem 0.6rem;
          border-radius: 100px;
          font-weight: 700;
          color: var(--teal-dark);
        }
        .btn-delete {
          background: transparent;
          border: none;
          color: var(--accent-red);
          cursor: pointer;
          opacity: 0.6;
        }
        .btn-delete:hover { opacity: 1; }
        .stats-badge {
          margin-top: 1rem;
          padding: 0.5rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 700;
          text-align: center;
        }
        .stats-badge.success {
          background: rgba(13, 148, 136, 0.1);
          color: var(--teal-dark);
        }
        .admin-actions {
          display: flex;
          justify-content: flex-end;
        }
        .empty-state {
          text-align: center;
          color: var(--text-muted);
          padding: 2rem;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
