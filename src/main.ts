import { gsap } from 'gsap';

// ==========================================================================
// REN KURODA — SCROLLYTELLING PORTFOLIO
// Core Architecture:
// 1. Optical Blur Reveal System
// 2. Camera Shutter / Curtain Reveal Controller (#shutter-portal)
// 3. Flat Scroll-Driven Card Peel Engine (#hero-albums-deck)
// 4. Side Scroll Tracker & Header Nav Synchronization
// 5. Motion Portal Reel Controls
// 6. Complete Archives Gallery & Category Filter Chips
// 7. Lightbox Modal & Web Audio Synthesizer
// ==========================================================================

interface ArchiveItem {
  id: string;
  type: 'photo' | 'video';
  category: 'EDITORIAL' | 'GROOMING' | 'RUNWAY' | 'MOTION' | 'PORTRAIT';
  url: string;
  thumb?: string;
  title: string;
  credits: string;
}

const ARCHIVES_DATA: ArchiveItem[] = [
  {
    id: 'arch-1',
    type: 'photo',
    category: 'EDITORIAL',
    url: '/images/editorial_male.jpg',
    title: 'Vogue Hommes Paris — "Nocturne Tailoring"',
    credits: 'Nhiếp ảnh: Kenzo M. · Âu phục Saint Laurent · Ấn bản Paris'
  },
  {
    id: 'arch-2',
    type: 'photo',
    category: 'GROOMING',
    url: '/images/grooming_male.jpg',
    title: 'Dior Men — Chiến dịch Toàn cầu Đồng hồ & Grooming',
    credits: 'Thương hiệu: Dior Beauty · Phát hành Tokyo & Paris'
  },
  {
    id: 'arch-3',
    type: 'video',
    category: 'MOTION',
    url: '/video/reel.mp4',
    thumb: '/images/motion_male.jpg',
    title: 'Kinetic Silhouette — Phim Thời trang Tokyo',
    credits: 'Đạo diễn: Lisa Wong · Chuẩn điện ảnh 4K · Tuyển chọn giải thưởng'
  },
  {
    id: 'arch-4',
    type: 'photo',
    category: 'RUNWAY',
    url: '/images/runway_male.jpg',
    title: 'Giorgio Armani Menswear SS26 — Dẫn đầu Runway',
    credits: 'Trình diễn mở màn (First Face) · Tuần lễ Thời trang Milan'
  },
  {
    id: 'arch-5',
    type: 'photo',
    category: 'PORTRAIT',
    url: '/images/portrait_male.jpg',
    title: 'GQ Japan — Chân dung Studio Obsidian Số 1',
    credits: 'Nhiếp ảnh: Shinji Ogawa · Studio Chân dung Đen Trắng'
  },
  {
    id: 'arch-6',
    type: 'photo',
    category: 'EDITORIAL',
    url: '/images/compcard_3.jpg',
    title: 'L’Officiel Hommes — Cấu trúc & Phom dáng',
    credits: 'Stylist: Emi K. · Ấn phẩm Mùa thu Milan'
  },
  {
    id: 'arch-7',
    type: 'photo',
    category: 'GROOMING',
    url: '/images/compcard_1.jpg',
    title: 'Shiseido Men — Chiến dịch Kiến trúc Làn da',
    credits: 'Nhiếp ảnh: Hiroshi Tanaka · Khu vực Châu Á Thái Bình Dương'
  },
  {
    id: 'arch-8',
    type: 'video',
    category: 'MOTION',
    url: '/video/reel.mp4',
    thumb: '/images/hero_male.jpg',
    title: 'Tokyo Twilight — Tác phẩm Chuyển động Hoàng hôn',
    credits: 'Sản xuất: Studio Zero · Paris & Tokyo'
  },
  {
    id: 'arch-9',
    type: 'photo',
    category: 'RUNWAY',
    url: '/images/compcard_2.jpg',
    title: 'Fendi Menswear — Lookbook Trình diễn Runway',
    credits: 'Bộ sưu tập Mùa đông · Tuần lễ Thời trang Milan'
  },
  {
    id: 'arch-10',
    type: 'photo',
    category: 'PORTRAIT',
    url: '/images/hero_male.jpg',
    title: 'Nghiên cứu Ánh sáng Tự nhiên — Trụ sở Tokyo',
    credits: 'Nhiếp ảnh: Aoi Sano · Studio Ánh sáng Tự nhiên'
  },
  {
    id: 'arch-11',
    type: 'photo',
    category: 'EDITORIAL',
    url: '/images/runway_male.jpg',
    title: 'Esquire International — Ấn bản Âu phục May đo',
    credits: 'Stylist: Marc D. · London'
  },
  {
    id: 'arch-12',
    type: 'video',
    category: 'MOTION',
    url: '/video/reel.mp4',
    thumb: '/images/compcard_3.jpg',
    title: 'Kinetic Fashion Film — Teaser II',
    credits: 'Đạo diễn: Lisa Wong · Chuẩn điện ảnh 60fps'
  }
];

