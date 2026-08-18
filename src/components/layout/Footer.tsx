import { Info, Shield, Scale } from 'lucide-react';

interface FooterProps {
  dark?: boolean;
}

export const Footer = ({ dark = false }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`border-t mt-12 ${dark ? 'bg-black border-white/10' : 'bg-gray-50'}`}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${dark ? 'text-foreground' : 'text-gray-900'}`}>About</h3>
            <p className={`text-sm ${dark ? 'text-muted-foreground' : 'text-gray-600'}`}>
              Cognito is a comprehensive clinical assessment tool designed for mental health professionals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${dark ? 'text-foreground' : 'text-gray-900'}`}>Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#help" className={`flex items-center gap-2 ${dark ? 'text-muted-foreground hover:text-fuchsia-400' : 'text-gray-600 hover:text-blue-600'}`}>
                  <Info className="h-4 w-4" />
                  Help & Support
                </a>
              </li>
              <li>
                <a href="#privacy" className={`flex items-center gap-2 ${dark ? 'text-muted-foreground hover:text-fuchsia-400' : 'text-gray-600 hover:text-blue-600'}`}>
                  <Shield className="h-4 w-4" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className={`flex items-center gap-2 ${dark ? 'text-muted-foreground hover:text-fuchsia-400' : 'text-gray-600 hover:text-blue-600'}`}>
                  <Scale className="h-4 w-4" />
                  Terms of Use
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${dark ? 'text-foreground' : 'text-gray-900'}`}>Contact</h3>
            <ul className={`space-y-2 text-sm ${dark ? 'text-muted-foreground' : 'text-gray-600'}`}>
              <li>support@psycognito.com</li>
              <li>Clinical Advisory: clinical@psycognito.com</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className={`border-t pt-8 ${dark ? 'border-white/10' : 'border-gray-200'}`}>
          {/* Bottom Info */}
          <div className={`flex flex-col md:flex-row justify-between items-center text-sm gap-4 ${dark ? 'text-muted-foreground' : 'text-gray-600'}`}>
            <div>
              <p>© {currentYear} Cognito. All rights reserved.</p>
              <p className={`text-xs mt-1 ${dark ? 'text-gray-600' : 'text-muted-foreground'}`}>
                Clinical assessment tool for mental health professionals. Not a substitute for professional medical advice.
              </p>
            </div>

            {/* Version & Status */}
            <div className={`text-right text-xs ${dark ? 'text-gray-600' : 'text-muted-foreground'}`}>
              <p>Version 2.0 - Production</p>
              <p className="text-green-400 mt-1">✓ HIPAA Compliant</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
