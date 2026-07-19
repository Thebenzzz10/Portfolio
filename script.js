// Smooth anchor scrolling (Live Preview friendly)
document.addEventListener("click", (e) => {
  const a = e.target.closest?.("a[href^='#']");
  if (!a) return;
  const href = a.getAttribute("href");
  if (!href || href === "#") return;

  const id = href.slice(1);
  const el = document.getElementById(id);
  if (!el) return;

  e.preventDefault();
  el.scrollIntoView({ behavior: "smooth", block: "start" });
});

// Reveal on scroll
const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));
revealEls.forEach((el) => el.classList.add("reveal"));

const revealIO = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("isIn");
        revealIO.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.18 }
);
revealEls.forEach((el) => revealIO.observe(el));

// Skills bars
const bars = Array.from(document.querySelectorAll("[data-bar]"));
const barIO = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const i = entry.target;
      const v = Number(i.getAttribute("data-bar") || 0);
      i.style.width = `${Math.max(0, Math.min(100, v))}%`;
      barIO.unobserve(i);
    }
  },
  { threshold: 0.35 }
);
bars.forEach((b) => barIO.observe(b));

// Contact form (no backend)
document.getElementById("contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Thanks! Connect a form backend later (Formspree/Netlify) to receive messages.");
});

// Footer year
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

/** -------- Portfolio galleries (Photography, Digital Art, Certificate, Web App) -------- */

const IMAGE_EXT_RE = /\.(jpe?g|png|webp|gif|svg|avif)$/i;

/** Shown on work cards only; omitted from Digital Art / Certificate modal grids. */
const CARD_COVER_FILE_RE = /^cover\.(svg|jpe?g|png|webp|gif|avif)$/i;

function filterImageFiles(names) {
  return (names || []).filter((n) => IMAGE_EXT_RE.test(String(n)));
}

function withoutCardCovers(names) {
  return (names || []).filter((n) => !CARD_COVER_FILE_RE.test(String(n).trim()));
}