// --------------------------------------------------------
// 1. Optical Blur Reveal System (IntersectionObserver)
// --------------------------------------------------------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.blur-reveal').forEach((el) => {
  revealObserver.observe(el);
});

// --------------------------------------------------------
// 4. Camera Shutter / Curtain Reveal Controller (#shutter-portal)
// --------------------------------------------------------
// ponytail: scroll-position normalized aperture opening; add gyro input when mobile orientation API requested.
const shutterSection = document.getElementById('shutter-portal');
const shutterDoorTop = document.querySelector<HTMLElement>('.shutter-door-top');
const shutterDoorBottom = document.querySelector<HTMLElement>('.shutter-door-bottom');
const shutterStatus = document.getElementById('shutter-status');

function updateShutterController() {
  if (!shutterSection || !shutterDoorTop || !shutterDoorBottom) return;

  const rect = shutterSection.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Shutter actuates as the user scrolls into the viewport
  const triggerStart = windowHeight * 0.85;
  const triggerEnd = windowHeight * 0.15;
  const progress = Math.min(Math.max((triggerStart - rect.top) / (triggerStart - triggerEnd), 0), 1);

  // Cubic smoothstep easing curve
  const eased = progress * progress * (3 - 2 * progress);

  shutterDoorTop.style.transform = `translateY(-${eased * 102}%)`;
  shutterDoorBottom.style.transform = `translateY(${eased * 102}%)`;

  if (shutterStatus) {
    if (eased >= 0.98) {
      shutterStatus.textContent = 'MÀN TRẬP: KHẨU ĐỘ MỞ (F/1.4)';
    } else if (eased <= 0.02) {
      shutterStatus.textContent = 'MÀN TRẬP: ĐÃ ĐÓNG';
    } else {
      shutterStatus.textContent = `MÀN TRẬP: KHẨU ĐỘ ${Math.round(eased * 100)}%`;
    }
  }
}

// --------------------------------------------------------
// 5. Scroll-Driven Card Peel Engine (#hero-albums-deck)
//    Progressively translates and unmasks Cards 1, 2, 3, and 4
// --------------------------------------------------------
// ponytail: 4-card progressive peel curves via RAF scroll calculation; add dynamic card count if CMS-backed.
const deckSection = document.getElementById('hero-albums-deck');
const deckCards = Array.from(document.querySelectorAll<HTMLElement>('.deck-card'));
const deckCardCounter = document.getElementById('deck-card-counter');
const deckProgressBar = document.getElementById('deck-progress-bar');

const peelWindows = [
  { start: 0.02, end: 0.28, dir: -1 }, // Card 0 peels up-left
  { start: 0.32, end: 0.58, dir: 1 },  // Card 1 peels up-right
  { start: 0.62, end: 0.88, dir: -1 }  // Card 2 peels up-left
];

