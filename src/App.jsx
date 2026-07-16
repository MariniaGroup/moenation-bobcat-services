import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'

const services = [
  { slug: 'site-prep', title: 'Site Prep', image: '/assets/images/services/site-prep.png', summary: 'Clearing, excavation support, rough preparation, and jobsite readiness for residential and commercial projects.' },
  { slug: 'hauling', title: 'Hauling', image: '/assets/images/services/hauling.png', summary: 'Reliable movement of soil, debris, green waste, construction materials, and jobsite loads throughout Los Angeles.' },
  { slug: 'demolition', title: 'Demolition', image: '/assets/images/services/demolition-support.png', summary: 'Selective demolition support, material removal, and site cleanup completed with safety and control.' },
  { slug: 'grading', title: 'Grading', image: '/assets/images/services/grading.png', summary: 'Precision grading and soil shaping for drainage, landscaping, foundations, driveways, and project preparation.' },
]

const insights = [
  { title: 'How to Prepare for a Bobcat Service Estimate', text: 'Gather photos, measurements, access details, surface conditions, utility information, and your preferred project timeline before requesting an estimate.' },
  { title: 'When a Property Needs Grading', text: 'Standing water, uneven surfaces, erosion, and poor drainage can indicate that reshaping or grading may be needed before construction or landscaping.' },
  { title: 'Residential vs. Commercial Site Preparation', text: 'Residential jobs often emphasize access and property protection, while commercial work may involve larger staging areas, schedules, documentation, and contractor coordination.' },
]

function track(eventName, properties = {}) {
  const consent = JSON.parse(localStorage.getItem('moenation-cookie-consent') || '{}')
  if (!consent.analytics) return
  const payload = { event_name: eventName, occurred_at: new Date().toISOString(), page: window.location.pathname, ...properties }
  const endpoint = import.meta.env.VITE_ANALYTICS_API_URL
  if (endpoint) fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), keepalive: true }).catch(() => {})
}

function Layout({ children }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); track('page_view') }, [location.pathname])
  return <>
    <div className="announcement">Flexible payment options may be available for eligible customers through Stripe-supported providers.</div>
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" to="/">MOENATION <span>BOBCAT SERVICES</span></Link>
        <button className="menu" onClick={() => setOpen(v => !v)} aria-label="Toggle navigation">☰</button>
        <nav className={open ? 'open' : ''}>
          <NavLink to="/">Home</NavLink><NavLink to="/site-prep">Site Prep</NavLink><NavLink to="/hauling">Hauling</NavLink>
          <NavLink to="/demolition">Demolition</NavLink><NavLink to="/grading">Grading</NavLink><NavLink to="/residential">Residential</NavLink>
          <NavLink to="/commercial">Commercial</NavLink><NavLink to="/insights">Insights</NavLink>
          <a className="button button-small" href="#quote">Get a Quote</a>
        </nav>
      </div>
    </header>
    <main>{children}</main>
    <Footer />
    <LeadPopup />
    <CookieBanner />
  </>
}

function HeroSlideshow() {
  const slides = useMemo(() => [
    '/assets/images/hero/bobcat-power.png',
    '/assets/images/hero/contractor-consultation.png',
    '/assets/images/services/commercial-jobsite.png',
    '/assets/images/services/residential-project.png',
  ], [])
  const [index, setIndex] = useState(0)
  useEffect(() => { const timer = setInterval(() => setIndex(i => (i + 1) % slides.length), 5500); return () => clearInterval(timer) }, [slides.length])
  return <section className="hero" style={{ backgroundImage: `linear-gradient(90deg,rgba(10,10,10,.9),rgba(10,10,10,.38)),url('${slides[index]}')` }}>
    <div className="container hero-content">
      <p className="eyebrow">Los Angeles Bobcat Services</p>
      <h1>Powerful Equipment. Professional Results.</h1>
      <p className="lead">Site preparation, hauling, demolition support, and precision grading for residential and commercial projects.</p>
      <div className="hero-actions"><a className="button" href="#quote">Request an Estimate</a><Link className="button button-secondary" to="/residential">Explore Services</Link></div>
      <div className="dots">{slides.map((_, i) => <button key={i} aria-label={`View slide ${i + 1}`} className={i === index ? 'active' : ''} onClick={() => setIndex(i)} />)}</div>
    </div>
  </section>
}

