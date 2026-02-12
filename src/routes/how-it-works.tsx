import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { 
  Search, 
  UserCheck, 
  Gavel, 
  Truck, 
  Camera, 
  FileText, 
  TrendingUp, 
  Wallet,
  ArrowRight,
  Shield,
  Clock,
  BadgeCheck
} from 'lucide-react'
import type { Variants } from 'framer-motion'
import { Header } from '@/components/Header'
import { Footer } from '@/components/landing'

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
      delayChildren: 0.2
    }
  }
}

const buyerSteps = [
  {
    icon: Search,
    number: '01',
    title: 'Discover Collections',
    description: 'Browse curated estate sales, vintage items, art, watches, and rare collectibles. Every listing includes detailed photos, condition reports, and provenance information.',
    details: ['Verified seller profiles', 'High-resolution photography', 'Condition grading', 'Item history & provenance']
  },
  {
    icon: UserCheck,
    number: '02',
    title: 'Create Your Account',
    description: 'Register for free and complete identity verification. We require verification to maintain a trusted marketplace and protect all participants.',
    details: ['Free registration', 'Quick ID verification', 'Secure payment setup', 'Bidder reputation tracking']
  },
  {
    icon: Gavel,
    number: '03',
    title: 'Place Your Bids',
    description: 'Bid on items with confidence. Set your maximum bid and our system will automatically bid on your behalf up to your limit. You\'ll always pay just one increment above the next highest bid.',
    details: ['Proxy bidding system', 'Real-time notifications', 'Bid history transparency', 'No bid sniping']
  },
  {
    icon: Truck,
    number: '04',
    title: 'Win & Receive',
    description: 'When you win, complete payment securely through our platform. The seller ships your item with insured delivery. Confirm receipt and the funds are released to the seller.',
    details: ['Secure payment escrow', 'Insured shipping', 'Delivery confirmation', 'Seller payout protection']
  }
]

const sellerSteps = [
  {
    icon: Camera,
    number: '01',
    title: 'Photograph & Describe',
    description: 'Create compelling listings with professional-quality photos. Include all relevant details: dimensions, condition, provenance, and any certificates of authenticity.',
    details: ['Photo guidelines provided', 'Detailed description templates', 'Condition assessment help', 'COA upload support']
  },
  {
    icon: FileText,
    number: '02',
    title: 'Set Your Terms',
    description: 'Choose your starting price, reserve price (optional), and auction duration. Our team reviews all listings to ensure quality and accuracy before going live.',
    details: ['Flexible pricing options', '7-day auction cycles', 'Reserve price protection', 'Expert review process']
  },
  {
    icon: TrendingUp,
    number: '03',
    title: 'Watch Bids Roll In',
    description: 'Monitor bidding activity in real-time. Receive notifications when bids are placed and engage with potential buyers through our messaging system.',
    details: ['Real-time bid tracking', 'Buyer messaging', 'Auction analytics', 'Marketing support']
  },
  {
    icon: Wallet,
    number: '04',
    title: 'Get Paid',
    description: 'Once the auction ends and the buyer confirms receipt, your funds are released. Keep 97% of the sale price—our 3% commission is among the lowest in the industry.',
    details: ['Fast payout (2-3 days)', 'Just 3% commission', 'No hidden fees', 'Secure fund transfer']
  }
]

const trustBadges = [
  {
    icon: Shield,
    title: 'Identity Verified',
    description: 'Every buyer and seller is identity-verified'
  },
  {
    icon: Clock,
    title: '7-Day Auctions',
    description: 'Fixed cycles keep inventory fresh and create urgency'
  },
  {
    icon: BadgeCheck,
    title: '3% Commission',
    description: 'Keep more of your money vs 25-30% traditional fees'
  }
]

export const Route = createFileRoute('/how-it-works')({
  component: HowItWorksPage,
})

