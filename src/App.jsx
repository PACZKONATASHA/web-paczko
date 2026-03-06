import { useState, useEffect, useRef } from 'react'

// Hook personalizado para animaciones al scroll - se activa cada vez que el elemento entra en vista
function useScrollAnimation(threshold = 0.01) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Se activa cuando el elemento entra en vista
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
        // Se desactiva cuando sale completamente del viewport para permitir re-animación
        if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
          setIsVisible(false)
        }
      },
      { 
        threshold: Math.min(threshold, 0.05),
        rootMargin: '100px 0px' // Se activa 100px antes de entrar en vista
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [threshold])

  return [ref, isVisible]
}

// Hook para parallax
function useParallax() {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return offset
}

// Componente Header
function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeMenu()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  // Cerrar al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!menuOpen) return
      const menu = document.getElementById('menuMobile')
      const btn = document.getElementById('menuBtn')
      if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
        closeMenu()
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [menuOpen])

  return (
    <header className="nav">
      <a className="brand" href="#">
        <img className="brandLogo" src="/img/logo-natasha.png" alt="Natasha Paczko" />
      </a>

      <nav className="menuDesktop" aria-label="Navegación principal">
        <a href="#que-hago">Qué hago</a>
        <a href="#por-que-web">Por qué web</a>
        <a href="#como-trabajo">Cómo trabajo</a>
      </nav>

      <a className="btn cta desktopOnly" href="#contacto">contacto</a>

      <button 
        className="menuBtn" 
        id="menuBtn" 
        type="button" 
        aria-label="Abrir menú" 
        aria-expanded={menuOpen}
        onClick={toggleMenu}
      >
        ☰
      </button>

      <nav className={`menuMobile ${menuOpen ? 'open' : ''}`} id="menuMobile" aria-label="Menú móvil">
        <a href="#que-hago" onClick={closeMenu}>Qué hago</a>
        <a href="#por-que-web" onClick={closeMenu}>Por qué web</a>
        <a href="#como-trabajo" onClick={closeMenu}>Cómo trabajo</a>
        <a href="#contacto" onClick={closeMenu}>Contacto</a>
      </nav>
    </header>
  )
}