function FinancingSection() {
  return <section className="section financing"><div className="container split">
    <div><p className="eyebrow">Flexible Payments</p><h2>Start the work now. Pay over time when eligible.</h2><p>Qualifying customers may see installment options at secure Stripe checkout, including eligible offers from Affirm, Klarna, and Afterpay/Clearpay.</p></div>
    <div className="finance-card"><h3>Payment flexibility at checkout</h3><ul><li>Review available terms before accepting</li><li>Provider approval and eligibility apply</li><li>Options vary by customer and transaction</li><li>Moenation does not determine financing terms</li></ul><a href="#quote" className="button">Ask About Payment Options</a></div>
  </div></section>
}

function QuoteForm() {
  const [status, setStatus] = useState('')
  async function submit(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = Object.fromEntries(form.entries())
    payload.lead_id = crypto.randomUUID()
    payload.created_at = new Date().toISOString()
    payload.first_touch_url = sessionStorage.getItem('first_touch_url') || window.location.href
    payload.referrer = document.referrer
    payload.utm = Object.fromEntries(new URLSearchParams(window.location.search))
    const endpoint = import.meta.env.VITE_LEAD_API_URL
    try {
      if (endpoint) await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      else localStorage.setItem(`lead-${payload.lead_id}`, JSON.stringify(payload))
      track('quote_form_submitted', { service_type: payload.service, customer_type: payload.customer_type })
      setStatus('Thank you. Your request has been recorded and a project representative will follow up.')
      e.currentTarget.reset()
    } catch { setStatus('We could not submit the form. Please email projects@MoenationBobcat.com.') }
  }
  return <section id="quote" className="section section-dark"><div className="container"><p className="eyebrow">Project Estimate</p><h2>Tell us what the job requires.</h2>
    <form className="quote-form" onSubmit={submit}>
      <label>Name<input required name="name" autoComplete="name" /></label><label>Email<input required type="email" name="email" autoComplete="email" /></label>
      <label>Mobile phone<input name="phone" autoComplete="tel" /></label><label>Company, if applicable<input name="company" autoComplete="organization" /></label>
      <label>Customer type<select name="customer_type" required><option value="">Choose one</option><option value="residential">Residential</option><option value="contractor">Contractor</option><option value="commercial">Commercial</option><option value="property_manager">Property manager</option></select></label>
      <label>Service<select name="service" required><option value="">Choose one</option>{services.map(s => <option key={s.slug} value={s.slug}>{s.title}</option>)}</select></label>
      <label>Project ZIP code<input name="project_zip" inputMode="numeric" /></label><label>Budget range<select name="budget_range"><option value="unknown">Not sure yet</option><option value="under_2500">Under $2,500</option><option value="2500_5000">$2,500–$5,000</option><option value="5000_10000">$5,000–$10,000</option><option value="over_10000">Over $10,000</option></select></label>
      <label className="full-width">Project details<textarea required name="project_details" rows="5" /></label>
      <label className="check full-width"><input type="checkbox" name="email_consent" value="yes" /> Email me service updates, project tips, and special offers. I may unsubscribe at any time.</label>
      <label className="check full-width"><input type="checkbox" name="sms_consent" value="yes" /> I agree to receive recurring automated promotional and project-related texts. Consent is not a condition of purchase. Message frequency varies. Message and data rates may apply. Reply STOP to opt out and HELP for help.</label>
      <p className="fine full-width">By submitting, you acknowledge the <Link to="/privacy">Privacy Policy</Link>, <Link to="/notice-at-collection">Notice at Collection</Link>, and <Link to="/sms-terms">SMS Terms</Link>.</p>
      <button className="button full-width" type="submit">Request My Estimate</button>{status && <p className="status full-width">{status}</p>}
    </form>
  </div></section>
}

