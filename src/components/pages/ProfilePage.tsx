import { useMember } from '@/integrations';
import { motion } from 'framer-motion';
import { User, Mail, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { format } from 'date-fns';
import { Image } from '@/components/ui/image';

export default function ProfilePage() {
  const { member } = useMember();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 w-full bg-background">
        <div className="max-w-[100rem] mx-auto px-8 md:px-16 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="font-heading text-5xl text-secondary mb-12">
              Professional Profile
            </h1>

            <div className="bg-primary p-8 mb-8">
              <div className="flex items-center gap-6 mb-6">
                {member?.profile?.photo?.url ? (
                  <Image src={member.profile.photo.url} alt={member.profile.nickname || 'Profile'} className="w-24 h-24 object-cover border-4 border-primary-foreground" />
                ) : (
                  <div className="w-24 h-24 bg-primary-foreground flex items-center justify-center">
                    <User size={48} className="text-primary" />
                  </div>
                )}
                <div>
                  <h2 className="font-heading text-3xl text-primary-foreground mb-2">
                    {member?.profile?.nickname || 'Healthcare Professional'}
                  </h2>
                  {member?.profile?.title && (
                    <p className="font-paragraph text-lg text-primary-foreground">
                      {member.profile.title}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-background border-2 border-secondary p-8">
                <h3 className="font-heading text-2xl text-secondary mb-6">
                  Account Information
                </h3>
                <div className="space-y-4">
                  {member?.contact?.firstName && (
                    <div className="flex items-center gap-3">
                      <User size={20} className="text-primary" />
                      <div>
                        <p className="font-paragraph text-sm text-secondary/70">Full Name</p>
                        <p className="font-paragraph text-base text-secondary font-semibold">
                          {member.contact.firstName} {member.contact.lastName || ''}
                        </p>
                      </div>
                    </div>
                  )}

                  {member?.loginEmail && (
                    <div className="flex items-center gap-3">
                      <Mail size={20} className="text-primary" />
                      <div>
                        <p className="font-paragraph text-sm text-secondary/70">Email</p>
                        <p className="font-paragraph text-base text-secondary font-semibold">
                          {member.loginEmail}
                        </p>
                      </div>
                    </div>
                  )}

                  {member?._createdDate && (
                    <div className="flex items-center gap-3">
                      <Calendar size={20} className="text-primary" />
                      <div>
                        <p className="font-paragraph text-sm text-secondary/70">Member Since</p>
                        <p className="font-paragraph text-base text-secondary font-semibold">
                          {format(new Date(member._createdDate), 'MMMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  )}

                  {member?.contact?.phones && member.contact.phones.length > 0 && (
                    <div className="flex items-center gap-3">
                      <User size={20} className="text-primary" />
                      <div>
                        <p className="font-paragraph text-sm text-secondary/70">Phone</p>
                        <p className="font-paragraph text-base text-secondary font-semibold">
                          {member.contact.phones[0]}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-backgrounddark p-8">
                <h3 className="font-heading text-2xl text-secondary-foreground mb-4">
                  Access Level
                </h3>
                <p className="font-paragraph text-base text-secondary-foreground">
                  You have full access to patient records, treatment plans, prescriptions, and lab reports. 
                  Your account status is: <span className="font-semibold">{member?.status || 'Active'}</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
