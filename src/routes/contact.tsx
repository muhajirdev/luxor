import { createFileRoute, Link } from '@tanstack/react-router'
import { Header } from '@/components/Header'
import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, Clock, ArrowRight, Send } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

import type { Variants } from 'framer-motion'

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as const }
  }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
}

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    value: 'hello@luxorbids.com',
    description: 'For general inquiries',
  },
  {
    icon: Phone,
    title: 'Phone',
    value: '+1 (555) 123-4567',
    description: 'Mon-Fri 9am-6pm EST',
  },
  {
    icon: MapPin,
    title: 'Office',
    value: '123 Auction Lane',
    description: 'New York, NY 10001',
  },
  {
    icon: Clock,
    title: 'Response Time',
    value: '< 24 hours',
    description: 'Average response time',
  },
]

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#000000]">
      <Header />

      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <div className="section-marker mb-6">Get In Touch</div>
              <h1 className="headline-xl text-[#fafaf9] mb-4">
                Contact
                <span className="font-display italic font-light"> Us</span>
              </h1>
              <p className="body-xl text-[#8a8a8a] max-w-2xl mb-16">
                Have a question about an auction, need help with your account, 
                or want to discuss a potential partnership? We're here to help.
              </p>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:col-span-7"
            >
              <motion.div variants={fadeInUp}>
                {submitted ? (
                  <div className="border border-[#1a1a1a] bg-[#0a0a0a] p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-[#b87333]">
                      <Send className="h-8 w-8 text-[#b87333]" />
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-[#fafaf9] mb-4">
                      Message Sent
                    </h3>
                    <p className="body-md text-[#8a8a8a] mb-8">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false)
                        setFormData({ name: '', email: '', subject: '', message: '' })
                      }}
                      className="btn-secondary"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="label text-[#8a8a8a] mb-2 block">
                          Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-4 font-editorial text-base text-[#fafaf9] placeholder-[#4a4a4a] transition-all duration-300 focus:border-[#b87333] focus:outline-none"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="label text-[#8a8a8a] mb-2 block">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-4 font-editorial text-base text-[#fafaf9] placeholder-[#4a4a4a] transition-all duration-300 focus:border-[#b87333] focus:outline-none"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="label text-[#8a8a8a] mb-2 block">
                        Subject
                      </label>
                      <select
                        id="subject"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-4 font-editorial text-base text-[#fafaf9] transition-all duration-300 focus:border-[#b87333] focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-[#0a0a0a] text-[#4a4a4a]">Select a topic</option>
                        <option value="general" className="bg-[#0a0a0a]">General Inquiry</option>
                        <option value="auction" className="bg-[#0a0a0a]">Auction Question</option>
                        <option value="account" className="bg-[#0a0a0a]">Account Help</option>
                        <option value="selling" className="bg-[#0a0a0a]">Selling on Luxor</option>
                        <option value="partnership" className="bg-[#0a0a0a]">Partnership</option>
                        <option value="press" className="bg-[#0a0a0a]">Press / Media</option>
                        <option value="other" className="bg-[#0a0a0a]">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="label text-[#8a8a8a] mb-2 block">
                        Message
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-4 font-editorial text-base text-[#fafaf9] placeholder-[#4a4a4a] transition-all duration-300 focus:border-[#b87333] focus:outline-none resize-none"
                        placeholder="Tell us how we can help..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary group w-full md:w-auto"
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          Send Message
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:col-span-5"
            >
              <motion.div variants={fadeInUp} className="border border-[#1a1a1a] bg-[#0a0a0a] p-8">
                <h3 className="font-display text-xl font-semibold text-[#fafaf9] mb-8">
                  Contact Information
                </h3>
                
                <div className="space-y-6">
                  {contactInfo.map((item) => (
                    <div key={item.title} className="flex items-start gap-4">
                      <div className="w-12 h-12 flex items-center justify-center border border-[#1a1a1a] shrink-0">
                        <item.icon className="h-5 w-5 text-[#b87333]" />
                      </div>
                      <div>
                        <div className="label-sm text-[#4a4a4a] mb-1">{item.title}</div>
                        <div className="font-display text-lg text-[#fafaf9]">{item.value}</div>
                        <div className="label-sm text-[#8a8a8a]">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                variants={fadeInUp}
                className="mt-8 border border-[#1a1a1a] bg-[#0a0a0a] p-8"
              >
                <h3 className="font-display text-xl font-semibold text-[#fafaf9] mb-4">
                  Quick Links
                </h3>
                <div className="space-y-3">
                  <Link
                    to="/how-it-works"
                    className="flex items-center justify-between py-3 border-b border-[#1a1a1a] group"
                  >
                    <span className="body-md text-[#8a8a8a] group-hover:text-[#fafaf9] transition-colors">
                      How It Works
                    </span>
                    <ArrowRight className="h-4 w-4 text-[#4a4a4a] group-hover:text-[#b87333] transition-colors" />
                  </Link>
                  <Link
                    to="/pricing"
                    className="flex items-center justify-between py-3 border-b border-[#1a1a1a] group"
                  >
                    <span className="body-md text-[#8a8a8a] group-hover:text-[#fafaf9] transition-colors">
                      Pricing
                    </span>
                    <ArrowRight className="h-4 w-4 text-[#4a4a4a] group-hover:text-[#b87333] transition-colors" />
                  </Link>
                  <Link
                    to="/collections"
                    className="flex items-center justify-between py-3 group"
                  >
                    <span className="body-md text-[#8a8a8a] group-hover:text-[#fafaf9] transition-colors">
                      Browse Catalog
                    </span>
                    <ArrowRight className="h-4 w-4 text-[#4a4a4a] group-hover:text-[#b87333] transition-colors" />
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#1a1a1a] bg-[#0a0a0a] py-8">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="label-sm text-[#4a4a4a]">
              © {new Date().getFullYear()} Luxor Bids. All rights reserved.
            </p>
            <div className="flex items-center gap-8">
              <Link to="/privacy" className="label-sm text-[#4a4a4a] hover:text-[#8a8a8a]">
                Privacy Policy
              </Link>
              <Link to="/terms" className="label-sm text-[#4a4a4a] hover:text-[#8a8a8a]">
                Terms of Service
              </Link>
              <Link to="/contact" className="label-sm text-[#fafaf9]">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ContactPage
