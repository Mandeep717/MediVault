import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, AlertCircle, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface AnalysisResult {
  symptoms: string[];
  possibleConditions: Array<{
    condition: string;
    likelihood: string;
    description: string;
  }>;
  recommendations: string[];
  urgency: 'low' | 'medium' | 'high';
}

interface TreatmentSuggestion {
  planName: string;
  duration: string;
  treatments: string[];
  medications: string[];
  lifestyle: string[];
  followUp: string;
}

export default function AIAssistantPage() {
  const [activeTab, setActiveTab] = useState<'symptom' | 'treatment'>('symptom');
  const [symptoms, setSymptoms] = useState('');
  const [patientHistory, setPatientHistory] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [treatmentSuggestion, setTreatmentSuggestion] = useState<TreatmentSuggestion | null>(null);

  const analyzeSymptoms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis with realistic medical data
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockAnalysis: AnalysisResult = {
      symptoms: symptoms.split(',').map(s => s.trim()).filter(s => s),
      possibleConditions: [
        {
          condition: 'Common Cold/Viral Infection',
          likelihood: 'High (65%)',
          description: 'Most common viral infection presenting with these symptoms. Usually self-limiting within 7-10 days.'
        },
        {
          condition: 'Influenza (Flu)',
          likelihood: 'Medium (25%)',
          description: 'More severe than common cold, may require antiviral treatment if caught early.'
        },
        {
          condition: 'Allergic Rhinitis',
          likelihood: 'Low (10%)',
          description: 'If symptoms are seasonal or triggered by environmental factors.'
        }
      ],
      recommendations: [
        'Rest for 7-10 days to allow immune system recovery',
        'Stay hydrated - drink at least 8-10 glasses of water daily',
        'Use saline nasal drops or spray for congestion relief',
        'Monitor temperature - seek immediate care if fever exceeds 103°F (39.4°C)',
        'Avoid smoking and secondhand smoke exposure',
        'Maintain good hygiene to prevent spreading to others'
      ],
      urgency: 'low'
    };

    setAnalysisResult(mockAnalysis);
    setIsAnalyzing(false);
  };

  const generateTreatmentPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsAnalyzing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockTreatment: TreatmentSuggestion = {
      planName: 'Comprehensive Symptom Management Plan',
      duration: '7-14 days',
      treatments: [
        'Rest and sleep optimization (8+ hours daily)',
        'Warm compress application for sinus relief',
        'Steam inhalation 3-4 times daily',
        'Throat lozenges for sore throat relief'
      ],
      medications: [
        'Paracetamol 500mg - 3 times daily for fever/pain',
        'Cough syrup - as needed for cough suppression',
        'Antihistamine - if allergic symptoms present',
        'Vitamin C supplement - 500mg daily for immune support'
      ],
      lifestyle: [
        'Maintain warm environment (72-75°F)',
        'Avoid strenuous activities and exercise',
        'Eat nutritious foods - chicken soup, fruits, vegetables',
        'Gargle with salt water 2-3 times daily',
        'Use humidifier to maintain air moisture'
      ],
      followUp: 'If symptoms persist beyond 10 days or worsen, consult healthcare provider'
    };

    setTreatmentSuggestion(mockTreatment);
    setIsAnalyzing(false);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-destructive/10 border-destructive text-destructive';
      case 'medium':
        return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      case 'low':
        return 'bg-green-100 border-green-500 text-green-700';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 w-full bg-background">
        <div className="max-w-[100rem] mx-auto px-8 md:px-16 py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
              <h1 className="font-heading text-5xl md:text-6xl text-secondary">
                AI Health Assistant
              </h1>
            </div>
            <p className="font-paragraph text-lg text-secondary/70 max-w-2xl">
              Get AI-powered symptom analysis and personalized treatment suggestions. 
              <span className="block mt-2 text-sm text-secondary/50">
                ⚠️ This tool provides general guidance only. Always consult with a healthcare professional for medical advice.
              </span>
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-12 border-b-2 border-secondary/20">
            <button
              onClick={() => setActiveTab('symptom')}
              className={`font-heading text-lg px-6 py-4 border-b-2 transition-all ${
                activeTab === 'symptom'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-secondary/60 hover:text-secondary'
              }`}
            >
              Symptom Analysis
            </button>
            <button
              onClick={() => setActiveTab('treatment')}
              className={`font-heading text-lg px-6 py-4 border-b-2 transition-all ${
                activeTab === 'treatment'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-secondary/60 hover:text-secondary'
              }`}
            >
              Treatment Plan
            </button>
          </div>

          {/* Symptom Analysis Tab */}
          {activeTab === 'symptom' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-2 gap-12"
            >
              {/* Input Form */}
              <div>
                <form onSubmit={analyzeSymptoms} className="space-y-6">
                  <div>
                    <label className="font-heading text-xl text-secondary mb-3 block">
                      Describe Your Symptoms
                    </label>
                    <p className="font-paragraph text-sm text-secondary/60 mb-3">
                      List symptoms separated by commas (e.g., fever, cough, sore throat)
                    </p>
                    <textarea
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="e.g., fever, cough, sore throat, fatigue"
                      rows={5}
                      className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary resize-none"
                    />
                  </div>

                  <div>
                    <label className="font-heading text-xl text-secondary mb-3 block">
                      Medical History (Optional)
                    </label>
                    <p className="font-paragraph text-sm text-secondary/60 mb-3">
                      Any relevant medical conditions or allergies
                    </p>
                    <textarea
                      value={patientHistory}
                      onChange={(e) => setPatientHistory(e.target.value)}
                      placeholder="e.g., asthma, diabetes, penicillin allergy"
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isAnalyzing || !symptoms.trim()}
                    className="w-full bg-primary text-primary-foreground font-heading text-lg px-8 py-4 hover:bg-accentbluelight transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <LoadingSpinner />
                        <span>ANALYZING...</span>
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        <span>ANALYZE SYMPTOMS</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Results */}
              <div>
                {analysisResult ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Urgency Badge */}
                    <div className={`border-2 p-4 ${getUrgencyColor(analysisResult.urgency)}`}>
                      <div className="flex items-center gap-2 font-heading text-lg">
                        {analysisResult.urgency === 'high' ? (
                          <AlertCircle size={24} />
                        ) : (
                          <CheckCircle size={24} />
                        )}
                        <span>
                          {analysisResult.urgency === 'high' ? 'HIGH PRIORITY' : 
                           analysisResult.urgency === 'medium' ? 'MODERATE PRIORITY' : 
                           'LOW PRIORITY'}
                        </span>
                      </div>
                    </div>

                    {/* Possible Conditions */}
                    <div>
                      <h3 className="font-heading text-2xl text-secondary mb-4">
                        Possible Conditions
                      </h3>
                      <div className="space-y-4">
                        {analysisResult.possibleConditions.map((condition, idx) => (
                          <div key={idx} className="bg-background border-2 border-secondary p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-heading text-lg text-secondary">
                                {condition.condition}
                              </h4>
                              <span className="font-paragraph text-sm bg-primary/10 text-primary px-3 py-1">
                                {condition.likelihood}
                              </span>
                            </div>
                            <p className="font-paragraph text-base text-secondary/70">
                              {condition.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h3 className="font-heading text-2xl text-secondary mb-4">
                        Recommendations
                      </h3>
                      <ul className="space-y-3">
                        {analysisResult.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex gap-3 font-paragraph text-base text-secondary">
                            <span className="text-primary font-bold">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-12 border-2 border-secondary/20">
                    <Sparkles className="w-12 h-12 text-secondary/30 mx-auto mb-4" />
                    <p className="font-paragraph text-lg text-secondary/60">
                      Enter your symptoms to get AI analysis
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Treatment Plan Tab */}
          {activeTab === 'treatment' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-2 gap-12"
            >
              {/* Input Form */}
              <div>
                <form onSubmit={generateTreatmentPlan} className="space-y-6">
                  <div>
                    <label className="font-heading text-xl text-secondary mb-3 block">
                      Current Symptoms
                    </label>
                    <p className="font-paragraph text-sm text-secondary/60 mb-3">
                      Describe the symptoms you want to create a treatment plan for
                    </p>
                    <textarea
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="e.g., fever, cough, sore throat, fatigue"
                      rows={5}
                      className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary resize-none"
                    />
                  </div>

                  <div>
                    <label className="font-heading text-xl text-secondary mb-3 block">
                      Medical History (Optional)
                    </label>
                    <p className="font-paragraph text-sm text-secondary/60 mb-3">
                      Any relevant medical conditions or allergies
                    </p>
                    <textarea
                      value={patientHistory}
                      onChange={(e) => setPatientHistory(e.target.value)}
                      placeholder="e.g., asthma, diabetes, penicillin allergy"
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-secondary font-paragraph text-base text-secondary focus:outline-none focus:border-primary resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isAnalyzing || !symptoms.trim()}
                    className="w-full bg-primary text-primary-foreground font-heading text-lg px-8 py-4 hover:bg-accentbluelight transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <LoadingSpinner />
                        <span>GENERATING...</span>
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        <span>GENERATE PLAN</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Treatment Plan Results */}
              <div>
                {treatmentSuggestion ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Plan Header */}
                    <div className="bg-primary text-primary-foreground p-6">
                      <h3 className="font-heading text-2xl mb-2">
                        {treatmentSuggestion.planName}
                      </h3>
                      <p className="font-paragraph text-base">
                        Duration: <span className="font-semibold">{treatmentSuggestion.duration}</span>
                      </p>
                    </div>

                    {/* Treatments */}
                    <div>
                      <h4 className="font-heading text-xl text-secondary mb-3">
                        Recommended Treatments
                      </h4>
                      <ul className="space-y-2">
                        {treatmentSuggestion.treatments.map((treatment, idx) => (
                          <li key={idx} className="flex gap-3 font-paragraph text-base text-secondary">
                            <span className="text-primary font-bold">✓</span>
                            <span>{treatment}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Medications */}
                    <div>
                      <h4 className="font-heading text-xl text-secondary mb-3">
                        Suggested Medications
                      </h4>
                      <ul className="space-y-2">
                        {treatmentSuggestion.medications.map((med, idx) => (
                          <li key={idx} className="flex gap-3 font-paragraph text-base text-secondary">
                            <span className="text-primary font-bold">💊</span>
                            <span>{med}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Lifestyle */}
                    <div>
                      <h4 className="font-heading text-xl text-secondary mb-3">
                        Lifestyle Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {treatmentSuggestion.lifestyle.map((item, idx) => (
                          <li key={idx} className="flex gap-3 font-paragraph text-base text-secondary">
                            <span className="text-primary font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Follow-up */}
                    <div className="bg-yellow-100 border-2 border-yellow-500 p-4">
                      <p className="font-heading text-lg text-yellow-700 mb-2">Follow-up</p>
                      <p className="font-paragraph text-base text-yellow-700">
                        {treatmentSuggestion.followUp}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-12 border-2 border-secondary/20">
                    <Sparkles className="w-12 h-12 text-secondary/30 mx-auto mb-4" />
                    <p className="font-paragraph text-lg text-secondary/60">
                      Enter your symptoms to generate a treatment plan
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-16 bg-background border-2 border-secondary/20 p-6"
          >
            <p className="font-heading text-lg text-secondary mb-3">
              ⚠️ Important Disclaimer
            </p>
            <p className="font-paragraph text-base text-secondary/70">
              This AI Health Assistant provides general medical information and suggestions only. 
              It is not a substitute for professional medical advice, diagnosis, or treatment. 
              Always consult with a qualified healthcare provider before making any medical decisions. 
              In case of emergency, please call your local emergency services immediately.
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
