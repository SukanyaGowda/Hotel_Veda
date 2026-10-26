/**
 * HOTEL VEDA — Haute Indo-Italian Dining & Atelier
 * Bespoke Cinema Engine & Video Interaction
 */

// ==========================================================================
// 1. HOTEL VEDA SACRED BACKGROUND MUSIC ENGINE
// Plays peaceful, serene Indian sitar & classical ambient dining soundscape
// ==========================================================================
class DiningAmbienceEngine {
  constructor() {
    const audioPath = new URL('/audio/hotel_veda_ambient.mp3', import.meta.url).href;
    this.audio = new Audio(audioPath);
    this.audio.loop = true;
    this.audio.preload = 'auto';
    this.targetVolume = 0.5;
    this.fadeInterval = null;
    this.isPlaying = false;
    this.synthCtx = null;

    // Listen for end/error fallbacks
    this.audio.addEventListener('error', (e) => {
      console.warn('Audio element error, will use synth fallback if needed:', e);
    });
  }

  playMusic() {
    if (this.fadeInterval) clearInterval(this.fadeInterval);
    this.audio.volume = 0;
    
    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          // Smooth elegant volume fade in
          let vol = 0;
          this.fadeInterval = setInterval(() => {
            vol = Math.min(this.targetVolume, vol + 0.04);
            this.audio.volume = vol;
            if (vol >= this.targetVolume) {
              clearInterval(this.fadeInterval);
              this.fadeInterval = null;
            }
          }, 50);
          this.updateSoundUI(true);
        })
        .catch((err) => {
          console.warn('Autoplay prevented by browser, waiting for user interaction:', err);
          this.isPlaying = false;
          this.updateSoundUI(false);
        });
    }
  }

  pauseMusic() {
    if (this.fadeInterval) clearInterval(this.fadeInterval);
    let vol = this.audio.volume;
    this.fadeInterval = setInterval(() => {
      vol = Math.max(0, vol - 0.08);
      this.audio.volume = vol;
      if (vol <= 0.02) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
        this.audio.pause();
        this.isPlaying = false;
        this.updateSoundUI(false);
      }
    }, 40);
  }

  toggle() {
    if (this.isPlaying) {
      this.pauseMusic();
      return false;
    } else {
      this.playMusic();
      return true;
    }
  }

  updateSoundUI(active) {
    const soundBtn = document.getElementById('soundToggleBtn');
    const soundIcon = document.getElementById('soundIcon');
    if (!soundBtn) return;

    if (active) {
      soundBtn.classList.add('playing');
      const textSpan = soundBtn.querySelector('.btn-text');
      if (textSpan) textSpan.textContent = 'MUSIC ON';
      if (soundIcon) soundIcon.setAttribute('data-lucide', 'volume-2');
    } else {
      soundBtn.classList.remove('playing');
      const textSpan = soundBtn.querySelector('.btn-text');
      if (textSpan) textSpan.textContent = 'MUSIC OFF';
      if (soundIcon) soundIcon.setAttribute('data-lucide', 'volume-x');
    }
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  playChime() {
    // Subtle golden chime for modal activations
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!this.synthCtx && AudioCtx) {
        this.synthCtx = new AudioCtx();
      }
      if (this.synthCtx && this.synthCtx.state === 'suspended') {
        this.synthCtx.resume();
      }
      if (!this.synthCtx) return;

      const notes = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6
      const now = this.synthCtx.currentTime;
      notes.forEach((f, i) => {
        const osc = this.synthCtx.createOscillator();
        const gain = this.synthCtx.createGain();
        const t = now + i * 0.09;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);

        gain.gain.setValueAtTime(0.04, t);
        gain.gain.exponentialRampToValueAtTime(0.0008, t + 0.55);

        osc.connect(gain);
        gain.connect(this.synthCtx.destination);

        osc.start(t);
        osc.stop(t + 0.55);
      });
    } catch (e) {}
  }
}

const ambience = new DiningAmbienceEngine();

// ==========================================================================
// 2. VIDEO CINEMA CONTROLLER
// Controls the 1080p AI Noodle Falling Video
// ==========================================================================
class VideoCinemaController {
  constructor() {
    this.video = document.getElementById('noodleAiVideo');
    this.cinemaWrapper = document.getElementById('cinemaWrapper');

    this.badgeSpoon = document.getElementById('badgeSpoon');
    this.badgeFall = document.getElementById('badgeFall');
    this.badgePlate = document.getElementById('badgePlate');

    // Silky slow-motion cinematic rate (0.6x for 7.17s master video)
    this.playbackRate = 0.6;

    this.init();
  }

  init() {
    if (!this.video) return;

    // Apply smooth slow-motion playback speed
    this.video.playbackRate = this.playbackRate;
    this.video.defaultPlaybackRate = this.playbackRate;

    // Ensure playback rate persists across loops and seeking
    this.video.addEventListener('ratechange', () => {
      if (this.video.playbackRate !== this.playbackRate) {
        this.video.playbackRate = this.playbackRate;
      }
    });

    this.video.addEventListener('loadedmetadata', () => {
      this.video.playbackRate = this.playbackRate;
    });

    // Ensure autoplay works across modern browsers
    this.video.play().catch(() => {
      document.body.addEventListener('click', () => this.video.play(), { once: true });
    });

    // Time update for synchronized badge illumination
    this.video.addEventListener('timeupdate', () => {
      this.syncBadges(this.video.currentTime);
    });

    // Click on video to toggle play/pause smoothly
    if (this.cinemaWrapper) {
      this.cinemaWrapper.addEventListener('click', (e) => {
        // Only toggle if not clicking interactive badges/buttons
        if (e.target.closest('.floating-badge') || e.target.closest('button') || e.target.closest('a')) {
          return;
        }
        if (this.video.paused) {
          this.video.play();
        } else {
          this.video.pause();
        }
      });
    }
  }

