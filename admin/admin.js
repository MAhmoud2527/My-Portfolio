"use strict";

const markup = (selector, label, type = "text", attr = "") => ({ selector, label, type, attr });
const text = (selector, label) => markup(selector, label, "long");
const link = (selector, label) => markup(selector, label, "link", "href");
const image = (selector, label) => markup(selector, label, "image", "src");
const heading = (selector) => markup(selector, "عنوان القسم");
const kicker = markup(".section-kicker", "العنوان التمهيدي");

const sectionFields = {
  hero: [
    markup(".eyebrow", "العنوان التمهيدي"), markup("#hero-title span", "الاسم المعروض"),
    markup(".hero-role", "المسمى الوظيفي"), text(".hero-intro", "النص التعريفي"),
    image(".portrait-shell img", "الصورة الرئيسية"), markup(".hero-actions a[download]", "ملف السيرة الذاتية PDF", "pdf", "href"),
    markup(".hero-actions a[download]", "نص زر تنزيل السيرة الذاتية", "trailing"),
    markup(".hero-actions .button-ghost", "نص زر المشاريع"), link(".hero-actions .button-ghost", "رابط زر المشاريع")
  ],
  about: [kicker, heading("#about-title"), image(".about-character", "صورة النبذة"),
    markup(".section-copy .text-link", "نص زر LinkedIn", "leading"), link(".section-copy .text-link", "رابط LinkedIn")],
  projects: [kicker, heading("#projects-title"), markup("#projects-toggle", "نص زر عرض المشاريع")],
  experience: [kicker, heading("#experience-title"), text(".experience-intro", "مقدمة الخبرة")],
  certifications: [kicker, heading("#certifications-title"), markup(".section-heading-row a", "نص زر الشهادات"), link(".section-heading-row a", "رابط كل الشهادات")],
  expertise: [kicker, heading("#expertise-title")],
  contact: [kicker, heading("#contact-title"), text(".contact-copy > p:not(.section-kicker)", "وصف التواصل"),
    markup("#contact-form", "بريد استقبال رسائل النموذج", "email", "data-recipient"),
    markup("#contact-form button", "نص زر الإرسال"), text(".form-note", "ملاحظة نموذج التواصل")],
  custom: [heading("h2"), text(".custom-body", "محتوى القسم"), image(".custom-image", "صورة القسم"),
    markup(".custom-link", "نص الزر"), link(".custom-link", "رابط الزر")]
};

const field = (key, label, type = "text", options) => ({ key, label, type, options });
const recordFields = {
  projects: [
    field("title", "اسم المشروع"), field("location", "الموقع"), field("subtitle", "السطر التعريفي"), field("role", "الدور"),
    field("category", "التصنيف", "select", [["pm", "مدير مشاريع"], ["site", "مهندس موقع"]]),
    field("status", "حالة المشروع", "select", [["", "بدون حالة"], ["in-progress", "جاري"], ["completed", "مكتمل"]]),
    field("systems", "الأنظمة · كل نظام في سطر", "lines"), field("scope", "نطاق العمل", "long"),
    field("responsibilities", "المسؤوليات", "long"), field("images", "صور المشروع · أول صورة هي الغلاف", "gallery")
  ],
  certifications: [
    field("title", "اسم الشهادة المختصر"), field("fullTitle", "الاسم الكامل"), field("issuer", "الجهة المانحة"),
    field("year", "السنة"), field("logo", "شعار الجهة", "image"), field("image", "صورة الشهادة", "image")
  ]
};

const collections = {
  hero: [{
    title: "روابط التواصل في الرئيسية", container: ".contact-panel", item: ":scope > a", summary: "span:not(.panel-icon)",
    template: '<a><span class="panel-icon" aria-hidden="true">↗</span><span>New link</span></a>',
    fields: [markup("span:not(.panel-icon)", "النص الظاهر"), link(":scope", "الرابط")]
  }],
  about: [{
    title: "فقرات النبذة", container: ".section-copy", item: ":scope > p:not(.section-kicker)", summary: ":scope",
    template: '<p>New paragraph</p>', insertBefore: ".text-link",
    fields: [text(":scope", "النص")]
  }, {
    title: "المؤشرات المهنية", container: ".metric-grid", item: ".metric-card", summary: "span",
    template: '<article class="metric-card"><strong>0</strong><span>New highlight</span></article>',
    fields: [markup("strong", "الرقم أو القيمة"), markup("span", "وصف المؤشر")]
  }],
  experience: [{
    title: "الأدوار المهنية", container: ".experience-timeline", item: ".experience-entry", summary: "h3",
    template: '<li class="experience-entry"><div class="experience-date">Dates</div><article class="experience-content"><h3>New role</h3><p class="experience-company">Company / Location</p><ul></ul></article></li>',
    fields: [markup("h3", "المسمى الوظيفي"), markup(".experience-date", "الفترة"), markup(".experience-company", "الشركة والموقع"), markup("ul", "المسؤوليات · كل نقطة في سطر", "list")]
  }],
  expertise: [{
    title: "بطاقات المهارات", container: ".expertise-grid", item: ".expertise-card", summary: "h3", counter: ".expertise-icon",
    template: '<article class="expertise-card"><div class="expertise-icon"></div><h3>New skill</h3><p></p></article>',
    fields: [markup("h3", "اسم المهارة"), text("p", "وصف المهارة")]
  }],
  contact: [{
    title: "وسائل التواصل", container: ".contact-list", item: "a", summary: "strong",
    template: '<a><strong>New contact</strong><span></span></a>',
    fields: [markup("strong", "نوع التواصل"), markup("span", "النص الظاهر"), link(":scope", "الرابط")]
  }]
};

