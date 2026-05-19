
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

document.addEventListener('DOMContentLoaded', () => {

    initNavbarScroll();
    initParticles();
    initParallax();
    initScrollReveal();
    initCounters();
    initTextArea();
    initFileUpload();

});

function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 30);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const WORDS = ['original', 'plagio', 'verificado', 'auténtico', 'análisis', 'preciso', 'fuente', 'cita', 'texto'];
    const particles = [];
    let W, H;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const isDark = () => document.body.classList.contains('dark-mode');

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.word = WORDS[Math.floor(Math.random() * WORDS.length)];
            this.x = Math.random() * W;
            this.y = H + 30;
            this.speed = 0.25 + Math.random() * 0.45;
            this.dx = (Math.random() - .5) * 0.3;
            this.size = 10 + Math.random() * 8;
            this.alpha = 0;
            this.targetAlpha = 0.06 + Math.random() * 0.09;
            this.rotation = (Math.random() - .5) * 0.4;
        }
        update() {
            this.y -= this.speed;
            this.x += this.dx;
            if (this.y < H * 0.6 && this.alpha < this.targetAlpha) this.alpha += 0.002;
            if (this.y < H * 0.15) this.alpha -= 0.003;
            if (this.alpha <= 0 && this.y < 0) this.reset();
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = Math.max(0, this.alpha);
            ctx.font = `${this.size}px 'Syne', sans-serif`;
            ctx.fillStyle = isDark() ? '#ffffff' : '#1c1c1d';
            ctx.fillText(this.word, 0, 0);
            ctx.restore();
        }
    }

    for (let i = 0; i < 28; i++) {
        const p = new Particle();
        p.y = Math.random() * H;
        p.alpha = p.targetAlpha * Math.random();
        particles.push(p);
    }

    function loop() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(loop);
    }
    loop();
}

function initParallax() {
    const orbs = document.querySelectorAll('[data-parallax]');
    if (!orbs.length) return;

    const onScroll = () => {
        const scrollY = window.scrollY;
        orbs.forEach(orb => {
            const speed = parseFloat(orb.dataset.parallax);
            orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
}

function initScrollReveal() {
    const targets = document.querySelectorAll('.fade-section');
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12 });

    targets.forEach(t => observer.observe(t));
}


function initCounters() {
    const counters = document.querySelectorAll('.counter-anim, [data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}


function initTextArea() {
    const txtArea = document.getElementById('txtAnalizar');
    const contador = document.getElementById('contadortxt');
    const btnTrash = document.getElementById('btnTrash');
    const progress = document.getElementById('wordProgress');
    if (!txtArea) return;

    const MAX_WORDS = 1000;

    const update = () => {
        const texto = txtArea.value.trim();
        const palabras = texto === '' ? 0 : texto.split(/\s+/).length;

        contador.textContent = palabras;

        const pct = Math.min((palabras / MAX_WORDS) * 100, 100);
        progress.style.width = pct + '%';
        progress.classList.toggle('danger', palabras > MAX_WORDS * 0.85);

        btnTrash.style.display = texto === '' ? 'none' : 'flex';
    };

    txtArea.addEventListener('input', update);
    txtArea.addEventListener('click', () => {
        const input = document.getElementById('archivo');
        const elementoToast = document.querySelector('.textarea-wrap');

        if (input.files[0]) {
            const archivo = input.files[0];
            const extension = archivo.name.slice(archivo.name.lastIndexOf('.')).toLowerCase();

            mostrarToast(`Ya tienes un archivo ${extension} cargado. Quítalo para ingresar texto manualmente.`, elementoToast);
            txtArea.blur();
        }
    });
}

function mostrarToast(mensaje, elementoReferencia) {
    document.querySelector('.toast-archivo')?.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-archivo';
    toast.innerHTML = `<i class="bi bi-info-circle"></i> ${mensaje}`;
    document.querySelector('.textarea-wrap').appendChild(toast);

    if (window.getComputedStyle(elementoReferencia).position === 'static') {
        elementoReferencia.style.position = 'relative';
    }

    elementoReferencia.appendChild(toast);

    setTimeout(() => toast.classList.add('toast-salir'), 2600);
    setTimeout(() => toast.remove(), 3800);
}

function borrarTexto() {
    const txtArea = document.getElementById('txtAnalizar');
    const contador = document.getElementById('contadortxt');
    const btnTrash = document.getElementById('btnTrash');
    const progress = document.getElementById('wordProgress');
    if (!txtArea) return;

    txtArea.value = '';
    contador.textContent = '0';
    progress.style.width = '0%';
    progress.classList.remove('danger');
    btnTrash.style.display = 'none';
    txtArea.focus();
}

function initFileUpload() {
    const input = document.getElementById('archivo');
    const btnUpload = document.getElementById('btn-upload')
    const spanNombre = document.querySelector('.archivo-nombre');
    const btnQuitar = document.querySelector('.archivo-remove')
    const textArea = document.getElementById('txtAnalizar');
    if (!input) return;

    btnUpload.addEventListener('click', (e) => {
        if (input.files[0]) {
            e.preventDefault();
            mostrarToast('Solo se puede subir un archivo por análisis.', btnUpload);
            return;
        };

    });

    input.addEventListener('change', () => {

        const archivo = input.files[0];
        if (!archivo) return;


        const tiposValidos = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword'
        ];

        if (!tiposValidos.includes(archivo.type)) {
            input.value = '';
            mostrarToast("Solo se permiten cargar documentos PDF o Word", btnUpload)
        }

        const nombre = input.files[0]?.name || '';
        if (spanNombre) spanNombre.textContent = nombre ? `📄 ${nombre} ` : '';

        if (btnQuitar) btnQuitar.classList.toggle('d-none', !nombre);

        if (nombre) {
            textArea.setAttribute('readOnly', true);
            textArea.setAttribute('placeholder', '');
            borrarTexto();
        }

    });

    btnQuitar.addEventListener('click', () => {

        input.value = '';

        if (spanNombre) spanNombre.textContent = '';
        btnQuitar.classList.add('d-none')
        textArea.removeAttribute('readOnly');
        textArea.setAttribute('placeholder', 'Ingresa tu texto o carga un documento para el análisis...');


    });

}
function modoOscuro() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}