function Home() { return <><HeroSlideshow /><section className="section"><div className="container"><p className="eyebrow">Precision. Safety. Reliability.</p><h2>Bobcat support built around the jobsite.</h2><div className="card-grid">{services.map(s => <Link className="image-card" key={s.slug} to={`/${s.slug}`}><img src={s.image} alt="" /><div><h3>{s.title}</h3><p>{s.summary}</p></div></Link>)}</div></div></section><FinancingSection /><section className="section section-dark"><div className="container split"><div><p className="eyebrow">Residential & Commercial</p><h2>Professional support for property owners and contractors.</h2><p>From backyard access and landscape preparation to commercial staging and contractor coordination, every project begins with a clear scope and practical plan.</p></div><img className="feature-image" src="/assets/images/services/commercial-jobsite.png" alt="Bobcat working at a commercial jobsite" /></div></section><QuoteForm /></> }

function ServicePage({ slug }) {
  const service = services.find(s => s.slug === slug)
  return <><PageHero title={service.title} image={service.image} text={service.summary} /><section className="section"><div className="container split"><div><p className="eyebrow">Service Capabilities</p><h2>Prepared for the conditions on your site.</h2><ul className="feature-list"><li>Residential and commercial projects</li><li>Contractor coordination</li><li>Site access evaluation</li><li>Debris and material planning</li><li>Clear project milestones</li><li>Photo-supported estimates</li></ul></div><div className="content-card"><h3>Request a site-specific estimate</h3><p>Pricing depends on access, soil or material conditions, volume, equipment needs, disposal requirements, schedule, and project complexity.</p><a href="#quote" className="button">Start an Estimate</a></div></div></section><FinancingSection /><QuoteForm /></>
}

function AudiencePage({ type }) {
  const residential = type === 'Residential'
  return <><PageHero title={`${type} Bobcat Services`} image={residential ? '/assets/images/services/residential-project.png' : '/assets/images/services/commercial-jobsite.png'} text={residential ? 'Property-focused service with careful access planning, communication, and cleanup.' : 'Jobsite support for contractors, property managers, developers, and commercial operators.'} />
    <section className="section"><div className="container"><p className="eyebrow">Built for Your Project</p><h2>{residential ? 'Improve the property without losing control of the process.' : 'Coordinate equipment support with your schedule and scope.'}</h2><div className="card-grid"><div className="card"><h3>Clear Scope</h3><p>Document the requested work, access conditions, exclusions, and milestones before mobilization.</p></div><div className="card"><h3>Progress Visibility</h3><p>Prepare for status updates, project photos, milestone invoices, and future customer portal access.</p></div><div className="card"><h3>Flexible Payments</h3><p>Eligible customers may receive third-party installment options during secure Stripe checkout.</p></div></div></div></section><FinancingSection /><QuoteForm /></>
}

function Insights() { return <><PageHero title="Insights" image="/assets/images/hero/contractor-consultation.png" text="Practical information to help customers prepare, budget, and make informed project decisions." /><section className="section"><div className="container card-grid">{insights.map(x => <article className="card" key={x.title}><p className="eyebrow">Project Guide</p><h3>{x.title}</h3><p>{x.text}</p></article>)}</div></section><QuoteForm /></> }
function PageHero({ title, image, text }) { return <section className="page-hero" style={{ backgroundImage: `linear-gradient(90deg,rgba(10,10,10,.9),rgba(10,10,10,.35)),url('${image}')` }}><div className="container"><p className="eyebrow">Moenation Bobcat Services</p><h1>{title}</h1><p className="lead">{text}</p></div></section> }