function updateCardPeelEngine() {
  if (!deckSection || deckCards.length === 0) return;

  const rect = deckSection.getBoundingClientRect();
  const totalScrollable = deckSection.offsetHeight - window.innerHeight;
  if (totalScrollable <= 0) return;

  const progress = Math.min(Math.max(-rect.top / totalScrollable, 0), 1);

  if (deckProgressBar) {
    deckProgressBar.style.width = `${progress * 100}%`;
  }

  const activeIdx = Math.min(Math.floor(progress * 4), 3);
  if (deckCardCounter) {
    deckCardCounter.textContent = `0${activeIdx + 1} / 04`;
  }

  deckCards.forEach((card, index) => {
    if (index < 3) {
      const win = peelWindows[index];
      if (progress < win.start) {
        // Stacked underneath prior cards
        const stackOffset = Math.max(0, index - activeIdx);
        const scale = 1 - stackOffset * 0.04;
        const translateY = stackOffset * 22;
        // ponytail: rigid flat translation without rotation wobble
        card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
        card.style.opacity = '1';
        card.style.pointerEvents = index === activeIdx ? 'auto' : 'none';
        card.style.zIndex = `${4 - index}`;
      } else if (progress >= win.start && progress <= win.end) {
        // Peeling out flat without rotation
        const localT = (progress - win.start) / (win.end - win.start);
        const ease = localT * localT * (3 - 2 * localT);
        const transX = win.dir * ease * 125;
        const transY = -ease * 40;
        const opacity = Math.max(0, 1 - ease * 1.15);

        card.style.transform = `translate3d(${transX}%, ${transY}px, 0) scale(1)`;
        card.style.opacity = `${opacity}`;
        card.style.pointerEvents = ease > 0.5 ? 'none' : 'auto';
        card.style.zIndex = '5';
      } else {
        // Fully peeled off
        const transX = win.dir * 140;
        card.style.transform = `translate3d(${transX}%, -60px, 0) scale(0.95)`;
        card.style.opacity = '0';
        card.style.pointerEvents = 'none';
        card.style.zIndex = '0';
      }
    } else {
      // Card 3 (Pinnacle finale story)
      const stackOffset = Math.max(0, 3 - activeIdx);
      const scale = 1 - stackOffset * 0.04;
      const translateY = stackOffset * 22;
      card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
      card.style.opacity = '1';
      card.style.pointerEvents = activeIdx === 3 ? 'auto' : 'none';
      card.style.zIndex = '1';
    }
  });
}

// Global scroll orchestrator loop for 60fps responsiveness
window.addEventListener('scroll', () => {
  updateShutterController();
  updateCardPeelEngine();
}, { passive: true });

// Initial run
updateShutterController();
updateCardPeelEngine();

// --------------------------------------------------------
// 6. Side Scroll Tracker & Header Nav Synchronization
// --------------------------------------------------------
const trackerFill = document.getElementById('tracker-fill');
const scrollPercentEl = document.getElementById('scroll-percent');
const navItems = document.querySelectorAll<HTMLAnchorElement>('#nav-menu .nav-item');
const trackerDots = document.querySelectorAll<HTMLAnchorElement>('.tracker-dot');

const trackedSections = [
  'section-hero',
  'shutter-portal',
  'hero-albums-deck',
  'section-archives',
  'section-compcard',
  'section-booking'
];

window.addEventListener('scroll', () => {
  const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
  const current = window.scrollY;
  const percent = Math.min(Math.max((current / (totalScroll || 1)) * 100, 0), 100);

  if (trackerFill) trackerFill.style.height = `${percent}%`;
  if (scrollPercentEl) scrollPercentEl.textContent = `${Math.round(percent).toString().padStart(2, '0')}%`;

  // Find active section
  let currentId = '';
  for (const id of trackedSections) {
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.15) {
        currentId = id;
        break;
      }
    }
  }

  if (currentId) {
    navItems.forEach((nav) => {
      nav.classList.toggle('active', nav.getAttribute('data-nav') === currentId);
    });
    trackerDots.forEach((dot) => {
      dot.classList.toggle('active', dot.getAttribute('href') === `#${currentId}`);
    });
  }
}, { passive: true });

// --------------------------------------------------------
// 5. The Motion Portal Reel Controls
// --------------------------------------------------------
const portalVideo = document.getElementById('portal-video') as HTMLVideoElement | null;
const portalMuteBtn = document.getElementById('portal-mute-btn');
const portalExpandBtn = document.getElementById('portal-expand-btn');
const speedBtns = document.querySelectorAll<HTMLButtonElement>('.speed-btn');

if (portalVideo) {
  speedBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      speedBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const speed = Number(btn.getAttribute('data-speed')) || 1.0;
      portalVideo.playbackRate = speed;
    });
  });

  portalMuteBtn?.addEventListener('click', () => {
    portalVideo.muted = !portalVideo.muted;
    if (portalMuteBtn) {
      portalMuteBtn.innerHTML = portalVideo.muted
        ? '<span class="hud-btn-icon">&#128263;</span> TẮT TIẾNG'
        : '<span class="hud-btn-icon">&#128266;</span> BẬT TIẾNG';
    }
  });

  portalExpandBtn?.addEventListener('click', () => {
    openLightbox({
      id: 'portal-fullscreen',
      type: 'video',
      category: 'MOTION',
      url: '/video/reel.mp4',
      title: 'Chiến dịch Chuyển động SS26 · Paris & Tokyo',
      credits: 'Đạo diễn: Lisa Wong · 4K ProRes · Bản gốc Toàn màn hình'
    });
  });
}

