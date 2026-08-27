(() => {
  "use strict";

  const projects = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];
  const certifications = Array.isArray(window.PORTFOLIO_CERTIFICATIONS) ? window.PORTFOLIO_CERTIFICATIONS : [];
  const grid = document.getElementById("project-grid");
  const projectsToggle = document.getElementById("projects-toggle");
  const PROJECTS_INITIAL_LIMIT = 8;
  let currentProjectFilter = "all";
  let showAllProjects = false;
  const certificationGrid = document.getElementById("certification-grid");
  const modal = document.getElementById("project-modal");
  const modalClose = modal?.querySelector(".modal-close");
  const modalImage = document.getElementById("modal-image");
  const modalPrev = document.getElementById("modal-prev");
  const modalNext = document.getElementById("modal-next");
  const modalImageCounter = document.getElementById("modal-image-counter");
  const modalThumbnails = document.getElementById("modal-thumbnails");
  const certificateModal = document.getElementById("certificate-modal");
  const certificateModalClose = certificateModal?.querySelector(".certificate-modal-close");
  const filterButtons = [...document.querySelectorAll(".filter-button")];
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.getElementById("primary-nav");
  const header = document.querySelector(".site-header");
  const navLinks = [...document.querySelectorAll(".primary-nav a")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const contactForm = document.getElementById("contact-form");

  let currentProjectImages = [];
  let currentProjectImageIndex = 0;

  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  function getProjectImages(project) {
    const projectImages = Array.isArray(project.images) && project.images.length
      ? project.images
      : project.image
        ? [project.image]
        : [];

    return projectImages
      .map((item, index) => {
        if (typeof item === "string") {
          return {
            src: item,
            alt: `${project.title} - Project photo ${index + 1}`
          };
        }

        return {
          src: item?.src || "",
          alt: item?.alt || `${project.title} - Project photo ${index + 1}`
        };
      })
      .filter((item) => item.src);
  }

  function projectCard(project) {
    const visibleTags = project.systems.slice(0, 4);
    const projectImages = getProjectImages(project);
    const coverImage = projectImages[0];
    return `
      <article class="project-card reveal" data-category="${escapeHtml(project.category)}">
        <div class="project-image">
          <img src="${escapeHtml(coverImage?.src || project.image || "")}" alt="${escapeHtml(coverImage?.alt || `Project image for ${project.title}`)}" loading="lazy" width="900" height="620">
        </div>
        <div class="project-body">
          <span class="project-role">${escapeHtml(project.role)}</span>
          <h3>${escapeHtml(project.title)}</h3>
          <p class="project-location">${escapeHtml(project.location)}</p>
          <div class="project-tags">
            ${visibleTags.map((tag) => `<span class="project-tag">${escapeHtml(tag)}</span>`).join("")}
          </div>
          <button class="project-open" type="button" data-project-id="${escapeHtml(project.id)}">
            View project <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </article>
    `;
  }

  function certificationCard(certification) {
    return `
      <button class="cert-card" type="button" data-certificate-id="${escapeHtml(certification.id)}" aria-label="View ${escapeHtml(certification.fullTitle)} certificate">
        <span class="cert-logo-wrap">
          <img src="${escapeHtml(certification.logo)}" alt="${escapeHtml(certification.issuer)} logo" loading="lazy" width="180" height="70">
        </span>
        <h3>${escapeHtml(certification.title)}</h3>
        <p>${escapeHtml(certification.fullTitle)}</p>
        <time datetime="${escapeHtml(certification.year)}">${escapeHtml(certification.year)}</time>
        <span class="cert-card-hint">View certificate</span>
      </button>
    `;
  }

  function renderCertifications() {
    if (!certificationGrid) return;
    certificationGrid.innerHTML = certifications.map(certificationCard).join("");
    certificationGrid.querySelectorAll(".cert-card").forEach((button) => {
      button.addEventListener("click", () => openCertificate(button.dataset.certificateId));
    });
  }

  function openCertificate(id) {
    if (!certificateModal) return;
    const certification = certifications.find((item) => item.id === id);
    if (!certification) return;

    const logo = document.getElementById("certificate-modal-logo");
    const issuer = document.getElementById("certificate-modal-issuer");
    const title = document.getElementById("certificate-modal-title");
    const year = document.getElementById("certificate-modal-year");
    const image = document.getElementById("certificate-modal-image");

    logo.src = certification.logo;
    logo.alt = `${certification.issuer} logo`;
    issuer.textContent = certification.issuer;
    title.textContent = certification.fullTitle;
    year.textContent = certification.year;
    image.src = certification.image;
    image.alt = `${certification.fullTitle} certificate issued to Mahmoud Ahmed`;

    certificateModal.showModal();
    document.body.classList.add("modal-open");
    certificateModalClose?.focus();
  }

  function closeCertificate() {
    if (!certificateModal?.open) return;
    certificateModal.close();
    document.body.classList.remove("modal-open");
  }

  function observeReveals(root = document) {
    const items = [...root.querySelectorAll(".reveal:not(.visible)")];
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    items.forEach((item) => observer.observe(item));
  }

  function groupHeading(title, count) {
    return `
      <div class="project-group-heading">
        <h3>${escapeHtml(title)}</h3>
        <span>${count} Projects</span>
      </div>
    `;
  }

  function renderProjects(filter = currentProjectFilter) {
    if (!grid) return;

    currentProjectFilter = filter;

    const filteredProjects = filter === "all"
      ? projects
      : projects.filter((project) => project.category === filter);

    const visibleProjects = showAllProjects
      ? filteredProjects
      : filteredProjects.slice(0, PROJECTS_INITIAL_LIMIT);

    if (filter === "all") {
      const pmProjects = visibleProjects.filter((project) => project.category === "pm");
      const siteProjects = visibleProjects.filter((project) => project.category === "site");
      const content = [];

      if (pmProjects.length) {
        content.push(groupHeading("Project Manager Projects", projects.filter((project) => project.category === "pm").length));
        content.push(...pmProjects.map(projectCard));
      }

      if (siteProjects.length) {
        content.push(groupHeading("Site Engineer Projects", projects.filter((project) => project.category === "site").length));
        content.push(...siteProjects.map(projectCard));
      }

      grid.innerHTML = content.join("");
    } else {
      grid.innerHTML = visibleProjects.map(projectCard).join("");
    }

    if (projectsToggle) {
      const hasMore = filteredProjects.length > PROJECTS_INITIAL_LIMIT;
      projectsToggle.hidden = !hasMore;
      projectsToggle.textContent = showAllProjects
        ? "Show Fewer Projects"
        : `View All Projects (${filteredProjects.length})`;
    }

    grid.querySelectorAll(".project-open").forEach((button) => {
      button.addEventListener("click", () => openProject(button.dataset.projectId));
    });
    observeReveals(grid);
  }

  function updateProjectGallery() {
    if (!modalImage || !currentProjectImages.length) return;

    const imageCount = currentProjectImages.length;
    currentProjectImageIndex = (currentProjectImageIndex + imageCount) % imageCount;

    const selectedImage = currentProjectImages[currentProjectImageIndex];
    modalImage.src = selectedImage.src;
    modalImage.alt = selectedImage.alt;

    const hasMultipleImages = imageCount > 1;

    if (modalPrev) modalPrev.hidden = !hasMultipleImages;
    if (modalNext) modalNext.hidden = !hasMultipleImages;

    if (modalImageCounter) {
      modalImageCounter.hidden = !hasMultipleImages;
      modalImageCounter.textContent = `${currentProjectImageIndex + 1} / ${imageCount}`;
    }

    modalThumbnails?.querySelectorAll(".modal-thumbnail").forEach((thumbnail, index) => {
      const isActive = index === currentProjectImageIndex;
      thumbnail.classList.toggle("active", isActive);
      thumbnail.setAttribute("aria-current", String(isActive));

      if (isActive) {
        thumbnail.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest"
        });
      }
    });
  }

  function renderProjectThumbnails() {
    if (!modalThumbnails) return;

    if (currentProjectImages.length <= 1) {
      modalThumbnails.innerHTML = "";
      modalThumbnails.hidden = true;
      return;
    }

    modalThumbnails.hidden = false;
    modalThumbnails.innerHTML = currentProjectImages
      .map((image, index) => `
        <button
          class="modal-thumbnail${index === 0 ? " active" : ""}"
          type="button"
          data-image-index="${index}"
          aria-label="View project image ${index + 1}"
          aria-current="${index === 0 ? "true" : "false"}"
        >
          <img src="${escapeHtml(image.src)}" alt="" loading="lazy">
        </button>
      `)
      .join("");

    modalThumbnails.querySelectorAll(".modal-thumbnail").forEach((thumbnail) => {
      thumbnail.addEventListener("click", () => {
        currentProjectImageIndex = Number(thumbnail.dataset.imageIndex);
        updateProjectGallery();
      });
    });
  }

  function showPreviousProjectImage() {
    if (currentProjectImages.length <= 1) return;
    currentProjectImageIndex -= 1;
    updateProjectGallery();
  }

  function showNextProjectImage() {
    if (currentProjectImages.length <= 1) return;
    currentProjectImageIndex += 1;
    updateProjectGallery();
  }

  function openProject(id) {
    if (!modal) return;
    const project = projects.find((item) => item.id === id);
    if (!project) return;

    const role = document.getElementById("modal-role");
    const title = document.getElementById("modal-title");
    const location = document.getElementById("modal-location");
    const tags = document.getElementById("modal-tags");
    const scope = document.getElementById("modal-scope");
    const responsibilities = document.getElementById("modal-responsibilities");

    currentProjectImages = getProjectImages(project);
    currentProjectImageIndex = 0;
    renderProjectThumbnails();
    updateProjectGallery();

    role.textContent = `${project.role} | ${project.subtitle}`;
    title.textContent = project.title;
    location.textContent = project.location;
    tags.innerHTML = project.systems.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
    scope.textContent = project.scope;
    responsibilities.textContent = project.responsibilities;

    modal.showModal();
    document.body.classList.add("modal-open");
    modalClose?.focus();
  }

  function closeModal() {
    if (!modal?.open) return;
    modal.close();
    document.body.classList.remove("modal-open");
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
      });
      showAllProjects = false;
      renderProjects(button.dataset.filter || "all");
    });
  });

  projectsToggle?.addEventListener("click", () => {
    showAllProjects = !showAllProjects;
    renderProjects(currentProjectFilter);

    if (!showAllProjects) {
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  modalPrev?.addEventListener("click", showPreviousProjectImage);
  modalNext?.addEventListener("click", showNextProjectImage);

  modalClose?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  certificateModalClose?.addEventListener("click", closeCertificate);
  certificateModal?.addEventListener("click", (event) => {
    if (event.target === certificateModal) closeCertificate();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
      closeCertificate();
      return;
    }

    if (!modal?.open || currentProjectImages.length <= 1) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPreviousProjectImage();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showNextProjectImage();
    }
  });

  menuButton?.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    nav?.classList.toggle("open", !expanded);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav?.classList.remove("open");
      menuButton?.setAttribute("aria-expanded", "false");
    });
  });

  function updateHeader() {
    header?.classList.toggle("scrolled", window.scrollY > 14);
  }

  function updateActiveNav() {
    const offset = window.scrollY + 130;
    let current = "";
    sections.forEach((section) => {
      if (section.offsetTop <= offset) current = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
  }

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updateHeader();
      updateActiveNav();
      ticking = false;
    });
  }, { passive: true });

  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "Portfolio inquiry").trim();
    const message = String(formData.get("message") || "").trim();

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      message
    ].join("\n");

    window.location.href = `mailto:M.Ahmed1518@Outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  const year = document.getElementById("current-year");
  if (year) year.textContent = String(new Date().getFullYear());

  renderProjects("all");
  renderCertifications();
  observeReveals(document);
  updateHeader();
  updateActiveNav();
})();
