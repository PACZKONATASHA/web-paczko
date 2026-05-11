import { useState, useEffect, useRef } from 'react'

function useScrollAnimation(threshold = 0.01) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
        if (!entry.isIntersecting && entry.boundingClientRect.top > 0) setIsVisible(false)
      },
      { threshold: Math.min(threshold, 0.05), rootMargin: '100px 0px' }
    )
    if (ref.current) observer.observe(ref.current)
    return () => { if (ref.current) observer.unobserve(ref.current) }
  }, [threshold])

  return [ref, isVisible]
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleMenu = () => setMenuOpen(!menuOpen)
  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') closeMenu() }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!menuOpen) return
      const menu = document.getElementById('menuMobile')
      const btn = document.getElementById('menuBtn')
      if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) closeMenu()
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [menuOpen])

  return (
    <header className="nav">
      <a className="brand" href="#">
        <img className="brandLogo" src="/img/logo.paczko.web.png" alt="Paczko Web" />
      </a>
      <nav className="menuDesktop" aria-label="Navegación principal">
        <a href="#servicios">Servicios</a>
        <a href="#como-trabajo">Cómo trabajo</a>
        <a href="#mis-trabajos">Trabajos</a>
        <a href="#faq">Preguntas</a>
      </nav>
      <a className="btn cta desktopOnly" href="#contacto">Consultar</a>
      <button className="menuBtn" id="menuBtn" type="button" aria-label="Abrir menú" aria-expanded={menuOpen} onClick={toggleMenu}>☰</button>
      <nav className={`menuMobile ${menuOpen ? 'open' : ''}`} id="menuMobile" aria-label="Menú móvil">
        <a href="#servicios" onClick={closeMenu}>Servicios</a>
        <a href="#como-trabajo" onClick={closeMenu}>Cómo trabajo</a>
        <a href="#mis-trabajos" onClick={closeMenu}>Trabajos</a>
        <a href="#faq" onClick={closeMenu}>Preguntas</a>
        <a href="#contacto" onClick={closeMenu}>Contacto</a>
      </nav>
    </header>
  )
}

function WorkCarousel() {
  const images = [
    '/img/cuadrado-1.jpeg',
    '/img/cuadrado-2.jpeg',
    '/img/cuadrado-3.jpeg',
    '/img/cuadrado-5.jpeg',
    '/img/cuadrado6.jpeg',
    '/img/cuadrado-7.jpeg',
  ]
  const [current, setCurrent] = useState(0)
  const trackRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  const goTo = (index) => setCurrent(index)
  const goPrev = () => setCurrent(prev => (prev - 1 + images.length) % images.length)
  const goNext = () => setCurrent(prev => (prev + 1) % images.length)

  return (
    <div className="workCarousel">
      <button className="carouselArrow carouselArrowLeft" onClick={goPrev} aria-label="Anterior">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div className="carouselViewport">
        <div className="carouselTrack" ref={trackRef} style={{ transform: `translateX(-${current * 100}%)` }}>
          {images.map((img, i) => (
            <div className="carouselSlide" key={i}>
              <img src={img} alt={`Trabajo de diseño web ${i + 1}`} className="carouselImg" />
            </div>
          ))}
        </div>
      </div>
      <button className="carouselArrow carouselArrowRight" onClick={goNext} aria-label="Siguiente">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      <div className="carouselDots">
        {images.map((_, i) => (
          <span key={i} className={`carouselDot ${i === current ? 'active' : ''}`} onClick={() => goTo(i)} />
        ))}
      </div>
      <div className="carouselProgress">
        <div className="carouselProgressBar" style={{ width: `${((current + 1) / images.length) * 100}%` }} />
      </div>
    </div>
  )
}

function Hero() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="hero" id="hero">
      <div className={`heroCenter ${loaded ? 'animate-in' : ''}`}>
        <span className="heroTag">Natasha Paczko · Diseño web</span>
        <h1 className="heroTitle">
          Páginas web claras<br />para tu negocio
        </h1>
        <p className="heroSubtitle">
          Ayudo a emprendimientos, profesionales y negocios a tener una presencia online simple, ordenada y funcional. En esta página encontrás todo lo que necesitás saber antes de pedir tu web.
        </p>
        <ul className="heroChecks">
          <li>Landing pages y webs informativas</li>
          <li>Catálogos con carrito a WhatsApp</li>
          <li>100% responsive para celular</li>
        </ul>
        <div className="heroButtons">
          <a className="btnHeroPrimary" href="#servicios">¿Qué tipo de página necesito?</a>
          <a className="btnHeroSecondary" href="https://wa.me/5493786417162?text=Hola%2C%20quiero%20consultar%20por%20mi%20p%C3%A1gina%20web" target="_blank" rel="noopener">Consultar por WhatsApp</a>
        </div>
      </div>
    </section>
  )
}

