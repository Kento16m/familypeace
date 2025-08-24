const isScrolling = false
let ticking = false

// Mobile Navigation Toggle
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("nav-toggle")
  const navMenu = document.getElementById("nav-menu")

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("show")

      // Change hamburger icon to X when menu is open
      const icon = navToggle.querySelector("i")
      if (navMenu.classList.contains("show")) {
        icon.classList.remove("fa-bars")
        icon.classList.add("fa-times")
      } else {
        icon.classList.remove("fa-times")
        icon.classList.add("fa-bars")
      }
    })

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("show")
        const icon = navToggle.querySelector("i")
        icon.classList.remove("fa-times")
        icon.classList.add("fa-bars")
      })
    })
  }
})

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      const headerHeight = document.querySelector(".header").offsetHeight
      const targetPosition = target.offsetTop - headerHeight - 20

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
  })
})

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const header = document.getElementById("header")
      if (window.scrollY > 50) {
        header.classList.add("scrolled")
      } else {
        header.classList.remove("scrolled")
      }
      ticking = false
    })
    ticking = true
  }
})

function copyToClipboard(elementId) {
  const element = document.getElementById(elementId)
  const text = element.textContent

  // Usar la API moderna de clipboard si está disponible
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showCopySuccess(element)
      })
      .catch(() => {
        fallbackCopyToClipboard(text, element)
      })
  } else {
    fallbackCopyToClipboard(text, element)
  }
}

function showCopySuccess(element) {
  const button = element.nextElementSibling
  const originalHTML = button.innerHTML

  button.innerHTML = '<i class="fas fa-check"></i>'
  button.classList.add("copied")

  // Crear notificación toast
  showToast("¡Copiado al portapapeles!", "success")

  setTimeout(() => {
    button.innerHTML = originalHTML
    button.classList.remove("copied")
  }, 2000)
}

function fallbackCopyToClipboard(text, element) {
  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.style.position = "fixed"
  textarea.style.opacity = "0"
  document.body.appendChild(textarea)

  textarea.select()
  textarea.setSelectionRange(0, 99999)

  try {
    document.execCommand("copy")
    showCopySuccess(element)
  } catch (err) {
    console.error("Error copying text: ", err)
    showToast("Error al copiar el texto", "error")
  }

  document.body.removeChild(textarea)
}

