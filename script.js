// Event Date
const WEDDING_DATE = new Date("2026-02-21T16:30:00+05:30");

// WhatsApp Numbers
const WHATSAPP_ISHANNEEL = "918903319492";
const WHATSAPP_ANJALI = "919995662870";

// Google Form
const GOOGLE_FORM_ACTION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdAOd4xEaNj9q_UxPF-dhHnWS9-RxZuuBchWr6e4xgoZpTzlA/formResponse";


// Google Form Entry IDs
const GOOGLE_FORM_FIELDS = {
  name: "entry.1428156076",
  phone: "entry.1913437468",
  attending: "entry.877086558",
  guests: "entry.1498135098",
  notes: "entry.2606285",
};

// Countdown elements
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const weddingDateLabel = document.getElementById("weddingDateLabel");

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Wedding date label
weddingDateLabel.textContent =
  "📅 " +
  WEDDING_DATE.toLocaleString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }) +
  " (IST)";

function pad2(n) {
  return String(n).padStart(2, "0");
}

function updateCountdown() {
  const now = new Date();
  const diff = Math.max(0, WEDDING_DATE.getTime() - now.getTime());

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  daysEl.textContent = days;
  hoursEl.textContent = pad2(hours);
  minutesEl.textContent = pad2(minutes);
  secondsEl.textContent = pad2(seconds);
}

setInterval(updateCountdown, 1000);
updateCountdown();


// Gallery
const MAX_IMAGES = 16;

const galleryImages = Array.from({ length: MAX_IMAGES }, (_, i) => 
  `assets/photo${i + 1}.jpg`
);

const slideshowImage = document.getElementById("slideshowImage");
const dotsContainer = document.getElementById("dots");

let slideIndex = 0;

function renderDots() {
  dotsContainer.innerHTML = "";
  
  galleryImages.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "dot" + (i === slideIndex ? " active" : "");
    dot.addEventListener("click", () => {
      slideIndex = i;
      updateSlide();
	  resetSlideshowTimer();
    });
	
    dotsContainer.appendChild(dot);
  });
}

// Timeline Accordion
const timelineCards = document.querySelectorAll(".timeline-card");

timelineCards.forEach((card) => {
  card.addEventListener("toggle", () => {
    if (card.open) {
      timelineCards.forEach((other) => {
        if (other !== card) other.removeAttribute("open");
      });
    }
  });
});


const cropOverrides = {
  "photo2.jpg":  { position: "50% 15%" },
  "photo3.jpg":  { position: "50% 10%" },
  "photo4.jpg":  { position: "50% 70%" },
  "photo5.jpg":  { position: "50% 40%" },
  "photo6.jpg":  { position: "50% 70%" },
  "photo7.jpg":  { position: "50% 80%" },
  "photo8.jpg":  { position: "60% 55%" },
  "photo9.jpg":  { position: "50% 55%" },
  "photo10.jpg": { position: "50% 70%" },
  "photo11.jpg": { position: "50% 10%" },
  "photo12.jpg": { position: "50% 70%" },
  "photo13.jpg": { position: "50% 32%" },
  "photo14.jpg": { position: "50% 58%" },
  "photo15.jpg": { position: "50% 75%" },
  "photo16.jpg": { position: "10% 75%" }
};

const cropCache = {};

function resolveCropFor(src) {
  const filename = src.split("/").pop();

  if (cropCache[filename]) {
    return cropCache[filename];
  }

  const override = cropOverrides[filename] || {};

  cropCache[filename] = {
    fit: override.fit || "cover",
    position: override.position || "50% 50%",
    zoom: override.zoom || 1
  };

  return cropCache[filename];
}

function applyCrop(img, crop) {
  img.style.objectFit = crop.fit;
  img.style.objectPosition = crop.position;
  img.style.transform = crop.zoom !== 1
    ? `scale(${crop.zoom})`
    : "none";
}