function TiposDeWeb() {
  const [ref, isVisible] = useScrollAnimation(0.1)

  const tipos = [
    {
      numero: '01',
      titulo: 'Landing Page simple',
      descripcion: 'Ideal para mostrar un servicio, producto o emprendimiento de forma clara y directa. Incluye secciones como inicio, información del negocio, servicios, beneficios, ubicación y botón directo a WhatsApp.',
      idealPara: 'Emprendimientos, servicios profesionales, estética, gastronomía, cursos, productos personalizados.',
      incluye: ['Botón de WhatsApp', 'Diseño responsive', 'Información ordenada', 'Imágenes del negocio', 'Redes sociales y ubicación'],
      link: null,
    },
    {
      numero: '02',
      titulo: 'Landing Page con formulario',
      descripcion: 'Además de mostrar la información del negocio, permite que el cliente complete un formulario. Esa información se envía por WhatsApp para facilitar el contacto.',
      idealPara: 'Turnos, presupuestos, consultas, reservas o pedidos personalizados.',
      incluye: ['Todo lo de la Landing simple', 'Formulario personalizado', 'Envío automático por WhatsApp', 'Campos a medida (fecha, producto, etc.)'],
      link: 'https://web-barradeaccess.vercel.app',
    },
    {
      numero: '03',
      titulo: 'Página web con varias secciones',
      descripcion: 'Una página más completa para negocios que necesitan mostrar más información, varios servicios o diferentes categorías.',
      idealPara: 'Negocios con muchos productos, marcas con más contenido, profesionales con varios servicios.',
      incluye: ['Inicio, nosotros, servicios', 'Preguntas frecuentes', 'Testimonios', 'Contacto y ubicación', 'Formulario opcional'],
      link: 'https://proyecto-mala-male.vercel.app',
    },
    {
      numero: '04',
      titulo: 'Catálogo con carrito a WhatsApp',
      descripcion: 'El cliente puede ver productos, elegir cantidades y armar un pedido. Al finalizar, el detalle completo del carrito se envía por WhatsApp para cerrar la venta.',
      idealPara: 'Emprendimientos que venden productos y prefieren cerrar la compra por mensaje.',
      incluye: ['Catálogo de productos', 'Carrito de compras', 'Pedido enviado por WhatsApp', 'Sin pago online (cierra por mensaje)'],
      link: 'https://de-loi3-d.vercel.app/',
    },
  ]

  return (
    <section className="sectionWhite" id="servicios" ref={ref}>
      <div className={`container ${isVisible ? 'animate-section' : ''}`}>
        <h2 className="section-title-animated">¿Qué tipo de página necesitás?</h2>
        <p className="sectionLead animate-fade-up delay-1">Antes de empezar, es importante entender qué opción se adapta mejor a tu negocio. Acá te explico cada una y podés ver un ejemplo real.</p>
        <div className="tiposGrid">
          {tipos.map((tipo, i) => (
            <div className={`tipoCard card-3d ${isVisible ? 'card-visible' : ''}`} key={i} style={{ transitionDelay: `${i * 0.12}s` }}>
              <span className="tipoNumero">{tipo.numero}</span>
              <h3 className="tipoCardTitle">{tipo.titulo}</h3>
              <p className="tipoCardDesc">{tipo.descripcion}</p>
              <div className="tipoCardSection">
                <span className="tipoLabel">Ideal para:</span>
                <p className="tipoCardIdeal">{tipo.idealPara}</p>
              </div>
              <div className="tipoCardSection">
                <span className="tipoLabel">Incluye:</span>
                <ul className="tipoIncluye">
                  {tipo.incluye.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              </div>
              {tipo.link && (
                <a className="tipoCardLink" href={tipo.link} target="_blank" rel="noopener noreferrer">
                  Ver ejemplo en vivo
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TablaComparativa() {
  const [ref, isVisible] = useScrollAnimation(0.1)

  return (
    <section className="sectionRosa" id="comparacion" ref={ref}>
      <div className={`container ${isVisible ? 'animate-section' : ''}`}>
        <h2 className="section-title-animated">Comparación de servicios</h2>
        <p className="sectionLead animate-fade-up delay-1">Un resumen rápido para que puedas comparar las opciones.</p>
        <div className="tablaWrap animate-fade-up delay-2">
          <table className="comparacionTabla">
            <thead>
              <tr>
                <th>Tipo de página</th>
                <th>Sirve para</th>
                <th>WhatsApp</th>
                <th>Formulario</th>
                <th>Carrito</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Landing simple</strong></td>
                <td>Mostrar un servicio o producto</td>
                <td className="tablaCheck">✓</td>
                <td className="tablaDash">—</td>
                <td className="tablaDash">—</td>
              </tr>
              <tr>
                <td><strong>Landing con formulario</strong></td>
                <td>Recibir consultas o turnos</td>
                <td className="tablaCheck">✓</td>
                <td className="tablaCheck">✓</td>
                <td className="tablaDash">—</td>
              </tr>
              <tr>
                <td><strong>Página con varias secciones</strong></td>
                <td>Mostrar más información del negocio</td>
                <td className="tablaCheck">✓</td>
                <td className="tablaOpcional">Opcional</td>
                <td className="tablaDash">—</td>
              </tr>
              <tr>
                <td><strong>Catálogo con carrito</strong></td>
                <td>Mostrar productos y recibir pedidos</td>
                <td className="tablaCheck">✓</td>
                <td className="tablaOpcional">Opcional</td>
                <td className="tablaCheck">✓</td>
              </tr>
            </tbody>
          </table>
          <p className="tablaNota">Todas las páginas se adaptan a celular, tablet y computadora.</p>
        </div>
      </div>
    </section>
  )
}

function ComoTrabajo() {
  const [ref, isVisible] = useScrollAnimation(0.1)

  const pasos = [
    {
      n: 1,
      titulo: 'Hablamos',
      detalle: 'Me contás sobre tu negocio y qué querés mostrar. Sin tecnicismos, sin presión.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
      ),
    },
    {
      n: 2,
      titulo: 'Elegimos el tipo de página',
      detalle: 'Te ayudo a entender qué opción encaja mejor con tu negocio y tu presupuesto.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      ),
    },
    {
      n: 3,
      titulo: 'Me enviás el material',
      detalle: 'Logo, fotos, textos, precios y datos de contacto. Todo lo que necesito para empezar.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
      ),
    },
    {
      n: 4,
      titulo: 'Diseño y desarrollo',
      detalle: 'Armo tu página con todo el material. Acá es donde la magia sucede.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"/>
          <polyline points="8 6 2 12 8 18"/>
        </svg>
      ),
    },
    {
      n: 5,
      titulo: 'Revisás y ajustamos',
      detalle: 'Te muestro el resultado. Si algo no te convence, lo ajustamos juntos.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      ),
    },
    {
      n: 6,
      titulo: '¡Tu página está lista!',
      detalle: 'La publicamos y queda online para que tus clientes la vean desde el primer día.',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
    },
  ]

  return (
    <section className="sectionWhite" id="como-trabajo" ref={ref}>
      <div className={`container ${isVisible ? 'animate-section' : ''}`}>
        <h2 className="section-title-animated">Cómo trabajamos juntos</h2>
        <p className="sectionLead animate-fade-up delay-1">Un proceso simple, claro y sin sorpresas. Sabés en todo momento qué está pasando.</p>
        <div className="procesoFlow">
          {pasos.map((paso, i) => (
            <div
              className={`procesoStep card-3d ${isVisible ? 'card-visible' : ''}`}
              key={i}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="procesoTop">
                <div className="procesoCirculo">
                  {paso.icon}
                </div>
                <span className="procesoN">{paso.n}</span>
              </div>
              <h3 className="procesoTitulo">{paso.titulo}</h3>
              <p className="procesoDetalle">{paso.detalle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MaterialNecesario() {
  const [ref, isVisible] = useScrollAnimation(0.1)

  const items = [
    'Logo del negocio, si tiene',
    'Nombre del emprendimiento o marca',
    'Fotos de productos, local, trabajos o servicios',
    'Textos o información que quiere mostrar',
    'Precios, si la página incluye productos',
    'Número de WhatsApp',
    'Redes sociales',
    'Dirección o ubicación, si corresponde',
    'Colores o estilo de referencia, si tiene preferencia',
    'Ejemplos de páginas que le gusten',
  ]

  return (
    <section className="sectionRosa" id="material" ref={ref}>
      <div className={`container ${isVisible ? 'animate-section' : ''}`}>
        <h2 className="section-title-animated">Material necesario para comenzar</h2>
        <p className="sectionLead animate-fade-up delay-1">Para poder avanzar con la página, el cliente debe enviar todo el material antes de iniciar el desarrollo.</p>
        <div className="materialBox animate-fade-up delay-2">
          <ul className="materialList">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <div className="materialAviso">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p>El diseño y los tiempos de entrega dependen de que el material esté completo. Si faltan fotos, precios o información importante, el inicio del proyecto puede demorarse.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function TiemposEntrega() {
  const [ref, isVisible] = useScrollAnimation(0.1)

  return (
    <section className="sectionWhite" id="tiempos" ref={ref}>
      <div className={`container ${isVisible ? 'animate-section' : ''}`}>
        <h2 className="section-title-animated">Tiempos de trabajo</h2>
        <p className="sectionLead animate-fade-up delay-1">Para que podamos trabajar de forma ordenada y respetar los plazos acordados.</p>
        <div className="tiemposGrid animate-fade-up delay-2">
          <div className="tiempoCard">
            <span className="tiempoIcono">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </span>
            <h3>Tiempo estimado</h3>
            <p>El tiempo estimado de realización de una página web es de aproximadamente <strong>2 semanas</strong>, contando desde el momento en que el cliente entrega todo el material necesario.</p>
          </div>
          <div className="tiempoCard tiempoCardAviso">
            <span className="tiempoIcono">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </span>
            <h3>Condición importante</h3>
            <p>Para respetar los tiempos acordados, el cliente debe enviar fotos, textos, precios y datos principales dentro de las <strong>72 horas</strong> posteriores a la confirmación del proyecto.</p>
          </div>
          <div className="tiempoCard tiempoCardInfo">
            <span className="tiempoIcono">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </span>
            <h3>Reprogramación</h3>
            <p>Si el material no se entrega dentro de ese plazo, la fecha de entrega podrá ser reprogramada, ya que no es posible avanzar correctamente sin la información necesaria.</p>
          </div>
        </div>
        <div className="tiemposFrase animate-fade-up delay-3">
          El plazo de entrega comienza a contar una vez recibido todo el material necesario para el desarrollo de la página: textos, imágenes, precios, logo y datos de contacto.
        </div>
      </div>
    </section>
  )
}


function PreguntasFrecuentes() {
  const [ref, isVisible] = useScrollAnimation(0.1)
  const [abierto, setAbierto] = useState(null)

  const preguntas = [
    {
      pregunta: '¿La página tiene botón de WhatsApp?',
      respuesta: 'Sí. Todas las páginas pueden incluir botón directo a WhatsApp para que los clientes te escriban fácilmente.',
    },
    {
      pregunta: '¿El formulario llega a WhatsApp?',
      respuesta: 'Sí. El formulario puede configurarse para que los datos del cliente se preparen y se envíen por WhatsApp automáticamente.',
    },
    {
      pregunta: '¿El carrito tiene pago online?',
      respuesta: 'No. El carrito funciona como un pedido por WhatsApp. El cliente selecciona productos y al finalizar se envía el detalle del pedido por mensaje. No incluye pasarela de pago.',
    },
    {
      pregunta: '¿Tengo que enviar fotos?',
      respuesta: 'Sí. Las fotos son necesarias para que la página se vea profesional y represente correctamente tu negocio. Sin fotos el diseño pierde calidad.',
    },
    {
      pregunta: '¿Cuánto tarda la página?',
      respuesta: 'El tiempo estimado es de 2 semanas desde que el cliente entrega todo el material completo: textos, imágenes, precios, logo y datos de contacto.',
    },
    {
      pregunta: '¿Qué pasa si no tengo fotos?',
      respuesta: 'Se puede avanzar con imágenes provisorias o de referencia, pero lo recomendable es contar con fotos reales del negocio, productos o servicios para un mejor resultado.',
    },
    {
      pregunta: '¿No sé qué tipo de página necesito, me podés ayudar?',
      respuesta: 'Sí. Si no sabés qué opción elegir, escribime por WhatsApp y charlamos sobre tu negocio para encontrar la opción más adecuada.',
    },
  ]

  const toggle = (i) => setAbierto(abierto === i ? null : i)

  return (
    <section className="sectionWhite" id="faq" ref={ref}>
      <div className={`container ${isVisible ? 'animate-section' : ''}`}>
        <h2 className="section-title-animated">Preguntas frecuentes</h2>
        <p className="sectionLead animate-fade-up delay-1">Respuestas a las dudas más comunes antes de empezar.</p>
        <div className="faqList animate-fade-up delay-2">
          {preguntas.map((item, i) => (
            <div className={`faqItem ${abierto === i ? 'faqItem--open' : ''}`} key={i}>
              <button className="faqPregunta" onClick={() => toggle(i)} aria-expanded={abierto === i}>
                <span>{item.pregunta}</span>
                <svg className="faqIcono" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              <div className="faqRespuesta">
                <p>{item.respuesta}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contacto() {
  const [ref, isVisible] = useScrollAnimation(0.2)
  const [formData, setFormData] = useState({ nombre: '', tipo: '', mensaje: '' })
  const [focusedField, setFocusedField] = useState(null)

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { nombre, tipo, mensaje } = formData
    const whatsappMessage = encodeURIComponent(
      `Hola! Soy ${nombre || 'Sin nombre'}.\n\nTipo de web: ${tipo || 'No especificado'}\n\nMensaje:\n${mensaje || 'Sin mensaje'}`
    )
    window.open(`https://wa.me/5493786417162?text=${whatsappMessage}`, '_blank')
  }

  return (
    <section className="contactSection" id="contacto" ref={ref}>
      <div className="contactBanner" style={{ backgroundImage: "url('/img/foto-banner-formu.png')" }}>
        <div className="contactBannerOverlay"></div>
        <div className={`contactBannerContent ${isVisible ? 'animate-in' : ''}`}>
          <h2 className="contactBannerTitle">¿No sabés qué tipo de página necesitás?</h2>
          <p className="contactBannerText">Escribime por WhatsApp y te ayudo a elegir la opción más adecuada para tu negocio.</p>
          <p className="contactBannerNote">Te respondo personalmente.</p>
        </div>
      </div>

      <div className="contactBody">
        <div className={`container ${isVisible ? 'animate-section' : ''}`}>
          <h3 className="formTitle">Quiero consultar por mi página web</h3>
          <p className="formSubtitle">Completá el formulario y te respondo por WhatsApp.</p>
          <form id="contactForm" className="form-animated" noValidate onSubmit={handleSubmit}>
            <div className="row">
              <div className={`field ${focusedField === 'nombre' ? 'focused' : ''} ${formData.nombre ? 'filled' : ''}`}>
                <label htmlFor="nombre">Nombre</label>
                <input id="nombre" type="text" placeholder="Tu nombre" autoComplete="name"
                  value={formData.nombre} onChange={handleChange}
                  onFocus={() => setFocusedField('nombre')} onBlur={() => setFocusedField(null)} />
                <span className="fieldLine"></span>
              </div>
            </div>
            <div className="row">
              <div className={`field ${focusedField === 'tipo' ? 'focused' : ''} ${formData.tipo ? 'filled' : ''}`}>
                <label htmlFor="tipo">¿Qué tipo de web necesitás?</label>
                <input id="tipo" type="text" placeholder="Landing / Web con formulario / Catálogo / No sé"
                  value={formData.tipo} onChange={handleChange}
                  onFocus={() => setFocusedField('tipo')} onBlur={() => setFocusedField(null)} />
                <span className="fieldLine"></span>
              </div>
            </div>
            <div className="row">
              <div className={`field ${focusedField === 'mensaje' ? 'focused' : ''} ${formData.mensaje ? 'filled' : ''}`}>
                <label htmlFor="mensaje">Contame sobre tu negocio</label>
                <textarea id="mensaje" placeholder="¿Qué vendés? ¿Qué querés mostrar en tu página?"
                  value={formData.mensaje} onChange={handleChange}
                  onFocus={() => setFocusedField('mensaje')} onBlur={() => setFocusedField(null)} />
                <span className="fieldLine"></span>
              </div>
            </div>
            <button className="btn btnSubmit btn-ripple" type="submit">
              <span>Quiero consultar por mi página web</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
            <div className="formNote">* Al hacer click se abre WhatsApp con tu mensaje armado automáticamente.</div>
          </form>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="siteFooter">
      <nav className="footerNav" aria-label="Footer navegación">
        <a href="#servicios">Servicios</a>
        <a href="#como-trabajo">Cómo trabajo</a>
        <a href="#mis-trabajos">Trabajos</a>
        <a href="#faq">Preguntas</a>
        <a href="#contacto">Contacto</a>
      </nav>
      <div className="footerBrand">
        <img className="footerLogo" src="/img/logo.paczko.web.png" alt="Paczko Web" />
      </div>
      <p className="footerCopy">© {year} Natasha Paczko · Páginas web para negocios</p>
    </footer>
  )
}

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TiposDeWeb />
        <ComoTrabajo />
        <MaterialNecesario />
        <TiemposEntrega />
        <PreguntasFrecuentes />
        <Contacto />
      </main>
      <Footer />
    </>
  )
}

export default App
