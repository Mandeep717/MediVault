import { useMember } from '@/integrations';
import { BaseCrudService } from '@/integrations';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Search, Filter } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { LabReports, Patients } from '@/entities';

export default function LabDashboardPage() {
  const { member } = useMember();
  const [labReports, setLabReports] = useState<LabReports[]>([]);
  const [patients, setPatients] = useState<Patients[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTestType, setFilterTestType] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [reportsResult, patientsResult] = await Promise.all([
        BaseCrudService.getAll<LabReports>('labreports'),
        BaseCrudService.getAll<Patients>('patients')
      ]);
      setLabReports(reportsResult.items);
      setPatients(patientsResult.items);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPatientName = (patientId?: string) => {
    const patient = patients.find(p => p._id === patientId);
    return patient?.patientName || 'Unknown Patient';
  };

  const filteredReports = labReports.filter(report => {
    const matchesSearch = 
      report.reportName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.testType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getPatientName(report.patientId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = !filterTestType || report.testType === filterTestType;
    
    return matchesSearch && matchesFilter;
  });

  const testTypes = Array.from(new Set(labReports.map(r => r.testType).filter(Boolean)));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 w-full">
        <div className="max-w-[100rem] mx-auto px-8 md:px-16 py-16">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="font-heading text-5xl md:text-6xl text-secondary mb-4">
              Lab Dashboard
            </h1>
            <p className="font-paragraph text-lg text-secondary/70">
              Welcome, {member?.profile?.nickname || 'Lab Technician'}. Manage lab reports and patient samples.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white border-2 border-secondary p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-sm text-secondary/60 mb-2">Total Lab Reports</p>
                  <p className="font-heading text-4xl text-secondary">{labReports.length}</p>
                </div>
                <FileText className="w-12 h-12 text-primary opacity-20" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white border-2 border-secondary p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-sm text-secondary/60 mb-2">Patients Tested</p>
                  <p className="font-heading text-4xl text-secondary">
                    {new Set(labReports.map(r => r.patientId)).size}
                  </p>
                </div>
                <Upload className="w-12 h-12 text-primary opacity-20" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white border-2 border-secondary p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-sm text-secondary/60 mb-2">Test Types</p>
                  <p className="font-heading text-4xl text-secondary">{testTypes.length}</p>
                </div>
                <Filter className="w-12 h-12 text-primary opacity-20" />
              </div>
            </motion.div>
          </div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white border-2 border-secondary p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-paragraph text-sm text-secondary/60 block mb-2">
                  Search Reports
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-secondary/40" />
                  <input
                    type="text"
                    placeholder="Search by report name, test type, or patient..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-secondary/20 focus:outline-none focus:border-primary font-paragraph text-base"
                  />
                </div>
              </div>

              <div>
                <label className="font-paragraph text-sm text-secondary/60 block mb-2">
                  Filter by Test Type
                </label>
                <select
                  value={filterTestType}
                  onChange={(e) => setFilterTestType(e.target.value)}
                  className="w-full px-4 py-3 border border-secondary/20 focus:outline-none focus:border-primary font-paragraph text-base bg-white"
                >
                  <option value="">All Test Types</option>
                  {testTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Lab Reports List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <LoadingSpinner />
              </div>
            ) : filteredReports.length > 0 ? (
              <div className="space-y-4">
                {filteredReports.map((report, index) => (
                  <motion.div
                    key={report._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="bg-white border-2 border-secondary/20 p-6 hover:border-primary transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                      <div>
                        <p className="font-paragraph text-xs text-secondary/60 uppercase tracking-wide mb-1">
                          Report Name
                        </p>
                        <p className="font-heading text-lg text-secondary">
                          {report.reportName}
                        </p>
                      </div>

                      <div>
                        <p className="font-paragraph text-xs text-secondary/60 uppercase tracking-wide mb-1">
                          Patient
                        </p>
                        <p className="font-paragraph text-base text-secondary">
                          {getPatientName(report.patientId)}
                        </p>
                      </div>

                      <div>
                        <p className="font-paragraph text-xs text-secondary/60 uppercase tracking-wide mb-1">
                          Test Type
                        </p>
                        <p className="font-paragraph text-base text-secondary">
                          {report.testType || 'N/A'}
                        </p>
                      </div>

                      <div>
                        <p className="font-paragraph text-xs text-secondary/60 uppercase tracking-wide mb-1">
                          Lab Name
                        </p>
                        <p className="font-paragraph text-base text-secondary">
                          {report.labName || 'N/A'}
                        </p>
                      </div>
                    </div>

                    {report.testResultSummary && (
                      <div className="mt-4 pt-4 border-t border-secondary/10">
                        <p className="font-paragraph text-sm text-secondary/70">
                          <span className="font-heading text-secondary">Summary:</span> {report.testResultSummary}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white border-2 border-secondary/20 p-12 text-center">
                <FileText className="w-16 h-16 text-secondary/20 mx-auto mb-4" />
                <p className="font-heading text-2xl text-secondary mb-2">No Lab Reports Found</p>
                <p className="font-paragraph text-base text-secondary/60">
                  {searchTerm || filterTestType ? 'Try adjusting your search or filter criteria.' : 'No lab reports have been uploaded yet.'}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
