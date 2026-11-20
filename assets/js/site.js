(() => {
  const slides = [
    { type: 'video', src: 'assets/images/hero-slides/hero-film.mp4' },
    { type: 'image', src: 'assets/images/hero-slides/close-up.png' },
    { type: 'image', src: 'assets/images/hero-slides/slide-01.jpg.png', position: 'center 45%' },
    { type: 'image', src: 'assets/images/hero-slides/slide-02.png' },
    { type: 'image', src: 'assets/images/hero-slides/slide-03.png', position: 'center top' }
  ];
  const layers = [document.querySelector('#hero-media'), document.querySelector('#hero-media-next')];
  const video = document.querySelector('#hero-video');
  const dots = document.querySelector('.slide-dots');
  if (layers.every(Boolean) && video && dots) {
    let current = 0;
    let activeLayer = null;
    let imageTimer;
    let videoHideTimer;
    const advance = () => show(current + 1);
    const show = index => {
      clearTimeout(imageTimer);
      clearTimeout(videoHideTimer);
      current = (index + slides.length) % slides.length;
      const slide = slides[current];
      if (slide.type === 'video') {
        layers.forEach(layer => layer.classList.remove('is-visible'));
        activeLayer = null;
        video.hidden = false;
        video.loop = false;
        if (video.getAttribute('src') !== slide.src) {
          video.setAttribute('src', slide.src);
          video.load();
        }
        video.currentTime = 0;
        video.onended = advance;
        video.play().then(() => requestAnimationFrame(() => video.classList.add('is-visible')))
          .catch(() => { imageTimer = setTimeout(advance, 7000); });
      } else {
        video.onended = null;
        video.pause();
        video.classList.remove('is-visible');
        if (!video.hidden) videoHideTimer = setTimeout(() => { video.hidden = true; }, 900);
        else video.hidden = true;
        const layer = layers.find(item => item !== activeLayer) || layers[0];
        layer.classList.remove('is-visible');
        layer.style.backgroundImage = `url("${slide.src}")`;
        layer.style.backgroundSize = 'cover';
        layer.style.backgroundPosition = slide.position || 'center center';
        layer.style.backgroundRepeat = 'no-repeat';
        void layer.offsetWidth;
        layer.classList.add('is-visible');
        if (activeLayer) activeLayer.classList.remove('is-visible');
        activeLayer = layer;
        imageTimer = setTimeout(advance, 7000);
      }
      [...dots.children].forEach((dot, i) => dot.setAttribute('aria-current', String(i === current)));
    };
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Show slide ${index + 1}`);
      dot.addEventListener('click', () => show(index));
      dots.append(dot);
    });
    document.querySelector('.previous')?.addEventListener('click', () => show(current - 1));
    document.querySelector('.next')?.addEventListener('click', () => show(current + 1));
    show(0);
  }
  const toggle = document.querySelector('.menu-toggle');
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    document.querySelectorAll('.nav').forEach(nav => nav.classList.toggle('open', open));
  });
  document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', () => {
    document.querySelectorAll('.nav').forEach(nav => nav.classList.remove('open'));
    toggle?.setAttribute('aria-expanded', 'false');
  }));
  const form = document.querySelector('#gazette-form');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const address = form.elements.email.value.trim();
    const subject = encodeURIComponent('JuteOrb email updates');
    const body = encodeURIComponent(`Please add ${address} to the JuteOrb email updates list.`);
    document.querySelector('#form-note').textContent = 'Your email app will open so you can send the signup request.';
    window.location.href = `mailto:info@juteorb.com?subject=${subject}&body=${body}`;
  });
  const contactForm = document.querySelector('#contact-form');
  contactForm?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const subject = encodeURIComponent('JuteOrb enquiry from ' + data.get('name'));
    const body = encodeURIComponent('Name: ' + data.get('name') + '\nEmail: ' + data.get('email') + '\n\n' + data.get('message'));
    document.querySelector('#contact-note').textContent = 'Your email app will open with the enquiry ready to send.';
    window.location.href = 'mailto:info@juteorb.com?subject=' + subject + '&body=' + body;
  });
})();