function showToast(message, type = "info") {
  // Remover toast existente si hay uno
  const existingToast = document.querySelector(".toast")
  if (existingToast) {
    existingToast.remove()
  }

  const toast = document.createElement("div")
  toast.className = `toast toast-${type}`
  toast.innerHTML = `
    <div class="toast-content">
      <i class="fas ${type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-circle" : "fa-info-circle"}"></i>
      <span>${message}</span>
    </div>
  `

  // Estilos del toast
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === "success" ? "linear-gradient(135deg, #10b981, #059669)" : type === "error" ? "linear-gradient(135deg, #ef4444, #dc2626)" : "linear-gradient(135deg, #3b82f6, #1d4ed8)"};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    transform: translateX(100%);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  `

  toast.querySelector(".toast-content").style.cssText = `
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 500;
  `

  document.body.appendChild(toast)

  // Animar entrada
  requestAnimationFrame(() => {
    toast.style.transform = "translateX(0)"
  })

  // Auto-remover después de 3 segundos
  setTimeout(() => {
    toast.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove()
      }
    }, 400)
  }, 3000)
}

document.getElementById("contact-form").addEventListener("submit", function (e) {
  e.preventDefault()

  const formData = new FormData(this)
  const name = formData.get("name").trim()
  const email = formData.get("email").trim()
  const message = formData.get("message").trim()

  // Validación mejorada
  const errors = []

  if (!name || name.length < 2) {
    errors.push("El nombre debe tener al menos 2 caracteres.")
  }

  if (!email) {
    errors.push("El correo electrónico es requerido.")
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      errors.push("Por favor, ingresa un correo electrónico válido.")
    }
  }

  if (!message || message.length < 10) {
    errors.push("El mensaje debe tener al menos 10 caracteres.")
  }

  if (errors.length > 0) {
    showToast(errors[0], "error")
    return
  }

  const submitButton = this.querySelector('button[type="submit"]')
  const originalText = submitButton.textContent

  // Animación de carga
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...'
  submitButton.disabled = true
  submitButton.style.transform = "scale(0.98)"

  // Simular envío con promesa
  new Promise((resolve) => {
    setTimeout(resolve, 2000)
  }).then(() => {
    showToast("¡Mensaje enviado exitosamente! Te contactaremos pronto.", "success")
    this.reset()

    // Animar campos del formulario
    const inputs = this.querySelectorAll("input, textarea")
    inputs.forEach((input, index) => {
      setTimeout(() => {
        input.style.transform = "scale(1.02)"
        setTimeout(() => {
          input.style.transform = "scale(1)"
        }, 150)
      }, index * 100)
    })

    submitButton.textContent = originalText
    submitButton.disabled = false
    submitButton.style.transform = "scale(1)"
  })
})

const createScrollObserver = (className, animationClass, options = {}) => {
  const defaultOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
    ...options,
  }

  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add(animationClass)
        entry.target.classList.add("active")
      }
    })
  }, defaultOptions)
}

document.addEventListener("DOMContentLoaded", () => {
  // Observador para elementos que aparecen desde abajo
  const fadeUpObserver = createScrollObserver(".reveal", "animate-fade-in-up")
  document.querySelectorAll(".about-card, .education-card, .blog-card, .section-header").forEach((el) => {
    el.classList.add("reveal")
    fadeUpObserver.observe(el)
  })

  // Observador para elementos que aparecen desde la izquierda
  const fadeLeftObserver = createScrollObserver(".reveal-left", "animate-fade-in-left")
  document.querySelectorAll(".contact-info, .donate-text").forEach((el) => {
    el.classList.add("reveal-left")
    fadeLeftObserver.observe(el)
  })

  // Observador para elementos que aparecen desde la derecha
  const fadeRightObserver = createScrollObserver(".reveal-right", "animate-fade-in-right")
  document.querySelectorAll(".contact-form, .bank-accounts").forEach((el) => {
    el.classList.add("reveal-right")
    fadeRightObserver.observe(el)
  })

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const statNumber = entry.target.querySelector(".stat-number")
          if (statNumber && !statNumber.classList.contains("animated")) {
            animateCounter(statNumber)
            statNumber.classList.add("animated")
          }
        }
      })
    },
    { threshold: 0.5 },
  )

  document.querySelectorAll(".stat").forEach((stat) => {
    statsObserver.observe(stat)
  })
})

function animateCounter(element) {
  const target = Number.parseInt(element.textContent.replace(/\D/g, ""))
  const duration = 2000
  const step = target / (duration / 16)
  let current = 0

  const timer = setInterval(() => {
    current += step
    if (current >= target) {
      current = target
      clearInterval(timer)
    }

    const suffix = element.textContent.includes("+") ? "+" : ""
    element.textContent = Math.floor(current) + suffix
  }, 16)
}

document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll('img[loading="lazy"]')

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target

          // Añadir efecto de carga
          img.style.opacity = "0"
          img.style.transform = "scale(1.1)"
          img.style.transition = "all 0.6s ease"

          img.onload = () => {
            img.style.opacity = "1"
            img.style.transform = "scale(1)"
          }

          img.src = img.src
          img.classList.remove("lazy")
          imageObserver.unobserve(img)
        }
      })
    })

    images.forEach((img) => imageObserver.observe(img))
  }
})

// Dropdown menu functionality for mobile
document.addEventListener("DOMContentLoaded", () => {
  const dropdownLinks = document.querySelectorAll(".dropdown > .nav-link")

  dropdownLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault()
        const dropdown = this.parentElement
        const menu = dropdown.querySelector(".dropdown-menu")

        dropdown.classList.toggle("active")

        if (dropdown.classList.contains("active")) {
          menu.style.display = "block"
          menu.style.position = "static"
          menu.style.opacity = "1"
          menu.style.visibility = "visible"
        } else {
          menu.style.display = "none"
        }
      }
    })
  })
})

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const scrolled = window.pageYOffset
      const heroImage = document.querySelector(".hero-image")

      if (heroImage && scrolled < window.innerHeight) {
        const rate = scrolled * -0.5
        heroImage.style.transform = `translateY(${rate}px)`
      }

      ticking = false
    })
    ticking = true
  }
})

document.addEventListener("DOMContentLoaded", () => {
  const heroTitle = document.querySelector(".hero-title")
  if (heroTitle) {
    const text = heroTitle.textContent
    heroTitle.textContent = ""
    heroTitle.style.borderRight = "2px solid #f4d03f"

    let i = 0
    const typeWriter = () => {
      if (i < text.length) {
        heroTitle.textContent += text.charAt(i)
        i++
        setTimeout(typeWriter, 100)
      } else {
        // Remover cursor después de completar
        setTimeout(() => {
          heroTitle.style.borderRight = "none"
        }, 1000)
      }
    }

    // Iniciar typing después de un pequeño delay
    setTimeout(typeWriter, 1000)
  }
})

function createFloatingParticles() {
  const hero = document.querySelector(".hero")
  if (!hero) return

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div")
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 4 + 2}px;
      height: ${Math.random() * 4 + 2}px;
      background: linear-gradient(45deg, #f4d03f, #3b82f6);
      border-radius: 50%;
      opacity: ${Math.random() * 0.5 + 0.2};
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float ${Math.random() * 3 + 2}s ease-in-out infinite;
      animation-delay: ${Math.random() * 2}s;
      pointer-events: none;
      z-index: 0;
    `
    hero.appendChild(particle)
  }
}

