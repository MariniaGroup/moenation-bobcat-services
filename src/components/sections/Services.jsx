import { services } from '../../data/services'

export default function Services() {
  return (
    <section className="section" id="services">
      <div className="container">
        <p className="eyebrow">Our services</p>
        <h2>Contractor-ready support for demanding projects</h2>
        <div className="card-grid">
          {services.map((service) => (
            <article className="card" key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
