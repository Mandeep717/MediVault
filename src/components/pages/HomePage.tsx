// HPI 1.7-V
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { ArrowRight, Activity, FileText, Shield, Users, Database, Stethoscope } from 'lucide-react';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// --- Canonical Data Sources ---
const FEATURES_DATA = [
  {
    id: '01',
    title: 'Patient Records',
    description: 'Complete digital health records with medical history, current complications, and personal information accessible to authorized healthcare professionals.',
    icon: Database,
  },
  {
    id: '02',
    title: 'Treatment Plans',
    description: 'Create and track comprehensive treatment plans including prescriptions, lab tests, diet plans, and physiotherapy schedules with progress monitoring.',
    icon: Activity,
  },
  {
    id: '03',
    title: 'Lab Reports',
    description: 'Upload and manage laboratory test results with detailed summaries, ensuring seamless integration with patient health records.',
    icon: FileText,
  },
  {
    id: '04',
    title: 'AI Health Assistant',
    description: 'Get AI-powered symptom analysis and personalized treatment suggestions for both patients and healthcare professionals.',
    icon: Stethoscope,
  }
];

const ROLES_DATA = [
  { 
    role: 'Doctors', 
    access: 'Full access to patient records, treatment plans, and prescriptions.',
    icon: Stethoscope
  },
  { 
    role: 'Lab Technicians', 
    access: 'Upload lab reports, manage test results, and access patient sample information.',
    icon: Activity
  },
  { 
    role: 'Patients', 
    access: 'View personal health records and treatment plans.',
    icon: Users
  }
];

