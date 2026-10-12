// Theme toggle, EN/FR switch (CV only) and the Hairline figures.
// The saved theme and language are applied before paint by the inline script in each page's <head>.

const root = document.documentElement;

function store(key, value) {
  try { localStorage.setItem(key, value); } catch {}
}

// ---------- theme ----------

const prefersDark = matchMedia("(prefers-color-scheme: dark)");
const isDark = () => root.dataset.theme ? root.dataset.theme === "dark" : prefersDark.matches;

document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
  btn.addEventListener("click", () => {
    root.dataset.theme = isDark() ? "light" : "dark";
    store("theme", root.dataset.theme);
  });
});

// ---------- language ----------

const langButtons = document.querySelectorAll("[data-set-lang]");

function setLang(lang, save) {
  root.dataset.lang = lang;
  root.lang = lang;
  langButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.setLang === lang)));
  if (save) {
    store("lang", lang);
    history.replaceState(null, "", lang === "fr" ? "?lang=fr" + location.hash : location.pathname + location.hash);
  }
}

if (langButtons.length) {
  setLang(root.dataset.lang === "fr" ? "fr" : "en", false);
  langButtons.forEach((b) => b.addEventListener("click", () => setLang(b.dataset.setLang, true)));
}

// ---------- Hairline figures ----------
// <div class="fig" data-fig="terrain" data-play data-label="..."></div>

const figs = document.querySelectorAll("[data-fig]");

if (figs.length) {
  import("https://cdn.jsdelivr.net/npm/@lucasmarkes/hairline@0.5.0/dist/index.js")
    .then((hairline) => {
      figs.forEach((el) => {
        const draw = hairline[el.dataset.fig];
        if (!draw) return;
        draw(el, {
          play: el.hasAttribute("data-play"),
          intensity: el.dataset.intensity ? Number(el.dataset.intensity) : undefined,
          label: el.dataset.label,
        });
      });
    })
    // the figures are decoration: without the CDN, the page stands without them
    .catch(() => figs.forEach((el) => el.remove()));
}
