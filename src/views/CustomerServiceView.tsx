import React, { useState } from 'react';
import { HelpCircle, Mail, MessageSquare, Phone, CheckCircle2 } from 'lucide-react';

export const CustomerServiceView: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending message
    setTimeout(() => {
      setIsSubmitted(true);
      setFormData({ subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 600);
  };

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500 min-h-[80vh]">
      {/* Contact Form Section */}
      <div className="flex-1 bg-white rounded-[2rem] p-8 sm:p-10 shadow-sm border border-slate-100 flex flex-col">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
            <Mail className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Contact Support</h1>
            <p className="text-sm text-slate-500">We're here to help you</p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h3>
            <p className="text-slate-500 max-w-xs">
              Thank you for reaching out. Our support team will get back to you within 24 hours.
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="mt-8 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
                placeholder="What do you need help with?"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-medium"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-bold text-slate-700">Message</label>
              <textarea
                required
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                placeholder="Describe your issue in detail..."
                className="w-full h-full min-h-[150px] px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-medium resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-colors mt-2"
            >
              Send Message
            </button>
          </form>
        )}
      </div>

      {/* FAQ & Alternatives */}
      <div className="w-full lg:w-[400px] flex flex-col gap-6">
        <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-slate-400" />
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">How do I negotiate a price?</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                As a buyer, find a product and click "Make an Offer". The vendor will be notified and can accept, reject, or counter your offer.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">How do I add products to my store?</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Vendors can go to the "Overview" tab in their hub, and either type in the product details or use the voice recording feature for quick additions.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">Are my payments secure?</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                MarketMates currently facilitates the negotiation process. Final payments are handled directly between you and the vendor upon meetup or delivery.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-[2rem] p-8 border border-emerald-100 flex flex-col justify-center items-center text-center gap-3">
          <Phone className="w-8 h-8 text-emerald-600 mb-2" />
          <h3 className="font-bold text-emerald-900">Urgent Support?</h3>
          <p className="text-sm text-emerald-700 mb-2">
            Call our toll-free hotline during business hours.
          </p>
          <a href="tel:0800123456" className="text-xl font-black text-emerald-800 hover:text-emerald-900 transition-colors">
            0800-123-456
          </a>
        </div>
      </div>
    </div>
  );
};