  syncBadges(currentTime) {
    // Elegant timing synchronized with natural 7.2s slow-motion cycle
    const isSpoon = currentTime >= 0 && currentTime < 2.3;
    const isFall = currentTime >= 2.3 && currentTime < 4.8;
    const isPlate = currentTime >= 4.8;

    if (this.badgeSpoon) {
      this.badgeSpoon.style.opacity = isSpoon ? '1' : '0.35';
      this.badgeSpoon.style.transform = isSpoon ? 'scale(1.05) translateY(-5px)' : 'scale(0.96)';
    }

    if (this.badgeFall) {
      this.badgeFall.style.opacity = isFall ? '1' : '0.35';
      this.badgeFall.style.transform = isFall ? 'scale(1.05) translateY(-5px)' : 'scale(0.96)';
    }

    if (this.badgePlate) {
      this.badgePlate.style.opacity = isPlate ? '1' : '0.35';
      this.badgePlate.style.transform = isPlate ? 'scale(1.05) translateY(-5px)' : 'scale(0.96)';
    }
  }
}

// ==========================================================================
// 3. MODALS & INTERACTIONS
// ==========================================================================
function initUI() {
  // Sound button
  const soundBtn = document.getElementById('soundToggleBtn');
  if (soundBtn) {
    soundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      ambience.toggle();
    });
  }

  // Booking Modal
  const bookingModal = document.getElementById('bookingModal');
  const closeBookingBtn = document.getElementById('closeBookingBtn');
  const heroBookBtn = document.getElementById('heroBookBtn');
  const ctaReserveTable = document.getElementById('ctaReserveTable');
  const navReserveBtn = document.getElementById('navReserveBtn');
  const bookingForm = document.getElementById('bookingForm');
  const dateInput = document.getElementById('dateInput');

  // Set default booking date to tomorrow
  if (dateInput) {
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    dateInput.value = tmrw.toISOString().split('T')[0];
  }

  function openBooking(e) {
    if (e) e.preventDefault();
    if (bookingModal) {
      bookingModal.classList.add('open');
      ambience.playChime();
    }
  }

  function closeBooking() {
    if (bookingModal) bookingModal.classList.remove('open');
  }

  if (heroBookBtn) heroBookBtn.addEventListener('click', openBooking);
  if (ctaReserveTable) ctaReserveTable.addEventListener('click', openBooking);
  if (navReserveBtn) navReserveBtn.addEventListener('click', openBooking);
  if (closeBookingBtn) closeBookingBtn.addEventListener('click', closeBooking);

  // Party Size Buttons
  document.querySelectorAll('.party-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.party-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Form Submit
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeBooking();
      alert('✨ Namaste! Welcome to HOTEL VEDA. Your royal dining reservation is confirmed. Atithi Devo Bhava — we look forward to twirling our signature saffron pasta at your table.');
    });
  }

  // Menu Modal
  const menuModal = document.getElementById('menuModal');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const ctaViewMenu = document.getElementById('ctaViewMenu');
  const navMenuBtn = document.getElementById('navMenuBtn');
  const menuOrderTableBtn = document.getElementById('menuOrderTableBtn');

  function openMenu(e) {
    if (e) e.preventDefault();
    if (menuModal) {
      menuModal.classList.add('open');
      ambience.playChime();
    }
  }

  function closeMenu() {
    if (menuModal) menuModal.classList.remove('open');
  }

  if (ctaViewMenu) ctaViewMenu.addEventListener('click', openMenu);
  if (navMenuBtn) navMenuBtn.addEventListener('click', openMenu);
  if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
  if (menuOrderTableBtn) {
    menuOrderTableBtn.addEventListener('click', () => {
      closeMenu();
      openBooking();
    });
  }

  // Philosophy / Fusion Story Modal
  const storyModal = document.getElementById('storyModal');
  const closeStoryBtn = document.getElementById('closeStoryBtn');
  const navPhilosophyBtn = document.getElementById('navPhilosophyBtn');
  const storyBookTableBtn = document.getElementById('storyBookTableBtn');

  function openStory(e) {
    if (e) e.preventDefault();
    if (storyModal) {
      storyModal.classList.add('open');
      ambience.playChime();
    }
  }

  function closeStory() {
    if (storyModal) storyModal.classList.remove('open');
  }

  if (navPhilosophyBtn) navPhilosophyBtn.addEventListener('click', openStory);
  if (closeStoryBtn) closeStoryBtn.addEventListener('click', closeStory);
  if (storyBookTableBtn) {
    storyBookTableBtn.addEventListener('click', () => {
      closeStory();
      openBooking();
    });
  }

  // Close modals on backdrop click
  window.addEventListener('click', (e) => {
    if (e.target === bookingModal) closeBooking();
    if (e.target === menuModal) closeMenu();
    if (e.target === storyModal) closeStory();
  });
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
  new VideoCinemaController();
  initUI();
});