// --------------------------------------------------------
// 6. Complete Archives Gallery & Category Filter Chips
// --------------------------------------------------------
const archivesGrid = document.getElementById('archives-grid');
const archiveChips = document.querySelectorAll<HTMLButtonElement>('.archive-chip');

function renderArchives(filter = 'ALL') {
  if (!archivesGrid) return;
  archivesGrid.innerHTML = '';

  const filtered = filter === 'ALL'
    ? ARCHIVES_DATA
    : ARCHIVES_DATA.filter((item) => item.category === filter);

  filtered.forEach((item, idx) => {
    const card = document.createElement('div');
    // ponytail: clean static grid cards without 3D tilt wobble
    card.className = `grid-item ${item.type === 'video' ? 'video-item' : ''}`;

    card.innerHTML = `
      <img src="${item.thumb || item.url}" alt="${item.title}" loading="lazy" />
      ${item.type === 'video' ? '<div class="video-badge">&#9658; THƯỚC PHIM</div>' : ''}
      <div class="grid-overlay">
        <h4 class="grid-title">${item.title}</h4>
        <p class="grid-meta">${item.credits}</p>
      </div>
    `;

    card.addEventListener('click', () => openLightbox(item));
    archivesGrid.appendChild(card);

    gsap.fromTo(card, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, delay: idx * 0.04 });
  });
}

archiveChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    archiveChips.forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    const filter = chip.getAttribute('data-filter') || 'ALL';
    renderArchives(filter);
  });
});
renderArchives('ALL');

// --------------------------------------------------------
// 10. Hero Album Story Lightbox Handlers
// --------------------------------------------------------
const albumStories: Record<string, ArchiveItem> = {
  vogue: {
    id: 'vogue-master',
    type: 'photo',
    category: 'EDITORIAL',
    url: '/images/editorial_male.jpg',
    title: 'Vogue Hommes Paris — "Nocturne Tailoring"',
    credits: 'Nhiếp ảnh: Kenzo M. · Âu phục Saint Laurent · Bộ ảnh 12 khung hình'
  },
  dior: {
    id: 'dior-master',
    type: 'video',
    category: 'MOTION',
    url: '/video/reel.mp4',
    title: 'Dior Men — "The Kinetic Silhouette"',
    credits: 'Đạo diễn: Lisa Wong · Phim thương mại toàn cầu & Ảnh tĩnh đồng hồ'
  },
  runway: {
    id: 'runway-master',
    type: 'photo',
    category: 'RUNWAY',
    url: '/images/runway_male.jpg',
    title: 'Milan Fashion Week — "Catwalk Protocol"',
    credits: 'Trình diễn mở màn · Giorgio Armani & Fendi Menswear'
  },
  portrait: {
    id: 'portrait-master',
    type: 'photo',
    category: 'PORTRAIT',
    url: '/images/portrait_male.jpg',
    title: 'GQ Japan — "Obsidian Monolith"',
    credits: 'Nhiếp ảnh: Shinji Ogawa · Nghiên cứu chân dung studio đen trắng'
  }
};

document.querySelectorAll<HTMLButtonElement>('.album-open-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const albumId = btn.getAttribute('data-album-id');
    if (albumId && albumStories[albumId]) {
      openLightbox(albumStories[albumId]);
    }
  });
});

// --------------------------------------------------------
// 11. Polaroid Fan-out Deck Inspection (#polaroid-fan)
// --------------------------------------------------------
const polaroidDetails: ArchiveItem[] = [
  {
    id: 'polaroid-1',
    type: 'photo',
    category: 'PORTRAIT',
    url: '/images/compcard_1.jpg',
    title: 'Polaroid 01 — Nghiên cứu Góc mặt Nghiêng',
    credits: 'Buổi tuyển chọn người mẫu Paris 2026 · Xác thực bởi Image Models'
  },
  {
    id: 'polaroid-2',
    type: 'photo',
    category: 'RUNWAY',
    url: '/images/compcard_2.jpg',
    title: 'Polaroid 02 — Tỉ lệ Toàn thân 188cm',
    credits: 'Kiểm tra tỉ lệ hình thể · Tuyển chọn bởi công ty Milan'
  },
  {
    id: 'polaroid-3',
    type: 'photo',
    category: 'EDITORIAL',
    url: '/images/compcard_3.jpg',
    title: 'Polaroid 03 — Âu phục May đo 48L',
    credits: 'Xác thực độ vừa vặn vest 48L · Paris SS26'
  },
  {
    id: 'polaroid-4',
    type: 'photo',
    category: 'PORTRAIT',
    url: '/images/portrait_male.jpg',
    title: 'Polaroid 04 — Chân dung Mộc Đen Trắng Obsidian',
    credits: 'Ánh sáng tự nhiên tại studio · Chụp cận cảnh Tokyo'
  }
];

