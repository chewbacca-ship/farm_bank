
import { Leaf, Mail, ArrowRight, Twitter, Linkedin, Instagram, Youtube } from "lucide-react"

const Footer = () => {
  return (
    <footer className="relative overflow-hidden">
      {/* Background with gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-green-900/50 via-transparent to-emerald-900/30"></div>
      
      {/* Organic shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-3xl -translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-teal-500/10 to-transparent rounded-full blur-3xl translate-x-32 translate-y-32"></div>
      
      <div className="relative pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Newsletter Section */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Stay Informed</h3>
                    <p className="text-emerald-200">Weekly market insights & opportunities</p>
                  </div>
                </div>
                <p className="text-emerald-100 leading-relaxed">
                  Get exclusive access to agricultural investment opportunities, market analysis, 
                  and sustainability reports delivered to your inbox.
                </p>
              </div>
              <div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    placeholder="Enter your email address" 
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-emerald-200 rounded-2xl backdrop-blur-sm py-2 px-4" 
                  />
                  <button className="flex flex-row items-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-8 shadow-lg p-2">
                    Subscribe
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
                <p className="text-xs text-emerald-300 mt-2">
                  No spam. Unsubscribe anytime. Read our privacy policy.
                </p>
              </div>
            </div>
          </div>
          
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Pasture Portfolio</h3>
                  <p className="text-emerald-200 text-sm">Smart Agriculture</p>
                </div>
              </div>
              <p className="text-emerald-100 leading-relaxed mb-6 max-w-md">
                Connecting investors with sustainable agricultural opportunities worldwide. 
                Building wealth while creating positive environmental and social impact.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-3">
                <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Twitter className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Youtube className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
            
            {/* Platform */}
            <div>
              <h4 className="font-bold text-white mb-6">Platform</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-emerald-200 hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#" className="text-emerald-200 hover:text-white transition-colors">Investment Types</a></li>
                <li><a href="#" className="text-emerald-200 hover:text-white transition-colors">Risk Management</a></li>
                <li><a href="#" className="text-emerald-200 hover:text-white transition-colors">Success Stories</a></li>
                <li><a href="#" className="text-emerald-200 hover:text-white transition-colors">Sustainability Impact</a></li>
              </ul>
            </div>
            
            {/* Resources */}
            <div>
              <h4 className="font-bold text-white mb-6">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-emerald-200 hover:text-white transition-colors">Market Research</a></li>
                <li><a href="#" className="text-emerald-200 hover:text-white transition-colors">Educational Content</a></li>
                <li><a href="#" className="text-emerald-200 hover:text-white transition-colors">Investment Calculator</a></li>
                <li><a href="#" className="text-emerald-200 hover:text-white transition-colors">API Documentation</a></li>
                <li><a href="#" className="text-emerald-200 hover:text-white transition-colors">Partner Program</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="font-bold text-white mb-6">Support</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-emerald-200 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-emerald-200 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-emerald-200 hover:text-white transition-colors">Live Chat</a></li>
                <li><a href="#" className="text-emerald-200 hover:text-white transition-colors">Phone Support</a></li>
                <li><a href="#" className="text-emerald-200 hover:text-white transition-colors">Community Forum</a></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-emerald-200">&copy; 2025 Pasture Portfolio. All rights reserved.</p>
            <div className="flex flex-wrap gap-6 mt-4 md:mt-0">
              <a href="#" className="text-emerald-200 hover:text-white transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-emerald-200 hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-emerald-200 hover:text-white transition-colors text-sm">Cookie Policy</a>
              <a href="#" className="text-emerald-200 hover:text-white transition-colors text-sm">Regulatory Disclosures</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;