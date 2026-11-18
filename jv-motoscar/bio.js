const contacts = document.querySelectorAll("[data-phone]");
const interests = document.querySelectorAll("[data-interest]");

function selectInterest(interest) {
  for (const button of interests) {
    button.setAttribute("aria-pressed", String(button.dataset.interest === interest));
  }
  const message = interest
    ? `Olá! Vim pelo Instagram da JV MotosCar e estou procurando ${interest === "moto" ? "uma moto" : "um carro"}. Quais opções vocês têm disponíveis?`
    : "Olá! Vim pelo Instagram da JV MotosCar. Quais motos e carros vocês têm disponíveis?";
  for (const link of contacts) {
    link.href = `https://wa.me/${link.dataset.phone}?text=${encodeURIComponent(message)}`;
  }
}

for (const button of interests) {
  button.addEventListener("click", () => selectInterest(button.dataset.interest));
}
selectInterest();

const photos = import.meta.glob(
  ["/WhatsApp Image 2026-11-17 at 19.48.*.jpeg", "/src/assets/jv-clientes/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}"],
  { eager: true, query: "?url", import: "default" },
);

const section = document.querySelector(".deliveries");
const reel = document.querySelector(".reel");
const group = document.querySelector(".reel-group");
const toggle = document.querySelector(".reel-toggle");

for (const [index, url] of Object.values(photos).entries()) {
  const picture = document.createElement("img");
  picture.src = url;
  picture.alt = `Registro de entrega da JV MotosCar, foto ${index + 1}`;
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
