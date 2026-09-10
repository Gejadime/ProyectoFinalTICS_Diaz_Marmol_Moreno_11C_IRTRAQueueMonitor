const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Reveal-on-scroll */
const reveal = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("is-visible");
      reveal.unobserve(entry.target);
    }
  });
},{threshold:.08});

document.querySelectorAll("section, .feature-card, .evidence-card, .themes-grid article, .statement-card, .engineering-board")
  .forEach(el=>{
    el.classList.add("reveal");
    reveal.observe(el);
  });

/* Lightweight parallax for the hero visual */
const heroVisual = document.querySelector(".hero-visual");
if (heroVisual && !reducedMotion) {
  heroVisual.addEventListener("pointermove", (event) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroVisual.style.transform =
      `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg)`;
    heroVisual.classList.add("magnetic");
  });

  heroVisual.addEventListener("pointerleave", () => {
    heroVisual.style.transform = "";
    heroVisual.classList.remove("magnetic");
  });
}

/* Rainbow title: only activates while the cursor is close to the heading,
   not permanently. */
const title = document.querySelector(".hero-title");
if (title && !reducedMotion) {
  const spans = title.querySelectorAll("span");

  const updateTitleHover = (event) => {
    const rect = title.getBoundingClientRect();
    const expanded = {
      left: rect.left - 70,
      top: rect.top - 70,
      right: rect.right + 70,
      bottom: rect.bottom + 70
    };
    const near = event.clientX >= expanded.left &&
                 event.clientX <= expanded.right &&
                 event.clientY >= expanded.top &&
                 event.clientY <= expanded.bottom;

    title.classList.toggle("is-hovering", near);

    spans.forEach((span, index) => {
      const r = span.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const distance = Math.hypot(event.clientX - cx, event.clientY - cy);
      const influence = Math.max(0, 1 - distance / 260);
      span.style.transform = near
        ? `translate(${(event.clientX - cx) * 0.012 * influence}px, ${(event.clientY - cy) * 0.012 * influence}px)`
        : "";
    });
  };

  window.addEventListener("pointermove", updateTitleHover, {passive:true});
  window.addEventListener("pointerleave", () => {
    title.classList.remove("is-hovering");
    spans.forEach(span => span.style.transform = "");
  });
}

/* Scroll progress + compact glassy header */
const progress = document.querySelector(".scroll-progress");
const topbar = document.querySelector(".topbar");

const updateScrollUI = () => {
  const scrollTop = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? scrollTop / max : 0;
  if (progress) progress.style.width = `${ratio * 100}%`;
  if (topbar) topbar.classList.toggle("scrolled", scrollTop > 18);
};

window.addEventListener("scroll", updateScrollUI, {passive:true});
updateScrollUI();

/* Accessible fallback for placeholder links */
document.querySelectorAll('a[href="#"]').forEach(a=>{
  a.addEventListener("click", e=>{
    e.preventDefault();
    alert("Reemplaza este # con el enlace real del proyecto.");
  });
});