const $ = (selector) => document.querySelector(selector);
const editor = $("#editor");
const picker = $("#dialog");
const session = { token: "", head: "", source: null, saved: null, baseline: null, doc: null, records: {}, uploads: new Map(), current: "", activeItem: null, busy: false };
const staticLabels = [...document.querySelectorAll("[data-en]")].map((node) => [node, node.textContent]);

function renderLanguage() {
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  document.title = language === "ar" ? "إدارة البورتفوليو | محمود أحمد" : "Portfolio Dashboard | Mahmoud Ahmed";
  for (const [node, arabic] of staticLabels) node.textContent = language === "ar" ? arabic : node.dataset.en;
  editor.setAttribute("aria-label", tr("تعديل") + (language === "ar" ? " المحتوى" : " content"));
  for (const toggle of document.querySelectorAll("[data-language]")) {
    toggle.textContent = language === "ar" ? "English" : "العربية";
    toggle.lang = language === "ar" ? "en" : "ar";
  }
  configureSignIn();
  if (session.doc) {
    render();
    updatePending();
  }
}

function element(tag, content = "", className = "") {
  const node = document.createElement(tag);
  if (content) node.textContent = content;
  if (className) node.className = className;
  return node;
}

function button(label, action, className = "", disabled = false) {
  const node = element("button", label, className);
  node.type = "button";
  node.disabled = disabled;
  node.addEventListener("click", action);
  return node;
}

function notify(message = "", isError = false) {
  const notice = $("#notice");
  notice.hidden = !message;
  notice.textContent = message;
  notice.classList.toggle("error", isError);
}

function sections(doc = session.doc) {
  return Array.from(doc.querySelector("#main-content").children).filter((node) => node.tagName === "SECTION");
}

function kindOf(section) {
  if (section.classList.contains("hero")) return "hero";
  return Object.hasOwn(Portfolio.sectionNames, section.id) ? section.id : "custom";
}

function nameOf(section) {
  const kind = kindOf(section);
  return section.dataset.navLabel || tr(Portfolio.sectionNames[kind]) || section.querySelector("h2")?.textContent || tr("قسم جديد");
}

function nodeAt(root, selector) {
  return selector === ":scope" ? root : root.querySelector(selector);
}

function getElementValue(node, descriptor) {
  if (descriptor.attr) return node.getAttribute(descriptor.attr) || "";
  if (descriptor.type === "list") return Array.from(node.children, (item) => item.textContent).join("\n");
  if (descriptor.type === "long") return node.textContent.trim();
  if (descriptor.type === "leading" || descriptor.type === "trailing") {
    const position = descriptor.type === "leading" ? "firstChild" : "lastChild";
    return node[position]?.nodeType === Node.TEXT_NODE ? node[position].textContent.trim() : "";
  }
  return node.textContent.trim().replace(/\s+/g, " ");
}

function setElementValue(node, descriptor, value) {
  if (descriptor.attr) {
    if (value) node.setAttribute(descriptor.attr, value);
    else node.removeAttribute(descriptor.attr);
    if (node.classList.contains("custom-image") || node.classList.contains("custom-link")) node.hidden = !value;
    if (descriptor.type === "image" || descriptor.type === "pdf") node.hidden = !value;
    return;
  }
  if (descriptor.type === "list") {
    node.replaceChildren(...value.split("\n").filter((line) => line.trim()).map((line) => element("li", line.trim())));
  } else if (descriptor.type === "leading" || descriptor.type === "trailing") {
    const position = descriptor.type === "leading" ? "firstChild" : "lastChild";
    const existing = node[position];
    if (existing?.nodeType === Node.TEXT_NODE) existing.textContent = value + " ";
    else if (descriptor.type === "leading") node.prepend(value + " ");
    else node.append(" " + value);
  } else {
    node.textContent = value;
  }
}

function ask(title, content, label = tr("تأكيد")) {
  $("#dialog-title").textContent = title;
  $("#dialog-content").replaceChildren(typeof content === "string" ? element("p", content) : content);
  $("#dialog-ok").textContent = label;
  picker.returnValue = "";
  picker.showModal();
  return new Promise((resolve) => picker.addEventListener("close", () => resolve(picker.returnValue === "accept"), { once: true }));
}

function validInputs() {
  return Array.from(editor.querySelectorAll("input,textarea,select")).every((control) => {
    if (!control.checkValidity()) {
      const panel = control.closest("details");
      if (panel) panel.open = true;
      control.reportValidity();
      return false;
    }
    return true;
  });
}

function selectSection(id, skipValidation = false) {
  if (!skipValidation && id === session.current) return;
  if (!skipValidation && !readyToLeave()) return;
  if (session.current !== id) session.activeItem = null;
  session.current = id;
  render();
}

function patchPage() {
  const doc = session.doc;
  const working = doc.cloneNode(true);
  const nav = working.getElementById("primary-nav");
  const currentSections = sections(working);
  const existingNav = new Map(Array.from(nav.querySelectorAll("a[href^='#']"), (a) => [a.getAttribute("href").slice(1), a]));
  nav.replaceChildren();
  for (const section of currentSections) {
    const kind = kindOf(section);
    if (!section.id) continue;
    const oldLink = existingNav.get(section.id);
    if (section.dataset.nav === "false" || (!oldLink && section.dataset.nav !== "true")) continue;
    const a = oldLink || element("a");
    a.href = "#" + section.id;
    a.textContent = section.dataset.navLabel || oldLink?.textContent || section.querySelector("h2")?.textContent || (kind === "hero" ? "Home" : Portfolio.sectionNames[kind]);
    nav.append(a);
  }
  const ids = new Set(currentSections.map((section) => section.id));
  working.querySelectorAll("main a[href^='#']").forEach((a) => {
    const href = a.getAttribute("href");
    if (href.length > 1 && !ids.has(href.slice(1)) && !working.getElementById(href.slice(1))) {
      a.setAttribute("hidden", "");
      a.setAttribute("data-missing-target", "");
    }
    else if (a.hasAttribute("data-missing-target")) {
      a.removeAttribute("hidden");
      a.removeAttribute("data-missing-target");
    }
  });
  return "<!doctype html>\n" + working.documentElement.outerHTML + "\n";
}

