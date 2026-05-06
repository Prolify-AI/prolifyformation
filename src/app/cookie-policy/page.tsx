import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Cookie Policy — Prolify",
  description: "Vectis Group LLC Cookie Policy for Prolify services.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-black/8 sticky top-0 bg-white z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-black/60 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Prolify
          </Link>
          <span className="text-xs font-bold uppercase tracking-widest text-black/40">Cookie Policy</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFC107]/15 border border-[#FFC107]/40 text-xs font-bold uppercase tracking-widest text-black/70 mb-6">
            Legal Document
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-black mb-4">
            Cookie Policy
          </h1>
          <p className="text-base text-black/55 font-medium">
            <strong>Effective Date:</strong> April 15, 2026 &nbsp;|&nbsp; <strong>Last Updated:</strong> April 8, 2026
          </p>
          <p className="text-sm text-black/50 mt-2 font-medium">
            Issued by <strong className="text-black">Vectis Group LLC.</strong>
          </p>
        </div>

        <div className="prose prose-sm md:prose-base max-w-none text-black/80 leading-relaxed">

          <div className="bg-[#FAFAFA] border border-black/8 rounded-2xl p-6 mb-10 not-prose">
            <h2 className="text-base font-black text-black mb-3 uppercase tracking-wide">Introduction</h2>
            <p className="text-sm text-black/70 leading-relaxed">
              Welcome. This Cookie Policy explains how Vectis Group, LLC, doing business as Prolify ("we," "us," "our," or "Prolify") uses cookies and similar technologies when you visit our website at prolify.co (the "Website") and access our platform. We know that "cookies" might be an unfamiliar term if you're forming a company for the first time. This policy explains what they are, why we use them, and how you can control them. <strong>Reading this policy should take about 5 minutes.</strong>
            </p>
          </div>

          <Section title="1. What Are Cookies?">
            <p>A <strong>cookie</strong> is a small text file that websites place on your computer or mobile device when you visit. Cookies are stored by your browser and automatically sent back to the website on future visits.</p>
            <h3>Why use cookies at all?</h3>
            <p>Cookies help websites work smoothly and securely. They allow us to:</p>
            <ul>
              <li>Keep you logged in</li>
              <li>Remember your preferences</li>
              <li>Understand how you use our platform</li>
              <li>Protect against fraud and security threats</li>
            </ul>
            <h3>Important distinction: Cookies are not spyware</h3>
            <p>Cookies cannot run programs, deliver viruses, or access information on your device beyond what the website sends them. They're just small text files with information that <em>you're</em> already sharing with us when you use the Website.</p>
          </Section>

          <Section title="2. Cookies We Use & Why">
            <p>We use cookies in four categories:</p>

            <h3>2.1 Strictly Necessary Cookies</h3>
            <p>These cookies <strong>must</strong> function for the Website to work. We can't ask your permission because without them, you couldn't access your account or complete transactions.</p>
            <div className="overflow-x-auto not-prose my-4">
              <table className="w-full text-sm border border-black/10 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-[#FFC107]/15 border-b border-black/10">
                    <th className="text-left px-4 py-3 font-bold text-black text-xs uppercase tracking-wide">Purpose</th>
                    <th className="text-left px-4 py-3 font-bold text-black text-xs uppercase tracking-wide">Provider</th>
                    <th className="text-left px-4 py-3 font-bold text-black text-xs uppercase tracking-wide">Typical Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/6">
                  {[
                    ["Keep you logged in (session authentication)", "Prolify", "Session (until you log out)"],
                    ["Protect against fraud and unauthorized access", "Prolify", "Session to 24 hours"],
                    ["Load balance traffic and prevent outages", "Prolify", "Session"],
                    ["Enable payment processing security", "Stripe", "Session to 30 days"],
                    ["CSRF protection (prevent form hijacking attacks)", "Prolify", "Session"],
                  ].map(([purpose, provider, duration]) => (
                    <tr key={purpose} className="bg-white even:bg-[#FAFAFA]">
                      <td className="px-4 py-3 font-medium text-black/75">{purpose}</td>
                      <td className="px-4 py-3 text-black/60">{provider}</td>
                      <td className="px-4 py-3 text-black/60">{duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p><strong>Impact if disabled:</strong> You won't be able to log in, use your account, or submit payment information securely. The Website will not work.</p>

            <h3>2.2 Functional Cookies</h3>
            <p>These cookies improve your experience by remembering choices you've made.</p>
            <div className="overflow-x-auto not-prose my-4">
              <table className="w-full text-sm border border-black/10 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-[#FFC107]/15 border-b border-black/10">
                    <th className="text-left px-4 py-3 font-bold text-black text-xs uppercase tracking-wide">Purpose</th>
                    <th className="text-left px-4 py-3 font-bold text-black text-xs uppercase tracking-wide">Provider</th>
                    <th className="text-left px-4 py-3 font-bold text-black text-xs uppercase tracking-wide">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/6">
                  {[
                    ["Remember your language preference", "Prolify", "1 year"],
                    ["Remember your UI preferences (e.g., theme, sidebar state)", "Prolify", "1 year"],
                    ["Customer support widget state (if applicable)", "Third-party support tools", "Session to 30 days"],
                  ].map(([purpose, provider, duration]) => (
                    <tr key={purpose} className="bg-white even:bg-[#FAFAFA]">
                      <td className="px-4 py-3 font-medium text-black/75">{purpose}</td>
                      <td className="px-4 py-3 text-black/60">{provider}</td>
                      <td className="px-4 py-3 text-black/60">{duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p><strong>Impact if disabled:</strong> You'll have to re-select your language and preferences on each visit, but the Website will still function.</p>

            <h3>2.3 Analytics & Performance Cookies</h3>
            <p>These cookies help us understand how you use the platform so we can improve features, fix bugs, and make the experience faster.</p>
            <div className="overflow-x-auto not-prose my-4">
              <table className="w-full text-sm border border-black/10 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-[#FFC107]/15 border-b border-black/10">
                    <th className="text-left px-4 py-3 font-bold text-black text-xs uppercase tracking-wide">Purpose</th>
                    <th className="text-left px-4 py-3 font-bold text-black text-xs uppercase tracking-wide">Provider</th>
                    <th className="text-left px-4 py-3 font-bold text-black text-xs uppercase tracking-wide">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/6">
                  {[
                    ["Track page views, clicks, feature adoption, and user flow", "PostHog", "365 days (first-party cookie)"],
                    ["Measure performance and error reporting", "Prolify / Monitoring services", "Variable"],
                  ].map(([purpose, provider, duration]) => (
                    <tr key={purpose} className="bg-white even:bg-[#FAFAFA]">
                      <td className="px-4 py-3 font-medium text-black/75">{purpose}</td>
                      <td className="px-4 py-3 text-black/60">{provider}</td>
                      <td className="px-4 py-3 text-black/60">{duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p><strong>Data collected:</strong> Which pages you visit, how long you spend on each, which features you use, feature adoption metrics, user flows, performance metrics, general geographic location (from IP address), browser/device type.</p>
            <p><strong>Who sees this data:</strong> Our product, engineering, and support teams use this data internally to improve the platform. We do not sell this data to third parties.</p>
            <p><strong>Impact if disabled:</strong> We'll have less insight into what's working, but the Website will function normally.</p>

            <h3>2.4 Marketing & Advertising Cookies</h3>
            <p>Prolify <strong>does not currently use marketing or advertising cookies</strong>. We do not deploy tracking pixels from advertising networks (such as Facebook Pixel, Google Ads, LinkedIn Ads, or similar services). This means:</p>
            <ul>
              <li>We do not track your activity for advertising purposes</li>
              <li>We do not build audience profiles for retargeting</li>
              <li>We do not share your browsing data with advertising networks</li>
              <li>You will not see Prolify ads following you around the internet based on your visit here</li>
            </ul>
            <p><strong>If this changes in the future</strong>, we will update this Cookie Policy, obtain your consent where required by law, and provide clear opt-out mechanisms before deploying any marketing cookies.</p>
          </Section>

          <Section title="3. First-Party vs. Third-Party Cookies">
            <p><strong>First-party cookies</strong> are set by Prolify directly (our domain).</p>
            <p><strong>Third-party cookies</strong> are set by other companies (like Stripe) when you visit our Website.</p>
            <h3>Why third-party cookies?</h3>
            <p>We use trusted vendors to:</p>
            <ul>
              <li>Process payments securely (Stripe)</li>
              <li>Understand product usage (PostHog — using first-party cookies only)</li>
            </ul>
            <p>We do <strong>not</strong> currently use third-party advertising cookies.</p>
            <p>All third-party vendors are required by contract to respect your privacy and follow applicable laws (including GDPR and CCPA), use data only for purposes we've authorized, maintain Data Processing Agreements (DPAs) with us, and not share your data with other parties without your consent.</p>
          </Section>

          <Section title="4. Similar Technologies">
            <p>Beyond cookies, we may also use:</p>
            <div className="overflow-x-auto not-prose my-4">
              <table className="w-full text-sm border border-black/10 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-[#FFC107]/15 border-b border-black/10">
                    <th className="text-left px-4 py-3 font-bold text-black text-xs uppercase tracking-wide">Technology</th>
                    <th className="text-left px-4 py-3 font-bold text-black text-xs uppercase tracking-wide">Purpose</th>
                    <th className="text-left px-4 py-3 font-bold text-black text-xs uppercase tracking-wide">Your Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/6">
                  {[
                    ["Web Beacons (pixels)", "Tiny invisible images that track whether an email was opened or page was viewed", "Part of analytics/marketing cookies (see section 5.3)"],
                    ["Local Storage", "Browser memory that persists data (like cookies, but larger and not automatically sent)", "Browser settings (usually under \"Clear Site Data\" or \"Local Storage\")"],
                    ["Session Storage", "Temporary browser memory cleared when you close the browser", "Cleared automatically when browser closes"],
                    ["SDKs in embedded tools", "If we embed a chat tool, payment processor, or analytics tool, it may use its own tracking", "Governed by that tool's privacy policy"],
                  ].map(([tech, purpose, control]) => (
                    <tr key={tech} className="bg-white even:bg-[#FAFAFA]">
                      <td className="px-4 py-3 font-bold text-black/75">{tech}</td>
                      <td className="px-4 py-3 text-black/60">{purpose}</td>
                      <td className="px-4 py-3 text-black/60">{control}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="5. Your Choices — How to Manage Cookies">
            <h3>5.1 Prolify Consent Banner & Preference Center</h3>
            <p>When you first visit the Website, you'll see a banner asking you to consent to non-essential cookies. You can:</p>
            <ul>
              <li><strong>Accept all</strong> — Enable all cookies (recommended for full functionality)</li>
              <li><strong>Reject all</strong> — Disable non-essential cookies (only strictly necessary cookies will remain)</li>
              <li><strong>Manage preferences</strong> — Choose which types of cookies to allow</li>
            </ul>
            <p>Your preference is saved and will be honored on future visits. You can change your preferences anytime by visiting our website and clicking "Cookie Preferences" in the footer, or by logging into your account and adjusting <strong>Settings &gt; Privacy &gt; Cookie Preferences</strong>.</p>

            <h3>5.2 Browser Settings</h3>
            <p>Most browsers allow you to manage, disable, or delete cookies:</p>
            <ul>
              <li><strong>Chrome:</strong> Settings &gt; Privacy and Security &gt; Cookies and other site data</li>
              <li><strong>Firefox:</strong> Preferences &gt; Privacy and Security &gt; Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences &gt; Privacy &gt; Cookies and website data</li>
              <li><strong>Edge:</strong> Settings &gt; Privacy, search, and services &gt; Cookies and other site data</li>
            </ul>
            <p><strong>Note:</strong> Blocking strictly necessary cookies may prevent the Website from working correctly.</p>

            <h3>5.3 Opt-Out of Analytics</h3>
            <p><strong>PostHog Analytics:</strong> Adjust your tracking preferences in your Prolify account settings (<strong>Settings &gt; Privacy &gt; Analytics Preferences</strong>). PostHog uses first-party cookies only — blocking third-party cookies will not affect PostHog tracking. For EU/UK users who do not consent to cookies, PostHog automatically operates in cookieless mode using server-side hashing, meaning no personal identifiers are stored on your device.</p>
            <p><strong>Note on Marketing Cookies:</strong> Prolify does not currently deploy marketing or advertising cookies. If this changes, specific opt-out instructions will be provided here.</p>

            <h3>5.4 Do Not Track (DNT) Signals</h3>
            <p>Some browsers include a "Do Not Track" (DNT) setting. Prolify does not currently respond to DNT signals, as there is no universal industry standard for honoring them. However, we honor Global Privacy Control (GPC) signals (see Section 5.5) and respect your choices through our consent banner and preference center.</p>

            <h3>5.5 Global Privacy Control (GPC)</h3>
            <p>Prolify honors the Global Privacy Control (GPC) signal. If your browser or privacy extension (such as Brave Browser or Privacy Badger) sends a GPC signal, we will treat it as a valid opt-out of the sale or sharing of personal information under CCPA/CPRA.</p>
          </Section>

          <Section title="6. Impact of Disabling Cookies">
            <div className="overflow-x-auto not-prose my-4">
              <table className="w-full text-sm border border-black/10 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-[#FFC107]/15 border-b border-black/10">
                    <th className="text-left px-4 py-3 font-bold text-black text-xs uppercase tracking-wide">Cookie Category</th>
                    <th className="text-left px-4 py-3 font-bold text-black text-xs uppercase tracking-wide">If You Disable</th>
                    <th className="text-left px-4 py-3 font-bold text-black text-xs uppercase tracking-wide">Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/6">
                  {[
                    ["Strictly Necessary", "You won't be able to", "Log in, maintain your session, or complete transactions. We recommend keeping these enabled."],
                    ["Functional", "You can use the Website, but", "You'll need to re-enter your language and preferences on each visit."],
                    ["Analytics", "You can use the Website, but", "We can't see which features you use or where improvements are needed."],
                    ["Marketing", "You can use the Website, and", "You'll see fewer Prolify ads on other websites. You won't be targeted for ads based on your visit here."],
                  ].map(([category, condition, impact]) => (
                    <tr key={category} className="bg-white even:bg-[#FAFAFA]">
                      <td className="px-4 py-3 font-bold text-black/75">{category}</td>
                      <td className="px-4 py-3 text-black/60">{condition}</td>
                      <td className="px-4 py-3 text-black/60">{impact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="7. International Data Transfers">
            <p>Prolify uses vendors in the United States and other countries. The data collected by cookies and analytics tools may be transferred to, processed in, and stored in the United States and other countries where our vendors operate. These countries may have different data protection laws than your home country.</p>
            <p>By using the Website and accepting cookies, you consent to this transfer. We take steps to ensure that international transfers are lawful:</p>
            <ul>
              <li>We enter into Data Processing Agreements with vendors</li>
              <li>Vendors certify compliance with frameworks like the Data Privacy Framework (DPF) or Standard Contractual Clauses (SCC)</li>
              <li>We regularly audit vendor compliance</li>
            </ul>
            <p>For more details, see our <a href="/privacy-policy">Privacy Policy</a> (Section 7: International Data Transfers).</p>
          </Section>

          <Section title="8. California (CCPA) & European (GDPR/ePrivacy) Users">
            <h3>8.1 For California Residents (CCPA/CPRA)</h3>
            <p>Under California privacy law, you have the right to know what personal information we collect (including via cookies), delete that information, and opt-out of the "sale" or "sharing" of your information.</p>
            <p><strong>Note on "Sale" and "Sharing":</strong> The CCPA defines "sale" and "sharing" broadly. Using analytics and marketing cookies may fall within these definitions depending on the vendor's practices and the data shared.</p>
            <p><strong>Your Options:</strong></p>
            <ul>
              <li>Use your Prolify account settings (<strong>Settings &gt; Privacy &gt; Marketing Communications</strong>) to opt out</li>
              <li>Use the browser-based opt-out mechanisms in Section 5.3</li>
              <li>Submit a request by contacting <a href="mailto:privacy@prolify.co">privacy@prolify.co</a></li>
            </ul>
            <p>For details, see our <a href="/privacy-policy">Privacy Policy</a> (Section 15: California Disclosures).</p>

            <h3>8.2 For European Residents (GDPR/ePrivacy Directive)</h3>
            <p>Under EU/UK law, we must obtain your <strong>explicit, informed consent</strong> before placing non-essential cookies. Strictly necessary cookies do not require consent and are placed automatically.</p>
            <p>The cookie consent banner you see when you first visit the Website is designed to meet this requirement. You must affirmatively opt-in to analytics and marketing cookies.</p>
            <p><strong>Your rights:</strong></p>
            <ul>
              <li>You can withdraw consent at any time by adjusting your cookie preferences (Section 5.1)</li>
              <li>You can request a copy of the cookies set on your device</li>
              <li>You can contact us to exercise your data rights (access, delete, portability, etc.)</li>
            </ul>
            <p>See our <a href="/privacy-policy">Privacy Policy</a> (Section 16: International User Disclosures) for more details on your GDPR rights.</p>
          </Section>

          <Section title="9. Third-Party Links & Cookies">
            <p>Our Website may link to other websites (e.g., government filing portals, payment processors, integrations). <strong>Those websites have their own cookie policies</strong>, and we are not responsible for their cookies or data practices. When you leave Prolify to visit a linked website, we recommend reviewing their cookie and privacy policies.</p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>We may update this Cookie Policy as our technology, vendors, or legal obligations change. When we make material changes, we'll:</p>
            <ul>
              <li>Post the new policy on this page</li>
              <li>Update the "Last Updated" date at the top</li>
              <li>Notify you of major changes via email (if required by law)</li>
            </ul>
            <p>Your continued use of the Website after a change means you accept the updated policy. If you do not accept a change, you may delete your cookies and stop using the Website.</p>
          </Section>

          <Section title="11. Contact Us">
            <p>If you have questions about this Cookie Policy, or if you'd like to exercise your privacy rights, please reach out:</p>
            <ul>
              <li><strong>Vectis Group, LLC (d/b/a Prolify)</strong></li>
              <li><strong>Email:</strong> <a href="mailto:privacy@prolify.co">privacy@prolify.co</a></li>
              <li><strong>Address:</strong> 30 N Gould St Ste N, Sheridan, WY 82801</li>
              <li><strong>EU Representative:</strong> Gregory Colbert — <a href="mailto:colbert@prolify.co">colbert@prolify.co</a></li>
              <li><strong>UK Representative:</strong> Mark Damsell — <a href="mailto:damsell@prolify.co">damsell@prolify.co</a></li>
            </ul>
            <p>We aim to respond to all privacy requests within 30 days.</p>
          </Section>

          <Section title="12. Glossary">
            <div className="overflow-x-auto not-prose my-4">
              <table className="w-full text-sm border border-black/10 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-[#FFC107]/15 border-b border-black/10">
                    <th className="text-left px-4 py-3 font-bold text-black text-xs uppercase tracking-wide">Term</th>
                    <th className="text-left px-4 py-3 font-bold text-black text-xs uppercase tracking-wide">Definition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/6">
                  {[
                    ["Browser", "Software you use to access the internet (Chrome, Firefox, Safari, Edge, etc.)"],
                    ["Cookie", "A small text file stored on your device by websites you visit"],
                    ["First-party cookie", "A cookie set by the website you're visiting (Prolify)"],
                    ["Third-party cookie", "A cookie set by another company's code running on the website"],
                    ["Session cookie", "A cookie that expires when you close your browser"],
                    ["Persistent cookie", "A cookie that stays on your device until it expires or you delete it"],
                    ["Pixel / Web beacon", "A tiny, invisible image used to track whether a page or email was viewed"],
                    ["Local storage", "Browser memory that stores larger amounts of data than cookies, not automatically sent to websites"],
                    ["GDPR", "General Data Protection Regulation (EU/UK privacy law)"],
                    ["CCPA", "California Consumer Privacy Act"],
                    ["DPA", "Data Processing Agreement (contract governing how vendors use your data)"],
                    ["DPF", "Data Privacy Framework (mechanism for transferring data from EU to US)"],
                    ["SCC", "Standard Contractual Clauses (legal mechanism for international data transfers)"],
                  ].map(([term, def]) => (
                    <tr key={term} className="bg-white even:bg-[#FAFAFA]">
                      <td className="px-4 py-3 font-bold text-black/75">{term}</td>
                      <td className="px-4 py-3 text-black/60">{def}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <div className="mt-10 pt-8 border-t border-black/8">
            <h2 className="text-xl font-black text-black mb-4 uppercase tracking-wide">Appendix: Cookie Inventory</h2>
            <p className="text-sm text-black/70 mb-4">The following table documents cookies currently set on the Prolify platform. This inventory is based on an audit completed April 8, 2026 and will be updated when material changes are made to our technology stack.</p>
            <div className="overflow-x-auto not-prose">
              <table className="w-full text-sm border border-black/10 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-[#FFC107]/15 border-b border-black/10">
                    <th className="text-left px-4 py-3 font-bold text-black text-xs uppercase tracking-wide">Cookie Name</th>
                    <th className="text-left px-4 py-3 font-bold text-black text-xs uppercase tracking-wide">Domain</th>
                    <th className="text-left px-4 py-3 font-bold text-black text-xs uppercase tracking-wide">Type</th>
                    <th className="text-left px-4 py-3 font-bold text-black text-xs uppercase tracking-wide">Purpose</th>
                    <th className="text-left px-4 py-3 font-bold text-black text-xs uppercase tracking-wide">Duration</th>
                    <th className="text-left px-4 py-3 font-bold text-black text-xs uppercase tracking-wide">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/6">
                  {[
                    ["session_id", "prolify.co", "First-party", "Authentication / Keep you logged in", "Session", "Strictly Necessary"],
                    ["csrf_token", "prolify.co", "First-party", "CSRF protection / Prevent form hijacking", "Session", "Strictly Necessary"],
                    ["user_language", "prolify.co", "First-party", "Remember language preference", "1 year", "Functional"],
                    ["ui_theme", "prolify.co", "First-party", "Remember dark/light mode preference", "1 year", "Functional"],
                    ["ph_[project_key]_posthog", "prolify.co", "First-party (PostHog)", "Product analytics — page views, feature adoption, user flows", "365 days", "Analytics"],
                    ["stripe_mid", "prolify.co", "First-party (Stripe)", "Stripe fraud detection", "1 year", "Strictly Necessary"],
                    ["__stripe_sid", "prolify.co", "First-party (Stripe)", "Stripe session identifier", "30 minutes", "Strictly Necessary"],
                  ].map(([name, domain, type, purpose, duration, category]) => (
                    <tr key={name} className="bg-white even:bg-[#FAFAFA]">
                      <td className="px-4 py-3 font-mono text-xs text-black/75">{name}</td>
                      <td className="px-4 py-3 text-black/60">{domain}</td>
                      <td className="px-4 py-3 text-black/60">{type}</td>
                      <td className="px-4 py-3 text-black/60">{purpose}</td>
                      <td className="px-4 py-3 text-black/60">{duration}</td>
                      <td className="px-4 py-3 text-black/60">{category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-black/50 mt-4">This inventory reflects Prolify's actual cookie deployment as confirmed April 8, 2026. Prolify uses PostHog for analytics (first-party cookies only) and does not deploy marketing or advertising pixels.</p>
          </div>

          <div className="mt-12 pt-8 border-t border-black/8 text-center not-prose">
            <p className="text-xs text-black/35 font-medium mb-1">
              Policy Version: 1.0 &nbsp;|&nbsp; Last Reviewed: April 8, 2026 &nbsp;|&nbsp; Next Review: October 8, 2026
            </p>
            <p className="text-xs text-black/30 mt-2">
              &copy; 2026 Vectis Group, LLC. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-black text-black mb-4 pb-2 border-b border-black/8">{title}</h2>
      <div className="space-y-3 text-black/75 text-sm leading-relaxed [&_h3]:font-bold [&_h3]:text-black [&_h3]:mt-4 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-[#B8860B] [&_a]:underline [&_strong]:text-black [&_strong]:font-bold [&_em]:italic">
        {children}
      </div>
    </div>
  );
}
