// Ioana & Andrei Wedding Website Interactive Logic (8 May 2027 - Padurile Regale)

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navigation on Scroll
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Live Countdown Timer to 8 May 2027, 18:00 EEST (UTC+3)
  const targetDate = new Date('2027-05-08T18:00:00+03:00').getTime();
  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins = document.getElementById('cd-mins');
  const elSecs = document.getElementById('cd-secs');

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      if (elDays) elDays.textContent = '00';
      if (elHours) elHours.textContent = '00';
      if (elMins) elMins.textContent = '00';
      if (elSecs) elSecs.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    if (elDays) elDays.textContent = String(days).padStart(2, '0');
    if (elHours) elHours.textContent = String(hours).padStart(2, '0');
    if (elMins) elMins.textContent = String(mins).padStart(2, '0');
    if (elSecs) elSecs.textContent = String(secs).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 3. Language Toggle (RO / EN)
  let currentLang = 'ro';
  const langToggleBtn = document.getElementById('lang-toggle-btn');

  function applyLanguage(lang) {
    currentLang = lang;
    if (langToggleBtn) {
      langToggleBtn.innerHTML = lang === 'ro' ? '🌐 RO / <span style="opacity:0.6">EN</span>' : '🌐 <span style="opacity:0.6">RO</span> / EN';
    }

    document.querySelectorAll('[data-ro][data-en]').forEach(el => {
      const text = lang === 'ro' ? el.getAttribute('data-ro') : el.getAttribute('data-en');
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else {
        el.innerHTML = text;
      }
    });

    // Update live ski pass preview labels
    syncSkiPassPreview();
    // Update story carousel caption language if active
    updateStoryCarouselCaption();
    // Update hero play/pause button label
    updateHeroPlayButtonLabel();
  }

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      applyLanguage(currentLang === 'ro' ? 'en' : 'ro');
    });
  }

  // 4. Full-Screen Hero Background Slideshow (Real Photos of Ioana & Andrei)
  const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
  const heroDots = Array.from(document.querySelectorAll('.slide-dot'));
  const heroPrevBtn = document.getElementById('hero-prev-btn');
  const heroNextBtn = document.getElementById('hero-next-btn');
  const heroPlayToggle = document.getElementById('hero-play-toggle');

  let currentHeroIdx = 0;
  let heroIsPlaying = true;
  let heroTimer = null;

  function showHeroSlide(index) {
    if (!heroSlides.length) return;
    currentHeroIdx = (index + heroSlides.length) % heroSlides.length;
    heroSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentHeroIdx);
    });
    heroDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentHeroIdx);
    });
  }

  function nextHeroSlide() {
    showHeroSlide(currentHeroIdx + 1);
  }

  function prevHeroSlide() {
    showHeroSlide(currentHeroIdx - 1);
  }

  function startHeroTimer() {
    stopHeroTimer();
    if (heroIsPlaying) {
      heroTimer = setInterval(nextHeroSlide, 5500);
    }
  }

  function stopHeroTimer() {
    if (heroTimer) {
      clearInterval(heroTimer);
      heroTimer = null;
    }
  }

  function updateHeroPlayButtonLabel() {
    if (!heroPlayToggle) return;
    if (heroIsPlaying) {
      heroPlayToggle.innerHTML = currentLang === 'ro' ? '⏸ Pauză Slideshow' : '⏸ Pause Slideshow';
    } else {
      heroPlayToggle.innerHTML = currentLang === 'ro' ? '▶ Rulează Slideshow' : '▶ Play Slideshow';
    }
  }

  if (heroSlides.length > 0) {
    startHeroTimer();

    if (heroNextBtn) {
      heroNextBtn.addEventListener('click', () => {
        nextHeroSlide();
        startHeroTimer();
      });
    }

    if (heroPrevBtn) {
      heroPrevBtn.addEventListener('click', () => {
        prevHeroSlide();
        startHeroTimer();
      });
    }

    heroDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showHeroSlide(idx);
        startHeroTimer();
      });
    });

    if (heroPlayToggle) {
      heroPlayToggle.addEventListener('click', () => {
        heroIsPlaying = !heroIsPlaying;
        updateHeroPlayButtonLabel();
        if (heroIsPlaying) {
          startHeroTimer();
        } else {
          stopHeroTimer();
        }
      });
    }
  }

  // 5. Story Section Interactive Photo Carousel
  const storyMainImg = document.getElementById('story-carousel-main-img');
  const storyCaptionEl = document.getElementById('story-carousel-caption');
  const storyThumbBtns = Array.from(document.querySelectorAll('.story-thumb-btn'));
  const storyPrevBtn = document.getElementById('story-prev-btn');
  const storyNextBtn = document.getElementById('story-next-btn');
  let currentStoryIdx = 0;

  function updateStoryCarouselCaption() {
    if (!storyThumbBtns.length || !storyCaptionEl) return;
    const activeThumb = storyThumbBtns[currentStoryIdx];
    if (!activeThumb) return;
    const roText = activeThumb.getAttribute('data-caption-ro') || '';
    const enText = activeThumb.getAttribute('data-caption-en') || '';
    storyCaptionEl.textContent = currentLang === 'ro' ? roText : enText;
  }

  function showStorySlide(idx) {
    if (!storyThumbBtns.length || !storyMainImg) return;
    currentStoryIdx = (idx + storyThumbBtns.length) % storyThumbBtns.length;
    const targetBtn = storyThumbBtns[currentStoryIdx];
    const newSrc = targetBtn.getAttribute('data-src');

    storyMainImg.style.opacity = '0.2';
    setTimeout(() => {
      storyMainImg.src = newSrc;
      storyMainImg.style.opacity = '1';
    }, 180);

    storyThumbBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === currentStoryIdx);
    });

    updateStoryCarouselCaption();
  }

  if (storyThumbBtns.length > 0) {
    storyThumbBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        showStorySlide(idx);
      });
    });

    if (storyPrevBtn) {
      storyPrevBtn.addEventListener('click', () => {
        showStorySlide(currentStoryIdx - 1);
      });
    }

    if (storyNextBtn) {
      storyNextBtn.addEventListener('click', () => {
        showStorySlide(currentStoryIdx + 1);
      });
    }
  }

  // 6. Interactive Alpine Ski-Pass RSVP Live Binding
  const rsvpForm = document.getElementById('rsvp-form');
  const inputName = document.getElementById('rsvp-name');
  const inputPhone = document.getElementById('rsvp-phone');
  const inputGuests = document.getElementById('rsvp-guests');
  const inputMenu = document.getElementById('rsvp-menu');
  const inputSong = document.getElementById('rsvp-song');
  const inputNotes = document.getElementById('rsvp-notes');

  const passHolder = document.getElementById('pass-holder-val');
  const passStatus = document.getElementById('pass-status-val');
  const passGuests = document.getElementById('pass-guests-val');
  const passTransport = document.getElementById('pass-transport-val');
  const passMenu = document.getElementById('pass-menu-val');
  const passSerial = document.getElementById('pass-serial-code');

  function getRadioVal(name) {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value : '';
  }

  function syncSkiPassPreview() {
    const nameVal = inputName && inputName.value.trim() ? inputName.value.trim() : (currentLang === 'ro' ? 'Invitatul Nostru Drag' : 'Our Honored Guest');
    const attendVal = getRadioVal('attendance');
    const transportVal = getRadioVal('transport');
    const guestsVal = inputGuests ? inputGuests.value : '2';
    const menuVal = inputMenu ? inputMenu.value : 'standard';

    if (passHolder) passHolder.textContent = nameVal;

    if (passStatus) {
      if (attendVal === 'yes') {
        passStatus.textContent = currentLang === 'ro' ? 'CONFIRMAT • PE PÂRTIE' : 'CONFIRMED • ON THE SLOPES';
        passStatus.style.color = '#6be695';
      } else {
        passStatus.textContent = currentLang === 'ro' ? 'ABSENT • CU GÂNDUL ALĂTURI' : 'UNABLE TO ATTEND';
        passStatus.style.color = '#f59e0b';
      }
    }

    if (passGuests) {
      passGuests.textContent = `${guestsVal} ${Number(guestsVal) === 1 ? (currentLang === 'ro' ? 'Persoană' : 'Guest') : (currentLang === 'ro' ? 'Persoane' : 'Guests')}`;
    }

    if (passTransport) {
      if (transportVal === 'blue_pipera') {
        passTransport.textContent = currentLang === 'ro' ? 'SHUTTLE BLUE (Metrou Pipera)' : 'BLUE SHUTTLE (Pipera Metro)';
        passTransport.className = 'pass-field-val highlight-blue';
      } else {
        passTransport.textContent = currentLang === 'ro' ? 'Mașină Personală (Parcare Pădurile Regale)' : 'Personal Car (Venue Parking)';
        passTransport.className = 'pass-field-val highlight-gold';
      }
    }

    if (passMenu) {
      const menuLabels = {
        standard: currentLang === 'ro' ? 'Meniu Tradițional & Gourmet' : 'Gourmet Standard Menu',
        vegetarian: currentLang === 'ro' ? 'Meniu Vegetarian' : 'Vegetarian Menu',
        vegan: currentLang === 'ro' ? 'Meniu Vegan' : 'Vegan Menu',
        glutenfree: currentLang === 'ro' ? 'Fără Gluten / Alergii' : 'Gluten-Free / Allergies'
      };
      passMenu.textContent = menuLabels[menuVal] || menuVal;
    }
  }

  // Listen to form changes
  if (rsvpForm) {
    rsvpForm.addEventListener('input', syncSkiPassPreview);
    rsvpForm.addEventListener('change', syncSkiPassPreview);

    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      syncSkiPassPreview();

      // Generate unique serial number
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      if (passSerial) passSerial.textContent = `IA-2027-0508-${randomNum}`;

      const confirmationBox = document.getElementById('rsvp-confirmation-banner');
      if (confirmationBox) {
        confirmationBox.style.display = 'block';
        confirmationBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Prepare WhatsApp message link for instant sharing if desired
      const nameVal = inputName.value.trim() || 'Invitat';
      const attendVal = getRadioVal('attendance') === 'yes' ? 'DA, confirm prezența!' : 'Din păcate nu pot ajunge.';
      const transportVal = getRadioVal('transport') === 'blue_pipera' ? 'Transport cu Blue de la Metrou Pipera' : 'Vin cu mașina personală';
      const guestsVal = inputGuests.value;
      const menuVal = inputMenu.value;
      const songVal = inputSong.value.trim();
      const notesVal = inputNotes.value.trim();

      const waText = encodeURIComponent(
        `Salut Ioana & Andrei! 🏔️⛷️\n` +
        `Confirmare nuntă 8 Mai 2027 (Pădurile Regale):\n` +
        `• Nume: ${nameVal}\n` +
        `• Răspuns: ${attendVal}\n` +
        `• Persoane: ${guestsVal}\n` +
        `• Transport: ${transportVal}\n` +
        `• Meniu: ${menuVal}\n` +
        (songVal ? `• Piesa de dans: ${songVal}\n` : '') +
        (notesVal ? `• Mențiuni: ${notesVal}` : '')
      );

      const waBtn = document.getElementById('btn-whatsapp-share');
      if (waBtn) {
        waBtn.href = `https://wa.me/?text=${waText}`;
      }
    });
  }

  // 7. Quick-Select "Blue" Transport Button from Transport Section
  const btnSelectBlue = document.getElementById('btn-select-blue-transport');
  if (btnSelectBlue) {
    btnSelectBlue.addEventListener('click', (e) => {
      e.preventDefault();
      const blueRadio = document.querySelector('input[name="transport"][value="blue_pipera"]');
      if (blueRadio) {
        blueRadio.checked = true;
        syncSkiPassPreview();
      }
      const rsvpSection = document.getElementById('confirmari');
      if (rsvpSection) {
        rsvpSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 8. Add to Calendar (.ics Download & Google Calendar)
  const btnDownloadIcs = document.getElementById('btn-download-ics');
  if (btnDownloadIcs) {
    btnDownloadIcs.addEventListener('click', () => {
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Ioana & Andrei Wedding//8 May 2027//RO',
        'BEGIN:VEVENT',
        'UID:ioana-andrei-wedding-20270508@padurileregale.ro',
        'DTSTAMP:20260915T120000Z',
        'DTSTART:20270508T150000Z',
        'DTEND:20270509T020000Z',
        'SUMMARY:Nunta Ioana & Andrei 🏔️ Pădurile Regale',
        'DESCRIPTION:Ceremonia începe la ora 18:00 în pădurea de stejari seculari, iar Petrecerea la ora 19:00 la Pădurile Regale (Corbeanca), cu final între 02:00 și 05:00 dimineața. Transport asigurat cu Blue de la stația de metrou Pipera!',
        'LOCATION:Pădurile Regale, Strada Pădurii, Corbeanca, Ilfov, România',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'Nunta_Ioana_si_Andrei_8_Mai_2027.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // 9. Print / Save Ski Pass Button
  const btnPrintPass = document.getElementById('btn-print-pass');
  if (btnPrintPass) {
    btnPrintPass.addEventListener('click', () => {
      window.print();
    });
  }

  // 10. FAQ Accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close others
      document.querySelectorAll('.faq-item').forEach(other => other.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // 11. 10-Photo Real Gallery Lightbox Modal
  const galleryCards = Array.from(document.querySelectorAll('.gallery-card'));
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  let currentLightboxIdx = 0;

  function openLightbox(idx) {
    if (!galleryCards.length || !lightboxModal) return;
    currentLightboxIdx = (idx + galleryCards.length) % galleryCards.length;
    const card = galleryCards[currentLightboxIdx];
    const imgEl = card.querySelector('img');
    const captionEl = card.querySelector('.gallery-caption-text');

    if (imgEl && lightboxImg) {
      lightboxImg.src = imgEl.src;
    }
    if (captionEl && lightboxCaption) {
      const text = currentLang === 'ro'
        ? (captionEl.getAttribute('data-ro') || captionEl.textContent)
        : (captionEl.getAttribute('data-en') || captionEl.textContent);
      lightboxCaption.textContent = text;
    }
    lightboxModal.classList.add('open');
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('open');
    }
  }

  if (galleryCards.length > 0 && lightboxModal) {
    galleryCards.forEach((card, idx) => {
      card.addEventListener('click', () => openLightbox(idx));
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(currentLightboxIdx - 1);
      });
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(currentLightboxIdx + 1);
      });
    }

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!lightboxModal.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') openLightbox(currentLightboxIdx - 1);
      if (e.key === 'ArrowRight') openLightbox(currentLightboxIdx + 1);
    });
  }

  // 12. Interactive Photo Uploader (> Încarcă aici poze de la nuntă <)
  const dropzone = document.getElementById('photo-dropzone');
  const fileInput = document.getElementById('photo-file-input');
  const previewGrid = document.getElementById('uploaded-photos-grid');
  const uploadStatusMsg = document.getElementById('upload-status-msg');

  function handleFiles(files) {
    if (!files || !files.length) return;
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const div = document.createElement('div');
        div.className = 'uploaded-thumb';
        div.innerHTML = `<img src="${e.target.result}" alt="Wedding Memory" />`;
        if (previewGrid) previewGrid.prepend(div);
      };
      reader.readAsDataURL(file);
    });

    if (uploadStatusMsg) {
      uploadStatusMsg.textContent = currentLang === 'ro'
        ? `✨ Mulțumim! ${files.length} fotografie(i) adăugată(e) în albumul Ioana & Andrei!`
        : `✨ Thank you! ${files.length} photo(s) added to Ioana & Andrei's wedding album!`;
      uploadStatusMsg.style.color = '#6be695';
    }
  }

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('dragover');
    });
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      handleFiles(e.dataTransfer.files);
    });
    fileInput.addEventListener('change', (e) => {
      handleFiles(e.target.files);
    });
  }

  // 13. Subtle Alpine Snowfall Canvas
  const snowCanvas = document.getElementById('snow-canvas');
  const snowToggleBtn = document.getElementById('snow-toggle-btn');
  let snowActive = true;

  if (snowCanvas) {
    const ctx = snowCanvas.getContext('2d');
    let width = (snowCanvas.width = window.innerWidth);
    let height = (snowCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = snowCanvas.width = window.innerWidth;
      height = snowCanvas.height = window.innerHeight;
    });

    const flakes = Array.from({ length: 48 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.2 + 0.8,
      d: Math.random() * 0.6 + 0.3,
      a: Math.random() * Math.PI * 2
    }));

    function drawSnow() {
      if (!snowActive) {
        requestAnimationFrame(drawSnow);
        return;
      }
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.beginPath();
      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
      }
      ctx.fill();

      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        f.y += f.d;
        f.a += 0.01;
        f.x += Math.sin(f.a) * 0.35;
        if (f.y > height) {
          f.y = -5;
          f.x = Math.random() * width;
        }
      }
      requestAnimationFrame(drawSnow);
    }

    snowCanvas.classList.add('active');
    drawSnow();

    if (snowToggleBtn) {
      snowToggleBtn.addEventListener('click', () => {
        snowActive = !snowActive;
        snowCanvas.classList.toggle('active', snowActive);
        snowToggleBtn.style.opacity = snowActive ? '1' : '0.55';
      });
    }
  }
});
