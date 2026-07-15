export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#top">Moenation Bobcat Services</a>
        <nav aria-label="Primary navigation">
          <a href="#services">Services</a>
          <a href="#about">Why Us</a>
          <a href="#service-area">Service Area</a>
          <a className="button button-small" href="#quote">Get a Quote</a>
        </nav>
      </div>
    </header>
  )
}
