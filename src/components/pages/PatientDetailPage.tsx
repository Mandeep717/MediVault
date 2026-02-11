import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, FileText, Pill, ClipboardList, CheckCircle2, Circle, Upload } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Patients, TreatmentPlans, Prescriptions, LabReports } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { format } from 'date-fns';
import { Image } from '@/components/ui/image';

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patients | null>(null);
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlans[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescriptions[]>([]);
  const [labReports, setLabReports] = useState<LabReports[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'treatments' | 'prescriptions' | 'labs'>('overview');
  const [showTreatmentForm, setShowTreatmentForm] = useState(false);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showLabReportForm, setShowLabReportForm] = useState(false);

  useEffect(() => {
    loadPatientData();
  }, [id]);

  const loadPatientData = async () => {
    if (!id) return;
    
    setIsLoading(true);
    const patientData = await BaseCrudService.getById<Patients>('patients', id);
    setPatient(patientData);

    const [treatmentsResult, prescriptionsResult, labsResult] = await Promise.all([
      BaseCrudService.getAll<TreatmentPlans>('treatmentplans'),
      BaseCrudService.getAll<Prescriptions>('prescriptions'),
      BaseCrudService.getAll<LabReports>('labreports')
    ]);

    setTreatmentPlans(treatmentsResult.items);
    setPrescriptions(prescriptionsResult.items);
    setLabReports(labsResult.items);
    setIsLoading(false);
  };

  const toggleTaskStatus = async (plan: TreatmentPlans) => {
    const newStatus = plan.currentStatus === 'Completed' ? 'In Progress' : 'Completed';
    setTreatmentPlans(prev => prev.map(p => p._id === plan._id ? { ...p, currentStatus: newStatus } : p));
    
    await BaseCrudService.update('treatmentplans', {
      _id: plan._id,
      currentStatus: newStatus
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="font-paragraph text-lg text-secondary">Patient not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 w-full bg-background">
        <div className="max-w-[100rem] mx-auto px-8 md:px-16 py-16">
          {/* Back Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 font-paragraph text-base text-secondary hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          {/* Patient Header */}
          <div className="bg-primary p-8 mb-8">
            <h1 className="font-heading text-5xl text-primary-foreground mb-4">
              {patient.patientName}
            </h1>
            <div className="grid md:grid-cols-3 gap-6 font-paragraph text-base text-primary-foreground">
              <div>
                <span className="font-semibold">Mobile:</span> {patient.mobileNumber || 'N/A'}
              </div>
              <div>
                <span className="font-semibold">DOB:</span> {patient.dateOfBirth ? format(new Date(patient.dateOfBirth), 'MMM dd, yyyy') : 'N/A'}
              </div>
              <div>
                <span className="font-semibold">Gender:</span> {patient.gender || 'N/A'}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b-2 border-secondary">
            {[
              { id: 'overview', label: 'Overview', icon: FileText },
              { id: 'treatments', label: 'Treatment Plans', icon: ClipboardList },
              { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
              { id: 'labs', label: 'Lab Reports', icon: Upload }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 font-paragraph text-base px-6 py-4 border-b-4 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-secondary hover:text-primary'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 gap-8"
            >
              <div className="bg-background border-2 border-secondary p-8">
                <h2 className="font-heading text-3xl text-secondary mb-6">
                  Personal Information
                </h2>
                <div className="space-y-4 font-paragraph text-base text-secondary">
                  <div>
                    <span className="font-semibold">Address:</span>
                    <p className="mt-1">{patient.address || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-background border-2 border-secondary p-8">
                <h2 className="font-heading text-3xl text-secondary mb-6">
                  Medical History
                </h2>
                <p className="font-paragraph text-base text-secondary">
                  {patient.medicalHistory || 'No medical history recorded'}
                </p>
              </div>

              <div className="md:col-span-2 bg-backgrounddark p-8">
                <h2 className="font-heading text-3xl text-secondary-foreground mb-6">
                  Current Complications
                </h2>
                <p className="font-paragraph text-base text-secondary-foreground">
                  {patient.currentComplications || 'No current complications'}
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'treatments' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-heading text-4xl text-secondary">
                  Treatment Plans
                </h2>
                <button
                  onClick={() => setShowTreatmentForm(true)}
                  className="flex items-center gap-2 bg-primary text-primary-foreground font-paragraph text-base px-6 py-3 hover:bg-accentbluelight transition-colors"
                >
                  <Plus size={18} />
                  ADD TREATMENT PLAN
                </button>
              </div>

              {treatmentPlans.length > 0 ? (
                <div className="space-y-6">
                  {treatmentPlans.map((plan) => (
                    <div key={plan._id} className="bg-background border-2 border-secondary p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-heading text-2xl text-secondary mb-2">
                            {plan.planName}
                          </h3>
                          <p className="font-paragraph text-sm text-secondary mb-3">
                            <span className="font-semibold">Type:</span> {plan.planType || 'General'}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleTaskStatus(plan)}
                          className="flex items-center gap-2 font-paragraph text-sm text-secondary hover:text-primary transition-colors"
                        >
                          {plan.currentStatus === 'Completed' ? (
                            <>
                              <CheckCircle2 size={24} className="text-primary" />
                              <span>Completed</span>
                            </>
                          ) : (
                            <>
                              <Circle size={24} />
                              <span>Mark Complete</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="space-y-3 font-paragraph text-base text-secondary">
                        <p><span className="font-semibold">Details:</span> {plan.planDetails || 'No details provided'}</p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <p><span className="font-semibold">Start Date:</span> {plan.startDate ? format(new Date(plan.startDate), 'MMM dd, yyyy') : 'N/A'}</p>
                          <p><span className="font-semibold">Expected End:</span> {plan.expectedEndDate ? format(new Date(plan.expectedEndDate), 'MMM dd, yyyy') : 'N/A'}</p>
                        </div>
                        {plan.doctorNotes && (
                          <p className="mt-4 pt-4 border-t border-secondary/20">
                            <span className="font-semibold">Doctor Notes:</span> {plan.doctorNotes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-secondary">
                  <p className="font-paragraph text-lg text-secondary">
                    No treatment plans created yet
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'prescriptions' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-heading text-4xl text-secondary">
                  Prescriptions
                </h2>
                <button
                  onClick={() => setShowPrescriptionForm(true)}
                  className="flex items-center gap-2 bg-primary text-primary-foreground font-paragraph text-base px-6 py-3 hover:bg-accentbluelight transition-colors"
                >
                  <Plus size={18} />
                  ADD PRESCRIPTION
                </button>
              </div>

              {prescriptions.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {prescriptions.map((prescription) => (
                    <div key={prescription._id} className="bg-background border-2 border-secondary p-6">
                      <h3 className="font-heading text-2xl text-secondary mb-4">
                        {prescription.drugName}
                      </h3>
                      <div className="space-y-2 font-paragraph text-base text-secondary">
                        <p><span className="font-semibold">Dosage:</span> {prescription.dosage || 'N/A'}</p>
                        <p><span className="font-semibold">Instructions:</span> {prescription.usageInstructions || 'N/A'}</p>
                        <p><span className="font-semibold">Prescribed By:</span> {prescription.prescribingDoctorName || 'N/A'}</p>
                        <p><span className="font-semibold">Date:</span> {prescription.prescriptionDate ? format(new Date(prescription.prescriptionDate), 'MMM dd, yyyy') : 'N/A'}</p>
                        <p><span className="font-semibold">Refills:</span> {prescription.refillsAllowed ?? 'N/A'}</p>
                        {prescription.expirationDate && (
                          <p><span className="font-semibold">Expires:</span> {format(new Date(prescription.expirationDate), 'MMM dd, yyyy')}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-secondary">
                  <p className="font-paragraph text-lg text-secondary">
                    No prescriptions recorded yet
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'labs' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-heading text-4xl text-secondary">
                  Lab Reports
                </h2>
                <button
                  onClick={() => setShowLabReportForm(true)}
                  className="flex items-center gap-2 bg-primary text-primary-foreground font-paragraph text-base px-6 py-3 hover:bg-accentbluelight transition-colors"
                >
                  <Plus size={18} />
                  UPLOAD LAB REPORT
                </button>
              </div>

              {labReports.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {labReports.map((report) => (
                    <div key={report._id} className="bg-background border-2 border-secondary p-6">
                      <h3 className="font-heading text-2xl text-secondary mb-4">
                        {report.reportName}
                      </h3>
                      <div className="space-y-3 font-paragraph text-base text-secondary">
                        <p><span className="font-semibold">Test Type:</span> {report.testType || 'N/A'}</p>
                        <p><span className="font-semibold">Lab:</span> {report.labName || 'N/A'}</p>
                        <p><span className="font-semibold">Date:</span> {report.reportDate ? format(new Date(report.reportDate), 'MMM dd, yyyy') : 'N/A'}</p>
                        {report.testResultSummary && (
                          <div className="mt-4 pt-4 border-t border-secondary/20">
                            <p className="font-semibold mb-2">Summary:</p>
                            <p>{report.testResultSummary}</p>
                          </div>
                        )}
                        {report.notes && (
                          <div className="mt-4 pt-4 border-t border-secondary/20">
                            <p className="font-semibold mb-2">Notes:</p>
                            <p>{report.notes}</p>
                          </div>
                        )}
                        {report.reportFile && (
                          <div className="mt-4">
                            <Image
                              src={report.reportFile}
                              alt={`Lab report: ${report.reportName}`}
                              className="w-full h-48 object-cover border-2 border-secondary"
                              width={400}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-secondary">
                  <p className="font-paragraph text-lg text-secondary">
                    No lab reports uploaded yet
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>

      {/* Modals */}
      {showTreatmentForm && (
        <TreatmentPlanForm
          onClose={() => setShowTreatmentForm(false)}
          onSuccess={() => {
            setShowTreatmentForm(false);
            loadPatientData();
          }}
        />
      )}

      {showPrescriptionForm && (
        <PrescriptionForm
          onClose={() => setShowPrescriptionForm(false)}
          onSuccess={() => {
            setShowPrescriptionForm(false);
            loadPatientData();
          }}
        />
      )}

      {showLabReportForm && (
        <LabReportForm
          onClose={() => setShowLabReportForm(false)}
          onSuccess={() => {
            setShowLabReportForm(false);
            loadPatientData();
          }}
        />
      )}

      <Footer />
    </div>
  );
}

function TreatmentPlanForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    planName: '',
    planType: '',
    planDetails: '',
    startDate: '',
    expectedEndDate: '',
    currentStatus: 'In Progress',
    doctorNotes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await BaseCrudService.create('treatmentplans', {
      _id: crypto.randomUUID(),
      ...formData
    });
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
          Create Treatment Plan
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-paragraph text-sm text-secondary font-semibold mb-2 block">
                Plan Name *
              </label>
              <input
                type="text"
                required
                value={formData.planName}
                onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="font-paragraph text-sm text-secondary font-semibold mb-2 block">
                Plan Type
              </label>
              <select
                value={formData.planType}
                onChange={(e) => setFormData({ ...formData, planType: e.target.value })}
                className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary"
              >
                <option value="">Select Type</option>
                <option value="Medication">Medication</option>
                <option value="Lab Tests">Lab Tests</option>
                <option value="Diet Plan">Diet Plan</option>
                <option value="Physiotherapy">Physiotherapy</option>
                <option value="Surgery">Surgery</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="font-paragraph text-sm text-secondary font-semibold mb-2 block">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="font-paragraph text-sm text-secondary font-semibold mb-2 block">
                Expected End Date
              </label>
              <input
                type="date"
                value={formData.expectedEndDate}
                onChange={(e) => setFormData({ ...formData, expectedEndDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="font-paragraph text-sm text-secondary font-semibold mb-2 block">
              Plan Details
            </label>
            <textarea
              value={formData.planDetails}
              onChange={(e) => setFormData({ ...formData, planDetails: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="font-paragraph text-sm text-secondary font-semibold mb-2 block">
              Doctor Notes
            </label>
            <textarea
              value={formData.doctorNotes}
              onChange={(e) => setFormData({ ...formData, doctorNotes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground font-paragraph text-base px-8 py-4 hover:bg-accentbluelight transition-colors"
            >
              CREATE PLAN
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

function PrescriptionForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    drugName: '',
    dosage: '',
    usageInstructions: '',
    prescriptionDate: new Date().toISOString().split('T')[0],
    prescribingDoctorName: '',
    refillsAllowed: 0,
    expirationDate: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await BaseCrudService.create('prescriptions', {
      _id: crypto.randomUUID(),
      ...formData,
      refillsAllowed: Number(formData.refillsAllowed)
    });
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
          Add Prescription
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-paragraph text-sm text-secondary font-semibold mb-2 block">
                Drug Name *
              </label>
              <input
                type="text"
                required
                value={formData.drugName}
                onChange={(e) => setFormData({ ...formData, drugName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="font-paragraph text-sm text-secondary font-semibold mb-2 block">
                Dosage
              </label>
              <input
                type="text"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                placeholder="e.g., 500mg twice daily"
                className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="font-paragraph text-sm text-secondary font-semibold mb-2 block">
                Prescribing Doctor
              </label>
              <input
                type="text"
                value={formData.prescribingDoctorName}
                onChange={(e) => setFormData({ ...formData, prescribingDoctorName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="font-paragraph text-sm text-secondary font-semibold mb-2 block">
                Prescription Date
              </label>
              <input
                type="date"
                value={formData.prescriptionDate}
                onChange={(e) => setFormData({ ...formData, prescriptionDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="font-paragraph text-sm text-secondary font-semibold mb-2 block">
                Refills Allowed
              </label>
              <input
                type="number"
                min="0"
                value={formData.refillsAllowed}
                onChange={(e) => setFormData({ ...formData, refillsAllowed: Number(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="font-paragraph text-sm text-secondary font-semibold mb-2 block">
                Expiration Date
              </label>
              <input
                type="date"
                value={formData.expirationDate}
                onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="font-paragraph text-sm text-secondary font-semibold mb-2 block">
              Usage Instructions
            </label>
            <textarea
              value={formData.usageInstructions}
              onChange={(e) => setFormData({ ...formData, usageInstructions: e.target.value })}
              rows={3}
              placeholder="e.g., Take with food, avoid alcohol"
              className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground font-paragraph text-base px-8 py-4 hover:bg-accentbluelight transition-colors"
            >
              ADD PRESCRIPTION
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

function LabReportForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    reportName: '',
    testType: '',
    reportFile: 'https://static.wixstatic.com/media/e1984f_1b5d7c1fdbf447578b9b0968da5862cc~mv2.png?originWidth=768&originHeight=576',
    testResultSummary: '',
    reportDate: new Date().toISOString().split('T')[0],
    labName: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await BaseCrudService.create('labreports', {
      _id: crypto.randomUUID(),
      ...formData
    });
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
          Upload Lab Report
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-paragraph text-sm text-secondary font-semibold mb-2 block">
                Report Name *
              </label>
              <input
                type="text"
                required
                value={formData.reportName}
                onChange={(e) => setFormData({ ...formData, reportName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="font-paragraph text-sm text-secondary font-semibold mb-2 block">
                Test Type
              </label>
              <input
                type="text"
                value={formData.testType}
                onChange={(e) => setFormData({ ...formData, testType: e.target.value })}
                placeholder="e.g., Blood Test, X-Ray"
                className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="font-paragraph text-sm text-secondary font-semibold mb-2 block">
                Lab Name
              </label>
              <input
                type="text"
                value={formData.labName}
                onChange={(e) => setFormData({ ...formData, labName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="font-paragraph text-sm text-secondary font-semibold mb-2 block">
                Report Date
              </label>
              <input
                type="date"
                value={formData.reportDate}
                onChange={(e) => setFormData({ ...formData, reportDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="font-paragraph text-sm text-secondary font-semibold mb-2 block">
              Test Result Summary
            </label>
            <textarea
              value={formData.testResultSummary}
              onChange={(e) => setFormData({ ...formData, testResultSummary: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="font-paragraph text-sm text-secondary font-semibold mb-2 block">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground font-paragraph text-base px-8 py-4 hover:bg-accentbluelight transition-colors"
            >
              UPLOAD REPORT
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
