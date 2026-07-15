export default function QuoteForm() {
  return (
    <section className="section quote-section" id="quote">
      <div className="container">
        <p className="eyebrow">Request a quote</p>
        <h2>Tell us about your project</h2>

        <form className="quote-form">
          <label>
            Name
            <input name="name" type="text" required />
          </label>

          <label>
            Company
            <input name="company" type="text" />
          </label>

          <label>
            Phone
            <input name="phone" type="tel" required />
          </label>

          <label>
            Email
            <input name="email" type="email" required />
          </label>

          <label className="full-width">
            Project details
            <textarea name="projectDetails" rows="6" required />
          </label>

          <button className="button" type="submit">Submit Quote Request</button>
        </form>
      </div>
    </section>
  )
}
