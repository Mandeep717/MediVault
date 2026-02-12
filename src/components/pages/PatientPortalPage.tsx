import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Patients, TreatmentPlans, Prescriptions, LabReports } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { format } from 'date-fns';
import { Image } from '@/components/ui/image';

export default function PatientPortalPage() {
  const [patientName, setPatientName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [patient, setPatient] = useState<Patients | null>(null);
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlans[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescriptions[]>([]);
  const [labReports, setLabReports] = useState<LabReports[]>([]);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSearching(true);

    const result = await BaseCrudService.getAll<Patients>('patients');
    const foundPatient = result.items.find(
      p => p.patientName?.toLowerCase() === patientName.toLowerCase() && 
           p.mobileNumber === mobileNumber
    );

    if (foundPatient) {
      setPatient(foundPatient);
      
      const [treatmentsResult, prescriptionsResult, labsResult] = await Promise.all([
        BaseCrudService.getAll<TreatmentPlans>('treatmentplans'),
        BaseCrudService.getAll<Prescriptions>('prescriptions'),
        BaseCrudService.getAll<LabReports>('labreports')
      ]);

      // Filter records by patientId
      const patientTreatments = treatmentsResult.items.filter(t => t.patientId === foundPatient._id);
      const patientPrescriptions = prescriptionsResult.items.filter(p => p.patientId === foundPatient._id);
      const patientLabs = labsResult.items.filter(l => l.patientId === foundPatient._id);

      setTreatmentPlans(patientTreatments);
      setPrescriptions(patientPrescriptions);
      setLabReports(patientLabs);
    } else {
      setError('Patient not found. Please check your name and mobile number.');
      setPatient(null);
    }

    setIsSearching(false);
  };

  const handleLogout = () => {
    setPatient(null);
    setPatientName('');
    setMobileNumber('');
    setTreatmentPlans([]);
    setPrescriptions([]);
    setLabReports([]);
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 w-full bg-background">
        {!patient ? (
          <div className="max-w-[100rem] mx-auto px-8 md:px-16 py-24">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="font-heading text-5xl md:text-6xl text-secondary mb-6 text-center">
                  Patient Portal
                </h1>
                <p className="font-paragraph text-lg text-secondary mb-12 text-center">
                  Access your health records and treatment information
                </p>

                <div className="bg-background border-2 border-secondary p-8">
                  <h2 className="font-heading text-3xl text-secondary mb-6">
                    Sign In
                  </h2>
                  
                  <form onSubmit={handleSearch} className="space-y-6">
                    <div>
                      <label className="font-paragraph text-sm text-secondary font-semibold mb-2 block">
                        Patient Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="Enter your full name"
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
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="Enter your mobile number"
                        className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary"
                      />
                    </div>

                    {error && (
                      <div className="bg-destructive/10 border-2 border-destructive p-4">
                        <p className="font-paragraph text-sm text-destructive">
                          {error}
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSearching}
                      className="w-full bg-primary text-primary-foreground font-paragraph text-base px-8 py-4 hover:bg-accentbluelight transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSearching ? (
                        <>
                          <LoadingSpinner />
                          <span>SEARCHING...</span>
                        </>
                      ) : (
                        <>
                          <Search size={18} />
                          <span>ACCESS MY RECORDS</span>
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-8 pt-8 border-t-2 border-secondary">
                    <p className="font-paragraph text-sm text-secondary text-center">
                      Healthcare professionals should use the{' '}
                      <a href="/login" className="text-primary hover:text-accentbluelight underline">
                        professional login
                      </a>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          <div className="max-w-[100rem] mx-auto px-8 md:px-16 py-16">
            {/* Patient Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="font-heading text-5xl text-secondary mb-3">
                  Welcome, {patient.patientName}
                </h1>
                <p className="font-paragraph text-lg text-secondary">
                  Your Health Records
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-secondary text-secondary-foreground font-paragraph text-base px-8 py-3 hover:bg-primary transition-colors"
              >
                SIGN OUT
              </button>
            </div>

            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary p-8 mb-8"
            >
              <h2 className="font-heading text-3xl text-primary-foreground mb-6">
                Personal Information
              </h2>
              <div className="grid md:grid-cols-3 gap-6 font-paragraph text-base text-primary-foreground">
                <div>
                  <span className="font-semibold">Mobile:</span> {patient.mobileNumber || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold">Date of Birth:</span> {patient.dateOfBirth ? format(new Date(patient.dateOfBirth), 'MMM dd, yyyy') : 'N/A'}
                </div>
                <div>
                  <span className="font-semibold">Gender:</span> {patient.gender || 'N/A'}
                </div>
                {patient.address && (
                  <div className="md:col-span-3">
                    <span className="font-semibold">Address:</span> {patient.address}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Medical History & Complications */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-background border-2 border-secondary p-8"
              >
                <h3 className="font-heading text-2xl text-secondary mb-4">
                  Medical History
                </h3>
                <p className="font-paragraph text-base text-secondary">
                  {patient.medicalHistory || 'No medical history recorded'}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-background border-2 border-secondary p-8"
              >
                <h3 className="font-heading text-2xl text-secondary mb-4">
                  Current Complications
                </h3>
                <p className="font-paragraph text-base text-secondary">
                  {patient.currentComplications || 'No current complications'}
                </p>
              </motion.div>
            </div>

            {/* Treatment Plans */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="font-heading text-4xl text-secondary mb-6">
                Treatment Plans
              </h2>
              {treatmentPlans.length > 0 ? (
                <div className="space-y-6">
                  {treatmentPlans.map((plan) => (
                    <div key={plan._id} className="bg-background border-2 border-secondary p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-heading text-2xl text-secondary mb-2">
                            {plan.planName}
                          </h3>
                          <p className="font-paragraph text-sm text-secondary">
                            <span className="font-semibold">Type:</span> {plan.planType || 'General'}
                          </p>
                        </div>
                        <span className={`font-paragraph text-sm px-4 py-2 ${
                          plan.currentStatus === 'Completed' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-backgrounddark text-secondary-foreground'
                        }`}>
                          {plan.currentStatus || 'In Progress'}
                        </span>
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
                    No treatment plans available
                  </p>
                </div>
              )}
            </motion.div>

            {/* Prescriptions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="font-heading text-4xl text-secondary mb-6">
                Prescriptions
              </h2>
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
                    No prescriptions available
                  </p>
                </div>
              )}
            </motion.div>

            {/* Lab Reports */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="font-heading text-4xl text-secondary mb-6">
                Lab Reports
              </h2>
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
                    No lab reports available
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