document.querySelectorAll<HTMLElement>('#polaroid-fan .polaroid-card').forEach((card) => {
  card.addEventListener('click', () => {
    const idx = Number(card.getAttribute('data-index')) || 0;
    if (polaroidDetails[idx]) {
      openLightbox(polaroidDetails[idx]);
    }
  });
});

// --------------------------------------------------------
// 12. Fullscreen Dual-Mode Lightbox (Photo & Video)
// --------------------------------------------------------
const lightbox = document.getElementById('lightbox-modal');
const lbImg = document.getElementById('lightbox-img') as HTMLImageElement | null;
const lbVideo = document.getElementById('lightbox-video') as HTMLVideoElement | null;
const lbVideoContainer = document.getElementById('lightbox-video-container');
const lbTitle = document.getElementById('lightbox-title');
const lbMeta = document.getElementById('lightbox-meta');
const closeLightboxBtn = document.getElementById('close-lightbox');

function openLightbox(item: ArchiveItem) {
  if (!lightbox) return;

  if (item.type === 'photo') {
    if (lbVideoContainer) lbVideoContainer.style.display = 'none';
    if (lbVideo) { lbVideo.pause(); lbVideo.src = ''; }
    if (lbImg) {
      lbImg.src = item.url;
      lbImg.style.display = 'block';
    }
  } else {
    if (lbImg) lbImg.style.display = 'none';
    if (lbVideoContainer) lbVideoContainer.style.display = 'block';
    if (lbVideo) {
      lbVideo.src = item.url;
      lbVideo.style.display = 'block';
      lbVideo.play().catch(() => {});
    }
  }

  if (lbTitle) lbTitle.textContent = item.title;
  if (lbMeta) lbMeta.textContent = item.credits;

  lightbox.classList.add('active');
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('active');
  if (lbVideo) {
    lbVideo.pause();
    lbVideo.src = '';
  }
}

closeLightboxBtn?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// --------------------------------------------------------
// 13. Digital Comp Card Print Trigger
// --------------------------------------------------------
document.getElementById('print-comp-btn')?.addEventListener('click', () => {
  window.print();
});

// --------------------------------------------------------
// 14. Booking Request Form Validation & Feedback
// --------------------------------------------------------
const bookingForm = document.getElementById('booking-request-form') as HTMLFormElement | null;
const feedbackMsg = document.getElementById('form-feedback-msg');

bookingForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (feedbackMsg) {
    feedbackMsg.textContent = 'Yêu cầu hợp tác đã được chuyển tới văn phòng Tokyo & ban quản lý châu Âu. Chúng tôi sẽ phản hồi xác nhận trong vòng 24 giờ.';
    feedbackMsg.style.color = '#555f4f';
    feedbackMsg.style.fontWeight = '500';
  }
  bookingForm.reset();
});

// --------------------------------------------------------
// 15. Ambient Web Audio Synthesizer (Harmonic Drone)
// --------------------------------------------------------
let audioCtx: AudioContext | null = null;
let oscillator: OscillatorNode | null = null;
let gainNode: GainNode | null = null;
let isAudioActive = false;
const audioToggle = document.getElementById('audio-toggle');

function initAudioContext() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

  // Low museum harmonic drone
  oscillator = audioCtx.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.value = 130.81; // C3 tone

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 450;

  gainNode = audioCtx.createGain();
  gainNode.gain.value = 0;

  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillator.start();
}

audioToggle?.addEventListener('click', () => {
  initAudioContext();
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  isAudioActive = !isAudioActive;
  if (isAudioActive && gainNode) {
    gsap.to(gainNode.gain, { value: 0.08, duration: 1.5 });
    audioToggle.classList.add('active');
    const txt = audioToggle.querySelector('.sound-text');
    if (txt) txt.textContent = 'ÂM THANH: BẬT';
  } else if (gainNode) {
    gsap.to(gainNode.gain, { value: 0, duration: 1.5 });
    audioToggle.classList.remove('active');
    const txt = audioToggle.querySelector('.sound-text');
    if (txt) txt.textContent = 'ÂM THANH: TẮT';
  }
});