function resetSlideshowTimer() {
  if (slideshowTimer) {
    clearInterval(slideshowTimer);
  }
  slideshowTimer = setInterval(nextSlide, 3500);
}

function nextSlide() {
  slideIndex = (slideIndex + 1) % galleryImages.length;
  updateSlide();
  resetSlideshowTimer();
}

function prevSlide() {
  slideIndex =
    (slideIndex - 1 + galleryImages.length) % galleryImages.length;
  updateSlide();
  resetSlideshowTimer();
}


let slideshowTimer = setInterval(nextSlide, 3500);


// Desktop Congtrols
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    nextSlide();
  } else if (e.key === "ArrowLeft") {
    prevSlide();
  }
});


// Mobile Controls
let touchStartX = 0;
let touchEndX = 0;

const SWIPE_THRESHOLD = 40; // px (safe & intentional)

slideshowImage.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

slideshowImage.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) < SWIPE_THRESHOLD) return;

  if (diff > 0) {
    // swipe left
    nextSlide();
  } else {
    // swipe right
    prevSlide();
  }
}

slideshowImage.onload = () => {
  const src = slideshowImage.src;
  const crop = resolveCropFor(src);
  applyCrop(slideshowImage, crop);
  slideshowImage.style.opacity = "1";
};

function updateSlide() {
  slideshowImage.style.opacity = "0";
  slideshowImage.src = galleryImages[slideIndex];
  renderDots();
}



slideshowImage.onerror = () => {
  slideshowImage.src = "assets/hero.jpg";
};

updateSlide();


// RSVP Form handler → Google Sheets
const rsvpForm = document.getElementById("rsvpForm");
const formStatus = document.getElementById("formStatus");
const whatsappRsvp = document.getElementById("whatsappRsvp");

// WhatsApp RSVP link live
function updateWhatsappLink() {
  const formData = new FormData(rsvpForm);

  const name = formData.get("name") || "";
  const phone = formData.get("phone") || "";
  const attending = formData.get("attending") || "Yes, I'll be there";
  const guests = formData.get("guests") || "1";
  const notes = formData.get("notes") || "";

  const msg =
    `Hi! RSVP for Anjali weds Ishanneel.\n\n` +
    `Name: ${name}\n` +
    `Phone: ${phone}\n` +
    `Attending: ${attending}\n` +
    `Guests: ${guests}\n` +
    `Notes: ${notes}`;

  // Default WhatsApp goes to Anjali
  whatsappRsvp.href = `https://wa.me/${WHATSAPP_ANJALI}?text=${encodeURIComponent(
    msg
  )}`;
}

rsvpForm.addEventListener("input", updateWhatsappLink);
updateWhatsappLink();

// Submit to Google Form / Google Sheets
rsvpForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  formStatus.textContent = "";

  try {
    formStatus.textContent = "Sending RSVP...";

    const formData = new FormData(rsvpForm);

    // Create Google Form submission payload
    const googleData = new URLSearchParams();
    googleData.append(GOOGLE_FORM_FIELDS.name, formData.get("name") || "");
	googleData.append(GOOGLE_FORM_FIELDS.phone, formData.get("phone") || "");
	googleData.append(GOOGLE_FORM_FIELDS.attending, formData.get("attending") || "");
	googleData.append(GOOGLE_FORM_FIELDS.guests, formData.get("guests") || "");
	googleData.append(GOOGLE_FORM_FIELDS.notes, formData.get("notes") || "");

	console.log("Submitting RSVP:", googleData.toString());

    await fetch(GOOGLE_FORM_ACTION_URL, {
	  method: "POST",
	  mode: "no-cors",
	  body: googleData,
	});


    formStatus.textContent = "✅ RSVP received! Thank you ❤️";
    rsvpForm.reset();
    updateWhatsappLink();
  } catch (err) {
    formStatus.textContent =
      "⚠️ Could not submit. Please RSVP on WhatsApp instead.";
  }
});