function safeAssetUrl(pathFromRoot) {
  return encodeURI(pathFromRoot).replace(/#/g, "%23");
}

/**
 * Static sites cannot read folders from the browser; manifests list filenames.
 * Run: node scripts/generate-gallery-manifests.mjs
 */
function createPortfolioGallery(options) {
  const {
    attrValue,
    mode,
    pillLabel,
    hdrTitle,
    ariaLabel,
    foldersList,
    getNestedManifest,
    getFlatManifest,
    folderKeyFor,
    nestedBasePath,
    flatBasePath,
    webAppProjects = [],
    webAppBasePath = "",
    getWebAppManifest = () => ({}),
  } = options;

  const triggers = document.querySelectorAll(`[data-gallery="${attrValue}"]`);
  if (!triggers.length) return;

  const defaultHdrTitle = hdrTitle;

  const state = {
    view: mode === "flat" ? "grid" : "folders",
    folderDisplayName: foldersList?.[0] || "",
    folderKey: "",
    files: [],
    index: 0,
    lightboxOpen: false,
  };

  const el = document.createElement("div");
  el.className = "modalBackdrop photoBackdrop galleryBackdrop";
  el.hidden = true;
  el.dataset.galleryType = attrValue;
  el.style.pointerEvents = "auto";
  el.innerHTML = `
    <div class="modal photoModal" role="dialog" aria-modal="true" aria-label="${ariaLabel}" tabindex="-1">
      <div class="photoHdr">
        <div class="photoHdrLeft">
          <div class="pill"><span style="color: rgba(255,255,255,.78)">${pillLabel}</span></div>
          <div class="photoHdrText">
            <div class="photoHdrTitle">${hdrTitle}</div>
          </div>
        </div>
        <button class="btn photoClose" type="button">Close</button>
      </div>

      ${
        mode === "web-app"
          ? `
      <section class="galleryWebAppIntro glass" hidden aria-label="Project description">
        <p class="galleryWebAppIntroDesc"></p>
      </section>`
          : ""
      }

      <section class="photoFoldersView galleryFoldersView" aria-label="Categories">
        <div class="photoFoldersGrid galleryFoldersGrid" role="list"></div>
      </section>

      <section class="photoGridView galleryGridView" hidden aria-label="Gallery images">
        <div class="photoGridTop">
          <button class="btn photoBackBtn galleryBackBtn" type="button">Back to folders</button>
          <div class="pill mono photoGridMeta galleryGridMeta" aria-live="polite"></div>
        </div>
        <div class="photoGrid galleryPhotoGrid" role="list"></div>
      </section>
    </div>

    <div class="photoLightbox galleryLightbox" hidden role="dialog" aria-modal="true" aria-label="Photo viewer">
      <button class="photoLbBg galleryLbBg" type="button" aria-label="Close viewer"></button>
      <button class="btn photoLbBtn photoLbPrev galleryLbPrev" type="button" aria-label="Previous photo">Prev</button>
      <img class="photoLbImg galleryLbImg" alt="" />
      <button class="btn photoLbBtn photoLbNext galleryLbNext" type="button" aria-label="Next photo">Next</button>
      <div class="photoLbBar glass">
        <div class="mono photoLbMeta galleryLbMeta"></div>
        <button class="btn photoLbBtn2 galleryLbClose2" type="button" data-lb-close aria-label="Close viewer">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(el);

  const modal = el.querySelector(".photoModal");
  const hdrTitleEl = modal.querySelector(".photoHdrTitle");
  const closeBtn = el.querySelector(".photoClose");
  const foldersViewEl = el.querySelector(".galleryFoldersView");
  const foldersGridEl = el.querySelector(".galleryFoldersGrid");
  const gridViewEl = el.querySelector(".galleryGridView");
  const backBtn = el.querySelector(".galleryBackBtn");
  const gridMetaEl = el.querySelector(".galleryGridMeta");
  const gridEl = el.querySelector(".galleryPhotoGrid");

  const lb = el.querySelector(".galleryLightbox");
  const lbImg = el.querySelector(".galleryLbImg");
  const lbMeta = el.querySelector(".galleryLbMeta");
  const lbPrev = el.querySelector(".galleryLbPrev");
  const lbNext = el.querySelector(".galleryLbNext");
  const lbClose = el.querySelector(".galleryLbClose2");
  const lbBg = el.querySelector(".galleryLbBg");

  let webAppIntroEl = null;
  let webAppDescEl = null;
  if (mode === "web-app") {
    webAppIntroEl = modal.querySelector(".galleryWebAppIntro");
    webAppDescEl = modal.querySelector(".galleryWebAppIntroDesc");
  }

  const loaderEl = document.createElement("div");
  loaderEl.className = "photoGridLoading mono galleryGridLoading";
  loaderEl.hidden = true;
  loaderEl.textContent = "Loading photos...";
  gridViewEl.insertBefore(loaderEl, gridEl);

  const nestedUrl = (folderKey, file) =>
    safeAssetUrl(`${nestedBasePath}/${folderKey}/${file}`);
  const flatUrl = (file) => safeAssetUrl(`${flatBasePath}/${file}`);
  const webAppUrl = (folderKey, file) =>
    safeAssetUrl(`${webAppBasePath}/${folderKey}/${file}`);

  function currentImageUrl(idx) {
    const file = state.files[idx];
    if (!file) return "";
    if (mode === "nested") return nestedUrl(state.folderKey, file);
    if (mode === "web-app") return webAppUrl(state.folderKey, file);
    return flatUrl(file);
  }

  function getNestedFiles(folderDisplayName) {
    const manifest = getNestedManifest();
    const key = folderKeyFor(folderDisplayName);
    const raw = manifest[key] || [];
    const files = filterImageFiles(raw);
    console.log("Loading images from:", `${nestedBasePath}/${key}/`, `(${files.length} image files)`);
    return { key, files };
  }

  function getFlatFiles() {
    const raw = getFlatManifest() || [];
    const files = withoutCardCovers(filterImageFiles(raw));
    console.log(
      "Loading gallery images from:",
      `${flatBasePath}/`,
      `(${files.length} items; card cover files like cover.svg are list-only on the work section)`
    );
    return files;
  }

  function getWebAppFiles(folderKey, opts = {}) {
    const { silent = false } = opts;
    const manifest = getWebAppManifest();
    const raw = manifest[folderKey] || [];
    const files = withoutCardCovers(filterImageFiles(raw));
    const fullPath = `${webAppBasePath}/${folderKey}/`;
    if (!silent) {
      console.log("Loading Web App screenshots from:", fullPath, `(${files.length} images)`);
    }
    return files;
  }

  function ensureInteractiveModalState() {
    el.querySelectorAll("button, .photoTile").forEach((node) => {
      node.style.pointerEvents = "auto";
      if ("disabled" in node) node.disabled = false;
    });
  }

  function closeLightbox() {
    state.lightboxOpen = false;
    lb.hidden = true;
    lbImg.removeAttribute("src");
  }

  function wireGridImages() {
    gridEl.querySelectorAll("img").forEach((img) => {
      img.addEventListener("error", () => {
        console.warn("Gallery image failed to load:", img.getAttribute("src"));
      });
    });
  }

  function renderFolders() {
    foldersGridEl.innerHTML = "";

    if (mode === "web-app") {
      webAppProjects.forEach((project) => {
        const files = getWebAppFiles(project.folder, { silent: true });
        const card = document.createElement("button");
        card.type = "button";
        card.className = "photoFolderCard";
        card.setAttribute("role", "listitem");
        card.dataset.webAppFolder = project.folder;
        card.innerHTML = `
          <div class="photoFolderTitle">${project.name}</div>
          <div class="photoFolderCount mono">${files.length} screenshots</div>
        `;
        card.addEventListener("click", () => openWebAppFolder(project));
        foldersGridEl.appendChild(card);
      });
      ensureInteractiveModalState();
      return;
    }

    if (!foldersList?.length) return;
    foldersList.forEach((folderName) => {
      const { files } = getNestedFiles(folderName);
      const card = document.createElement("button");
      card.type = "button";
      card.className = "photoFolderCard";
      card.setAttribute("role", "listitem");
      card.dataset.folder = folderName;
      card.innerHTML = `
        <div class="photoFolderTitle">${folderName}</div>
        <div class="photoFolderCount mono">${files.length} photos</div>
      `;
      card.addEventListener("click", () => openFolder(folderName));
      foldersGridEl.appendChild(card);
    });
    ensureInteractiveModalState();
  }

  function renderGrid() {
    const label = state.folderDisplayName;
    if (mode === "nested") {
      gridMetaEl.textContent = `${label} · ${state.files.length} photos`;
    } else if (mode === "web-app") {
      gridMetaEl.textContent = `${label} · ${state.files.length} screenshots`;
    } else {
      gridMetaEl.textContent = `${label} · ${state.files.length} images`;
    }
    loaderEl.hidden = true;

    if (!state.files.length) {
      let hint = "";
      if (mode === "nested") {
        hint = `No image files found for folder (check manifest matches disk): ${nestedBasePath}/${state.folderKey}/`;
      } else if (mode === "web-app") {
        hint = `No screenshots in ${webAppBasePath}/${state.folderKey}/ — add images and run node scripts/generate-gallery-manifests.mjs`;
      } else {
        hint = `No image files found in ${flatBasePath}/ — run scripts/generate-gallery-manifests.mjs after adding files.`;
      }
      gridEl.innerHTML = `<div class="galleryEmpty mono">${hint}</div>`;
      console.warn(hint);
      ensureInteractiveModalState();
      return;
    }

    gridEl.innerHTML = state.files
      .map((file, i) => {
        let src = "";
        if (mode === "nested") src = nestedUrl(state.folderKey, file);
        else if (mode === "web-app") src = webAppUrl(state.folderKey, file);
        else src = flatUrl(file);
        return `
          <button class="photoTile galleryPhotoTile" type="button" role="listitem" data-idx="${i}">
            <img src="${src}" alt="" loading="lazy" decoding="async" />
          </button>
        `;
      })
      .join("");
    wireGridImages();
    ensureInteractiveModalState();
  }

  function openFolder(folderName) {
    const { key, files } = getNestedFiles(folderName);
    state.folderDisplayName = folderName;
    state.folderKey = key;
    state.files = files;
    state.view = "grid";
    state.index = 0;
    foldersViewEl.hidden = true;
    gridViewEl.hidden = false;
    loaderEl.hidden = false;
    gridEl.innerHTML = "";
    gridMetaEl.textContent = `${folderName} · loading...`;
    requestAnimationFrame(() => {
      renderGrid();
    });
  }

  function openFlatGallery() {
    state.folderDisplayName = hdrTitle;
    state.files = getFlatFiles();
    state.view = "grid";
    state.index = 0;
    foldersViewEl.hidden = true;
    gridViewEl.hidden = false;
    backBtn.hidden = true;
    loaderEl.hidden = false;
    gridEl.innerHTML = "";
    gridMetaEl.textContent = `${pillLabel} · loading...`;
    requestAnimationFrame(() => {
      renderGrid();
    });
  }

  function openWebAppFolder(project) {
    if (!project) {
      console.error("[Portfolio] web-app: invalid project folder");
      return;
    }
    console.log("[Portfolio] Web App folder opened:", project.folder);
    closeLightbox();
    if (webAppIntroEl && webAppDescEl) {
      webAppIntroEl.hidden = false;
      webAppDescEl.textContent = project.description;
    }
    state.folderKey = project.folder;
    state.folderDisplayName = project.name;
    state.files = getWebAppFiles(project.folder);
    state.view = "grid";
    state.index = 0;
    foldersViewEl.hidden = true;
    gridViewEl.hidden = false;
    backBtn.hidden = false;
    loaderEl.hidden = false;
    gridEl.innerHTML = "";
    gridMetaEl.textContent = `${project.name} · loading…`;
    requestAnimationFrame(() => {
      renderGrid();
    });
  }

  function backToFolders() {
    state.view = "folders";
    state.files = [];
    if (mode === "web-app" && webAppIntroEl) webAppIntroEl.hidden = true;
    render();
  }

  function openModal(trigger = null) {
    el.hidden = false;
    document.documentElement.classList.add("modalOpen");
    closeLightbox();

    if (mode === "flat") {
      if (webAppIntroEl) webAppIntroEl.hidden = true;
      if (hdrTitleEl) hdrTitleEl.textContent = defaultHdrTitle;
      modal.setAttribute("aria-label", ariaLabel);
      openFlatGallery();
    } else if (mode === "web-app") {
      if (webAppIntroEl) webAppIntroEl.hidden = true;
      if (hdrTitleEl) hdrTitleEl.textContent = defaultHdrTitle;
      modal.setAttribute("aria-label", ariaLabel);
      state.view = "folders";
      foldersViewEl.hidden = false;
      gridViewEl.hidden = true;
      backBtn.hidden = false;
      renderFolders();
    } else {
      if (webAppIntroEl) webAppIntroEl.hidden = true;
      if (hdrTitleEl) hdrTitleEl.textContent = defaultHdrTitle;
      modal.setAttribute("aria-label", ariaLabel);
      state.view = "folders";
      foldersViewEl.hidden = false;
      gridViewEl.hidden = true;
      backBtn.hidden = false;
      renderFolders();
    }
    ensureInteractiveModalState();
    requestAnimationFrame(() => modal.focus());
  }

  function closeModal() {
    el.hidden = true;
    document.documentElement.classList.remove("modalOpen");
    closeLightbox();
    if (mode === "web-app") {
      if (webAppIntroEl) webAppIntroEl.hidden = true;
      if (hdrTitleEl) hdrTitleEl.textContent = defaultHdrTitle;
      modal.setAttribute("aria-label", ariaLabel);
    }
  }

  function openLightbox(idx) {
    if (!state.files.length) return;
    state.lightboxOpen = true;
    state.index = Math.max(0, Math.min(state.files.length - 1, idx));
    const url = currentImageUrl(state.index);
    console.log("Lightbox open:", url);
    lbImg.onerror = () => console.warn("Lightbox image failed:", url);
    lbImg.src = url;
    lbMeta.textContent = `${state.folderDisplayName} · ${state.index + 1}/${state.files.length}`;
    lb.hidden = false;
  }

  function stepLightbox(delta) {
    if (!state.files.length) return;
    state.index = (state.index + delta + state.files.length) % state.files.length;
    const url = currentImageUrl(state.index);
    lbImg.src = url;
    lbMeta.textContent = `${state.folderDisplayName} · ${state.index + 1}/${state.files.length}`;
  }

  function render() {
    const isFolders = state.view === "folders";
    foldersViewEl.hidden = !isFolders;
    gridViewEl.hidden = isFolders;
    if (isFolders) renderFolders();
    else renderGrid();
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("[Portfolio] Gallery card clicked:", attrValue, {
        title: trigger.getAttribute("data-title"),
        webAppFolder: trigger.getAttribute("data-web-app-folder"),
      });
      openModal(trigger);
    });
    trigger.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      console.log("[Portfolio] Gallery card activated (keyboard):", attrValue, {
        title: trigger.getAttribute("data-title"),
      });
      openModal(trigger);
    });
  });

  closeBtn.addEventListener("click", closeModal);
  backBtn.addEventListener("click", () => {
    if (mode === "flat") return;
    backToFolders();
  });

  el.addEventListener("click", (e) => {
    if (e.target === el) closeModal();
  });

  gridEl.addEventListener("click", (e) => {
    const tile = e.target.closest?.("[data-idx]");
    if (!tile) return;
    openLightbox(Number(tile.getAttribute("data-idx") || 0));
  });

  lbPrev.addEventListener("click", () => stepLightbox(-1));
  lbNext.addEventListener("click", () => stepLightbox(1));
  lbClose.addEventListener("click", closeLightbox);
  lbBg.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (e) => {
    if (el.hidden) return;
    if (e.key === "Escape") {
      if (state.lightboxOpen) closeLightbox();
      else closeModal();
      return;
    }
    if (!state.lightboxOpen) return;
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });
}

const photographyFolders = [
  "Animal Photography",
  "Cosplay",
  "Dark Theme",
  "Debut",
  "Drama and Sunset",
  "Flower",
  "Fun Shot",
  "Nature Vibe",
  "Product Shot",
  "Vintage Vibe",
];

const folderKeyFor = (displayName) => {
  if (displayName === "Nature Vibes") return "Nature Vibe";
  if (displayName === "Vintage Vibes") return "Vintage Vibe";
  return displayName;
};

const rawPhotoManifest = window.PHOTOGRAPHY_MANIFEST || {};
const normalizedPhotoManifest = {};
Object.keys(rawPhotoManifest).forEach((key) => {
  normalizedPhotoManifest[folderKeyFor(key)] = rawPhotoManifest[key];
});

createPortfolioGallery({
  attrValue: "photography",
  mode: "nested",
  pillLabel: "Photography",
  hdrTitle: "Portfolio",
  ariaLabel: "Photography portfolio",
  foldersList: photographyFolders,
  getNestedManifest: () => normalizedPhotoManifest,
  getFlatManifest: () => [],
  folderKeyFor,
  nestedBasePath: "./image/PHOTOGRAPHY",
  flatBasePath: "",
});

createPortfolioGallery({
  attrValue: "digital-art",
  mode: "flat",
  pillLabel: "Digital Art",
  hdrTitle: "Digital Artist Portfolio",
  ariaLabel: "Digital art gallery",
  foldersList: null,
  getNestedManifest: () => ({}),
  getFlatManifest: () => window.DIGITAL_ART_MANIFEST || [],
  folderKeyFor,
  nestedBasePath: "",
  flatBasePath: "./image/DigitalArt",
});

createPortfolioGallery({
  attrValue: "certificate",
  mode: "flat",
  pillLabel: "Certificate",
  hdrTitle: "Certificate of Completion",
  ariaLabel: "Certificate gallery",
  foldersList: null,
  getNestedManifest: () => ({}),
  getFlatManifest: () => window.CERTIFICATE_MANIFEST || [],
  folderKeyFor,
  nestedBasePath: "",
  flatBasePath: "./image/Certificate",
});

const webAppProjects = [
  {
    name: "Barangay Health Center",
    folder: "BarangayHealthCenter",
    description:
      "A modern concept for a web application with a focus on user experience.",
  },
];

createPortfolioGallery({
  attrValue: "web-app",
  mode: "web-app",
  pillLabel: "Web App",
  hdrTitle: "Projects",
  ariaLabel: "Web application projects",
  foldersList: null,
  getNestedManifest: () => ({}),
  getFlatManifest: () => [],
  folderKeyFor,
  nestedBasePath: "",
  flatBasePath: "",
  webAppProjects,
  webAppBasePath: "./image/WebApp",
  getWebAppManifest: () => window.WEB_APP_MANIFEST || {},
});
