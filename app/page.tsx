"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, 
  QrCode, 
  Receipt, 
  Smartphone, 
  Bell, 
  LineChart, 
  Package, 
  Users, 
  ChevronRight,
  CheckCircle2,
  X,
  Mail,
  MessageCircle,
  MapPin,
  Download,
  Lock,
  Loader2
} from "lucide-react"

export default function Home() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showRefund, setShowRefund] = useState(false)
  const [showCookie, setShowCookie] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDownloadOpen, setIsDownloadOpen] = useState(false)
  const [downloadPassword, setDownloadPassword] = useState("")
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState("")

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80 // height of fixed header
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  const DownloadModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const handleDownload = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsDownloading(true);
      setDownloadError("");

      try {
        const response = await fetch('/api/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            password: downloadPassword,
            filename: 'software-v1.zip' // This can be dynamic in future
          }),
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'DineByte_Software_v1.zip';
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
          onClose();
          setDownloadPassword("");
        } else {
          const data = await response.json();
          setDownloadError(data.error || "Incorrect password. Please try again.");
        }
      } catch (err) {
        setDownloadError("Failed to initiate download. Please check your connection.");
      } finally {
        setIsDownloading(false);
      }
    };

    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="p-8 sm:p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Secure Download</h3>
                    <p className="text-slate-500 text-sm mt-2">Enter password to download software</p>
                  </div>
                  <button 
                    onClick={onClose} 
                    className="p-2.5 hover:bg-slate-100 rounded-2xl transition-colors group" 
                    aria-label="Close"
                    disabled={isDownloading}
                  >
                    <X className="w-6 h-6 text-slate-400 group-hover:text-slate-900 transition-colors" />
                  </button>
                </div>
                
                <form className="space-y-6" onSubmit={handleDownload}>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-600" />
                      Software Password
                    </label>
                    <input 
                      type="password" 
                      required 
                      value={downloadPassword}
                      onChange={(e) => setDownloadPassword(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all" 
                      placeholder="••••••••••••" 
                    />
                    <p className="text-[10px] text-slate-400 mt-1 ml-1 uppercase tracking-wider font-bold">
                      Password hint: Dinebytesoftware.in
                    </p>
                  </div>

                  {downloadError && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-xl border border-red-100 flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      {downloadError}
                    </motion.p>
                  )}

                  <button 
                    type="submit" 
                    disabled={isDownloading}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-amber-600 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                        Download Now
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <p className="text-xs text-amber-700 leading-relaxed text-center">
                    This software is protected. By downloading, you agree to our 
                    <button onClick={() => { onClose(); setShowTerms(true); }} className="font-bold underline ml-1">Terms of Service</button>.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    )
  }

  const Modal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="p-8 sm:p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Book a Demo</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-amber-600 text-sm font-bold uppercase tracking-wider">100% Free of Cost</p>
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  className="p-2.5 hover:bg-slate-100 rounded-2xl transition-colors group" 
                  aria-label="Close"
                  disabled={isSubmitting}
                >
                  <X className="w-6 h-6 text-slate-400 group-hover:text-slate-900 transition-colors" />
                </button>
              </div>
              <form className="space-y-5" onSubmit={async (e) => { 
                e.preventDefault(); 
                setIsSubmitting(true);
                
                const formData = new FormData(e.currentTarget);
                const data = {
                  name: formData.get('name'),
                  restaurant: formData.get('restaurant'),
                  email: formData.get('email'),
                };

                try {
                  const response = await fetch('/api/send', {
                    method: 'POST',
                    body: JSON.stringify(data),
                  });

                  if (response.ok) {
                    onClose(); 
                    alert("Thank you! Your demo request has been sent. We'll contact you soon."); 
                  } else {
                    const error = await response.json();
                    alert(error.error?.message || "Something went wrong. Please try again.");
                  }
                } catch (err) {
                  alert("Failed to send request. Please check your connection.");
                } finally {
                  setIsSubmitting(false);
                }
              }}>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                  <input 
                    name="name"
                    type="text" 
                    required 
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all" 
                    placeholder="John Doe" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Restaurant Name</label>
                  <input 
                    name="restaurant"
                    type="text" 
                    required 
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all" 
                    placeholder="The Gourmet Kitchen" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                  <input 
                    name="email"
                    type="email" 
                    required 
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all" 
                    placeholder="john@example.com" 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-5 bg-amber-600 text-white rounded-2xl font-bold text-lg hover:bg-amber-700 transition-all shadow-xl shadow-amber-600/20 active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : "Request Free Demo"}
                </button>
                <p className="text-center text-xs text-slate-400 mt-4">
                  By clicking, you agree to our <button type="button" onClick={() => { onClose(); setShowTerms(true); }} className="text-amber-600 font-semibold hover:underline">Terms & Conditions</button>
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  const TermsModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 max-h-[85vh] flex flex-col"
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Terms & Conditions</h3>
                <p className="text-slate-500 text-sm mt-1">Last updated: March 2024 | DineByte India</p>
              </div>
              <button 
                onClick={onClose} 
                className="p-2.5 hover:bg-slate-200/50 rounded-2xl transition-colors group" 
                aria-label="Close"
              >
                <X className="w-6 h-6 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </button>
            </div>
            <div className="p-8 sm:p-10 overflow-y-auto custom-scrollbar">
              <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600 leading-relaxed">Welcome to DineByte. These terms and conditions outline the rules and regulations for the use of DineByte's Restaurant Management Platform, operated under Indian jurisdiction.</p>
                
                <div className="mt-10 space-y-10">
                  <section>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm">1</div>
                      <h4 className="text-xl font-bold text-slate-900 m-0">Acceptance of Terms</h4>
                    </div>
                    <p className="text-slate-600 leading-relaxed">By accessing this platform, you agree to comply with and be bound by these terms. Our services are intended for use by business entities (restaurants/cafes) registered in India.</p>
                  </section>

                  <section>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm">2</div>
                      <h4 className="text-xl font-bold text-slate-900 m-0">Subscription & Billing</h4>
                    </div>
                    <p className="text-slate-600 leading-relaxed">DineByte operates on a SaaS model. All prices are inclusive of applicable <strong>GST (Goods and Services Tax)</strong>. Subscriptions are billed in advance on a monthly or annual basis as per the selected plan.</p>
                  </section>

                  <section>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm">3</div>
                      <h4 className="text-xl font-bold text-slate-900 m-0">Software Usage</h4>
                    </div>
                    <p className="text-slate-600 leading-relaxed">You are granted a non-exclusive, non-transferable license to use DineByte for your internal business operations. Reverse engineering or unauthorized distribution of the software is strictly prohibited under the <strong>Indian Copyright Act</strong>.</p>
                  </section>

                  <section>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm">4</div>
                      <h4 className="text-xl font-bold text-slate-900 m-0">User Responsibilities</h4>
                    </div>
                    <p className="text-slate-600 leading-relaxed">Users must ensure the accuracy of data entered into the system. DineByte is not responsible for incorrect billing or tax calculations resulting from erroneous user input.</p>
                  </section>

                  <section>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm">5</div>
                      <h4 className="text-xl font-bold text-slate-900 m-0">Governing Law</h4>
                    </div>
                    <p className="text-slate-600 leading-relaxed">These terms are governed by the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts in <strong>Patna, Bihar</strong>.</p>
                  </section>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  const PrivacyModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 max-h-[85vh] flex flex-col"
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Privacy Policy</h3>
                <p className="text-slate-500 text-sm mt-1">Compliant with Digital Personal Data Protection Act, 2023</p>
              </div>
              <button 
                onClick={onClose} 
                className="p-2.5 hover:bg-slate-200/50 rounded-2xl transition-colors group" 
                aria-label="Close"
              >
                <X className="w-6 h-6 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </button>
            </div>
            <div className="p-8 sm:p-10 overflow-y-auto custom-scrollbar">
              <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600 leading-relaxed">DineByte is committed to protecting your business and customer data. This policy explains how we collect, use, and safeguard your information.</p>
                
                <div className="mt-10 space-y-10">
                  <section>
                    <h4 className="text-xl font-bold text-slate-900 mb-4">Data Collection</h4>
                    <p className="text-slate-600 leading-relaxed">We collect restaurant information (name, address, GSTIN), owner contact details, and customer transaction data solely for providing our management services.</p>
                  </section>

                  <section>
                    <h4 className="text-xl font-bold text-slate-900 mb-4">Data Usage</h4>
                    <p className="text-slate-600 leading-relaxed">Your data is used to generate bills, provide analytics, and manage orders. We <strong>do not sell</strong> your data or your customers' data to third-party marketing agencies.</p>
                  </section>

                  <section>
                    <h4 className="text-xl font-bold text-slate-900 mb-4">Data Security</h4>
                    <p className="text-slate-600 leading-relaxed">All data is stored on secure cloud servers with end-to-end encryption. We follow industry-standard security protocols to prevent unauthorized access.</p>
                  </section>

                  <section>
                    <h4 className="text-xl font-bold text-slate-900 mb-4">Compliance</h4>
                    <p className="text-slate-600 leading-relaxed">We comply with the <strong>Information Technology Act, 2000</strong> and the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> of India.</p>
                  </section>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  const RefundModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 max-h-[85vh] flex flex-col"
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Cancellation & Refund</h3>
                <p className="text-slate-500 text-sm mt-1">Fair usage policy for our partners</p>
              </div>
              <button 
                onClick={onClose} 
                className="p-2.5 hover:bg-slate-200/50 rounded-2xl transition-colors group" 
                aria-label="Close"
              >
                <X className="w-6 h-6 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </button>
            </div>
            <div className="p-8 sm:p-10 overflow-y-auto custom-scrollbar">
              <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600 leading-relaxed">At DineByte, we believe in providing value. Our refund policy is designed to be fair and transparent.</p>
                
                <div className="mt-10 space-y-10">
                  <section>
                    <h4 className="text-xl font-bold text-slate-900 mb-4">Subscription Cancellation</h4>
                    <p className="text-slate-600 leading-relaxed">You can cancel your subscription at any time through your dashboard. Your service will continue until the end of the current billing cycle.</p>
                  </section>

                  <section>
                    <h4 className="text-xl font-bold text-slate-900 mb-4">Refund Eligibility</h4>
                    <p className="text-slate-600 leading-relaxed">Refunds are provided if requested within <strong>7 days of the initial purchase</strong>, provided the service has not been extensively used. Renewal payments are generally non-refundable.</p>
                  </section>

                  <section>
                    <h4 className="text-xl font-bold text-slate-900 mb-4">Hardware Refunds</h4>
                    <p className="text-slate-600 leading-relaxed">For smart hardware purchases, a full refund is available within 15 days for defective units. The hardware must be returned in its original packaging.</p>
                  </section>

                  <section>
                    <h4 className="text-xl font-bold text-slate-900 mb-4">Processing Time</h4>
                    <p className="text-slate-600 leading-relaxed">Once approved, refunds are processed within <strong>5-7 working days</strong> to the original payment method used.</p>
                  </section>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  const CookieModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 max-h-[85vh] flex flex-col"
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Cookie Policy</h3>
                <p className="text-slate-500 text-sm mt-1">How we use cookies to improve your experience</p>
              </div>
              <button 
                onClick={onClose} 
                className="p-2.5 hover:bg-slate-200/50 rounded-2xl transition-colors group" 
                aria-label="Close"
              >
                <X className="w-6 h-6 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </button>
            </div>
            <div className="p-8 sm:p-10 overflow-y-auto custom-scrollbar">
              <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600 leading-relaxed">DineByte uses cookies to ensure the platform functions correctly and to provide a personalized experience for your staff and customers.</p>
                
                <div className="mt-10 space-y-10">
                  <section>
                    <h4 className="text-xl font-bold text-slate-900 mb-4">Essential Cookies</h4>
                    <p className="text-slate-600 leading-relaxed">These are required for core features like session management, secure login, and basket persistence during QR ordering.</p>
                  </section>

                  <section>
                    <h4 className="text-xl font-bold text-slate-900 mb-4">Analytics Cookies</h4>
                    <p className="text-slate-600 leading-relaxed">We use these to understand how users interact with our dashboard, helping us optimize performance and usability.</p>
                  </section>

                  <section>
                    <h4 className="text-xl font-bold text-slate-900 mb-4">Preference Cookies</h4>
                    <p className="text-slate-600 leading-relaxed">These remember your settings such as language preferences and dashboard layout customizations.</p>
                  </section>

                  <section>
                    <h4 className="text-xl font-bold text-slate-900 mb-4">Third-Party Cookies</h4>
                    <p className="text-slate-600 leading-relaxed">Our payment gateways (like Razorpay) may use cookies to ensure secure transaction processing.</p>
                  </section>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  const Mockup = ({ src, delay = 0, className = "" }: { src: string, delay?: number, className?: string }) => (
    <motion.div 
      initial={{ opacity: 0, y: 40, rotateX: 5 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay, ease: [0.21, 0.45, 0.32, 0.9] }}
      className={`relative w-full group perspective-2000 ${className}`}
    >
      <div className="absolute -inset-10 bg-linear-to-tr from-amber-500/20 via-transparent to-blue-500/20 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition duration-1000" />
      
      <motion.div 
        whileHover={{ 
          rotateX: 5, 
          rotateY: -5, 
          scale: 1.05,
          z: 50
        }}
        className="relative rounded-[2.5rem] bg-white/90 backdrop-blur-md p-3 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 overflow-hidden transform-gpu transition-all duration-700 ease-out"
      >
        {/* Browser Frame Header */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-slate-50/80 backdrop-blur-md border-b border-slate-200/50 flex items-center px-6 gap-2 z-20">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
          </div>
          <div className="mx-auto flex items-center gap-2 bg-slate-200/30 px-4 py-1 rounded-lg">
             <Lock className="w-2.5 h-2.5 text-slate-400" />
             <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">dinebyte.in</div>
          </div>
        </div>

        <div className="relative mt-10 rounded-2xl overflow-hidden border border-slate-200/50 shadow-inner bg-slate-100">
          <img
            src={src}
            className="w-full h-auto object-cover transform transition-transform duration-1000 group-hover:scale-105"
            alt="mockup"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
      </motion.div>
    </motion.div>
  )

  const ExperienceShowcase = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const mockups = [
      {
        src: "/ai mockup.jpg",
        title: "Gemini AI Dashboard",
        desc: "Advanced neural networks analyzing your restaurant data in real-time.",
        badge: "AI ENGINE",
        icon: LineChart
      },
      {
        src: "/bill mockup.jpg",
        title: "Billing Configuration",
        desc: "Professional GST-ready billing with deep revenue insights and customization.",
        badge: "SMART BILLING",
        icon: Receipt
      },
      {
        src: "/order mockup.jpg",
        title: "Premium Ordering",
        desc: "Seamless ordering experience designed for high-pressure environments.",
        badge: "SECURE ORDERING",
        icon: QrCode
      }
    ]

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % mockups.length)
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + mockups.length) % mockups.length)

    return (
      <section className="py-32 px-6 bg-[#fafbfc] overflow-hidden relative">
        {/* Ambient backgrounds */}
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-sm font-bold text-amber-600 uppercase tracking-[0.3em] mb-4"
            >
              Visual Intelligence
            </motion.h2>
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900"
            >
              Advanced <span className="text-amber-600">Restaurant</span> Ecosystem
            </motion.h3>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="relative h-125 md:h-175 flex items-center justify-center perspective-3000">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100, rotateY: -20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, rotateY: 20, scale: 0.9 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute w-full h-full flex items-center justify-center transform-gpu"
                >
                  <div className="relative w-full group">
                    <Mockup src={mockups[currentIndex].src} className="shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]" />
                    
                    {/* Floating Info Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[90%] md:w-auto bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-4xl border border-slate-200 shadow-2xl z-30 flex flex-col md:flex-row items-center gap-6"
                    >
                      <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
                        {(() => {
                          const Icon = mockups[currentIndex].icon;
                          return <Icon className="w-8 h-8" />;
                        })()}
                      </div>
                      <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                          <h4 className="text-xl font-bold text-slate-900">{mockups[currentIndex].title}</h4>
                          <span className="px-3 py-1 bg-amber-100 text-amber-600 text-[10px] font-black rounded-full uppercase tracking-widest">
                            {mockups[currentIndex].badge}
                          </span>
                        </div>
                        <p className="text-slate-500 text-sm max-w-sm">{mockups[currentIndex].desc}</p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-20 z-40">
              <button
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-xl border border-slate-100 hover:bg-amber-600 hover:text-white transition-all hover:scale-110 active:scale-90 group"
              >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8 rotate-180 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-20 z-40">
              <button
                onClick={nextSlide}
                aria-label="Next Slide"
                className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-xl border border-slate-100 hover:bg-amber-600 hover:text-white transition-all hover:scale-110 active:scale-90 group"
              >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Slide Indicators */}
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 flex gap-3 z-40">
              {mockups.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    currentIndex === i ? "w-12 bg-amber-600" : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      <Modal isOpen={open} onClose={() => setOpen(false)} />
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <RefundModal isOpen={showRefund} onClose={() => setShowRefund(false)} />
      <CookieModal isOpen={showCookie} onClose={() => setShowCookie(false)} />
      <DownloadModal isOpen={isDownloadOpen} onClose={() => setIsDownloadOpen(false)} />

      {/* NAVBAR */}
      <header 
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled ? "py-4 bg-white/70 backdrop-blur-2xl border-b border-slate-200/50 shadow-sm" : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="relative w-12 h-12 flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="DineByte Logo" 
                className="w-full h-full object-contain transform transition-transform group-hover:scale-110"
              />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
              DineByte
            </h1>
          </motion.div>

          <nav className="hidden md:flex items-center gap-2 p-1.5 bg-slate-100/50 backdrop-blur-md rounded-2xl border border-slate-200/50">
            {[
              { id: "features", label: "Features" },
              { id: "solutions", label: "Solutions" },
              { id: "downloads", label: "Downloads" },
              { id: "advanced", label: "Enterprise" },
              { id: "contact", label: "Contact" },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => scrollTo(item.id)} 
                className="px-5 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition-all"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setOpen(true)}
              className="hidden sm:block px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-xl shadow-slate-900/10 hover:bg-amber-600 transition-all hover:scale-105 active:scale-95"
            >
              Free Demo
            </motion.button>
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
                <span className="w-6 h-0.5 bg-slate-900 rounded-full" />
                <span className="w-4 h-0.5 bg-slate-900 rounded-full" />
                <span className="w-6 h-0.5 bg-slate-900 rounded-full" />
              </div>}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
            >
              <div className="p-6 space-y-4">
                {[
                  { id: "features", label: "Features" },
                  { id: "solutions", label: "Solutions" },
                  { id: "downloads", label: "Downloads" },
                  { id: "advanced", label: "Enterprise" },
                  { id: "contact", label: "Contact" },
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => { scrollTo(item.id); setIsMobileMenuOpen(false); }} 
                    className="block w-full text-left p-4 text-lg font-bold text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-2xl transition-all"
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => { setOpen(true); setIsMobileMenuOpen(false); }}
                  className="w-full py-5 bg-amber-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-amber-600/20"
                >
                  Book Free Demo
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>


      {/* HERO */}
      <section className="relative pt-44 pb-32 px-6 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-sm font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                Empowering Local Businesses — Better than the Industry Giants
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight text-slate-900 mb-8">
              Premium Tech for <br />
              <span className="bg-linear-to-r from-amber-600 via-amber-500 to-amber-400 bg-clip-text text-transparent">
                Every Neighborhood Cafe
              </span>
            </h1>

            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12">
              DineByte delivers world-class restaurant management at a fraction of the cost. 
              Built with love in India, we provide small businesses with the elite tools 
              usually reserved for big names—budget-friendly, powerful, and local.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <button
                onClick={() => setOpen(true)}
                className="group px-8 py-4 bg-amber-600 text-white rounded-2xl font-bold shadow-xl shadow-amber-600/20 hover:bg-amber-700 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                Book Free Demo
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => scrollTo("contact")}
                className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                Get in Touch
              </button>
            </div>
          </motion.div>

          <div className="mt-24 max-w-5xl mx-auto">
            <Mockup src="/dashboardnew.jpg" delay={0.2} />
          </div>
        </div>
      </section>


      {/* TRUSTED BY / CLIENTS */}
      <section className="py-24 border-y border-slate-100 bg-white/50 backdrop-blur-sm overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-16"
          >
            Trusted by 500+ leading restaurants & cafes
          </motion.p>
          
          <div className="relative flex overflow-hidden group">
            {/* Gradient Masks */}
            <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-white to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-white to-transparent z-10" />

            <div className="flex animate-marquee whitespace-nowrap gap-20 items-center py-4">
              {[
                { name: "Bharat 28", font: "font-serif" },
                { name: "Ministry of Chai", font: "font-sans" },
                { name: "The Gourmet Kitchen", font: "font-serif" },
                { name: "Urban Bistro", font: "font-sans" },
                { name: "Spice Route", font: "font-serif" },
                { name: "Brew & Beans", font: "font-sans" },
                { name: "Royal Feast", font: "font-serif" },
                { name: "Coastal Cravings", font: "font-sans" }
              ].map((client, i) => (
                <div 
                  key={i} 
                  className={`flex items-center gap-4 text-3xl font-bold text-slate-300 hover:text-amber-500 transition-all duration-500 cursor-default grayscale hover:grayscale-0 hover:scale-110 ${client.font}`}
                >
                  <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-amber-400 transition-colors" />
                  {client.name}
                </div>
              ))}
            </div>
            {/* Duplicate for seamless loop */}
            <div className="flex animate-marquee whitespace-nowrap gap-20 items-center py-4 ml-20" aria-hidden="true">
               {[
                 { name: "Bharat 28", font: "font-serif" },
                 { name: "Ministry of Chai", font: "font-sans" },
                 { name: "The Gourmet Kitchen", font: "font-serif" },
                 { name: "Urban Bistro", font: "font-sans" },
                 { name: "Spice Route", font: "font-serif" },
                 { name: "Brew & Beans", font: "font-sans" },
                 { name: "Royal Feast", font: "font-serif" },
                 { name: "Coastal Cravings", font: "font-sans" }
               ].map((client, i) => (
                 <div 
                   key={i} 
                   className={`flex items-center gap-4 text-3xl font-bold text-slate-300 hover:text-amber-500 transition-all duration-500 cursor-default grayscale hover:grayscale-0 hover:scale-110 ${client.font}`}
                 >
                   <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-amber-400 transition-colors" />
                   {client.name}
                 </div>
               ))}
             </div>
          </div>
        </div>
      </section>

      <ExperienceShowcase />


      {/* FEATURES */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto relative">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="grid md:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-bold text-amber-600 uppercase tracking-widest mb-4">Core Platform</h2>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900">
                Intuitive Management <br />for Modern Teams
              </h3>
            </motion.div>

            <div className="space-y-4">
              {[
                { 
                  icon: Users, 
                  title: "Small Business First", 
                  desc: "Built specifically for local cafes and restaurants. We offer high-end features at a budget-friendly price point.",
                  img: "/order mockup.jpg"
                },
                { 
                  icon: LayoutDashboard, 
                  title: "Smart Table Management", 
                  desc: "Visualize your entire floor in real-time. Track order status, occupancy, and turnover at a glance.",
                  img: "/tablenew.jpg"
                },
                { 
                  icon: QrCode, 
                  title: "QR Ordering Experience", 
                  desc: "Give your guests the power to order and pay from their phones. No apps, no friction, just pure speed.",
                  img: "/qr.png"
                },
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex gap-6 p-8 rounded-4xl hover:bg-white hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 border border-transparent hover:border-slate-100"
                >
                  <div className="shrink-0 w-16 h-16 bg-slate-50 rounded-[1.25rem] flex items-center justify-center text-slate-400 group-hover:bg-amber-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-amber-600/30 transition-all duration-500 group-hover:rotate-6">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">{item.title}</h4>
                    <p className="text-slate-500 leading-relaxed text-lg">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 bg-amber-500/10 rounded-full blur-[120px] opacity-50" />
            <div className="relative z-10 scale-110">
              <Mockup src="/tablenew.jpg" />
            </div>
            {/* Floating UI Elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -right-12 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 z-20 hidden lg:block"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                  <LineChart className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase">Revenue Today</p>
                  <p className="text-2xl font-bold text-slate-900">₹42,500.00</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* SOLUTIONS */}
      <section id="solutions" className="py-32 px-6 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-200 h-200 bg-amber-500 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-4">The Ecosystem</h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Complete Hardware & Software</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                id: "dashboard",
                icon: Smartphone,
                title: "Cloud POS Software",
                desc: "Lightning fast interface that works on any device. 99.9% uptime guaranteed.",
                features: ["Offline Mode", "Multi-terminal Sync", "Staff Permissions"],
                img: "/dashboardnew.jpg"
              },
              {
                id: "qr",
                icon: QrCode,
                title: "QR Ordering System",
                desc: "Beautiful digital menus that increase average order value by up to 30%.",
                features: ["Image-rich Menus", "Instant Updates", "Digital Payments"],
                img: "/qr.png"
              },
              {
                id: "hardware",
                icon: Bell,
                title: "Smart Hardware",
                desc: "Commercial-grade devices designed for the heat of the kitchen.",
                features: ["Wireless Bell System", "Thermal Printers", "Kitchen Displays"],
                img: "/device.png"
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setActiveTab(item.id)}
                className={`p-10 rounded-[2.5rem] border transition-all cursor-pointer group relative overflow-hidden ${
                  activeTab === item.id 
                  ? "bg-white/15 border-white/20 shadow-2xl shadow-amber-500/10" 
                  : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                {activeTab === item.id && (
                  <motion.div 
                    layoutId="activeGlow"
                    className="absolute inset-0 bg-linear-to-br from-amber-500/10 to-transparent pointer-events-none"
                  />
                )}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all group-hover:scale-110 ${
                  activeTab === item.id ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "bg-amber-500/20 text-amber-500"
                }`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold mb-4">{item.title}</h4>
                <p className="text-slate-400 mb-8 leading-relaxed">{item.desc}</p>
                <ul className="space-y-3 mb-8">
                  {item.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle2 className={`w-4 h-4 ${activeTab === item.id ? "text-amber-400" : "text-amber-500"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="relative h-48 mt-auto flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={item.img}
                      src={item.img} 
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 20 }}
                      className="h-full object-contain filter drop-shadow-2xl transition-transform group-hover:scale-105" 
                      alt={item.title} 
                    />
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* DOWNLOADS SECTION */}
      <section id="downloads" className="py-32 px-6 max-w-7xl mx-auto relative overflow-hidden">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="bg-white rounded-[3rem] p-12 md:p-20 border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-amber-500 via-amber-600 to-amber-700" />
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-bold mb-6">
                <Download className="w-4 h-4" />
                Latest Version: v1.0.4
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
                Download the <br />
                <span className="text-amber-600">DineByte Desktop App</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-10">
                Get the full power of DineByte on your desktop. Our secure software 
                provides a stable, lightning-fast experience for your restaurant management, 
                even with multiple terminals and offline support.
              </p>

              <div className="space-y-6 mb-12">
                {[
                  "Native Windows & macOS support",
                  "Automatic background updates",
                  "Advanced printer driver integration",
                  "Secure local data encryption"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-700 font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    {feature}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsDownloadOpen(true)}
                className="group px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-amber-600 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-slate-900/20 flex items-center gap-3"
              >
                <Download className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
                Download Software
              </button>
              
              <p className="mt-6 text-sm text-slate-400 font-medium flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password required for access
              </p>
            </div>

            <div className="relative">
              <div className="absolute -inset-10 bg-blue-500/5 rounded-full blur-[120px] opacity-50" />
              <div className="relative z-10">
                <div className="bg-slate-50 rounded-4xl p-4 border border-slate-100">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100">
                    <div className="bg-slate-900 p-3 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                      </div>
                      <div className="mx-auto text-[10px] text-slate-400 font-bold uppercase tracking-widest">DineByte Desktop</div>
                    </div>
                    <img 
                      src="/dashboardnew.jpg" 
                      alt="DineByte Desktop App" 
                      className="w-full h-auto opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              </div>
              
              {/* Floating stats */}
              <motion.div 
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 z-20 hidden sm:block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">File Size</p>
                    <p className="text-xl font-bold text-slate-900">124 MB</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>


      {/* ADVANCED FEATURES (Replacement for Pricing) */}
      <section id="advanced" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="bg-amber-600 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-150 h-150 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-white/80 font-bold uppercase tracking-widest text-sm mb-4">Enterprise Power</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-8">
                Advanced Tools for <br />Ambitious Restaurants
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { icon: LineChart, title: "AI Analytics", desc: "Predict peak times and optimize staffing." },
                  { icon: Package, title: "Smart Inventory", desc: "Auto-reordering and waste tracking." },
                  { icon: Users, title: "CRM & Loyalty", desc: "Personalized marketing for regulars." },
                  { icon: Smartphone, title: "Multi-Outlet", desc: "Manage 100+ locations from one dashboard." },
                ].map((item, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <item.icon className="w-6 h-6 text-amber-200 mb-4" />
                    <h4 className="text-white font-bold mb-2">{item.title}</h4>
                    <p className="text-amber-50 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setOpen(true)}
                className="mt-12 px-8 py-4 bg-white text-amber-600 rounded-2xl font-bold hover:bg-amber-50 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10"
              >
                Learn More About Enterprise
              </button>
            </div>

            <div className="hidden lg:block">
              <Mockup src="/bill mockup.jpg" />
            </div>
          </div>
        </div>
      </section>


      {/* CONTACT CTA */}
      <section id="contact" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900 rounded-[3rem] p-12 md:p-24 border border-white/10 relative overflow-hidden text-center"
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-[120px] -translate-y-1/2" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[120px] translate-y-1/2" />
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-8">
                Ready to Transform <br />Your Restaurant?
              </h2>
              <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                Join 500+ restaurants that have modernized their operations with DineByte. 
                <span className="text-amber-500 font-bold block mt-2">Setup takes less than 24 hours.</span>
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mb-16 max-w-3xl mx-auto">
                <motion.a 
                  whileHover={{ y: -5 }}
                  href="mailto:siddhant.anand17@gmail.com" 
                  className="flex items-center gap-6 p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-amber-500/50 transition-all group"
                >
                  <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
                    <Mail className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Email Us</p>
                    <p className="text-white font-bold text-lg truncate">siddhant.anand17@gmail.com</p>
                  </div>
                </motion.a>

                <motion.a 
                  whileHover={{ y: -5 }}
                  href="https://wa.me/916205339833" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-6 p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-green-500/50 transition-all group"
                >
                  <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all duration-500">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">WhatsApp</p>
                    <p className="text-white font-bold text-lg">+91 6205339833</p>
                  </div>
                </motion.a>
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
                <button
                  onClick={() => setOpen(true)}
                  className="group px-12 py-6 bg-amber-600 text-white rounded-2xl font-bold text-xl hover:bg-amber-700 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-amber-600/30 flex items-center gap-3"
                >
                  Book Free Demo
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 bg-slate-800 overflow-hidden ring-2 ring-white/10">
                        <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="user" />
                      </div>
                    ))}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-lg">500+ Active</p>
                    <p className="text-slate-500 text-sm font-medium">Restaurant Partners</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-24 pb-12 px-6 border-t border-slate-200 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center p-2.5 shadow-xl shadow-slate-900/10">
                  <img 
                    src="/logo.png" 
                    alt="DineByte Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-slate-900 tracking-tight">DineByte</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-5 h-3 bg-linear-to-b from-[#FF9933] via-white to-[#138808] rounded-xs border border-slate-200" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Make in India</span>
                  </div>
                </div>
              </div>
              <p className="text-slate-500 text-lg leading-relaxed max-w-md mb-8">
                The most budget-friendly, high-performance restaurant management system for small businesses. 
                Proudly empowering Indian neighborhood cafes to compete with global giants.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" aria-label="WhatsApp Support" className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 hover:bg-amber-600 hover:text-white transition-all">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="#" aria-label="Email Support" className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 hover:bg-amber-600 hover:text-white transition-all">
                  <Mail className="w-5 h-5" />
                </a>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-slate-500 text-sm font-bold border border-slate-100">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  Bihar, India
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-8 uppercase tracking-widest text-xs">Platform</h4>
              <ul className="space-y-4 text-slate-500 font-bold">
                <li><button onClick={() => scrollTo("features")} className="hover:text-amber-600 transition-colors">Features</button></li>
                <li><button onClick={() => scrollTo("solutions")} className="hover:text-amber-600 transition-colors">Solutions</button></li>
                <li><button onClick={() => scrollTo("advanced")} className="hover:text-amber-600 transition-colors">Enterprise</button></li>
                <li><button onClick={() => setOpen(true)} className="hover:text-amber-600 transition-colors">Book Demo</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-8 uppercase tracking-widest text-xs">Legal</h4>
              <ul className="space-y-4 text-slate-500 font-bold">
                <li><button onClick={() => setShowTerms(true)} className="hover:text-amber-600 transition-colors">Terms & Conditions</button></li>
                <li><button onClick={() => setShowPrivacy(true)} className="hover:text-amber-600 transition-colors">Privacy Policy</button></li>
                <li><button onClick={() => setShowRefund(true)} className="hover:text-amber-600 transition-colors">Refund Policy</button></li>
                <li><button onClick={() => setShowCookie(true)} className="hover:text-amber-600 transition-colors">Cookie Policy</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <p className="text-slate-400 text-sm font-bold">© 2024 DineByte. All rights reserved.</p>
              <p className="text-slate-400 text-xs mt-2 font-medium">
                Designed & Developed with ❤️ by{" "}
                <a 
                  href="https://instagram.com/thisizzzsid" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:text-amber-700 transition-colors font-bold"
                >
                  Siddhant Anand
                </a>
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              <img src="/vercel.svg" alt="Vercel" className="h-4 opacity-30 grayscale hover:grayscale-0 transition-all" />
              <img src="/next.svg" alt="Next.js" className="h-4 opacity-30 grayscale hover:grayscale-0 transition-all" />
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}