import { Star, Quote } from "lucide-react"


const testimonials = [
  {
    name: "Sarah Chen",
    role: "Portfolio Manager",
    company: "Green Capital",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHdvbWFuJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzU5NTI2ODA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    content: "Pasture Portfolio has transformed how we approach agricultural investments. The AI-powered insights and real-time analytics have helped us achieve 28% returns while supporting sustainable farming.",
    rating: 5
  },
  {
    name: "Marcus Rodriguez",
    role: "Individual Investor",
    company: "Former Tech Executive",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG1hbiUyMGJ1c2luZXNzfGVufDF8fHx8MTc1OTUyNjgwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    content: "After years in tech, I wanted investments that made a difference. Pasture Portfolio combines strong returns with environmental impact. My portfolio has grown 35% while supporting 12 sustainable farms.",
    rating: 5
  },
  {
    name: "Dr. Elena Vasquez",
    role: "Agricultural Scientist",
    company: "Sustainability Institute",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHdvbWFuJTIwc2NpZW50aXN0fGVufDF8fHx8MTc1OTUyNjgwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    content: "As a scientist, I appreciate Pasture Portfolio's rigorous approach to sustainability. Their platform connects investors with truly innovative agricultural projects that are reshaping food production.",
    rating: 5
  }
]

const Testimonials = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-emerald-800/50 via-transparent to-teal-800/30"></div>
      
      {/* Organic shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full blur-3xl -translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-teal-400/20 to-transparent rounded-full blur-3xl translate-x-32 translate-y-32"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-white">Trusted by Thousands</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            What Our Investors 
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"> Say</span>
          </h2>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            Real stories from real investors who are building wealth while creating positive impact in agriculture.
          </p>
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="group">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 h-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/15">
                {/* Quote icon */}
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Quote className="w-6 h-6 text-white" />
                </div>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                {/* Content */}
                <p className="text-white leading-relaxed mb-8 text-lg">
                  "{testimonial.content}"
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-emerald-500/20 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <p className="text-emerald-200 text-sm">{testimonial.role}</p>
                    <p className="text-emerald-300 text-xs">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Bottom stats */}
        <div className="mt-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-black text-white mb-2">4.9/5</p>
              <p className="text-emerald-200">Average Rating</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white mb-2">12,847</p>
              <p className="text-emerald-200">Happy Investors</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white mb-2">$47.2M</p>
              <p className="text-emerald-200">Total Returns</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white mb-2">98%</p>
              <p className="text-emerald-200">Would Recommend</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials;