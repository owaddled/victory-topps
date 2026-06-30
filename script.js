const issues = [
  {
    number: 2,
    title: "Issue #2",
    status: "Inked + Lettered",
    description: "Sixteen pages inked and lettered.",
    folder: "images/2",
    pages: [
      { file: "cover.tif", label: "Cover" },
      ...Array.from({ length: 16 }, (_, index) => {
      const pageNumber = index + 1;

      return {
        file: `${String(pageNumber).padStart(2, "0")}.tif`,
        label: `Page ${pageNumber}`
    };
  })
]
  },
  {
    number: 3,
    title: "Issue #3",
    status: "Pencils Only",
    description: "Uninked pencil art.",
    folder: "images/3",
    pages: [
      { file: "cover.tif", label: "Cover" },
      { file: "01.tif", label: "Pencils 1" },
      { file: "02.tif", label: "Pencils 2" },
      { file: "05.tif", label: "Pencils 5" }
    ]
  },
  {
    number: 5,
    title: "Issue #5",
    status: "Cover Only",
    description: "Only the cover artwork is available from this issue.",
    folder: "images/5",
    pages: [
      { file: "cover.tif", label: "Cover" }
    ]
  }
];

const issueGrid = document.querySelector("#issue-grid");
const tabButtons = document.querySelectorAll(".tab-button");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const closeButton = document.querySelector("#lightbox-close");
const prevButton = document.querySelector("#lightbox-prev");
const nextButton = document.querySelector("#lightbox-next");

let visibleImages = [];
let currentImageIndex = 0;

function imagePath(issue, page) {
  return `${issue.folder}/${page.file}`;
}

function renderIssues(filter = "all") {
  const selectedIssues = filter === "all"
    ? issues
    : issues.filter(issue => String(issue.number) === filter);

  issueGrid.innerHTML = selectedIssues.map(issue => `
    <article class="issue-card" data-issue="${issue.number}">
      <div class="issue-topline">
        <div>
          <h2>${issue.title}</h2>
          <span class="badge">${issue.status}</span>
        </div>
      </div>
      <p class="issue-description">${issue.description}</p>
      <div class="page-grid">
        ${issue.pages.map((page) => `
          <button class="page-button" type="button" data-src="${imagePath(issue, page)}" data-caption="${issue.title} — ${page.label}">
            <span class="page-thumb">
              <img src="${imagePath(issue, page)}" alt="${issue.title} ${page.label}" loading="lazy">
            </span>
            <span class="page-label">${page.label}</span>
          </button>
        `).join("")}
      </div>
    </article>
  `).join("");

  visibleImages = Array.from(document.querySelectorAll(".page-button")).map(button => ({
    src: button.dataset.src,
    caption: button.dataset.caption
  }));

  document.querySelectorAll(".page-button").forEach((button, index) => {
    button.addEventListener("click", () => openLightbox(index));
  });
}

function openLightbox(index) {
  currentImageIndex = index;
  updateLightboxImage();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  closeButton.focus();
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
}

function updateLightboxImage() {
  const image = visibleImages[currentImageIndex];
  if (!image) return;

  lightboxImage.src = image.src;
  lightboxImage.alt = image.caption;
  lightboxCaption.textContent = image.caption;
}

function showPreviousImage() {
  currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
  updateLightboxImage();
}

function showNextImage() {
  currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
  updateLightboxImage();
}

tabButtons.forEach(button => {
  button.addEventListener("click", () => {
    tabButtons.forEach(tab => tab.classList.remove("active"));
    button.classList.add("active");
    renderIssues(button.dataset.filter);
  });
});

closeButton.addEventListener("click", closeLightbox);
prevButton.addEventListener("click", showPreviousImage);
nextButton.addEventListener("click", showNextImage);

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("open")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showPreviousImage();
  if (event.key === "ArrowRight") showNextImage();
});

renderIssues();
