import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { showSuccessToast } from '../../utils/toastUtils';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    showSuccessToast('Your message has been sent to our sweet team! 🍬');
    e.currentTarget.reset();
  };

  return (
    <div className="bg-surface_container_lowest min-h-screen">
      {/* Hero Section */}
      <div className="bg-primary pt-24 pb-32 px-6">
        <div className="max-w-[1280px] mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black text-on_primary mb-6 tracking-tight">
            Contact Us 🍬
          </h1>
          <p className="text-on_primary/80 text-xl font-bold max-w-2xl mx-auto">
            Have a question about our sweets? We'd love to hear from you! 
            Whether it's a Bulk order or just a sweet hello.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1280px] mx-auto px-6 -mt-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-primary/5">
            <h2 className="text-3xl font-black text-on_surface mb-8">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-black text-on_surface_variant mb-2 ml-1">Your Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Candy Lover"
                    className="w-full bg-surface_container_high rounded-2xl px-6 py-4 text-on_surface font-bold outline-none focus:ring-4 focus:ring-primary/20 transition-all border-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-on_surface_variant mb-2 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="hello@sweet.com"
                    className="w-full bg-surface_container_high rounded-2xl px-6 py-4 text-on_surface font-bold outline-none focus:ring-4 focus:ring-primary/20 transition-all border-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-black text-on_surface_variant mb-2 ml-1">Subject</label>
                <input 
                  type="text" 
                  required
                  placeholder="Inquiry about..."
                  className="w-full bg-surface_container_high rounded-2xl px-6 py-4 text-on_surface font-bold outline-none focus:ring-4 focus:ring-primary/20 transition-all border-none"
                />
              </div>
              <div>
                <label className="block text-sm font-black text-on_surface_variant mb-2 ml-1">Message</label>
                <textarea 
                  required
                  rows="5"
                  placeholder="Type your sweet message here..."
                  className="w-full bg-surface_container_high rounded-3xl px-6 py-4 text-on_surface font-bold outline-none focus:ring-4 focus:ring-primary/20 transition-all border-none resize-none"
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-secondary text-on_secondary py-5 rounded-2xl font-black text-lg shadow-xl shadow-secondary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Send Message <Send size={22} strokeWidth={3} />
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-8">
            <div className="bg-surface_container_high rounded-[40px] p-10 flex flex-col gap-10">
              <h2 className="text-3xl font-black text-on_surface">Visit Our Store</h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-primary text-on_primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                    <MapPin size={28} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-on_surface mb-1">Our Location</h3>
                    <p className="text-on_surface_variant font-medium leading-relaxed">
                      123 Sweet Street, Sugar Land<br />
                      Candy Kingdom, CK 88888
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-tertiary text-on_tertiary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-tertiary/20">
                    <Phone size={28} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-on_surface mb-1">Call Us</h3>
                    <p className="text-on_surface_variant font-medium leading-relaxed">
                      +1 (555) 123-4567<br />
                      Mon - Sat: 9am - 8pm
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-secondary text-on_secondary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-secondary/20">
                    <Mail size={28} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-on_surface mb-1">Email Us</h3>
                    <p className="text-on_surface_variant font-medium leading-relaxed">
                      hello@candyshop.com<br />
                      support@candyshop.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fun Fact Card */}
            <div className="bg-secondary p-8 rounded-[40px] text-on_secondary relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-3 italic">Did you know?</h3>
                  <p className="font-bold opacity-90 leading-relaxed">
                    Gummi bears were first created in Germany in 1922 by Hans Riegel! 🍭
                  </p>
               </div>
               <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
