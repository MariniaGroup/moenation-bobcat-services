import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import Services from './components/sections/Services'
import WhyChooseUs from './components/sections/WhyChooseUs'
import ServiceArea from './components/sections/ServiceArea'
import QuoteForm from './components/forms/QuoteForm'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <WhyChooseUs />
        <ServiceArea />
        <QuoteForm />
      </main>
      <Footer />
    </>
  )
}