// Componente Slideshow - una imagen a la vez con transicion
function WorkSlideshow() {
  const images = [
    '/img/cuadrado-1.jpeg',
    '/img/cuadrado-2.jpeg',
    '/img/cuadrado-3.jpeg',
    '/img/cuadrado-5.jpeg',
    '/img/cuadrado6.jpeg',
    '/img/cuadrado-7.jpeg',
  ]
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % images.length)
        setVisible(true)
      }, 600)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="workSlideshow">
      <img
        src={images[current]}
        alt="Trabajo de diseno web"
        className={`workslideshowImg ${visible ? 'slide-visible' : 'slide-hidden'}`}
      />
      <div className="workslideshowDots">
        {images.map((_, i) => (
          <span
            key={i}
            className={`slideDot ${i === current ? 'active' : ''}`}
            onClick={() => { setCurrent(i); setVisible(true) }}
          />
        ))}
      </div>
    </div>
  )
}
// Componente Hero - Fullscreen con animaciones
function Hero() {
  const [loaded, setLoaded] = useState(false)
  const parallaxOffset = useParallax()
  const [contentRef, contentVisible] = useScrollAnimation(0.2)

  useEffect(() => {
    // Activar animaciones después de montar
    const timer = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="hero" id="hero">
      <div 
        className="heroBanner" 
        style={{ 
          backgroundImage: "url('/img/escritorio-rosa.avif')",
          backgroundPositionY: `${parallaxOffset * 0.5}px`
        }}
      >
        <div className="heroBannerOverlay"></div>
        <div className={`heroBannerContent ${loaded ? 'animate-in' : ''}`}>
          <span className="heroTag">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            Diseño Web Profesional
          </span>
          <h1 className="heroBannerTitle">
            <span className="title-line">Diseño sitios web</span>
            <span className="title-line title-highlight">simples y modernos</span>
            <span className="title-line">para negocios chicos</span>
          </h1>
          <p className="heroSubtitle">
            Transformo tu idea en una experiencia digital única
          </p>
          <div className="heroBannerActions">
            <a href="#que-hago" className="scrollArrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M19 12l-7 7-7-7"/>
              </svg>
            </a>
            <a className="btn btnBanner btnPrimary" href="#mis-trabajos">
              <span>Ver trabajos</span>
            </a>
          </div>
        </div>
      </div>

      <div className="heroContent" ref={contentRef}>
        <div className={`heroWrapper ${contentVisible ? 'animate-in' : ''}`}>
          <div className="heroPhotoColumn">
            <WorkSlideshow />
          </div>

                    <div className={`heroQuoteColumn ${contentVisible ? 'animate-section' : ''}`}>
            <blockquote className="heroQuote">
              <div className="quoteIcon">"</div>
              <p>Genero sitios web con impacto visual, que transmiten una experiencia interactiva para el que la visita.</p>
            </blockquote>
            <p className="heroDescription">
              Te acompaño, te escucho y te explico todo sin tecnicismos, para que te sientas segura con tu web desde el primer día.
            </p>
            <div className="heroActions">
              <a className="btn btnCta" href="https://wa.me/5493786417162?text=Hola%2C%20quiero%20consultar%20por%20una%20web" target="_blank" rel="noopener">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Quiero mi web
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Componente Qué Hago con animaciones
function QueHago() {
  const [ref, isVisible] = useScrollAnimation(0.2)
  
  return (
    <section className="sectionRosa" id="que-hago" ref={ref}>
      <div className={`container ${isVisible ? 'animate-section' : ''}`}>
        <h2 className="section-title-animated">Qué hago</h2>
        
        <p className="sectionLead animate-fade-up delay-1">Diseño páginas web a medida para negocios que quieren verse profesionales sin complicarse.</p>
        
        <div className="textBlock animate-fade-up delay-2">
          <p><strong>Puedo ayudarte si necesitás:</strong></p>
          <ul className="bulletList animated-list">
            <li className="list-item-animated">Una web simple para mostrar tu negocio</li>
            <li className="list-item-animated">Una página clara para recibir consultas por WhatsApp</li>
            <li className="list-item-animated">Presencia online para empezar a vender o crecer</li>
          </ul>
          <p className="highlight pulse-glow">Si no sabés qué tipo de web necesitás, lo vemos juntas.</p>
        </div>
      </div>
    </section>
  )
}

// Componente Por Qué Web con cards animadas
function PorQueWeb() {
  const [ref, isVisible] = useScrollAnimation(0.1)
  
  const reasons = [
    {
      number: 1,
      title: "Tu espacio propio",
      text: "Instagram depende de Meta. Si cambian el algoritmo o desaparece, tu presencia se va. Tu web es tuya para siempre.",
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    },
    {
      number: 2,
      title: "Confianza profesional",
      text: "Una web propia transmite profesionalismo. Tus clientes sienten que eres un negocio establecido, no solo alguien con Instagram.",
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
    },
    {
      number: 3,
      title: "Contacto claro y directo",
      text: "En tu web controlas cómo contactarte. Un formulario, WhatsApp directo, teléfono. No compites con el ruido de Instagram.",
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
    },
    {
      number: 4,
      title: "Google te encuentra",
      text: "Tu web aparece en Google. Cuando alguien busca \"peluquería en [tu ciudad]\", te encuentra. Instagram no aparece en búsquedas.",
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
    }
  ]

  return (
    <section className="sectionWhite" id="por-que-web" ref={ref}>
      <div className={`container ${isVisible ? 'animate-section' : ''}`}>
        <h2 className="section-title-animated">¿Por qué tener una web además de Instagram?</h2>
        
        <p className="sectionLead animate-fade-up delay-1">Instagram está bien, pero tu web es tu terreno propio. Aquí te explico por qué ambas se complementan.</p>
        
        <div className="reasonsGrid">
          {reasons.map((reason, index) => (
            <div 
              className={`reasonCard card-3d ${isVisible ? 'card-visible' : ''}`} 
              key={reason.number}
              style={{ transitionDelay: `${index * 0.15}s` }}
            >
              <div className="cardIcon">{reason.icon}</div>
              <span className="reasonNumber">{reason.number}</span>
              <h3>{reason.title}</h3>
              <p>{reason.text}</p>
              <div className="cardShine"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Componente Process Card con animaciones
function ProcessCard({ image, number, title, detail, imgClass, index, isVisible }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className={`processCard card-interactive ${isVisible ? 'card-visible' : ''}`}
      style={{ transitionDelay: `${index * 0.2}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="processCardImg">
        <img className={imgClass} src={image} alt={title} />
        <div className={`imageOverlay ${isHovered ? 'active' : ''}`}></div>
      </div>
      <div className="processCardBody">
        <span className={`processNumber ${isHovered ? 'pulse' : ''}`}>{number}</span>
        <h3 className="processCardTitle">{title}</h3>
        <p className="processCardText">{detail}</p>
      </div>
    </div>
  )
}

// Componente Cómo Trabajo con animaciones
function ComoTrabajo() {
  const [ref, isVisible] = useScrollAnimation(0.1)
  
  const processes = [
    {
      image: "/img/charlamos1.jpg",
      number: 1,
      title: "Charlamos",
      detail: "Definimos juntas qué querés comunicar, a quién y para qué."
    },
    {
      image: "/img/diseño-web.jpg",
      number: 2,
      title: "Diseño tu web",
      detail: "Maqueto tu sitio con un diseño moderno, simple y pensado para celular."
    },
    {
      image: "/img/sitio-web.jpg",
      number: 3,
      title: "Publicamos y te acompaño",
      detail: "Dejamos tu web online y te explico todo de forma clara. Si después necesitás ayuda, sigo cerca.",
      imgClass: "imgCenter"
    }
  ]

  return (
    <section className="sectionRosa" id="como-trabajo" ref={ref}>
      <div className={`container ${isVisible ? 'animate-section' : ''}`}>
        <h2 className="section-title-animated">Cómo trabajo</h2>
        
        <div className="processGrid">
          {processes.map((process, index) => (
            <ProcessCard
              key={process.number}
              image={process.image}
              number={process.number}
              title={process.title}
              detail={process.detail}
              imgClass={process.imgClass}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// Componente Diferencial con animación
function Diferencial() {
  const [ref, isVisible] = useScrollAnimation(0.3)
  
  return (
    <section className="sectionRosa sectionDiferencial" id="diferencial" ref={ref}>
      <div className={`container ${isVisible ? 'animate-section' : ''}`}>
        <div className="diferencialContent">
          <span className="diferencialIcon animate-scale-in">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </span>
          <h2 className="section-title-animated">Trabajo de forma personalizada y cercana</h2>
          <p className="sectionLead animate-fade-up delay-1">No trabajo con soluciones genéricas ni trato automático. Cada proyecto es distinto y lo encaro de manera individual.</p>
        </div>
      </div>
    </section>
  )
}

// Componente Para Quién con animaciones
function ParaQuien() {
  const [ref, isVisible] = useScrollAnimation(0.2)
  
  const audiences = [
    { 
      text: "Emprendedores que recién empiezan", 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    },
    { 
      text: "Comercios chicos (peluquerías, estética, tiendas, etc.)", 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    },
    { 
      text: "Personas que quieren una web clara y fácil de usar", 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    },
    { 
      text: "Quienes valoran el trato humano y directo", 
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
    }
  ]

  return (
    <section className="sectionWhite" id="para-quien" ref={ref}>
      <div className={`container ${isVisible ? 'animate-section' : ''}`}>
        <h2 className="section-title-animated">¿Para quién es este servicio?</h2>
        
        <div className="audienceList">
          {audiences.map((item, index) => (
            <div 
              className={`audienceItem audience-animated ${isVisible ? 'slide-in' : ''}`} 
              key={index}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <span className="audienceIcon">{item.icon}</span>
              <span className="audienceText">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Componente Trabajo Destacado con efectos
function TrabajoDestacado() {
  const [ref, isVisible] = useScrollAnimation(0.2)
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <section className="sectionRosa" id="mis-trabajos" ref={ref}>
      <div className={`container ${isVisible ? 'animate-section' : ''}`}>
        <h2 className="section-title-animated">Mis trabajos</h2>

        <div className={`projectShowcase ${imageLoaded ? 'loaded' : ''}`}>
          <div className="projectImage image-reveal">
            <img 
              src="/img/img1.jpg" 
              alt="Proyecto - Web profesional" 
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
            <div className="projectImageOverlay">
              <a className="btn btnProject" href="https://proyecto-mala-male.vercel.app" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                </svg>
                Ver proyecto
              </a>
            </div>
          </div>
        </div>
        
        <div className="projectHighlight animate-fade-up delay-1">
          <div className="projectInfo">
            <h3 className="projectTitle">MalaMale Salon</h3>
            <p className="projectType">Sitio web + E-commerce + Agenda de citas</p>
            
            <p className="projectDescription">Una peluquería que quería verse profesional online. Construimos una web con:</p>
            
            <ul className="projectFeatures features-animated">
              <li><strong>Galería de trabajos</strong> - Muestra sus mejores transformaciones</li>
              <li><strong>Tienda online</strong> - Vende productos de cuidado capilar</li>
              <li><strong>Agenda de citas</strong> - Los clientes reservan directamente</li>
              <li><strong>Contacto claro</strong> - WhatsApp, teléfono, formulario</li>
              <li><strong>Diseño mobile-first</strong> - Se ve perfecto en celular</li>
              <li><strong>Visible en Google</strong> - Aparece cuando buscan "peluquería"</li>
            </ul>
          </div>
        </div>
        
        <p className="projectCta animate-fade-up delay-2">¿Ves el tipo de web que hago? Esto es lo que puedo hacer por tu negocio.</p>
      </div>
    </section>
  )
}

// Componente Contacto con animaciones
function Contacto() {
  const [ref, isVisible] = useScrollAnimation(0.2)
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    mensaje: ''
  })
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
          <h2 className="contactBannerTitle">Contame tu idea</h2>
          <p className="contactBannerText">No necesitás tener todo definido. Contame qué proyecto tenés en mente y vemos juntas qué tipo de web te conviene.</p>
          <p className="contactBannerNote">Te respondo personalmente por WhatsApp.</p>
        </div>
      </div>

      <div className="contactBody">
        <div className={`container ${isVisible ? 'animate-section' : ''}`}>
          <h3 className="formTitle">Escribime</h3>
          <p className="formSubtitle">
            Completá el formulario y te respondo por WhatsApp.
          </p>
          <form id="contactForm" className="form-animated" noValidate onSubmit={handleSubmit}>
            <div className="row">
              <div className={`field ${focusedField === 'nombre' ? 'focused' : ''} ${formData.nombre ? 'filled' : ''}`}>
                <label htmlFor="nombre">Nombre</label>
                <input 
                  id="nombre" 
                  type="text" 
                  placeholder="Tu nombre" 
                  autoComplete="name"
                  value={formData.nombre}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('nombre')}
                  onBlur={() => setFocusedField(null)}
                />
                <span className="fieldLine"></span>
              </div>
            </div>

            <div className="row">
              <div className={`field ${focusedField === 'tipo' ? 'focused' : ''} ${formData.tipo ? 'filled' : ''}`}>
                <label htmlFor="tipo">¿Qué tipo de web necesitás?</label>
                <input 
                  id="tipo" 
                  type="text" 
                  placeholder="Landing / Web / Tienda"
                  value={formData.tipo}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('tipo')}
                  onBlur={() => setFocusedField(null)}
                />
                <span className="fieldLine"></span>
              </div>
            </div>

            <div className="row">
              <div className={`field ${focusedField === 'mensaje' ? 'focused' : ''} ${formData.mensaje ? 'filled' : ''}`}>
                <label htmlFor="mensaje">Tu idea</label>
                <textarea 
                  id="mensaje" 
                  placeholder="Cuéntame qué tenés en mente..."
                  value={formData.mensaje}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('mensaje')}
                  onBlur={() => setFocusedField(null)}
                />
                <span className="fieldLine"></span>
              </div>
            </div>

            <button className="btn btnSubmit btn-ripple" type="submit">
              <span>Quiero hablar sobre mi web</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>

            <div className="formNote">
              * Al hacer click se abre WhatsApp con tu mensaje armado automáticamente.
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

// Componente Footer
function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="siteFooter">
      <nav className="footerNav" aria-label="Footer navegación">
        <a href="#que-hago">Qué hago</a>
        <a href="#por-que-web">Por qué web</a>
        <a href="#como-trabajo">Cómo trabajo</a>
        <a href="#contacto">Contacto</a>
      </nav>

      <div className="footerBrand">
        <img className="footerLogo" src="/img/logo-natasha.png" alt="Natasha Paczko" />
      </div>

      <p className="footerCopy">
        © {year} Natasha Paczko · Webs simples y modernas
      </p>
    </footer>
  )
}

// Componente Principal App
function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <QueHago />
        <PorQueWeb />
        <ComoTrabajo />
        <Diferencial />
        <ParaQuien />
        <TrabajoDestacado />
        <Contacto />
      </main>
      <Footer />
    </>
  )
}

export default App
