import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-secondary py-12">
      <div className="max-w-[100rem] mx-auto px-8 md:px-16">
        <div className="grid md:grid-cols-3 gap-12 mb-8">
          <div>
            <h3 className="font-heading text-xl text-secondary-foreground mb-4">
              HealthCare Records
            </h3>
            <p className="font-paragraph text-sm text-secondary-foreground">
              Secure digital platform for managing patient health records and treatment plans
            </p>
          </div>

          <div>
            <h4 className="font-heading text-lg text-secondary-foreground mb-4">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="font-paragraph text-sm text-secondary-foreground hover:text-accentbluelight transition-colors">
                Home
              </Link>
              <Link to="/login" className="font-paragraph text-sm text-secondary-foreground hover:text-accentbluelight transition-colors">
                Healthcare Login
              </Link>
              <Link to="/patient-portal" className="font-paragraph text-sm text-secondary-foreground hover:text-accentbluelight transition-colors">
                Patient Portal
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-heading text-lg text-secondary-foreground mb-4">
              Contact
            </h4>
            <div className="font-paragraph text-sm text-secondary-foreground space-y-2">
              <p>Email: support@healthcarerecords.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Available 24/7 for emergencies</p>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-foreground pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-paragraph text-sm text-secondary-foreground">
              © 2026 HealthCare Records. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="#" className="font-paragraph text-sm text-secondary-foreground hover:text-accentbluelight transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="font-paragraph text-sm text-secondary-foreground hover:text-accentbluelight transition-colors">
                Terms of Service
              </Link>
              <Link to="#" className="font-paragraph text-sm text-secondary-foreground hover:text-accentbluelight transition-colors">
                HIPAA Compliance
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
