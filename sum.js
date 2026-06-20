// ================================================================
// ✅ YAHAN APNI IMAGES LAGAYEIN - SIRF IS JAGAH CHANGE KAREIN
// ================================================================

const allImages = [
    // ===== NATURE CATEGORY =====
    { src: "img1.jpg", title: "Serene Mountain Lake", category: "nature" },
    { src: "img4.jpg", title: "Misty Forest Trail", category: "nature" },
    { src: "img7.png", title: "Sunset Over Valley", category: "nature" },
    { src: "img14.jpg", title: "Waterfall Cascade", category: "nature" },

    // ===== CITY CATEGORY =====
    { src: "img2.jpg", title: "Downtown City Lights", category: "Nightfall" },
    { src: "img5.jpg", title: "Urban Street Life", category: "Nightfall" },
    { src: "img8.jpg", title: "Night Skyline View", category: "Nightfall" },
    { src: "img15.jpg", title: "Modern Architecture", category: "Nightfall" },

    // ===== ABSTRACT CATEGORY =====
    { src: "img3.jpg", title: "Vibrant Abstract Art", category: "Chromatic" },
    { src: "img6.jpg", title: "Colorful Geometric", category: "Chromatic" },
    { src: "img10.jpg", title: "Fluid Abstract Design", category: "Nightfall" },
    { src: "img13.jpg", title: "Creative Expression", category: "Chromatic" },

    // ===== EXTRA IMAGES =====
    { src: "img11.jpg", title: "Golden Hour Sunset", category: "nature" },
    { src: "img12.jpg", title: "City at Dusk", category: "Nightfall" }
];

// FALLBACK IMAGES - agar aapki images na milen to yeh use hongi
const fallbackImages = [
    { src: "https://picsum.photos/seed/nature1/400/300", title: "Beautiful Nature", category: "nature" },
    { src: "https://picsum.photos/seed/city1/400/300", title: "City Skyline", category: "Nightfall" },
    { src: "https://picsum.photos/seed/abstract1/400/300", title: "Abstract Art", category: "Chromatic" },
    { src: "https://picsum.photos/seed/nature2/400/300", title: "Mountain View", category: "nature" },
    { src: "https://picsum.photos/seed/city2/400/300", title: "Urban Night", category: "Nightfall" },
    { src: "https://picsum.photos/seed/abstract2/400/300", title: "Color Splash", category: "Chromatic" }
];

// ================================================================
// CODE - NICHE KUCH CHANGE NA KAREIN
// ================================================================

let currentCategory = "all";
let filteredImages = [];
let carouselImages = [];
let carouselAngle = 0;
let autoRotateInterval = null;
let isAutoRotating = true;
let currentLightboxIndex = 0;
let currentLightboxList = [];
let allImagesList = [];