function Policy({ title, children }) { return <section className="section policy"><div className="container"><p className="eyebrow">Legal & Privacy</p><h1>{title}</h1><p className="fine">Effective July 16, 2026. Working draft for business review; legal counsel should review before production launch.</p>{children}</div></section> }
function Privacy() { return <Policy title="Privacy Policy"><h2>Information we collect</h2><p>We may collect identifiers and contact information, company information, project details, property location information, communications, consent records, website activity, device information, advertising identifiers, payment references, and customer account information.</p><h2>How we use information</h2><p>We use information to respond to inquiries, prepare estimates, provide services, process payments, communicate project updates, improve operations, measure marketing performance, prevent fraud, maintain records, and comply with law.</p><h2>Sharing</h2><p>We may disclose information to service providers supporting hosting, analytics, communications, advertising, payment processing, accounting, and business operations. Payment credentials are processed by third-party payment providers and should not be stored by Moenation.</p><h2>Your choices</h2><p>You may unsubscribe from email, reply STOP to marketing texts, reject nonessential cookies, or submit a privacy request. California residents may have additional rights concerning access, correction, deletion, and certain sharing practices.</p><h2>Contact</h2><p>Email privacy questions to projects@MoenationBobcat.com.</p></Policy> }
function Notice() { return <Policy title="Notice at Collection"><p>At or before collection, Moenation may collect contact identifiers, commercial and project information, internet activity, approximate location, communications, consent records, and payment references. These categories are used for estimates, service delivery, payments, communications, security, analytics, advertising where consent applies, and legal compliance.</p><p>Retention depends on the purpose, legal obligations, contractual requirements, dispute needs, and operational necessity. See the Privacy Policy for details and choices.</p></Policy> }
function CookiePolicy() { return <Policy title="Cookie Policy"><p>Essential technologies support website operation and security. Optional analytics technologies help measure use and improve performance. Optional advertising technologies may support conversion measurement and remarketing. Visitors can accept all, reject nonessential technologies, or manage preferences through the cookie banner.</p></Policy> }
function SmsTerms() { return <Policy title="SMS Terms & Conditions"><p>By separately opting in, you agree to receive recurring automated promotional and project-related messages from Moenation Enterprise LLC. Consent is not a condition of purchase. Message frequency varies. Message and data rates may apply. Reply STOP to opt out and HELP for assistance.</p><p>Project-related transactional messages may be handled separately from promotional marketing consent where permitted. Carriers are not liable for delayed or undelivered messages.</p></Policy> }
function Terms() { return <Policy title="Website Terms of Use"><p>This website provides general service and project information and does not create a binding service agreement. Estimates, schedules, availability, financing options, and project terms remain subject to written confirmation. Users may not misuse forms, interfere with the site, or submit unlawful content.</p><h2>Financing disclosure</h2><p>Financing is offered by third-party providers and is subject to eligibility and approval. Available providers, payment schedules, limits, interest, fees, and terms vary. Moenation does not determine approval or financing terms.</p></Policy> }

function LeadPopup() {
  const [show, setShow] = useState(false)
  const [done, setDone] = useState(false)
  useEffect(() => { const last = Number(localStorage.getItem('lead-popup-dismissed') || 0); if (Date.now() - last > 14 * 86400000) { const t = setTimeout(() => setShow(true), 22000); return () => clearTimeout(t) } }, [])
  function close() { localStorage.setItem('lead-popup-dismissed', String(Date.now())); setShow(false) }
  async function submit(e) { e.preventDefault(); const data = Object.fromEntries(new FormData(e.currentTarget)); data.lead_id = crypto.randomUUID(); data.offer = '10_percent_labor_max_250'; data.created_at = new Date().toISOString(); const endpoint = import.meta.env.VITE_LEAD_API_URL; if (endpoint) await fetch(endpoint, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) }); else localStorage.setItem(`lead-${data.lead_id}`, JSON.stringify(data)); track('discount_form_submitted'); setDone(true) }
  if (!show) return null
  return <div className="modal-backdrop" role="dialog" aria-modal="true"><div className="modal"><button className="modal-close" onClick={close}>×</button>{done ? <><h2>Your offer request is recorded.</h2><p>Watch your email for the next step.</p><button className="button" onClick={close}>Close</button></> : <><p className="eyebrow">New Customer Offer</p><h2>Save 10% on eligible labor</h2><p>Join the project list and receive an offer for 10% off eligible labor on a qualifying first residential project, up to $250.</p><form onSubmit={submit} className="popup-form"><input required name="name" placeholder="Name" /><input required type="email" name="email" placeholder="Email" /><input name="company" placeholder="Company, if applicable" /><input name="phone" placeholder="Mobile phone, optional" /><label className="check"><input type="checkbox" name="email_consent" value="yes" /> Email me offers and project tips.</label><label className="check"><input type="checkbox" name="sms_consent" value="yes" /> I agree to recurring automated promotional texts. Consent is not required to purchase. Msg & data rates may apply. Reply STOP to opt out.</label><button className="button" type="submit">Get My Offer</button><p className="fine">Excludes materials, rentals, disposal, permits, taxes, financing charges, subcontractors, and existing contracts. Cannot be combined. Additional restrictions may apply.</p></form></>}</div></div>
}