function workingSnapshot() {
  const snapshot = { pageDOM: session.doc.documentElement.outerHTML };
  for (const kind of Object.keys(recordFields)) snapshot[kind] = Portfolio.writeRecords(kind, session.records[kind]);
  return snapshot;
}

function hasUnsavedChanges(snapshot = workingSnapshot()) {
  return Object.keys(snapshot).some((key) => snapshot[key] !== session.saved[key]);
}

function readyToLeave() {
  if (!validInputs()) return false;
  if (!hasUnsavedChanges()) return true;
  notify(tr("احفظ تعديلات الجزء الحالي قبل الانتقال."), true);
  editor.querySelector(".save-draft:not([hidden])")?.focus();
  return false;
}

function saveDraft() {
  if (!validInputs() || session.busy) return;
  try {
    checkRecords();
    session.saved = workingSnapshot();
    updatePending();
    notify(tr("اتحفظت التعديلات في الجلسة الحالية. اضغط نشر التعديلات لتحديث الموقع."));
  } catch (error) {
    notify(error.message, true);
  }
}

function saveButton() {
  return button(tr("حفظ التعديلات"), saveDraft, "primary save-draft");
}

function pendingChanges(snapshot = workingSnapshot()) {
  const changes = [];
  if (snapshot.pageDOM !== session.source.pageDOM) {
    changes.push({ path: Portfolio.paths.page, content: patchPage() });
  }
  for (const kind of Object.keys(recordFields)) {
    const next = snapshot[kind];
    if (next !== session.source[kind]) changes.push({ path: Portfolio.paths[kind], content: next });
  }
  return changes;
}

function updatePending() {
  if (!session.doc) return;
  const snapshot = workingSnapshot();
  const unsaved = hasUnsavedChanges(snapshot);
  const changed = Object.keys(snapshot).some((key) => snapshot[key] !== session.source[key]);
  const ready = changed && !unsaved && !session.busy;
  $("#draft").textContent = unsaved ? tr("تعديلات تحتاج حفظ") : changed ? tr("تعديلات محفوظة وجاهزة للنشر") : tr("آخر نسخة من GitHub");
  const publishButton = $("#publish");
  publishButton.disabled = !ready;
  publishButton.classList.toggle("publish-ready", ready);
  const itemEditor = editor.querySelector(".project-edit");
  for (const save of editor.querySelectorAll(".save-draft")) {
    save.hidden = Boolean(itemEditor) && !itemEditor.contains(save);
    save.disabled = !unsaved || session.busy;
  }
  for (const fieldGroup of editor.querySelectorAll(".section-fields")) fieldGroup.inert = Boolean(itemEditor);
}

function assetUrl(path) {
  if (!Portfolio.validLink(path, "image") || !path || path.startsWith("#")) return "";
  return session.uploads.get(path)?.url || new URL("../" + path, location.href).href;
}

function stageFile(file, kind) {
  if (!Portfolio.files[kind].split(",").includes(file.type) || !file.size || file.size > 15 * 1024 * 1024) {
    throw new Error(tr("اختار ملفًا مدعومًا حجمه أقل من 15 ميجابايت."));
  }
  const ext = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "application/pdf": "pdf" }[file.type];
  const path = "assets/portfolio-media/" + crypto.randomUUID() + "." + ext;
  session.uploads.set(path, { path, file, url: URL.createObjectURL(file) });
  return path;
}