function createScrollToTopButton() {
  const button = document.createElement("button")
  button.innerHTML = '<i class="fas fa-arrow-up"></i>'
  button.className = "scroll-to-top"
  button.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1000;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  `

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  })

  document.body.appendChild(button)

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      button.style.opacity = "1"
      button.style.visibility = "visible"
      button.style.transform = "scale(1)"
    } else {
      button.style.opacity = "0"
      button.style.visibility = "hidden"
      button.style.transform = "scale(0.8)"
    }
  })

  button.addEventListener("mouseenter", () => {
    button.style.transform = "scale(1.1)"
    button.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.4)"
  })

  button.addEventListener("mouseleave", () => {
    button.style.transform = "scale(1)"
    button.style.boxShadow = "0 4px 15px rgba(59, 130, 246, 0.3)"
  })
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Accessibility improvements
document.addEventListener("DOMContentLoaded", () => {
  // Add ARIA labels to social links
  const socialLinks = document.querySelectorAll(".social-link")
  socialLinks.forEach((link) => {
    const icon = link.querySelector("i")
    if (icon.classList.contains("fa-facebook")) {
      link.setAttribute("aria-label", "Síguenos en Facebook")
    } else if (icon.classList.contains("fa-instagram")) {
      link.setAttribute("aria-label", "Síguenos en Instagram")
    } else if (icon.classList.contains("fa-youtube")) {
      link.setAttribute("aria-label", "Síguenos en YouTube")
    } else if (icon.classList.contains("fa-whatsapp")) {
      link.setAttribute("aria-label", "Contáctanos por WhatsApp")
    }
  })

  const copyButtons = document.querySelectorAll(".copy-btn")
  copyButtons.forEach((button) => {
    button.setAttribute("aria-label", "Copiar al portapapeles")
  })

  const formInputs = document.querySelectorAll("input, textarea")
  formInputs.forEach((input) => {
    const label = document.querySelector(`label[for="${input.id}"]`)
    if (label) {
      input.setAttribute("aria-describedby", `${input.id}-help`)
    }
  })

  createFloatingParticles()
  createScrollToTopButton()
})

// Error handling for images
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll("img")
  images.forEach((img) => {
    img.addEventListener("error", function () {
      this.style.display = "none"
      console.warn("Failed to load image:", this.src)
    })
  })
})

console.log(
  "%c¡Bienvenido a Family Peace Association - Paraguay!",
  "color: #3b82f6; font-size: 16px; font-weight: bold;",
)
console.log(
  "%cSitio web desarrollado con amor para fortalecer familias paraguayas.",
  "color: #475569; font-size: 12px;",
)
console.log(
  "%c✨ Versión 2.0 - Ahora con animaciones modernas y efectos avanzados",
  "color: #f4d03f; font-size: 12px; font-weight: bold;",
)
