import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Plus, UserPlus } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Patients } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { format } from 'date-fns';

export default function DashboardPage() {
  const [patients, setPatients] = useState<Patients[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setIsLoading(true);
    const result = await BaseCrudService.getAll<Patients>('patients');
    setPatients(result.items);
    setIsLoading(false);
  };

  const filteredPatients = patients.filter(patient =>
    patient.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.mobileNumber?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 w-full bg-background">
        <div className="max-w-[100rem] mx-auto px-8 md:px-16 py-16">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="font-heading text-5xl text-secondary mb-3">
                Patient Records
              </h1>
              <p className="font-paragraph text-lg text-secondary">
                Manage and view all patient health records
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground font-paragraph text-base px-8 py-4 hover:bg-accentbluelight transition-colors"
            >
              <UserPlus size={20} />
              ADD NEW PATIENT
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-12">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary" size={20} />
              <input
                type="text"
                placeholder="Search by patient name or mobile number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 border-2 border-secondary font-paragraph text-base text-secondary placeholder:text-secondary/50 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Patients List */}
          <div className="min-h-[400px]">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner />
              </div>
            ) : filteredPatients.length > 0 ? (
              <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {filteredPatients.map((patient, index) => (
                  <motion.div
                    key={patient._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link to={`/patient/${patient._id}`}>
                      <div className="bg-background border-2 border-secondary p-6 hover:border-primary transition-colors h-full">
                        <h3 className="font-heading text-2xl text-secondary mb-4">
                          {patient.patientName || 'Unnamed Patient'}
                        </h3>
                        <div className="space-y-2 font-paragraph text-sm text-secondary">
                          <p><span className="font-semibold">Mobile:</span> {patient.mobileNumber || 'N/A'}</p>
                          <p><span className="font-semibold">DOB:</span> {patient.dateOfBirth ? format(new Date(patient.dateOfBirth), 'MMM dd, yyyy') : 'N/A'}</p>
                          <p><span className="font-semibold">Gender:</span> {patient.gender || 'N/A'}</p>
                          {patient.currentComplications && (
                            <p className="mt-3 pt-3 border-t border-secondary/20">
                              <span className="font-semibold">Current Issues:</span> {patient.currentComplications}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20">
                <p className="font-paragraph text-lg text-secondary">
                  {searchTerm ? 'No patients found matching your search' : 'No patients in the system'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Patient Modal */}
      {showAddForm && (
        <AddPatientModal 
          onClose={() => setShowAddForm(false)} 
          onSuccess={() => {
            setShowAddForm(false);
            loadPatients();
          }}
        />
      )}

      <Footer />
    </div>
  );
}

function AddPatientModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    patientName: '',
    mobileNumber: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    medicalHistory: '',
    currentComplications: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await BaseCrudService.create('patients', {
      _id: crypto.randomUUID(),
      ...formData,
      dateOfBirth: formData.dateOfBirth || undefined
    });

    setIsSubmitting(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-secondary/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8"
      >
        <h2 className="font-heading text-4xl text-secondary mb-6">
          Add New Patient
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-paragraph text-sm text-secondary font-semibold mb-2 block">
                Patient Name *
              </label>
              <input
                type="text"
                required
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="font-paragraph text-sm text-secondary font-semibold mb-2 block">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="font-paragraph text-sm text-secondary font-semibold mb-2 block">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="font-paragraph text-sm text-secondary font-semibold mb-2 block">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-paragraph text-sm text-secondary font-semibold mb-2 block">
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="font-paragraph text-sm text-secondary font-semibold mb-2 block">
              Medical History
            </label>
            <textarea
              value={formData.medicalHistory}
              onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="font-paragraph text-sm text-secondary font-semibold mb-2 block">
              Current Complications
            </label>
            <textarea
              value={formData.currentComplications}
              onChange={(e) => setFormData({ ...formData, currentComplications: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary text-primary-foreground font-paragraph text-base px-8 py-4 hover:bg-accentbluelight transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'ADDING PATIENT...' : 'ADD PATIENT'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-secondary text-secondary-foreground font-paragraph text-base px-8 py-4 hover:bg-secondary/80 transition-colors"
            >
              CANCEL
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