// ========== 3D CAROUSEL ==========
function buildCarousel() {
    const track = document.getElementById('carouselTrack');
    if (!track) return;
    track.innerHTML = '';

    carouselImages = [...allImagesList];
    if (carouselImages.length > 8) {
        carouselImages = carouselImages.slice(0, 8);
    }

    const count = carouselImages.length;
    if (count === 0) {
        carouselImages = fallbackImages.slice(0, 6);
    }

    const angleStep = 360 / carouselImages.length;
    const radius = 280;

    carouselImages.forEach((img, idx) => {
        const card = document.createElement('div');
        card.className = 'carousel-card';

        let imgHtml = '';
        if (img.src && img.src !== "" && img.src !== "undefined") {
            imgHtml = `<img src="${img.src}" alt="${img.title}" onerror="this.parentElement.innerHTML='<div class=\\'img-placeholder\\'>📷<br>${img.title}</div>';">`;
        } else {
            imgHtml = `<div class="img-placeholder">📷<br>${img.title}</div>`;
        }

        card.innerHTML = imgHtml + `<div class="card-title">${img.title}</div>`;

        const radian = (idx * angleStep * Math.PI) / 180;
        const x = Math.sin(radian) * radius;
        const z = Math.cos(radian) * radius;
        card.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${idx * angleStep}deg)`;

        card.addEventListener('click', (e) => {
            e.stopPropagation();
            const foundIdx = allImagesList.findIndex(i => i.title === img.title);
            openLightboxWithList(foundIdx >= 0 ? foundIdx : 0, allImagesList);
        });

        track.appendChild(card);
    });

    updateCarouselRotation();
}

function updateCarouselRotation() {
    const track = document.getElementById('carouselTrack');
    if (track) {
        track.style.transform = `rotateY(${carouselAngle}deg)`;
    }
}

function rotateCarousel(direction) {
    const count = carouselImages.length;
    if (count === 0) return;
    const step = 360 / count;
    carouselAngle += direction * step;
    updateCarouselRotation();
    if (isAutoRotating) restartAutoRotate();
}

function startAutoRotate() {
    if (autoRotateInterval) clearInterval(autoRotateInterval);
    const count = carouselImages.length;
    if (count === 0) return;

    autoRotateInterval = setInterval(() => {
        if (isAutoRotating) {
            const step = 360 / count;
            carouselAngle += step;
            updateCarouselRotation();
        }
    }, 2000);
}

function stopAutoRotate() {
    if (autoRotateInterval) {
        clearInterval(autoRotateInterval);
        autoRotateInterval = null;
    }
}

function restartAutoRotate() {
    if (isAutoRotating) {
        stopAutoRotate();
        startAutoRotate();
    }
}

function toggleAutoRotate() {
    isAutoRotating = !isAutoRotating;
    const btn = document.getElementById('autoRotateBtn');
    if (isAutoRotating) {
        btn.textContent = '⏸ Pause Rotation';
        btn.classList.add('active');
        startAutoRotate();
    } else {
        btn.textContent = '▶️ Start Rotation';
        btn.classList.remove('active');
        stopAutoRotate();
    }
}

// ========== GALLERY GRID ==========
function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    grid.innerHTML = '';

    let imagesToShow = filteredImages.length > 0 ? filteredImages : allImagesList;

    if (imagesToShow.length === 0) {
        grid.innerHTML =
            `<p style="text-align:center;color:#888;padding:50px;width:100%;">No images in this category.</p>`;
        return;
    }

    imagesToShow.forEach((img, idx) => {
        const card = document.createElement('div');
        card.className = 'grid-card';

        let imgHtml = '';
        if (img.src && img.src !== "" && img.src !== "undefined") {
            imgHtml =
                `<img src="${img.src}" alt="${img.title}" onerror="this.src='https://picsum.photos/seed/${idx}/400/300';">`;
        } else {
            imgHtml =
                `<div style="height:240px; background:linear-gradient(145deg,#2a2a4a,#1a1a3a); display:flex; align-items:center; justify-content:center; color:#666;">📷</div>`;
        }

        card.innerHTML = imgHtml + `<div class="info">${img.title}</div>`;

        const foundIdx = allImagesList.findIndex(i => i.title === img.title);
        card.addEventListener('click', () => {
            openLightboxWithList(foundIdx >= 0 ? foundIdx : idx, allImagesList);
        });

        grid.appendChild(card);
    });
}

function filterGallery(category) {
    currentCategory = category;
    if (category === "all") {
        filteredImages = [...allImagesList];
    } else {
        filteredImages = allImagesList.filter(img => img.category === category);
    }
    renderGallery();
}

// ========== LIGHTBOX ==========
function openLightboxWithList(startIndex, imageList) {
    if (!imageList || imageList.length === 0) return;
    currentLightboxList = imageList;
    currentLightboxIndex = startIndex % imageList.length;
    const modal = document.getElementById('lightboxModal');
    const imgEl = document.getElementById('lightboxImage');
    const captionEl = document.getElementById('lbCaption');

    const img = currentLightboxList[currentLightboxIndex];
    if (img) {
        imgEl.src = img.src || "https://picsum.photos/seed/fallback/800/600";
        captionEl.innerText = img.title || "Untitled";
    }
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightboxModal').classList.remove('show');
    document.body.style.overflow = '';
}

function nextLightboxImage() {
    if (currentLightboxList.length === 0) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxList.length;
    const imgEl = document.getElementById('lightboxImage');
    const captionEl = document.getElementById('lbCaption');
    const img = currentLightboxList[currentLightboxIndex];
    if (img) {
        imgEl.src = img.src || "https://picsum.photos/seed/fallback/800/600";
        captionEl.innerText = img.title || "Untitled";
    }
}

function prevLightboxImage() {
    if (currentLightboxList.length === 0) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxList.length) % currentLightboxList.length;
    const imgEl = document.getElementById('lightboxImage');
    const captionEl = document.getElementById('lbCaption');
    const img = currentLightboxList[currentLightboxIndex];
    if (img) {
        imgEl.src = img.src || "https://picsum.photos/seed/fallback/800/600";
        captionEl.innerText = img.title || "Untitled";
    }
}

// ========== EVENT LISTENERS ==========
function setupEventListeners() {
    document.getElementById('prevCarouselBtn').addEventListener('click', () => rotateCarousel(-1));
    document.getElementById('nextCarouselBtn').addEventListener('click', () => rotateCarousel(1));
    document.getElementById('autoRotateBtn').addEventListener('click', toggleAutoRotate);

    document.getElementById('closeLb').addEventListener('click', closeLightbox);
    document.getElementById('prevLbBtn').addEventListener('click', prevLightboxImage);
    document.getElementById('nextLbBtn').addEventListener('click', nextLightboxImage);
    document.getElementById('lightboxModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('lightboxModal')) closeLightbox();
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterGallery(btn.getAttribute('data-category'));
        });
    });

    document.addEventListener('keydown', (e) => {
        const lb = document.getElementById('lightboxModal');
        if (lb.classList.contains('show')) {
            if (e.key === 'ArrowRight') { e.preventDefault();
                nextLightboxImage(); }
            if (e.key === 'ArrowLeft') { e.preventDefault();
                prevLightboxImage(); }
            if (e.key === 'Escape') { e.preventDefault();
                closeLightbox(); }
        }
    });
}

// ========== INIT ==========
function init() {
    const valid = allImages.filter(img => img.src && img.src !== "" && img.src !== "undefined");
    if (valid.length > 0) {
        allImagesList = [...valid];
    } else {
        allImagesList = [...fallbackImages];
    }

    filteredImages = [...allImagesList];
    buildCarousel();
    renderGallery();
    setupEventListeners();
    startAutoRotate();
}

// DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