function CookieBanner() {
  const [open, setOpen] = useState(!localStorage.getItem('moenation-cookie-consent'))
  const [manage, setManage] = useState(false)
  const [prefs, setPrefs] = useState({ essential: true, analytics: false, advertising: false, functional: false })
  function save(next) { localStorage.setItem('moenation-cookie-consent', JSON.stringify({ ...next, version: '2026-07-16', updated_at: new Date().toISOString() })); setOpen(false) }
  if (!open) return null
  return <div className="cookie"><div><strong>We value your privacy.</strong><p>Essential cookies operate the website. Optional analytics and advertising technologies help improve performance and support remarketing when you consent.</p>{manage && <div className="cookie-options"><label><input type="checkbox" checked disabled /> Essential</label><label><input type="checkbox" checked={prefs.analytics} onChange={e => setPrefs({...prefs, analytics:e.target.checked})} /> Analytics</label><label><input type="checkbox" checked={prefs.advertising} onChange={e => setPrefs({...prefs, advertising:e.target.checked})} /> Advertising</label><label><input type="checkbox" checked={prefs.functional} onChange={e => setPrefs({...prefs, functional:e.target.checked})} /> Functional</label></div>}</div><div className="cookie-actions"><button onClick={() => save({essential:true,analytics:false,advertising:false,functional:false})}>Reject Nonessential</button><button onClick={() => setManage(!manage)}>Manage Preferences</button>{manage ? <button className="button" onClick={() => save(prefs)}>Save Choices</button> : <button className="button" onClick={() => save({essential:true,analytics:true,advertising:true,functional:true})}>Accept All</button>}</div></div>
}

function Footer() { return <footer className="site-footer"><div className="container footer-grid"><div><div className="brand">MOENATION <span>BOBCAT SERVICES</span></div><p>Precision. Safety. Reliability.</p><p>Serving Los Angeles-area residential and commercial projects.</p></div><div><p><strong>Projects:</strong> projects@MoenationBobcat.com</p><p><strong>Website:</strong> MoenationBobcat.com</p><div className="legal-links"><Link to="/privacy">Privacy</Link><Link to="/notice-at-collection">Notice at Collection</Link><Link to="/cookies">Cookies</Link><Link to="/sms-terms">SMS Terms</Link><Link to="/terms">Terms</Link></div></div></div></footer> }

export default function App() {
  useEffect(() => { if (!sessionStorage.getItem('first_touch_url')) sessionStorage.setItem('first_touch_url', window.location.href) }, [])
  return <BrowserRouter><Layout><Routes><Route path="/" element={<Home />} />{services.map(s => <Route key={s.slug} path={`/${s.slug}`} element={<ServicePage slug={s.slug} />} />)}<Route path="/residential" element={<AudiencePage type="Residential" />} /><Route path="/commercial" element={<AudiencePage type="Commercial" />} /><Route path="/insights" element={<Insights />} /><Route path="/privacy" element={<Privacy />} /><Route path="/notice-at-collection" element={<Notice />} /><Route path="/cookies" element={<CookiePolicy />} /><Route path="/sms-terms" element={<SmsTerms />} /><Route path="/terms" element={<Terms />} /><Route path="*" element={<Home />} /></Routes></Layout></BrowserRouter>
}