function mediaControl(label, type, getValue, setValue) {
  const wrap = element("div", "", "field wide");
  const title = element("label", tr(label));
  const input = element("input");
  const gallery = type === "gallery";
  const list = element("div", "", gallery ? "media-list sortable-gallery" : type === "image" ? "media-list single-image-preview" : "media-list");
  const sortHint = gallery ? element("p", tr("اسحب الصور لتغيير ترتيبها."), "hint") : null;
  let dragIndex = null;
  input.type = "file";
  input.id = "media-" + crypto.randomUUID();
  title.htmlFor = input.id;
  input.multiple = type === "gallery";
  input.accept = Portfolio.files[type === "gallery" ? "image" : type];
  const values = () => type === "gallery" ? getValue() : [getValue()].filter(Boolean);
  const save = (entries) => {
    setValue(type === "gallery" ? entries : entries[0] || "");
    redraw();
    updatePending();
  };
  function reorder(all, from, to, restoreFocus = false) {
    if (from === to) return;
    const next = [...all];
    next.splice(to, 0, next.splice(from, 1)[0]);
    save(next);
    if (restoreFocus) list.children[to]?.querySelector("select")?.focus();
  }
  function redraw() {
    list.replaceChildren();
    values().forEach((entry, index, all) => {
      const path = typeof entry === "string" ? entry : entry.src;
      const card = element("div", "", "media-tile");
      if (type === "pdf") {
        const a = element("a", tr("فتح ملف PDF"));
        a.href = assetUrl(path);
        a.target = "_blank";
        a.rel = "noopener";
        card.append(a);
      } else {
        const img = element("img");
        const src = assetUrl(path);
        if (src) img.src = src;
        img.alt = tr("صورة ") + (index + 1);
        img.draggable = false;
        card.append(img);
      }
      const controls = element("div", "", "media-controls");
      if (gallery) {
        card.draggable = true;
        const marker = element("span", index === 0 ? tr("الغلاف") : String(index + 1), "photo-order");
        card.append(marker);
        const position = element("select");
        position.setAttribute("aria-label", tr("نقل الصورة") + " " + (index + 1));
        for (let i = 0; i < all.length; i++) {
          const option = element("option", String(i + 1));
          option.value = String(i);
          position.append(option);
        }
        position.value = String(index);
        position.addEventListener("change", () => reorder(all, index, Number(position.value), true));
        controls.append(position);
        card.addEventListener("dragstart", (event) => {
          if (event.target.closest("button, select")) { event.preventDefault(); return; }
          dragIndex = index;
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData("text/plain", String(index));
          card.classList.add("dragging");
        });
        card.addEventListener("dragover", (event) => {
          if (dragIndex === null || dragIndex === index) return;
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
          card.classList.add("drop-target");
        });
        card.addEventListener("dragleave", (event) => {
          if (!card.contains(event.relatedTarget)) card.classList.remove("drop-target");
        });
        card.addEventListener("drop", (event) => {
          if (dragIndex === null) return;
          event.preventDefault();
          const from = dragIndex;
          dragIndex = null;
          card.classList.remove("drop-target");
          reorder(all, from, index);
        });
        card.addEventListener("dragend", () => {
          dragIndex = null;
          list.querySelectorAll(".dragging, .drop-target").forEach((tile) => tile.classList.remove("dragging", "drop-target"));
        });
      }
      controls.append(button(tr("إزالة"), () => save(all.filter((_, i) => i !== index)), "danger quiet"));
      card.append(controls);
      list.append(card);
    });
  }
  input.addEventListener("change", () => {
    const selected = Array.from(input.files);
    if (!selected.length) return;
    try {
      const paths = selected.map((file) => stageFile(file, type === "gallery" ? "image" : type));
      save(type === "gallery" ? [...values(), ...paths] : paths);
      notify();
    } catch (error) {
      notify(error.message, true);
    } finally {
      input.value = "";
    }
  });
  wrap.append(title);
  if (sortHint) wrap.append(sortHint);
  wrap.append(list, input);
  redraw();
  return wrap;
}