function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#000000]">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="noise-overlay" />
        <div className="relative mx-auto max-w-[1600px] px-6 lg:px-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="section-marker mb-6 justify-center">
              Getting Started
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="headline-xl text-[#fafaf9] mb-8"
            >
              How Luxor Bids
              <span className="font-display italic font-light"> Works</span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="body-xl text-[#8a8a8a] max-w-2xl mx-auto"
            >
              Whether you are buying your first collectible or liquidating an entire estate, 
              our transparent auction process makes it simple, secure, and straightforward.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-y border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 flex items-center justify-center border border-[#b87333]/30 bg-[#b87333]/10">
                  <badge.icon className="h-5 w-5 text-[#b87333]" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-[#fafaf9]">{badge.title}</h3>
                  <p className="body-sm text-[#8a8a8a]">{badge.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Buyers */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.div variants={fadeInUp} className="section-marker mb-6">
              For Collectors
            </motion.div>
            <motion.h2 
              variants={fadeInUp}
              className="headline-lg text-[#fafaf9] mb-6"
            >
              Buying on
              <span className="font-display italic font-light"> Luxor Bids</span>
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="body-xl text-[#8a8a8a] max-w-2xl"
            >
              Discover exceptional collectibles from verified sellers. 
              Bid with confidence knowing every item is accurately represented.
            </motion.p>
          </motion.div>

          <div className="space-y-16">
            {buyerSteps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
              >
                <div className="lg:col-span-2 flex items-center gap-4">
                  <div className="w-16 h-16 flex items-center justify-center border border-[#b87333] bg-[#b87333]/10">
                    <step.icon className="h-6 w-6 text-[#b87333]" />
                  </div>
                  <span className="font-display text-5xl font-bold text-[#1a1a1a]">{step.number}</span>
                </div>
                
                <div className="lg:col-span-6">
                  <h3 className="font-display text-2xl font-semibold text-[#fafaf9] mb-4">
                    {step.title}
                  </h3>
                  <p className="body-lg text-[#8a8a8a] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="lg:col-span-4">
                  <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6">
                    <h4 className="label-sm text-[#4a4a4a] mb-4 uppercase tracking-wider">What to expect</h4>
                    <ul className="space-y-3">
                      {step.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#b87333]" />
                          <span className="body-sm text-[#b0b0b0]">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 text-center"
          >
            <Link
              to="/collections"
              className="btn-primary group inline-flex"
            >
              Start Browsing
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* For Sellers */}
      <section className="py-24 lg:py-32 bg-[#0a0a0a] border-y border-[#1a1a1a]">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.div variants={fadeInUp} className="section-marker mb-6">
              For Sellers
            </motion.div>
            <motion.h2 
              variants={fadeInUp}
              className="headline-lg text-[#fafaf9] mb-6"
            >
              Selling on
              <span className="font-display italic font-light"> Luxor Bids</span>
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="body-xl text-[#8a8a8a] max-w-2xl"
            >
              Turn your collectibles into cash. Our low 3% commission means 
              you keep more of what your items are worth.
            </motion.p>
          </motion.div>

          <div className="space-y-16">
            {sellerSteps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
              >
                <div className="lg:col-span-2 flex items-center gap-4">
                  <div className="w-16 h-16 flex items-center justify-center border border-[#b87333] bg-[#b87333]/10">
                    <step.icon className="h-6 w-6 text-[#b87333]" />
                  </div>
                  <span className="font-display text-5xl font-bold text-[#1a1a1a]">{step.number}</span>
                </div>
                
                <div className="lg:col-span-6">
                  <h3 className="font-display text-2xl font-semibold text-[#fafaf9] mb-4">
                    {step.title}
                  </h3>
                  <p className="body-lg text-[#8a8a8a] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="lg:col-span-4">
                  <div className="bg-[#000000] border border-[#1a1a1a] p-6">
                    <h4 className="label-sm text-[#4a4a4a] mb-4 uppercase tracking-wider">What to expect</h4>
                    <ul className="space-y-3">
                      {step.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#b87333]" />
                          <span className="body-sm text-[#b0b0b0]">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 text-center"
          >
            <Link
              to="/register"
              className="btn-primary group inline-flex"
            >
              Become a Seller
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="section-marker mb-6 justify-center">
              Common Questions
            </motion.div>
            <motion.h2 
              variants={fadeInUp}
              className="headline-lg text-[#fafaf9]"
            >
              Frequently Asked
              <span className="font-display italic font-light"> Questions</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          >
            {[
              {
                q: 'Is there a fee to register?',
                a: 'No. Registration is completely free for both buyers and sellers. We only charge a 3% commission when a sale is completed.'
              },
              {
                q: 'How does proxy bidding work?',
                a: 'Enter your maximum bid and our system will automatically bid the lowest amount necessary to keep you in the lead, up to your limit. You will only pay one increment above the next highest bid.'
              },
              {
                q: 'What happens if I win an auction?',
                a: 'You will receive an email notification with payment instructions. Once payment is confirmed, the seller ships your item with insured delivery.'
              },
              {
                q: 'How do I know sellers are trustworthy?',
                a: 'Every seller undergoes identity verification before listing. We also track seller ratings and transaction history to ensure accountability.'
              },
              {
                q: 'Can I set a reserve price?',
                a: 'Yes. Sellers can set a hidden reserve price. If bidding does not reach this amount, the item will not sell and no fees are charged.'
              },
              {
                q: 'What if an item is not as described?',
                a: 'We offer buyer protection. If an item significantly differs from its description, contact us within 48 hours of delivery to initiate a return process.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-[#0a0a0a] border border-[#1a1a1a] p-8">
                <h3 className="font-display text-lg font-semibold text-[#fafaf9] mb-4">
                  {faq.q}
                </h3>
                <p className="body text-[#8a8a8a] leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-[#0a0a0a] border-t border-[#1a1a1a]">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="headline-lg text-[#fafaf9] mb-6">
              Ready to Get
              <span className="font-display italic font-light"> Started?</span>
            </h2>
            <p className="body-xl text-[#8a8a8a] mb-10">
              Join thousands of collectors who trust Luxor Bids for their most prized acquisitions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="btn-primary group"
              >
                Create Free Account
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/collections"
                className="btn-secondary"
              >
                Browse Collections
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
