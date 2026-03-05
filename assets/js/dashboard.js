  // ===================== CANVAS PARTICLE BG =====================
  (function() {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    const COLORS = ['#ff3cac','#784bff','#2bd9fe','#ffcc00'];

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function Particle() {
      this.reset = function() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.r = Math.random() * 1.5 + 0.3;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.alpha = Math.random() * 0.5 + 0.1;
        this.life = Math.random() * 200 + 100;
        this.age = 0;
      };
      this.reset();
    }

    for (let i = 0; i < 120; i++) { const p = new Particle(); p.age = Math.random() * p.life; particles.push(p); }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.age++;
        if (p.age > p.life || p.x < 0 || p.x > W || p.y < 0 || p.y > H) p.reset();
        const fade = Math.sin(Math.PI * p.age / p.life);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * fade;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }
    window.addEventListener('resize', resize);
    resize(); draw();
  })();

  // ===================== CUSTOM CURSOR =====================
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function animCursor() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animCursor);
  })();
  document.querySelectorAll('button, .upload-zone, .btn').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.width = '20px'; cursor.style.height = '20px'; ring.style.width = '52px'; ring.style.height = '52px'; ring.style.borderColor = '#ff3cac'; });
    el.addEventListener('mouseleave', () => { cursor.style.width = '12px'; cursor.style.height = '12px'; ring.style.width = '36px'; ring.style.height = '36px'; ring.style.borderColor = '#784bff'; });
  });

  // ===================== GSAP LOADER =====================
  window.addEventListener('load', () => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to('#loader', { opacity: 0, duration: 0.6, delay: 0.3, onComplete: () => {
          document.getElementById('loader').style.display = 'none';
          gsap.to('#app', { opacity: 1, duration: 0.5 });
          animateIn();
        }});
      }
    });
    tl.to('#loader-logo', { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', from: { y: 30 } })
      .to('#loader-sub', { opacity: 1, duration: 0.4 }, '-=0.3')
      .to('#loader-bar', { width: '100%', duration: 1.5, ease: 'power2.inOut' }, '-=0.2');
  });

  function animateIn() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('header', { y: -40, opacity: 0, duration: 0.8, ease: 'expo.out' });
    gsap.from('.hero-label', { y: 30, opacity: 0, duration: 0.9, delay: 0.1, ease: 'expo.out' });
    gsap.from('.left-col .card', { y: 40, opacity: 0, duration: 0.8, delay: 0.25, stagger: 0.12, ease: 'expo.out' });
    gsap.from('.right-panel .card', { y: 40, opacity: 0, duration: 0.8, delay: 0.3, stagger: 0.12, ease: 'expo.out' });
    gsap.from('.size-row', { x: 20, opacity: 0, duration: 0.5, stagger: 0.04, delay: 0.6, ease: 'power3.out' });
  }

  // ===================== SIZES DATA =====================
  const allSizesDef = [
    { w: 16, h: 16, name: 'favicon-16x16.png', icon: 'fa-globe', tag: null },
    { w: 32, h: 32, name: 'favicon-32x32.png', icon: 'fa-window-maximize', tag: null },
    { w: 48, h: 48, name: 'favicon-48x48.png', icon: 'fa-desktop', tag: null },
    { w: 64, h: 64, name: 'favicon-64x64.png', icon: 'fa-expand', tag: null },
    { w: 128, h: 128, name: 'favicon-128x128.png', icon: 'fa-tablet-alt', tag: null },
    { w: 180, h: 180, name: 'favicon-180x180.png', icon: 'fa-apple', tag: 'Apple Touch' },
    { w: 187, h: 187, name: 'favicon-187x187.png', icon: 'fa-windows', tag: 'MS Tile' },
    { w: 250, h: 250, name: 'favicon-250x250.png', icon: 'fa-square', tag: null },
    { w: 256, h: 256, name: 'favicon-256x256.png', icon: 'fa-tv', tag: null },
    { w: 400, h: 400, name: 'favicon-400x400.png', icon: 'fa-expand-arrows-alt', tag: null },
    { w: 36, h: 36, name: 'icon-ldpi.png', icon: 'fa-android', tag: 'ldpi' },
    { w: 48, h: 48, name: 'icon-mdpi.png', icon: 'fa-android', tag: 'mdpi' },
    { w: 72, h: 72, name: 'icon-hdpi.png', icon: 'fa-android', tag: 'hdpi' },
    { w: 96, h: 96, name: 'icon-xhdpi.png', icon: 'fa-android', tag: 'xhdpi' },
    { w: 144, h: 144, name: 'icon-xxhdpi.png', icon: 'fa-android', tag: 'xxhdpi' },
    { w: 192, h: 192, name: 'icon-xxxhdpi.png', icon: 'fa-android', tag: 'xxxhdpi' },
  ];

  // Render sizes list
  function renderSizesList() {
    const container = document.getElementById('sizes-list');
    const maxW = Math.max(...allSizesDef.map(s => s.w));
    container.innerHTML = allSizesDef.map((s, i) => `
      <div class="size-row" id="srow-${i}">
        <div class="size-row-icon"><i class="fas ${s.icon}"></i></div>
        <div class="size-row-info">
          <div class="size-row-dim">${s.w}×${s.h}</div>
          <div class="size-row-name">${s.name}</div>
        </div>
        ${s.tag ? `<span class="android-badge">${s.tag}</span>` : ''}
        <div class="size-row-bar">
          <div class="size-row-fill" style="width:${(s.w/maxW)*100}%"></div>
        </div>
      </div>
    `).join('');
  }
  renderSizesList();

  // ===================== APP LOGIC =====================
  const uploadArea = document.getElementById('upload-area');
  const imageInput = document.getElementById('image-input');
  const imagePreviewContainer = document.getElementById('image-preview-container');
  const imagePreview = document.getElementById('image-preview');
  const previewInfo = document.getElementById('preview-info');
  const generateBtn = document.getElementById('generate-btn');
  const resetBtn = document.getElementById('reset-btn');
  const faviconPreview = document.getElementById('favicon-preview');
  const previewPlaceholder = document.getElementById('preview-placeholder');
  const downloadBtn = document.getElementById('download-btn');
  const progressContainer = document.getElementById('progress-container');
  const progressBar = document.getElementById('progress-bar');
  const progressPct = document.getElementById('progress-pct');
  const customWidthInput = document.getElementById('custom-width');
  const customHeightInput = document.getElementById('custom-height');
  const addSizeBtn = document.getElementById('add-size-btn');
  const customSizesContainer = document.getElementById('custom-sizes-container');

  let originalImage = null, generatedFavicon = null, customSizes = [];

  // Upload
  imageInput.addEventListener('change', handleImageUpload);
  uploadArea.addEventListener('dragover', e => { e.preventDefault(); uploadArea.style.borderColor = '#784bff'; });
  uploadArea.addEventListener('dragleave', () => { uploadArea.style.borderColor = ''; });
  uploadArea.addEventListener('drop', e => {
    e.preventDefault(); uploadArea.style.borderColor = '';
    const file = e.dataTransfer.files[0];
    if (file && file.type.match('image.*')) processFile(file);
  });

  function handleImageUpload(e) { const f = e.target.files[0]; if (f) processFile(f); }

  function processFile(file) {
    if (!file.type.match('image.*')) { showToast('Invalid file', 'Please upload PNG, JPG or SVG', 'error'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      originalImage = new Image();
      originalImage.onload = () => {
        imagePreview.src = ev.target.result;
        imagePreviewContainer.style.display = 'block';
        uploadArea.classList.add('active');
        previewInfo.textContent = `${originalImage.width} × ${originalImage.height} px`;
        faviconPreview.style.display = 'none';
        previewPlaceholder.style.display = 'flex';
        downloadBtn.disabled = true;
        // GSAP anim
        gsap.fromTo(imagePreviewContainer, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' });
        showToast('Image uploaded', `${originalImage.width}×${originalImage.height}px ready`, 'success');
      };
      originalImage.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Generate
  generateBtn.addEventListener('click', generateFavicon);
  function generateFavicon() {
    if (!originalImage) { showToast('No image', 'Upload an image first', 'error'); return; }
    const size = 400;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, size, size);
    const scale = Math.min(size / originalImage.width, size / originalImage.height);
    const nw = originalImage.width * scale, nh = originalImage.height * scale;
    ctx.drawImage(originalImage, (size - nw) / 2, (size - nh) / 2, nw, nh);
    generatedFavicon = canvas.toDataURL('image/png');

    faviconPreview.src = generatedFavicon;
    faviconPreview.style.display = 'block';
    previewPlaceholder.style.display = 'none';
    downloadBtn.disabled = false;

    // Update demo sizes
    ['demo-32','demo-48','demo-64','demo-96'].forEach(id => {
      const img = document.getElementById(id);
      img.src = generatedFavicon; img.style.display = 'block';
    });

    gsap.fromTo('#favicon-frame', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' });
    gsap.fromTo('#favicon-preview', { scale: 1.1 }, { scale: 1, duration: 0.5, ease: 'expo.out' });

    // Stagger the size rows with a pulse
    gsap.fromTo('.size-row', { backgroundColor: 'rgba(120,75,255,0.15)' }, {
      backgroundColor: 'rgba(255,255,255,0)', duration: 0.8, stagger: 0.04, ease: 'power2.out'
    });

    showToast('Favicon generated!', 'Ready to download all 16 sizes', 'success');
  }

  // Reset
  resetBtn.addEventListener('click', () => {
    uploadArea.classList.remove('active');
    imagePreviewContainer.style.display = 'none';
    faviconPreview.style.display = 'none';
    previewPlaceholder.style.display = 'flex';
    downloadBtn.disabled = true;
    progressContainer.style.display = 'none';
    imageInput.value = ''; customWidthInput.value = ''; customHeightInput.value = '';
    customSizes = []; customSizesContainer.innerHTML = '';
    originalImage = null; generatedFavicon = null;
    ['demo-32','demo-48','demo-64','demo-96'].forEach(id => {
      const img = document.getElementById(id);
      img.style.display = 'none'; img.src = '';
    });
    gsap.fromTo('#app', { opacity: 0.7 }, { opacity: 1, duration: 0.4 });
    showToast('Reset complete', 'Start fresh anytime', 'info');
  });

  // Custom size
  addSizeBtn.addEventListener('click', addCustomSize);
  function addCustomSize() {
    const w = parseInt(customWidthInput.value), h = parseInt(customHeightInput.value);
    if (!w || !h || isNaN(w) || isNaN(h)) { showToast('Invalid size', 'Enter both width and height', 'error'); return; }
    if (w < 16 || h < 16) { showToast('Too small', 'Minimum size is 16×16', 'error'); return; }
    if (w > 1000 || h > 1000) { showToast('Too large', 'Maximum size is 1000×1000', 'error'); return; }
    customSizes.push({ width: w, height: h });
    const tag = document.createElement('div');
    tag.className = 'size-tag';
    tag.innerHTML = `${w}×${h} <button data-w="${w}" data-h="${h}"><i class="fas fa-times"></i></button>`;
    tag.querySelector('button').addEventListener('click', function() {
      const bw = parseInt(this.dataset.w), bh = parseInt(this.dataset.h);
      customSizes = customSizes.filter(s => s.width !== bw || s.height !== bh);
      gsap.to(tag, { scale: 0, opacity: 0, duration: 0.25, onComplete: () => tag.remove() });
    });
    customSizesContainer.appendChild(tag);
    gsap.fromTo(tag, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)' });
    customWidthInput.value = ''; customHeightInput.value = '';
    showToast('Size added', `${w}×${h}px included in export`, 'success');
  }

  // Download
  downloadBtn.addEventListener('click', downloadFavicons);
  function downloadFavicons() {
    if (!generatedFavicon) { showToast('Not ready', 'Generate a favicon first', 'error'); return; }

    const standardSizes = allSizesDef.map(s => ({ width: s.w, height: s.h, filename: s.name }));
    const allSizes = [...standardSizes, ...customSizes.map(s => ({ width: s.width, height: s.height }))];

    progressContainer.style.display = 'block';
    gsap.fromTo(progressContainer, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
    progressBar.style.width = '0%';
    progressPct.textContent = '0%';

    const zip = new JSZip();
    const folder = zip.folder("favicons");
    const tempImg = new Image();
    tempImg.src = generatedFavicon;

    // Animate button
    gsap.to('#download-btn', { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1 });

    tempImg.onload = function() {
      let processed = 0;
      allSizes.forEach(size => {
        const { width, height } = size;
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, width, height);
        const scale = Math.min(width / tempImg.width, height / tempImg.height);
        const nw = tempImg.width * scale, nh = tempImg.height * scale;
        ctx.drawImage(tempImg, (width - nw) / 2, (height - nh) / 2, nw, nh);
        canvas.toBlob(blob => {
          const fileName = size.filename || `favicon-${width}x${height}.png`;
          folder.file(fileName, blob);
          processed++;
          const pct = Math.round((processed / allSizes.length) * 100);
          progressBar.style.width = pct + '%';
          progressPct.textContent = pct + '%';
          if (processed === allSizes.length) {
            zip.generateAsync({ type: 'blob' }, meta => {
              const p = Math.round(meta.percent);
              progressBar.style.width = p + '%';
              progressPct.textContent = p + '%';
            }).then(content => {
              saveAs(content, 'splashpaint-favicons.zip');
              setTimeout(() => {
                gsap.to(progressContainer, { opacity: 0, y: -10, duration: 0.4, onComplete: () => { progressContainer.style.display = 'none'; } });
              }, 800);
              showToast('Download complete!', `${allSizes.length} files packed in ZIP`, 'success');
            });
          }
        }, 'image/png');
      });
    };
  }

  // ===================== TOAST =====================
  const toast = document.getElementById('toast');
  const toastIcon = document.getElementById('toast-icon');
  const toastTitle = document.getElementById('toast-title');
  const toastSub = document.getElementById('toast-sub');
  let toastTimer;
  const toastIcons = { success: 'fa-check', error: 'fa-times', info: 'fa-info' };

  function showToast(title, sub, type = 'success') {
    clearTimeout(toastTimer);
    toastTitle.textContent = title;
    toastSub.textContent = sub;
    toastIcon.innerHTML = `<i class="fas ${toastIcons[type]}"></i>`;
    toast.className = `toast ${type}`;
    gsap.fromTo(toast, { x: 120, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'expo.out' });
    toastTimer = setTimeout(() => {
      gsap.to(toast, { x: 120, opacity: 0, duration: 0.4, ease: 'expo.in' });
    }, 3500);
  }

  // ===================== PWA =====================
  const pwaBanner = document.getElementById('pwa-banner');
  const installButton = document.getElementById('install-button');
  const dismissButton = document.getElementById('dismiss-button');
  let deferredPrompt = null;

  function isInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone || document.referrer.includes('android-app://');
  }
  function showBanner() {
    if (isInstalled() || sessionStorage.getItem('pwaDismissed')) return;
    pwaBanner.style.display = 'flex';
    setTimeout(() => pwaBanner.classList.add('show'), 50);
  }
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault(); deferredPrompt = e; showBanner();
  });
  installButton.addEventListener('click', async () => {
    pwaBanner.classList.remove('show');
    setTimeout(() => { pwaBanner.style.display = 'none'; }, 500);
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      showToast(outcome === 'accepted' ? 'App installed!' : 'Cancelled', '', outcome === 'accepted' ? 'success' : 'info');
      deferredPrompt = null;
    } else {
      showToast('Install tip', 'Tap share → Add to Home Screen', 'info');
    }
  });
  dismissButton.addEventListener('click', () => {
    pwaBanner.classList.remove('show');
    setTimeout(() => { pwaBanner.style.display = 'none'; }, 500);
    sessionStorage.setItem('pwaDismissed', 'true');
  });
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (isIOS && !isInstalled()) setTimeout(showBanner, 3000);