
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Tractor, Sprout, Heart, BarChart3 } from "lucide-react";
import Navbar from "../components/Navbar";
import ServiceCard from "../components/ServiceCard";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-12">
            <div className="flex-1 text-left">
              <span className={`inline-block px-4 py-2 bg-accent text-primary rounded-full text-sm font-medium mb-4
                transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                Empowering Indian Farmers
              </span>
              
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6
                transition-all duration-700 delay-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                Exchange, Sell, and <span className="text-primary">Support</span> in the Farming Community
              </h1>
              
              <p className={`text-muted-foreground text-lg md:text-xl mb-8 max-w-2xl
                transition-all duration-700 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                Vismay connects farmers across India to exchange equipment, sell produce, and receive community support through a simple, intuitive platform.
              </p>
              
              <div className={`flex flex-wrap gap-4
                transition-all duration-700 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <Link to="/barter" className="btn-vismay">
                  Start Exchanging
                  <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn-outline">
                  Join Vismay
                </Link>
              </div>
            </div>
            
            <div className={`flex-1 relative
              transition-all duration-1000 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop" 
                  alt="Indian Farmer with Tractor" 
                  className="w-full h-auto object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              
              {/* Stats cards */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <BarChart3 size={20} />
                  </div>
                  <div className="text-left">
                    <span className="block text-2xl font-bold">5000+</span>
                    <span className="text-xs text-muted-foreground">Equipment Listings</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 animate-float">
                <div className="text-left">
                  <span className="block text-2xl font-bold">10K+</span>
                  <span className="text-xs text-muted-foreground">Happy Farmers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-accent/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-6">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Vismay offers a comprehensive set of services designed to meet the diverse needs of the farming community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard 
              title="Barter Equipment"
              description="Exchange your farming equipment with other farmers based on equivalent value, helping you access the tools you need without major investments."
              icon={<Tractor size={24} />}
              to="/barter"
              delay={0}
            />
            
            <ServiceCard 
              title="Sell Produce"
              description="List your harvested crops for direct sale, connecting with buyers who value quality farm produce and are willing to pay fair prices."
              icon={<Sprout size={24} />}
              to="/sell"
              delay={200}
            />
            
            <ServiceCard 
              title="Donations"
              description="Support fellow farmers in need through targeted donation campaigns that address specific challenges faced by the farming community."
              icon={<Heart size={24} />}
              to="/donations"
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <img 
                src="https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?q=80&w=1000&auto=format&fit=crop" 
                alt="Farmers collaborating" 
                className="rounded-2xl shadow-lg w-full h-auto object-cover"
              />
            </div>
            
            <div className="flex-1 text-left">
              <h2 className="section-heading mb-6">Why Vismay?</h2>
              
              <p className="text-muted-foreground mb-6">
                Vismay was created to address the unique challenges faced by Indian farmers. Our platform is built on principles of community, sustainability, and economic empowerment.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Direct farmer-to-farmer connections without middlemen",
                  "Access to equipment without heavy capital investment",
                  "Community support system for farmers in need",
                  "Simple, intuitive interface designed for rural users",
                  "AI-powered recommendations for optimal equipment matching"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary mt-0.5">
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5L4.33333 8.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8">
                <Link to="/login" className="btn-vismay">
                  Join Our Community
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-accent/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-6">Farmer Success Stories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from farmers who have transformed their operations through Vismay's platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "Vismay helped me exchange my old water pump for a seed drill that I desperately needed. This saved me over ₹40,000 in new equipment costs.",
                name: "Rakesh Kumar",
                location: "Madhya Pradesh",
                image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1000&auto=format&fit=crop"
              },
              {
                quote: "After a difficult season, the donation support from the Vismay community helped my family stay afloat. Now I'm back on my feet and helping others.",
                name: "Lakshmi Devi",
                location: "Andhra Pradesh",
                image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1000&auto=format&fit=crop"
              },
              {
                quote: "I sold my entire wheat harvest directly through Vismay at prices 20% higher than what local middlemen were offering. This platform is a game-changer.",
                name: "Gurpreet Singh",
                location: "Punjab",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"
              }
            ].map((testimonial, index) => (
              <div key={index} className="vismay-card p-6 text-left h-full flex flex-col">
                <div className="mb-4">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.6667 13.3333H5.33334C4.96667 13.3333 4.66667 13.0333 4.66667 12.6667V8.66666C4.66667 8.29999 4.96667 7.99999 5.33334 7.99999H9.33334C9.70001 7.99999 10 8.29999 10 8.66666V10.6667C10 11.0333 10.3 11.3333 10.6667 11.3333C11.0333 11.3333 11.3333 11.0333 11.3333 10.6667V8.66666C11.3333 7.56666 10.4333 6.66666 9.33334 6.66666H5.33334C4.23334 6.66666 3.33334 7.56666 3.33334 8.66666V12.6667C3.33334 13.7667 4.23334 14.6667 5.33334 14.6667H10.6667C11.0333 14.6667 11.3333 14.3667 11.3333 14C11.3333 13.6333 11.0333 13.3333 10.6667 13.3333Z" fill="#779246"/>
                    <path d="M26.6667 13.3333H21.3333C20.9667 13.3333 20.6667 13.0333 20.6667 12.6667V8.66666C20.6667 8.29999 20.9667 7.99999 21.3333 7.99999H25.3333C25.7 7.99999 26 8.29999 26 8.66666V10.6667C26 11.0333 26.3 11.3333 26.6667 11.3333C27.0333 11.3333 27.3333 11.0333 27.3333 10.6667V8.66666C27.3333 7.56666 26.4333 6.66666 25.3333 6.66666H21.3333C20.2333 6.66666 19.3333 7.56666 19.3333 8.66666V12.6667C19.3333 13.7667 20.2333 14.6667 21.3333 14.6667H26.6667C27.0333 14.6667 27.3333 14.3667 27.3333 14C27.3333 13.6333 27.0333 13.3333 26.6667 13.3333Z" fill="#779246"/>
                    <path d="M10.6667 25.3333H5.33334C4.96667 25.3333 4.66667 25.0333 4.66667 24.6667V20.6667C4.66667 20.3 4.96667 20 5.33334 20H10.6667C11.0333 20 11.3333 19.7 11.3333 19.3333C11.3333 18.9667 11.0333 18.6667 10.6667 18.6667H5.33334C4.23334 18.6667 3.33334 19.5667 3.33334 20.6667V24.6667C3.33334 25.7667 4.23334 26.6667 5.33334 26.6667H10.6667C11.0333 26.6667 11.3333 26.3667 11.3333 26C11.3333 25.6333 11.0333 25.3333 10.6667 25.3333Z" fill="#779246"/>
                    <path d="M26.6667 25.3333H21.3333C20.9667 25.3333 20.6667 25.0333 20.6667 24.6667V20.6667C20.6667 20.3 20.9667 20 21.3333 20H25.3333C25.7 20 26 20.3 26 20.6667V22.6667C26 23.0333 26.3 23.3333 26.6667 23.3333C27.0333 23.3333 27.3333 23.0333 27.3333 22.6667V20.6667C27.3333 19.5667 26.4333 18.6667 25.3333 18.6667H21.3333C20.2333 18.6667 19.3333 19.5667 19.3333 20.6667V24.6667C19.3333 25.7667 20.2333 26.6667 21.3333 26.6667H26.6667C27.0333 26.6667 27.3333 26.3667 27.3333 26C27.3333 25.6333 27.0333 25.3333 26.6667 25.3333Z" fill="#779246"/>
                  </svg>
                </div>
                
                <p className="italic text-muted-foreground mb-6 flex-grow">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-primary rounded-3xl p-10 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Farming Experience?
            </h2>
            
            <p className="text-primary-foreground/90 mb-8 max-w-lg mx-auto">
              Join thousands of farmers who are already benefiting from the Vismay community. Start bartering, selling, or supporting today.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/login" className="px-8 py-3 bg-white text-primary rounded-full font-medium hover:bg-white/90 transition-colors">
                Join Vismay
              </Link>
              <Link to="/barter" className="px-8 py-3 bg-transparent border border-white text-white rounded-full font-medium hover:bg-white/10 transition-colors">
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-vismay-950 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <h3 className="text-2xl font-bold mb-4">Vismay</h3>
              <p className="text-white/70 mb-4">
                Connecting farmers across India for equipment exchange, produce sales, and community support.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                <li><Link to="/barter" className="text-white/70 hover:text-white transition-colors">Barter Equipment</Link></li>
                <li><Link to="/sell" className="text-white/70 hover:text-white transition-colors">Sell Produce</Link></li>
                <li><Link to="/donations" className="text-white/70 hover:text-white transition-colors">Make Donations</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23 3.00005C22.0424 3.67552 20.9821 4.19216 19.86 4.53005C19.2577 3.83756 18.4573 3.34674 17.567 3.12397C16.6767 2.90121 15.7395 2.95724 14.8821 3.2845C14.0247 3.61176 13.2884 4.19445 12.773 4.95376C12.2575 5.71308 11.9877 6.61238 12 7.53005V8.53005C10.2426 8.57561 8.50127 8.18586 6.93101 7.39549C5.36074 6.60513 4.01032 5.43868 3 4.00005C3 4.00005 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.50005C20.9991 7.2215 20.9723 6.94364 20.92 6.67005C21.9406 5.66354 22.6608 4.39276 23 3.00005Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 9H2V21H6V9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 11.3701C16.1234 12.2023 15.9812 13.0523 15.5937 13.7991C15.2062 14.5459 14.5931 15.1515 13.8416 15.5297C13.0901 15.908 12.2384 16.0397 11.4077 15.906C10.5771 15.7723 9.80971 15.3801 9.21479 14.7852C8.61987 14.1903 8.22768 13.4229 8.09402 12.5923C7.96035 11.7616 8.09202 10.91 8.47028 10.1584C8.84854 9.40691 9.45414 8.7938 10.2009 8.4063C10.9477 8.0188 11.7977 7.87665 12.63 8.00006C13.4789 8.12594 14.2648 8.52152 14.8717 9.12836C15.4785 9.73521 15.8741 10.5211 16 11.3701Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.5 6.5H17.51" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
              
              <p className="text-white/70 text-sm">
                Email: contact@vismay.org<br />
                Phone: +91 9876543210
              </p>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/50 text-sm">
            <p>© {new Date().getFullYear()} Vismay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