function renderField(descriptor, read, write) {
  const { label, type, options } = descriptor;
  if (["image", "pdf", "gallery"].includes(type)) return mediaControl(label, type, read, write);
  const multiline = ["long", "lines", "list"].includes(type);
  const wrapper = element("label", "", "field" + (multiline ? " wide" : ""));
  const control = element(type === "select" ? "select" : multiline ? "textarea" : "input");
  control.dir = "auto";
  if (type === "email") control.type = "email";
  if (options) for (const [value, display] of options) {
    const option = element("option", tr(display));
    option.value = value;
    control.append(option);
  }
  control.value = read();
  control.addEventListener("input", () => {
    const value = control.value;
    const valid = (type !== "link" || Portfolio.validLink(value.trim())) &&
      (type !== "email" || (!control.validity.typeMismatch && !/[?#&%]/.test(value)));
    control.setCustomValidity(valid ? "" : type === "email" ? tr("اكتب عنوان بريد إلكتروني صالحًا.") : tr("استخدم رابط HTTPS أو mailto أو tel أو رابط قسم يبدأ بـ #."));
    if (valid) {
      write(type === "link" ? value.trim() : value);
      updatePending();
    }
  });
  wrapper.append(element("span", tr(label)), control);
  return wrapper;
}

function markupFields(container, root, definitions, afterChange = () => {}) {
  const group = element("div", "", "fields");
  for (const descriptor of definitions) {
    const node = nodeAt(root, descriptor.selector);
    if (!node) continue;
    group.append(renderField(descriptor, () => getElementValue(node, descriptor), (value) => {
      setElementValue(node, descriptor, value);
      afterChange(descriptor, node);
    }));
  }
  container.append(group);
  return group;
}

function move(list, index, delta) {
  const target = list[index + delta];
  if (!target) return;
  if (delta < 0) target.before(list[index]);
  else target.after(list[index]);
}

function renderMarkupCollection(root, config) {
  const parent = root.querySelector(config.container);
  const isRole = config.container === ".experience-timeline";
  const heading = (record) => nodeAt(record, config.summary)?.textContent.trim() || tr(isRole ? "دور مهني جديد" : "عنصر جديد");
  const getItems = () => [...parent.querySelectorAll(config.item)];
  function updateCounters() {
    if (config.counter) [...parent.querySelectorAll(config.counter)].forEach((counter, index) => {
      counter.textContent = String(index + 1).padStart(2, "0");
    });
  }
  return renderCardCollection({
    title: tr(config.title),
    addLabel: tr(isRole ? "＋ إضافة دور مهني" : "＋ إضافة عنصر"),
    backLabel: tr("كل العناصر"),
    deleteLabel: tr("حذف العنصر"),
    emptyText: tr("مفيش عناصر هنا لسه."),
    getItems, heading,
    info: (record) => {
      if (isRole) return { subtitle: record.querySelector(".experience-company")?.textContent.trim(), detail: record.querySelector(".experience-date")?.textContent.trim() };
      const extra = config.fields.map((field) => nodeAt(record, field.selector))
        .find((node) => node && node !== nodeAt(record, config.summary) && node !== record);
      return { subtitle: extra?.textContent.trim() };
    },
    editFields: (record, panel, updateTitle) => markupFields(panel, record, config.fields, updateTitle),
    add: () => {
      const template = document.createElement("template");
      template.innerHTML = config.template;
      const node = template.content.firstElementChild;
      parent.insertBefore(node, config.insertBefore ? parent.querySelector(config.insertBefore) : null);
      updateCounters();
      return node;
    },
    move: (items, index, delta) => { move(items, index, delta); updateCounters(); },
    remove: (record) => { record.remove(); updateCounters(); }
  });
}

const navIcons = {
  hero: "m3 10 9-7 9 7v10H3z M9 20v-6h6v6",
  about: "M4 6h16v12H4z M8 10h8m-8 4h5",
  projects: "M3 7h7l2 2h9v11H3z M3 7V5h7l2 2h7",
  experience: "M3 8h18v12H3z M8 8V4h8v4 M3 13h18m-10 0v2h2v-2",
  certifications: "M5 3h14v16H5z M8 7h8m-8 4h8m-8 4h4",
  expertise: "M4 4h6v6H4z m10 0h6v6h-6z M4 14h6v6H4z m10 0h6v6h-6z",
  contact: "M3 5h18v14H3z M3 6l9 7 9-7",
  custom: "M4 5h16v14H4z M8 9h8m-8 4h8"
};

function navigationIcon(kind) {
  const namespace = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(namespace, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.5");
  svg.setAttribute("stroke-linejoin", "round");
  const path = document.createElementNS(namespace, "path");
  path.setAttribute("d", navIcons[kind]);
  svg.append(path);
  return svg;
}

function renderSidebar() {
  const list = $("#sections");
  list.replaceChildren();
  for (const section of sections()) {
    const id = section.id || "hero";
    const tab = button(nameOf(section), () => selectSection(id), "section-button");
    tab.prepend(navigationIcon(kindOf(section)));
    if (session.current === id) tab.setAttribute("aria-current", "true");
    list.append(tab);
  }
  $("#site-settings").setAttribute("aria-current", String(session.current === "settings"));
}

function navOptions(section, title) {
  const nav = session.doc.getElementById("primary-nav");
  const old = Array.from(nav.querySelectorAll("a")).find((link) => link.getAttribute("href") === "#" + section.id);
  const enabled = element("input");
  enabled.type = "checkbox";
  enabled.setAttribute("role", "switch");
  enabled.checked = section.dataset.nav !== "false" && (section.dataset.nav === "true" || Boolean(old));
  const nameField = renderField(field("nav", tr("اسم القسم في قائمة التنقل")), () => section.dataset.navLabel || old?.textContent || (kindOf(section) === "hero" ? "Home" : nameOf(section)), (value) => {
    section.dataset.navLabel = value.trim();
    renderSidebar();
  });
  nameField.hidden = !enabled.checked;
  enabled.addEventListener("change", () => {
    if (enabled.checked && !section.id) section.id = "hero";
    section.dataset.nav = String(enabled.checked);
    nameField.hidden = !enabled.checked;
    updatePending();
  });
  const label = element("label", "", "visibility-toggle");
  label.append(enabled, element("span", "", "switch-track"), element("span", tr("إظهار في قائمة التنقل")));
  title.append(label);
  return nameField;
}

function renderSettings() {
  const header = element("div", "", "editor-head");
  header.append(element("h2", tr("إعدادات الموقع")), saveButton());
  editor.append(header);
  const order = element("div", "", "section-order");
  const orderItems = element("div", "", "section-order-items");
  const list = sections();
  order.append(element("h3", tr("ترتيب الأقسام وقائمة التنقل")), orderItems);
  list.forEach((section, index) => {
    const row = element("div", "", "section-order-row");
    const label = element("strong", nameOf(section));
    const top = element("div", "", "collection-head");
    const actions = element("div", "", "tools");
    const shift = (delta) => {
      if (!validInputs()) return;
      move(list, index, delta);
      render();
      $("#section-order-" + (index + delta) + (delta < 0 ? "-up" : "-down"))?.focus();
    };
    const up = button(tr("↑ لأعلى"), () => shift(-1), "quiet", index === 0);
    const down = button(tr("↓ لأسفل"), () => shift(1), "quiet", index === list.length - 1);
    up.id = "section-order-" + index + "-up";
    down.id = "section-order-" + index + "-down";
    actions.append(up, down);
    top.append(label, actions);
    row.append(top, navOptions(section, top));
    orderItems.append(row);
  });
  editor.append(order);
  const doc = session.doc;
  markupFields(editor, doc, [
    markup("title", tr("عنوان تبويب المتصفح")), markup('meta[name="description"]', tr("وصف الموقع في نتائج البحث"), "long", "content"),
    markup('meta[property="og:title"]', tr("عنوان المشاركة"), "text", "content"),
    markup('meta[property="og:description"]', tr("وصف المشاركة"), "long", "content"),
    markup(".site-header .brand strong", tr("الاسم في رأس الموقع")),
    markup(".site-header .brand small", tr("المسمى في رأس الموقع")),
    link('.nav-social a[aria-label="LinkedIn"]', tr("رابط LinkedIn أعلى الموقع")),
    link('.nav-social a[aria-label="WhatsApp"]', tr("رابط WhatsApp أعلى الموقع")),
    link('.nav-social a[aria-label="Email"]', tr("البريد أعلى الموقع"))
  ]);
  const footer = doc.querySelector(".site-footer p");
  const last = footer?.lastChild;
  const group = element("div", "", "fields");
  if (last?.nodeType === Node.TEXT_NODE) {
    group.append(renderField(field("footer", tr("نص الحقوق في التذييل")), () => last.textContent.trim(), (value) => { last.textContent = " " + value; }));
  }
  editor.append(group);
}

function render() {
  renderSidebar();
  editor.replaceChildren();
  if (session.current === "settings") {
    renderSettings();
    updatePending();
    return;
  }
  const list = sections();
  const index = list.findIndex((section) => (section.id || "hero") === session.current);
  if (index < 0) {
    editor.append(element("p", tr("أضف قسمًا للبدء أو افتح إعدادات الموقع.")));
    return;
  }
  const section = list[index];
  const kind = kindOf(section);
  const header = element("div", "", "editor-head");
  header.append(element("h2", nameOf(section)));
  const tools = element("div", "", "tools section-fields");
  tools.append(saveButton());
  tools.append(button(tr("حذف القسم"), async () => {
    if (!readyToLeave()) return;
    const detail = kind === "projects" || kind === "certifications"
      ? tr("هيختفي القسم من الصفحة عند النشر، وتفضل عناصره محفوظة لو أضفته مرة تانية.")
      : tr("القسم ومحتواه الحالي هيتشالوا من الصفحة عند النشر.");
    if (await ask(tr("حذف قسم ") + nameOf(section), detail, tr("حذف القسم"))) {
      section.remove();
      selectSection("settings", true);
    }
  }, "danger quiet"));
  header.append(tools);
  editor.append(header);
  const group = markupFields(editor, section, sectionFields[kind], () => {
    if (kind === "custom" && !section.dataset.navLabel) renderSidebar();
  });
  group.classList.add("section-fields");
  for (const collection of collections[kind] || []) editor.append(renderMarkupCollection(section, collection));
  if (recordFields[kind]) editor.append(renderContentRecords(kind));
  updatePending();
}

function parsePage(source) {
  const doc = new DOMParser().parseFromString(source, "text/html");
  if (!doc.getElementById("main-content") || !doc.getElementById("primary-nav")) throw new Error(tr("تعذر التعرف على أقسام الموقع."));
  return doc;
}

async function addSection() {
  if (!readyToLeave()) return;
  const present = new Set(sections().map(kindOf));
  const select = element("select");
  select.setAttribute("aria-label", tr("نوع القسم"));
  const choices = [["custom", tr("قسم جديد (عنوان، نص، صورة ورابط)")], ...Object.entries(Portfolio.sectionNames).filter(([kind]) => !present.has(kind))];
  for (const [kind, label] of choices) {
    const option = element("option", tr(label));
    option.value = kind;
    select.append(option);
  }
  if (!await ask(tr("إضافة قسم"), select, tr("إضافة"))) return;
  const kind = select.value;
  let section;
  if (kind === "custom") {
    const template = document.createElement("template");
    template.innerHTML = '<section class="section section-light managed-section" data-nav="true"><div class="container section-copy reveal"><h2>New section</h2><p class="custom-body"></p><img class="custom-image" alt="" loading="lazy" hidden><a class="text-link custom-link" hidden>Learn more</a></div></section>';
    section = template.content.firstElementChild;
    section.id = "section-" + crypto.randomUUID().slice(0, 8);
  } else {
    if (!session.baseline) {
      const original = await Portfolio.readFile(session.token, Portfolio.paths.page, Portfolio.baseline);
      session.baseline = parsePage(original.content);
    }
    section = session.doc.importNode(sections(session.baseline).find((candidate) => kindOf(candidate) === kind), true);
    if (kind === "contact") section.querySelector("form").dataset.recipient = "M.Ahmed1518@Outlook.com";
    if (kind !== "hero") {
      const originalLink = Array.from(session.baseline.querySelectorAll("#primary-nav a")).find((a) => a.getAttribute("href") === "#" + kind);
      if (originalLink) {
        section.dataset.nav = "true";
        section.dataset.navLabel = originalLink.textContent;
      }
    }
  }
  session.doc.getElementById("main-content").append(section);
  selectSection(section.id || "hero", true);
  updatePending();
}

function configureSignIn() {
  const linked = Boolean(DashboardVault.read());
  for (const selector of ["#token", "#token-label", "#confirm-password", "#confirm-label", "#setup-intro", "#setup-hint", "#create-token"]) {
    $(selector).hidden = linked;
  }
  $("#unlock-intro").hidden = !linked;
  $("#reset-vault").hidden = !linked;
  $("#token").required = !linked;
  $("#confirm-password").required = !linked;
  $("#password").minLength = linked ? 1 : 12;
  $("#password").autocomplete = linked ? "current-password" : "new-password";
  $("#signin-title").textContent = linked ? tr("دخول لوحة التحكم") : tr("إعداد الدخول لأول مرة");
  $("#password-label").textContent = linked ? tr("كلمة مرور اللوحة") : tr("كلمة مرور جديدة للوحة");
  $("#connect-button").textContent = linked ? tr("فتح اللوحة") : tr("حفظ الربط وفتح اللوحة");
}

async function connect(event) {
  event.preventDefault();
  const input = $("#token");
  const password = $("#password").value;
  const stored = DashboardVault.read();
  if (!stored && !input.value.trim().startsWith("github_pat_")) {
    notify(tr("استخدم Fine-grained personal access token من GitHub."), true);
    return;
  }
  if (!stored && (password.trim().length < 12 || password !== $("#confirm-password").value)) {
    notify(tr("اكتب كلمة مرور من ١٢ حرفًا على الأقل وتأكد إن خانة التأكيد مطابقة."), true);
    return;
  }
  $("#connect-button").disabled = true;
  $("#reset-vault").disabled = true;
  try {
    const token = stored ? await DashboardVault.unlock(password, stored) : input.value.trim();
    notify(tr("بنجلب أحدث محتوى من GitHub…"));
    const user = await Portfolio.request(token, "/user");
    if (user.login.toLowerCase() !== Portfolio.repository.split("/")[0].toLowerCase()) {
      throw new Error(tr("استخدم حساب GitHub المالك للبورتفوليو."));
    }
    const { object: { sha } } = await Portfolio.readHead(token);
    const entries = await Promise.all(Object.entries(Portfolio.paths).map(async ([kind, path]) => {
      const result = await Portfolio.readFile(token, path, sha);
      return [kind, result.content];
    }));
    const files = Object.fromEntries(entries);
    const doc = parsePage(files.page);
    const records = Object.fromEntries(Object.keys(recordFields).map((kind) => [kind, Portfolio.parseRecords(kind, files[kind])]));
    const source = { pageDOM: doc.documentElement.outerHTML };
    for (const kind of Object.keys(recordFields)) source[kind] = Portfolio.writeRecords(kind, records[kind]);
    if (!stored) {
      try {
        await DashboardVault.save(token, password);
      } catch {
        throw new Error(tr("المتصفح ما قدرش يحفظ الربط المشفّر. افتح اللوحة في نافذة عادية عبر HTTPS واسمح بتخزين بيانات الموقع."));
      }
    }
    Object.assign(session, { token, head: sha, doc, records, source, saved: source });
    $("#connect").reset();
    $("#signin").hidden = true;
    $("#workspace").hidden = false;
    $("#disconnect").hidden = false;
    $("#publish").hidden = false;
    selectSection(sections()[0]?.id || (sections().length ? "hero" : "settings"), true);
    updatePending();
    notify();
  } catch (error) {
    notify(error.status === 401 ? tr("GitHub رفض الرمز. لو انتهت صلاحيته، أعد إعداد الدخول برمز جديد.") : error.message, true);
  } finally {
    $("#connect-button").disabled = false;
    $("#reset-vault").disabled = false;
  }
}

function releaseUploads() {
  for (const upload of session.uploads.values()) URL.revokeObjectURL(upload.url);
  session.uploads.clear();
}

function checkRecords() {
  for (const kind of Object.keys(recordFields)) {
    if (Portfolio.writeRecords(kind, session.records[kind]) === session.source[kind]) continue;
    const incomplete = session.records[kind].find((record) => !record.title?.trim() ||
      (kind === "certifications" && (!record.fullTitle?.trim() || !record.issuer?.trim() || !record.year?.trim() || !record.image || !record.logo)));
    if (incomplete) throw new Error(kind === "projects"
      ? tr("اكتب اسمًا لكل مشروع قبل النشر.")
      : tr("اكمل اسم الشهادة والجهة والسنة وصورة الشهادة والشعار قبل النشر."));
  }
}

async function publish() {
  if (session.busy || !validInputs() || hasUnsavedChanges()) return;
  const changes = pendingChanges(session.saved);
  if (!changes.length) return;
  try {
    checkRecords();
    if (!await ask(tr("نشر التعديلات"), tr("التعديلات هتتسجل على GitHub وتظهر على موقع البورتفوليو بعد تحديث GitHub Pages."), tr("نشر التعديلات"))) return;
    session.busy = true;
    editor.inert = true;
    $(".sidebar").inert = true;
    $("#disconnect").disabled = true;
    updatePending();
    notify(tr("جاري حفظ الملفات على GitHub…"));
    const uploads = Array.from(session.uploads.values()).filter((upload) => changes.some(({ content }) => content.includes(upload.path)));
    const sha = await Portfolio.publish(session.token, session.head, changes, uploads);
    session.head = sha;
    const page = changes.find(({ path }) => path === Portfolio.paths.page);
    if (page) session.doc = parsePage(page.content);
    session.source = workingSnapshot();
    session.saved = session.source;
    releaseUploads();
    render();
    notify(tr("تم حفظ التعديلات على GitHub (") + sha.slice(0, 7) + tr("). ظهورها على الموقع يعتمد على اكتمال تحديث GitHub Pages."));
  } catch (error) {
    notify(error.message, true);
  } finally {
    session.busy = false;
    editor.inert = false;
    $(".sidebar").inert = false;
    $("#disconnect").disabled = false;
    updatePending();
  }
}

$("#connect").addEventListener("submit", connect);
for (const toggle of document.querySelectorAll("[data-language]")) {
  toggle.addEventListener("click", () => {
    if (session.doc && !validInputs()) return;
    setLanguage(language === "ar" ? "en" : "ar");
    notify();
    renderLanguage();
  });
}
renderLanguage();
$("#reset-vault").addEventListener("click", async () => {
  if (!await ask(tr("إعادة إعداد الدخول"), tr("هيتم مسح رمز GitHub المشفّر من المتصفح ده. هتحتاج تدخل الرمز وتختار كلمة مرور مرة تانية."), tr("مسح الربط من المتصفح"))) return;
  try {
    DashboardVault.clear();
    $("#connect").reset();
    configureSignIn();
    notify();
    $("#token").focus();
  } catch {
    notify(tr("المتصفح ما قدرش يمسح بيانات الربط."), true);
  }
});
$("#publish").addEventListener("click", publish);
$("#add-section").addEventListener("click", () => addSection().catch((error) => notify(error.message, true)));
$("#site-settings").addEventListener("click", () => selectSection("settings"));
$("#disconnect").addEventListener("click", async () => {
  if (pendingChanges().length && !await ask(tr("الخروج من اللوحة"), tr("عندك تعديلات غير منشورة. هتتفقد بعد الخروج."), tr("خروج"))) return;
  releaseUploads();
  Object.assign(session, { token: "", head: "", doc: null, source: null, saved: null, records: {}, current: "", activeItem: null });
  editor.replaceChildren();
  $("#sections").replaceChildren();
  $("#workspace").hidden = true;
  $("#signin").hidden = false;
  $("#publish").hidden = true;
  $("#disconnect").hidden = true;
  notify();
  configureSignIn();
  $(DashboardVault.read() ? "#password" : "#token").focus();
});

window.addEventListener("beforeunload", (event) => {
  if (session.doc && pendingChanges().length) event.preventDefault();
});

function projectImages(project) {
  return project.images?.length ? project.images : project.image ? [project.image] : [];
}

function renderItemCard({ title, subtitle, detail, photo, icon, badge }, edit) {
  const card = element("article", "", "project-card");
  if (icon) {
    const cover = element("div", "", "project-cover" + (icon === "certifications" ? " certificate-cover" : ""));
    cover.append(navigationIcon(icon));
    const src = photo && assetUrl(typeof photo === "string" ? photo : photo.src);
    if (src) {
      const image = element("img");
      image.alt = "";
      image.loading = "lazy";
      image.src = src;
      image.addEventListener("error", () => image.remove(), { once: true });
      cover.append(image);
    }
    if (badge) cover.append(element("span", badge.label, "project-status " + badge.status));
    card.append(cover);
  }
  const body = element("div", "", "project-card-body");
  const heading = element("h4", title);
  heading.dir = "auto";
  body.append(heading);
  if (subtitle) {
    const label = element("p", subtitle);
    label.dir = "auto";
    body.append(label);
  }
  const actions = element("div", "", "project-card-actions");
  actions.append(element("small", detail || ""));
  const editButton = button(tr("تعديل"), edit, "quiet");
  editButton.setAttribute("aria-label", tr("تعديل ") + title);
  actions.append(editButton);
  body.append(actions);
  card.append(body);
  return card;
}

function renderRecordFields(kind, record, parent, onChange) {
  const group = element("div", "", "fields");
  for (const descriptor of recordFields[kind]) {
    const { key, type } = descriptor;
    group.append(renderField(descriptor, () => {
      if (type === "gallery") return projectImages(record);
      if (type === "lines") return (record[key] || []).join("\n");
      return record[key] || "";
    }, (value) => {
      if (type === "gallery") delete record.image;
      record[key] = type === "lines" ? value.split("\n").map((line) => line.trim()).filter(Boolean) : value;
      onChange(key);
    }));
  }
  parent.append(group);
}

function renderContentRecords(kind) {
  const projects = kind === "projects";
  const list = session.records[kind];
  const heading = (record) => record.title || tr(projects ? "مشروع جديد" : "شهادة جديدة");
  return renderCardCollection({
    title: tr(Portfolio.sectionNames[kind]),
    addLabel: tr(projects ? "＋ إضافة مشروع" : "＋ إضافة شهادة"),
    backLabel: tr(projects ? "عرض كل المشاريع" : "عرض كل الشهادات"),
    deleteLabel: tr(projects ? "حذف المشروع" : "حذف الشهادة"),
    emptyText: tr(projects ? "أضف مشروعًا عشان يظهر هنا." : "أضف شهادة عشان تظهر هنا."),
    getItems: () => list,
    heading,
    info: (record) => {
      if (!projects) return { icon: "certifications", photo: record.image || record.logo, subtitle: record.issuer || record.fullTitle, detail: record.year };
      const label = { completed: tr("مكتمل"), "in-progress": tr("جاري") }[record.status];
      return {
        icon: "projects", photo: projectImages(record)[0], subtitle: record.location,
        detail: tr(record.category === "site" ? "مهندس موقع" : "مدير مشاريع"),
        badge: label && { label, status: record.status }
      };
    },
    editFields: (record, panel, updateTitle) => renderRecordFields(kind, record, panel, updateTitle),
    add: () => {
      const id = crypto.randomUUID();
      const record = projects
        ? { id, title: "", role: "", location: "", category: "pm", status: "", subtitle: "", systems: [], images: [], scope: "", responsibilities: "" }
        : { id, title: "", fullTitle: "", issuer: "", year: "", logo: "", image: "" };
      list.unshift(record);
      return record;
    },
    move: (items, index, delta) => { [items[index + delta], items[index]] = [items[index], items[index + delta]]; },
    remove: (record) => { list.splice(list.indexOf(record), 1); }
  });
}

function renderCardCollection(config) {
  const items = config.getItems();
  const activeIndex = items.indexOf(session.activeItem);
  const block = element("div", "", "collection");
  const header = element("div", "", "collection-head");
  const title = element("h3");
  title.append(config.title, element("span", String(items.length), "count-badge"));
  header.append(title, button(config.addLabel, () => {
    if (readyToLeave()) open(config.add(), true);
  }, "collection-add"));
  block.append(header);

  function open(record, focusEditor = false) {
    session.activeItem = record;
    render();
    if (focusEditor) editor.querySelector(".project-edit-title")?.focus();
  }

  if (activeIndex >= 0) {
    const record = items[activeIndex];
    const panel = element("section", "", "project-edit");
    const row = element("div", "", "collection-head");
    const heading = element("h4", config.heading(record), "project-edit-title");
    heading.tabIndex = -1;
    heading.dir = "auto";
    row.append(heading, button(config.backLabel, () => { if (readyToLeave()) open(null); }, "quiet"));
    panel.append(row);
    config.editFields(record, panel, () => { heading.textContent = config.heading(record); });

    const actions = element("div", "", "tools");
    actions.append(saveButton());
    const shift = (delta) => {
      if (!validInputs()) return;
      config.move(items, activeIndex, delta);
      open(record, true);
    };
    actions.append(button(tr("↑ لأعلى"), () => shift(-1), "quiet", activeIndex === 0));
    actions.append(button(tr("↓ لأسفل"), () => shift(1), "quiet", activeIndex === items.length - 1));
    actions.append(button(config.deleteLabel, async () => {
      if (await ask(config.deleteLabel, config.heading(record), tr("حذف"))) {
        config.remove(record);
        open(null);
      }
    }, "danger quiet"));
    panel.append(actions);
    block.append(panel);
  } else if (items.length) {
    const grid = element("div", "", "project-grid");
    grid.append(...items.map((record) => renderItemCard({ title: config.heading(record), ...config.info(record) }, () => {
      if (readyToLeave()) open(record, true);
    })));
    block.append(grid);
  } else {
    block.append(element("p", config.emptyText, "empty-projects"));
  }
  return block;
}
