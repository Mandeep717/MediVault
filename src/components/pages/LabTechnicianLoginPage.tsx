import { useMember } from '@/integrations';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';

export default function LabTechnicianLoginPage() {
  const { isAuthenticated, actions } = useMember();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/lab-dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    actions.login();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 w-full bg-background">
        <div className="max-w-[100rem] mx-auto px-8 md:px-16 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Login Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl"
            >
              <h1 className="font-heading text-5xl md:text-6xl text-secondary mb-6">
                Lab Technician Portal
              </h1>
              <p className="font-paragraph text-lg text-secondary mb-12">
                Access lab management tools, upload test results, and manage patient samples with your professional credentials
              </p>

              <div className="space-y-8">
                <div className="bg-background border-2 border-secondary p-8">
                  <h3 className="font-heading text-2xl text-secondary mb-4">
                    Lab Professional Access
                  </h3>
                  <p className="font-paragraph text-base text-secondary mb-6">
                    This portal is exclusively for laboratory technicians and professionals. Sign in to access lab management features, upload test results, and manage patient samples.
                  </p>
                  <button
                    onClick={handleLogin}
                    className="w-full bg-primary text-primary-foreground font-paragraph text-base px-8 py-4 hover:bg-accentbluelight transition-colors"
                  >
                    SIGN IN WITH CREDENTIALS
                  </button>
                </div>

                <div className="bg-backgrounddark p-8">
                  <h4 className="font-heading text-xl text-secondary-foreground mb-3">
                    Other Access Options
                  </h4>
                  <p className="font-paragraph text-sm text-secondary-foreground mb-4">
                    Are you a doctor or healthcare professional? Access the main healthcare system.
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-background text-secondary border-2 border-background font-paragraph text-base px-8 py-4 hover:bg-secondary hover:text-secondary-foreground transition-colors"
                  >
                    HEALTHCARE PROFESSIONAL LOGIN
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-[600px] hidden lg:block"
            >
              <Image
                src="https://static.wixstatic.com/media/e1984f_aeeab6d58b014ea092d970f6c75a772c~mv2.png?originWidth=576&originHeight=576"
                alt="Lab technician working with samples"
                className="w-full h-full object-cover"
                width={600}
              />
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
