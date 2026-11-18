const message = "Oi! Vim pelo Instagram e queria conhecer as motos e os carros que vocês têm na loja.";
for (const link of document.querySelectorAll("[data-phone]")) {
  link.href = `https://wa.me/${link.dataset.phone}?text=${encodeURIComponent(message)}`;
}

const photos = import.meta.glob(
  "/src/assets/jv-clientes/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}",
  { eager: true, query: "?url", import: "default" },
);

const section = document.querySelector(".deliveries");
const reel = document.querySelector(".reel");
const group = document.querySelector(".reel-group");
const toggle = document.querySelector(".reel-toggle");

for (const [index, url] of Object.values(photos).entries()) {
  const picture = document.createElement("img");
  picture.src = url;
  picture.alt = `Registro de entrega da JTVM Motos Car, foto ${index + 1}`;
  picture.width = 1254;
  picture.height = 1254;
  picture.loading = "lazy";
  picture.decoding = "async";
  group.append(picture);
}

if (group.childElementCount) section.hidden = false;

if (group.childElementCount > 1) {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const duplicate = group.cloneNode(true);
  duplicate.setAttribute("aria-hidden", "true");
  reel.append(duplicate);
  let paused = reduceMotion.matches;
  let inView = !("IntersectionObserver" in window);
  let frame = null;
  let lastTime = null;
  let offset = 0;
  let loopWidth = 0;

  function measure() {
    loopWidth = group.getBoundingClientRect().width;
  }

  function animate(now) {
    if (lastTime !== null && loopWidth > 0) {
      offset = (offset + Math.min(now - lastTime, 40) * 0.032) % loopWidth;
      reel.scrollLeft = offset;
    }
    lastTime = now;
    frame = requestAnimationFrame(animate);
  }

  function sync() {
    toggle.textContent = paused ? "Reproduzir" : "Pausar";
    toggle.setAttribute("aria-pressed", String(paused));
    if (paused || !inView || document.hidden) {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      lastTime = null;
    } else if (frame === null) {
      measure();
      offset = reel.scrollLeft % (loopWidth || 1);
      frame = requestAnimationFrame(animate);
    }
  }

  function pause() {
    paused = true;
    sync();
  }

  toggle.addEventListener("click", () => {
    paused = !paused;
    sync();
  });
  reel.addEventListener("pointerdown", pause, { passive: true });
  reel.addEventListener("focusin", pause);
  document.addEventListener("visibilitychange", sync);
  window.addEventListener("resize", measure, { passive: true });
  reduceMotion.addEventListener("change", () => {
    paused = reduceMotion.matches;
    sync();
  });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(reel);
  }
  sync();
} else {
  toggle.hidden = true;
}