const TICKER_ITEMS = ["SECURE DATA", "HIPAA COMPLIANT", "REAL-TIME UPDATES", "INTEGRATED CARE", "DIGITAL HEALTH"];

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col bg-background font-paragraph overflow-x-hidden selection:bg-primary selection:text-white">
      <Header />

      {/* --- HERO SECTION --- 
          Replicating the structural layout of the inspiration image:
          Split screen, Left: Bold Typography, Right: Portrait Image.
      */}
      <section className="relative w-full min-h-screen flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column: Typography & CTA */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-24 py-20 lg:py-0 z-10 bg-background">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-heading text-7xl md:text-8xl lg:text-[7rem] leading-[0.9] tracking-tight text-secondary mb-8">
              HealthCare
              <br />
              <span className="text-primary">Records</span>
            </h1>
            
            <div className="w-24 h-1 bg-secondary mb-8" />

            <p className="font-paragraph text-lg md:text-xl text-secondary/80 max-w-md mb-10 leading-relaxed">
              Amplify your medical practice with data-driven management solutions. Streamline patient care with comprehensive digital health records.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login" className="inline-block group">
                <motion.button
                  className="bg-primary text-white font-heading text-sm tracking-widest uppercase px-10 py-5 hover:bg-accentbluelight transition-all duration-300 flex items-center gap-3"
                  whileHover={{ gap: '20px' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Healthcare Login <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link to="/lab-login" className="inline-block group">
                <motion.button
                  className="bg-secondary text-white font-heading text-sm tracking-widest uppercase px-10 py-5 hover:bg-primary transition-all duration-300 flex items-center gap-3"
                  whileHover={{ gap: '20px' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Lab Login <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Image Portrait */}
        <div className="w-full lg:w-1/2 h-[60vh] lg:h-screen relative bg-gray-100">
          <motion.div 
            className="absolute inset-0 w-full h-full"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <Image
              src="https://static.wixstatic.com/media/e1984f_73a701830bdf4aa799ea971837ecfacd~mv2.png?originWidth=1152&originHeight=896"
              alt="Medical Professional"
              className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-700"
              width={1200}
            />
            {/* Overlay Gradient for text readability if needed, though design is split */}
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* --- TICKER SECTION --- 
          Dynamic motion element to break the static layout 
      */}
      <div className="w-full bg-secondary py-6 overflow-hidden border-y border-white/10">
        <div className="flex whitespace-nowrap">
          <motion.div 
            className="flex gap-16 items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          >
            {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-white font-heading text-xl md:text-2xl tracking-widest uppercase opacity-80">{item}</span>
                <div className="w-2 h-2 bg-primary rounded-full" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* --- STICKY SCROLL FEATURES SECTION --- 
          "Vertical Sticky Section" pattern from Lexicon.
          Left side holds the context, right side scrolls the content.
      */}
      <section className="w-full bg-background py-32 relative">
        <div className="max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            
            {/* Sticky Left Column */}
            <div className="lg:w-1/3">
              <div className="sticky top-32">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="font-heading text-5xl md:text-6xl text-secondary mb-8 leading-tight">
                    Core <br/>
                    <span className="text-primary">Capabilities</span>
                  </h2>
                  <p className="font-paragraph text-lg text-secondary/70 mb-12 max-w-sm">
                    A unified platform designed for the modern healthcare ecosystem. Secure, fast, and reliable.
                  </p>
                  <div className="hidden lg:block w-full h-[1px] bg-secondary/20 mt-8" />
                </motion.div>
              </div>
            </div>

            {/* Scrollable Right Column */}
            <div className="lg:w-2/3 flex flex-col gap-24">
              {FEATURES_DATA.map((feature, index) => (
                <FeatureCard key={index} feature={feature} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- PARALLAX IMAGE BREAK --- 
          "Visual Breather" pattern.
      */}
      <section className="w-full h-[80vh] relative overflow-hidden flex items-center justify-center">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: useTransform(smoothProgress, [0, 1], ["0%", "20%"]) }}
        >
           <Image
              src="https://static.wixstatic.com/media/e1984f_15bc0b21faca40f3b3d73063bf5b9d33~mv2.png?originWidth=1600&originHeight=896"
              alt="Laboratory Environment"
              className="w-full h-full object-cover opacity-40"
              width={1600}
            />
        </motion.div>
        <div className="absolute inset-0 bg-primary/90 mix-blend-multiply z-10" />
        
        <div className="relative z-20 text-center px-6">
          <motion.h2 
            className="font-heading text-5xl md:text-7xl text-white mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Precision in Every Detail
          </motion.h2>
          <p className="font-paragraph text-xl text-white/80 max-w-2xl mx-auto">
            From lab results to daily prescriptions, accuracy is our currency.
          </p>
        </div>
      </section>

      {/* --- ROLES & ACCESS SECTION --- 
          "Card Stack Interactions" / Grid Layout
          High contrast dark section.
      */}
      <section className="w-full bg-secondary py-32 text-white">
        <div className="max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-white/20 pb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-4xl md:text-6xl mb-4">Role-Based Access</h2>
              <p className="text-white/60 text-lg">Secure authentication for every stakeholder.</p>
            </motion.div>
            <div className="hidden md:block">
              <Shield className="w-12 h-12 text-primary" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ROLES_DATA.map((item, index) => (
              <RoleCard key={index} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- 
          Minimalist, centered, bold.
      */}
      <section className="w-full bg-background py-32 flex items-center justify-center relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[40vw] h-[40vw] bg-accentbluelight/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-heading text-5xl md:text-7xl text-secondary mb-8">
              Ready to Get Started?
            </h2>
            <p className="font-paragraph text-xl text-secondary/70 mb-12 max-w-2xl mx-auto">
              Join the network of healthcare professionals streamlining their workflow today.
            </p>
            <Link to="/login">
              <motion.button
                className="bg-secondary text-white font-heading text-lg px-16 py-6 hover:bg-primary transition-colors duration-300 rounded-none"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                LOGIN NOW
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// --- SUB-COMPONENTS ---

function FeatureCard({ feature, index }: { feature: any, index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="group relative bg-white border-l-2 border-secondary/10 pl-8 md:pl-12 py-8 hover:border-primary transition-colors duration-500"
      initial={{ opacity: 0, x: 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div className="absolute -left-[9px] top-8 w-4 h-4 bg-background border-2 border-secondary/20 rounded-full group-hover:border-primary group-hover:bg-primary transition-colors duration-500" />
      
      <div className="flex items-start justify-between mb-6">
        <span className="font-heading text-6xl text-secondary/5 group-hover:text-primary/10 transition-colors duration-500">
          {feature.id}
        </span>
        <div className="p-4 bg-secondary/5 rounded-full group-hover:bg-primary/10 transition-colors duration-500">
          <feature.icon className="w-8 h-8 text-secondary group-hover:text-primary transition-colors duration-500" />
        </div>
      </div>

      <h3 className="font-heading text-3xl text-secondary mb-4 group-hover:translate-x-2 transition-transform duration-300">
        {feature.title}
      </h3>
      <p className="font-paragraph text-lg text-secondary/70 leading-relaxed max-w-xl">
        {feature.description}
      </p>
    </motion.div>
  );
}

function RoleCard({ item, index }: { item: any, index: number }) {
  return (
    <motion.div
      className="bg-white/5 border border-white/10 p-10 hover:bg-primary hover:border-primary transition-all duration-500 group cursor-default"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="mb-8 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
        <item.icon className="w-10 h-10 text-white" />
      </div>
      <h4 className="font-heading text-2xl text-white mb-4">
        {item.role}
      </h4>
      <div className="w-12 h-[1px] bg-white/30 mb-6 group-hover:w-full transition-all duration-500" />
      <p className="font-paragraph text-base text-white/70 group-hover:text-white transition-colors duration-300">
        {item.access}
      </p>
    </motion.div>
  );
}