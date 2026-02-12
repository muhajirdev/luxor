import { createFileRoute, Link } from '@tanstack/react-router'
import { Header } from '@/components/Header'
import { motion } from 'framer-motion'

export const Route = createFileRoute('/terms')({
  component: TermsOfService,
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

function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#000000]">
      <Header />

      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-[900px] px-6 lg:px-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            {/* Header */}
            <div className="mb-16">
              <div className="section-marker mb-6">Legal</div>
              <h1 className="headline-xl text-[#fafaf9] mb-4">Terms of Service</h1>
              <p className="body-md text-[#8a8a8a]">Last updated: February 12, 2026</p>
            </div>

            {/* Content */}
            <div className="space-y-12 text-[#b0b0b0]">
              <section>
                <h2 className="font-display text-xl font-semibold text-[#fafaf9] mb-4">1. Acceptance of Terms</h2>
                <p className="body-md leading-relaxed">
                  By accessing or using Luxor Bids, you agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use our platform.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-[#fafaf9] mb-4">2. Eligibility</h2>
                <p className="body-md leading-relaxed">
                  You must be at least 18 years old and capable of forming legally binding contracts 
                  to use our services. By using Luxor Bids, you represent and warrant that you meet 
                  these requirements.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-[#fafaf9] mb-4">3. Account Registration</h2>
                <p className="body-md leading-relaxed">
                  You are responsible for maintaining the confidentiality of your account credentials 
                  and for all activities that occur under your account. You must provide accurate 
                  and complete information during registration and keep your information updated.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-[#fafaf9] mb-4">4. Bidding and Auctions</h2>
                <p className="body-md leading-relaxed mb-4">
                  When you place a bid on Luxor Bids:
                </p>
                <ul className="list-disc list-inside space-y-2 body-md leading-relaxed ml-4">
                  <li>Your bid is a legally binding commitment to purchase</li>
                  <li>All bids are final and cannot be retracted</li>
                  <li>You agree to pay the full bid amount plus any applicable fees</li>
                  <li>Failure to complete payment may result in account suspension</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-[#fafaf9] mb-4">5. Fees and Payments</h2>
                <p className="body-md leading-relaxed">
                  Luxor Bids charges a 3% commission on successful sales. Buyers are responsible 
                  for all applicable taxes and shipping costs. Payment is due within 48 hours of 
                  winning an auction.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-[#fafaf9] mb-4">6. Seller Responsibilities</h2>
                <p className="body-md leading-relaxed mb-4">
                  As a seller, you agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 body-md leading-relaxed ml-4">
                  <li>Provide accurate descriptions of items</li>
                  <li>Sell only items you own or have authority to sell</li>
                  <li>Ship items within 3 business days of receiving payment</li>
                  <li>Respond to buyer inquiries within 24 hours</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-[#fafaf9] mb-4">7. Prohibited Items</h2>
                <p className="body-md leading-relaxed">
                  The following items are prohibited on Luxor Bids: counterfeit goods, illegal items, 
                  weapons, drugs, hazardous materials, and any items that violate intellectual property 
                  rights. We reserve the right to remove listings and suspend accounts for violations.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-[#fafaf9] mb-4">8. Limitation of Liability</h2>
                <p className="body-md leading-relaxed">
                  Luxor Bids provides the platform as-is and makes no warranties about the accuracy 
                  of listings or the conduct of users. We are not liable for disputes between buyers 
                  and sellers, though we may assist in mediation.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-[#fafaf9] mb-4">9. Termination</h2>
                <p className="body-md leading-relaxed">
                  We reserve the right to terminate or suspend your account at any time for violations 
                  of these terms or for any other reason at our discretion. You may also close your 
                  account at any time.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-[#fafaf9] mb-4">10. Changes to Terms</h2>
                <p className="body-md leading-relaxed">
                  We may update these Terms of Service from time to time. We will notify you of 
                  significant changes, and your continued use of the platform constitutes acceptance 
                  of the updated terms.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-[#fafaf9] mb-4">11. Contact Us</h2>
                <p className="body-md leading-relaxed">
                  For questions about these Terms of Service, please contact us at{' '}
                  <a href="mailto:legal@luxorbids.com" className="text-[#b87333] hover:underline">
                    legal@luxorbids.com
                  </a>
                </p>
              </section>
            </div>

            {/* Back Link */}
            <div className="mt-16 pt-8 border-t border-[#1a1a1a]">
              <Link
                to="/"
                className="label text-[#8a8a8a] transition-colors hover:text-[#fafaf9]"
              >
                ← Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
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
              <Link to="/terms" className="label-sm text-[#fafaf9]">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default TermsOfService
