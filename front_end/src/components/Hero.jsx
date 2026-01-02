
import { ArrowRight, TrendingUp, Shield, Leaf, Sparkles, Users, DollarSign } from "lucide-react"

const Hero = ({setLandingPage}) => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background with organic gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-green-100/40 via-transparent to-emerald-100/60"></div>
      
      {/* Organic curved shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-teal-200/20 rounded-full blur-3xl -translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-blue-200/30 to-green-200/20 rounded-full blur-3xl translate-x-32 translate-y-32"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left column - asymmetric layout */}
          <div className="lg:col-span-7">
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">AI-Powered Agricultural Investments</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] text-slate-900">
                Grow Your 
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 bg-clip-text text-transparent">
                  Portfolio
                </span>
                <br />
                <span className="text-4xl md:text-5xl lg:text-6xl text-slate-700">
                  with Agriculture
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 max-w-2xl leading-relaxed">
                Transform your portfolio with sustainable agricultural investments. 
                Access premium farming projects, livestock operations, and agtech innovations.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button size="lg" className="flex flex-row justify-center items-center bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl shadow-xl shadow-emerald-200/50 border-0" onClick={() => setLandingPage(false)}>
                  <span className="text-lg">Start Investing</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button variant="outline" size="lg" className="bg-white/50 backdrop-blur-sm border-white/30 hover:bg-white/70 px-8 py-4 rounded-2xl">
                  <span className="text-lg">Explore Opportunities</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Right column - asymmetric visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative">
              {/* Main image with glassmorphism container */}
              <div className="relative bg-white/20 backdrop-blur-sm border border-white/30 rounded-3xl p-4 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1725338281767-5bbd183e5b54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGZhcm1pbmclMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1OTU4ODY0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Sustainable farming technology"
                  className="rounded-2xl w-full h-80 object-cover"
                />
              </div>
              
              {/* Floating cards with glassmorphism */}
              <div className="absolute -top-8 -left-8 bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">+24.5%</p>
                    <p className="text-sm text-slate-600">Annual Returns</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">$8.2M+</p>
                    <p className="text-sm text-slate-600">Protected</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-1/2 -right-12 bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl p-3 shadow-lg">
                <div className="text-center">
                  <Leaf className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <p className="font-bold text-slate-900">1,240</p>
                  <p className="text-xs text-slate-600">Farms</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom stats section with curved design */}
        <div className="mt-20">
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-8 shadow-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-slate-900">$47.2M</p>
                <p className="text-sm text-slate-600">Total Invested</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-slate-900">12,847</p>
                <p className="text-sm text-slate-600">Active Investors</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-slate-900">1,240+</p>
                <p className="text-sm text-slate-600">Sustainable Farms</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-slate-900">18.7%</p>
                <p className="text-sm text-slate-600">Avg. Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero;