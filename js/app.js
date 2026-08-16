/* ============================================================
   GOLDEN PIZZA CAFE — SHARED APP UTILITIES
   Loaded on every page. Handles: mobile nav, toasts, lightbox,
   WhatsApp/Call quick links, dynamic footer year.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  // Mobile hamburger
  const hamburger = document.querySelector("[data-hamburger]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
    });
  }

  // Footer year
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // Wire restaurant info from CONFIG into any [data-rest] elements
  if (window.CONFIG) {
    const R = CONFIG.RESTAURANT;
    document.querySelectorAll("[data-rest-phone]").forEach((el) => (el.textContent = R.phone));
    document.querySelectorAll("[data-rest-email]").forEach((el) => (el.textContent = R.email));
    document.querySelectorAll("[data-rest-address]").forEach((el) => (el.textContent = R.address));
    document.querySelectorAll("[data-rest-hours]").forEach(
      (el) => (el.textContent = `${R.openDays} · ${R.openTime} – ${R.closeTime}`)
    );
    document.querySelectorAll("a[data-tel]").forEach((el) => (el.href = `tel:${R.phone}`));
    document.querySelectorAll("a[data-whatsapp]").forEach(
      (el) => (el.href = `https://wa.me/${R.whatsapp}`)
    );
    document.querySelectorAll("a[data-instagram]").forEach((el) => (el.href = R.instagram));
    document.querySelectorAll("a[data-maps]").forEach((el) => (el.href = R.googleMaps));
  }

  // Lightbox for poster/gallery images
  const lightbox = document.querySelector("[data-lightbox]");
  if (lightbox) {
    const lightboxImg = lightbox.querySelector("img");
    document.querySelectorAll("[data-zoom]").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const src = trigger.getAttribute("data-zoom") || trigger.querySelector("img")?.src;
        lightboxImg.src = src;
        lightbox.classList.add("open");
      });
    });
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.closest("[data-lightbox-close]")) {
        lightbox.classList.remove("open");
      }
    });
  }

  // Active nav link highlight
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-menu a, .mobile-tabbar a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path) a.classList.add("active");
  });
});

/* ---------------- Toast ---------------- */
function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}
window.showToast = showToast;

/* ---------------- Formatting helpers ---------------- */
function formatRupee(n) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}
window.formatRupee = formatRupee;

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
window.escapeHtml = escapeHtml;
