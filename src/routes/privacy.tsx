import { createFileRoute, Link } from '@tanstack/react-router'
import { Header } from '@/components/Header'
import { motion } from 'framer-motion'

export const Route = createFileRoute('/privacy')({
  component: PrivacyPolicy,
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

function PrivacyPolicy() {
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
              <h1 className="headline-xl text-[#fafaf9] mb-4">Privacy Policy</h1>
              <p className="body-md text-[#8a8a8a]">Last updated: February 12, 2026</p>
            </div>

            {/* Content */}
            <div className="space-y-12 text-[#b0b0b0]">
              <section>
                <h2 className="font-display text-xl font-semibold text-[#fafaf9] mb-4">1. Introduction</h2>
                <p className="body-md leading-relaxed">
                  Welcome to Luxor Bids. We are committed to protecting your privacy and ensuring 
                  the security of your personal information. This Privacy Policy explains how we 
                  collect, use, disclose, and safeguard your information when you use our platform.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-[#fafaf9] mb-4">2. Information We Collect</h2>
                <p className="body-md leading-relaxed mb-4">
                  We collect information you provide directly to us when you:
                </p>
                <ul className="list-disc list-inside space-y-2 body-md leading-relaxed ml-4">
                  <li>Create an account</li>
                  <li>Place bids or list items</li>
                  <li>Complete transactions</li>
                  <li>Contact our support team</li>
                  <li>Participate in surveys or promotions</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-[#fafaf9] mb-4">3. How We Use Your Information</h2>
                <p className="body-md leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside space-y-2 body-md leading-relaxed ml-4">
                  <li>Provide and maintain our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Verify seller identities and prevent fraud</li>
                  <li>Send notifications about auctions and bids</li>
                  <li>Improve our platform and user experience</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-[#fafaf9] mb-4">4. Information Sharing</h2>
                <p className="body-md leading-relaxed">
                  We do not sell your personal information. We may share your information with:
                </p>
                <ul className="list-disc list-inside space-y-2 body-md leading-relaxed ml-4 mt-4">
                  <li>Other users when you engage in transactions</li>
                  <li>Service providers who assist in our operations</li>
                  <li>Law enforcement when required by law</li>
                  <li>Business partners with your consent</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-[#fafaf9] mb-4">5. Data Security</h2>
                <p className="body-md leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your 
                  personal information against unauthorized access, alteration, disclosure, or 
                  destruction. All data is encrypted in transit and at rest.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-[#fafaf9] mb-4">6. Your Rights</h2>
                <p className="body-md leading-relaxed">
                  You have the right to access, update, or delete your personal information. 
                  You can manage most of your information through your account settings or 
                  by contacting us directly.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-[#fafaf9] mb-4">7. Contact Us</h2>
                <p className="body-md leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at{' '}
                  <a href="mailto:privacy@luxorbids.com" className="text-[#b87333] hover:underline">
                    privacy@luxorbids.com
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
              <Link to="/privacy" className="label-sm text-[#fafaf9]">
                Privacy Policy
              </Link>
              <Link to="/terms" className="label-sm text-[#4a4a4a] hover:text-[#8a8a8a]">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PrivacyPolicy
