"use strict";

const SiteLanguage = (() => {
  const root = document.documentElement;
  const url = new URL(location.href);
  const switcherEnabled = root.dataset.languageSwitcher !== "false";
  const themePreview = url.searchParams.has("preview-theme");
  const preferenceKey = "mahmoud-portfolio-visitor-language";
  function savedLanguage() {
    try { return localStorage.getItem(preferenceKey); } catch { return null; }
  }
  const defaultLanguage = root.dataset.siteLanguage === "ar" ? "ar" : "en";
  const requestedLanguage = switcherEnabled || themePreview ? url.searchParams.get("lang") : null;
  const language = [requestedLanguage, switcherEnabled ? savedLanguage() : null, defaultLanguage].find((choice) => choice === "ar" || choice === "en");
  const labels = {
  "Private Palace - Makkah": "قصر خاص – مكة المكرمة",
  "General Food Security Authority": "الهيئة العامة للأمن الغذائي",
  "Arcon Offices": "مكاتب أركون",
  "U Walk Riyadh Project": "مشروع يو ووك الرياض",
  "Al-Subaie Office – Central IPTV & CCTV Integration": "مكتب السبيعي – تكامل أنظمة IPTV والمراقبة",
  "Parcel 309 - 11th Floor": "القطعة 309 – الدور 11",
  "Mahd Sports Academy - IPTV Headend System": "أكاديمية مهد الرياضية – محطة توزيع IPTV",
  "Football Park - U Walk Mall Jeddah": "فوتبول بارك – يو ووك مول جدة",
  "Parcel 309 - 12th & 13th Floors": "القطعة 309 – الدوران 12 و13",
  "ARGAN Tower Project": "مشروع برج أركان",
  "MWV - Villa (Sharqi)": "مشروع MWV – فيلا الشرقي",
  "Fahad & Salman Al-Subaie Villas": "فلل فهد وسلمان السبيعي",
  "Saleh Al-Saawi Hotel (Snood)": "فندق صالح الصعوي (سنود)",
  "Mawakib Al-Kawthar Hotel": "فندق مواكب الكوثر",
  "Namira Mosque Rest House": "استراحة مسجد نمرة",
  "Muzdalifah Rest House": "استراحة مزدلفة",
  "Mina Pilgrims Camp": "مخيم الحجاج بمنى",
  "Al-Awali Villas": "فلل العوالي",
  "Bandar Al-Humaidah Private Villa": "فيلا بندر الحميدة الخاصة",
  "Al-Jouf, Tabuk & Khamis Mushait, Saudi Arabia": "الجوف وتبوك وخميس مشيط، السعودية",
  "Riyadh, Saudi Arabia": "الرياض، السعودية",
  "KAFD, Riyadh, Saudi Arabia": "مركز الملك عبدالله المالي، الرياض، السعودية",
  "Jeddah, Saudi Arabia": "جدة، السعودية",
  "Al-Shisha, Makkah, Saudi Arabia": "الشيشة، مكة المكرمة، السعودية",
  "Al-Aziziyah, Makkah, Saudi Arabia": "العزيزية، مكة المكرمة، السعودية",
  "Arafat, Makkah, Saudi Arabia": "عرفات، مكة المكرمة، السعودية",
  "Muzdalifah, Makkah, Saudi Arabia": "مزدلفة، مكة المكرمة، السعودية",
  "Mina, Makkah, Saudi Arabia": "منى، مكة المكرمة، السعودية",
  "Al-Awali, Makkah, Saudi Arabia": "العوالي، مكة المكرمة، السعودية",
  "Project Manager - ELV & ICT Systems": "مدير مشاريع أنظمة ELV وICT",
  "Project Manager - ELV Systems": "مدير مشاريع أنظمة التيار الخفيف",
  "Project Manager - ELV & Fire Systems": "مدير مشاريع أنظمة التيار الخفيف والحريق",
  "Site Engineer - ELV Systems": "مهندس موقع لأنظمة التيار الخفيف",
  "MA logo": "شعار محمود أحمد",
  "Portrait of Mahmoud Ahmed": "صورة محمود أحمد",
  "Project photo": "صورة المشروع",
  "View project image": "عرض صورة المشروع",
  "Portfolio inquiry": "استفسار عن البورتفوليو",
  "Skip to content": "تخطَّ إلى المحتوى",
  "Mahmoud Ahmed": "محمود أحمد",
  "Mahmoud Ahmed home": "الصفحة الرئيسية لمحمود أحمد",
  "Home": "الرئيسية",
  "Open navigation": "فتح قائمة التنقل",
  "Primary navigation": "القائمة الرئيسية",
  "About": "نبذة عني",
  "Projects": "المشاريع",
  "Experience": "الخبرة",
  "Certifications": "الشهادات",
  "Expertise": "الخبرات",
  "Contact": "التواصل",
  "PMP-Certified Project Manager": "مدير مشاريع معتمد بشهادة PMP",
  "Hello, I am": "أهلًا، أنا",
  "Project Manager": "مدير مشاريع",
  "Project Manager - ELV & ICT": "مدير مشاريع أنظمة التيار الخفيف وتقنية المعلومات والاتصالات",
  "Project Manager | PMP® | ELV & ICT": "مدير مشاريع · PMP® · أنظمة التيار الخفيف وتقنية المعلومات والاتصالات",
  "Delivering ELV and ICT projects with a focus on planning, coordination, technical quality, commissioning, and successful handover.": "إدارة تنفيذ مشاريع التيار الخفيف وتقنية المعلومات والاتصالات، من التخطيط والتنسيق إلى ضبط الجودة والتشغيل والتسليم.",
  "Download CV": "تحميل السيرة الذاتية",
  "View Projects": "عرض المشاريع",
  "Makkah, Saudi Arabia": "مكة المكرمة، السعودية",
  "Chat on WhatsApp": "تواصل عبر واتساب",
  "Scroll down": "مرّر للأسفل",
  "Scroll to About section": "الانتقال إلى قسم نبذة عني",
  "About Me": "نبذة عني",
  "Focused on delivering reliable ELV projects": "تنفيذ مشاريع تيار خفيف يُعتمد عليها",
  "I am a PMP®-certified Project Manager with progressive experience delivering ELV, low-current, and networking projects across hospitality, commercial, residential, and Hajj-related environments in Saudi Arabia.": "مدير مشاريع معتمد بشهادة PMP®، بخبرة في تنفيذ مشاريع التيار الخفيف والشبكات في قطاعات الضيافة والتجارة والإسكان ومشاريع الحج في السعودية.",
  "My background combines project coordination, site execution, testing and commissioning, stakeholder communication, and hands-on technical knowledge of ICT and ELV systems.": "أجمع بين تنسيق المشاريع وتنفيذ الأعمال في الموقع والاختبار والتشغيل والتواصل مع أصحاب المصلحة، مع خبرة فنية عملية في أنظمة التيار الخفيف وتقنية المعلومات والاتصالات.",
  "View LinkedIn profile": "عرض حساب لينكدإن",
  "Years in ELV Project Delivery": "سنوات في تنفيذ مشاريع التيار الخفيف",
  "Selected Projects": "مشاريع مختارة",
  "ELV & ICT Systems": "أنظمة ELV وICT",
  "Major Saudi Cities": "مدن سعودية رئيسية",
  "Selected ELV & ICT Projects": "مشاريع مختارة في ELV وICT",
  "Project portfolio": "معرض المشاريع",
  "Project categories": "تصنيفات المشاريع",
  "All": "الكل",
  "Site Engineer": "مهندس موقع",
  "View All Projects": "عرض كل المشاريع",
  "Show Fewer Projects": "عرض مشاريع أقل",
  "Project Manager Projects": "مشاريع إدارة المشاريع",
  "Site Engineer Projects": "مشاريع الإشراف الميداني",
  "View project": "عرض المشروع",
  "View certificate": "عرض الشهادة",
  "Completed": "مكتمل",
  "In Progress": "قيد التنفيذ",
  "Career": "المسيرة المهنية",
  "Professional experience": "الخبرة المهنية",
  "From hands-on site execution to leading ELV and ICT project delivery in Saudi Arabia.": "من التنفيذ الميداني إلى قيادة مشاريع التيار الخفيف وتقنية المعلومات والاتصالات في السعودية.",
  "Mar 2024": "مارس ٢٠٢٤",
  "Feb 2023": "فبراير ٢٠٢٣",
  "- Present": "– حتى الآن",
  "Current role": "الوظيفة الحالية",
  "Premium Electronics Company": "الإلكترونيات المتميزة الأمنية",
  "/ Makkah, Saudi Arabia": "/ مكة المكرمة، السعودية",
  "Lead ELV and ICT projects from planning through testing, commissioning, and handover, coordinating site teams, schedules, and project priorities.": "قيادة مشاريع ELV وICT من التخطيط إلى الاختبار والتشغيل والتسليم، مع تنسيق فرق الموقع والجداول والأولويات.",
  "Monitor scope, progress, quality, material readiness, and site risks; coordinate with clients, consultants, subcontractors, and suppliers.": "متابعة النطاق والتقدم والجودة وجاهزية المواد ومخاطر الموقع، والتنسيق مع العملاء والاستشاريين والمقاولين والموردين.",
  "Oversee snag closure, client training, acceptance, progress reporting, and handover documentation.": "الإشراف على إغلاق الملاحظات وتدريب العملاء والاستلام وتقارير التقدم ووثائق التسليم.",
  "Site Engineer - ELV & Low Current": "مهندس موقع لأنظمة التيار الخفيف",
  "Supervised daily site activities and technicians, ensuring installation followed approved drawings, specifications, and work sequences.": "الإشراف على الأعمال اليومية والفنيين والتحقق من تنفيذ التركيبات وفق المخططات والمواصفات وتسلسل العمل المعتمد.",
  "Resolved technical and interface issues; followed up quantities, materials, quality inspections, and site progress.": "حل المشكلات الفنية ومشكلات التنسيق، ومتابعة الكميات والمواد وفحوصات الجودة وتقدم التنفيذ.",
  "Supported system testing, commissioning, consultant inspections, and project handover.": "المشاركة في اختبار الأنظمة وتشغيلها وفحوصات الاستشاري وتسليم المشاريع.",
  "Professional Certifications": "الشهادات المهنية",
  "Credentials aligned with my role": "شهادات مرتبطة بتخصصي",
  "View all certifications": "عرض كل الشهادات",
  "Core Expertise": "مجالات الخبرة",
  "What I bring to a project": "خبراتي في تنفيذ المشاريع",
  "Project Management": "إدارة المشاريع",
  "Planning, coordination, progress monitoring, risk awareness, documentation, and handover.": "التخطيط والتنسيق ومتابعة التقدم والمخاطر والتوثيق والتسليم.",
  "ELV Systems": "أنظمة التيار الخفيف",
  "CCTV, access control, fire alarm, PA, IPTV, MATV, BMS, intercom, and PABX.": "المراقبة والتحكم في الدخول وإنذار الحريق والصوتيات وIPTV وMATV وBMS والإنتركم والسنترال.",
  "Networking & Cabling": "الشبكات والكابلات",
  "Data networks, Wi-Fi, structured cabling, racks, termination, labeling, and Fluke testing.": "شبكات البيانات والواي فاي والكابلات الهيكلية والراكات وإنهاء الكابلات وترقيمها واختبارات Fluke.",
  "Testing & Commissioning": "الاختبار والتشغيل",
  "System testing, integration follow-up, snag closure, quality checks, and acceptance support.": "اختبار الأنظمة ومتابعة الربط وإغلاق الملاحظات وفحوصات الجودة ودعم الاستلام.",
  "Team & Stakeholder Coordination": "تنسيق الفرق وأصحاب المصلحة",
  "Site teams, clients, consultants, vendors, subcontractors, and internal departments.": "التنسيق بين فرق الموقع والعملاء والاستشاريين والموردين والمقاولين والأقسام الداخلية.",
  "Let Us Work Together": "خلّينا نشتغل معًا",
  "Available for ELV & ICT project opportunities": "متاح لفرص مشاريع ELV وICT",
  "For project management roles, ELV delivery opportunities, or professional collaboration, contact me through email, phone, LinkedIn, or WhatsApp.": "لفرص إدارة المشاريع أو تنفيذ أنظمة التيار الخفيف أو التعاون المهني، تواصل معي عبر البريد أو الهاتف أو لينكدإن أو واتساب.",
  "Location": "الموقع",
  "Email": "البريد الإلكتروني",
  "Phone": "الهاتف",
  "Name": "الاسم",
  "Subject": "الموضوع",
  "Message": "الرسالة",
  "Send message": "إرسال رسالة",
  "The form opens your email application. No visitor data is stored by this website.": "يفتح النموذج تطبيق البريد الإلكتروني، والموقع لا يخزّن بيانات الزوار.",
  "Back to top ↑": "العودة إلى الأعلى ↑",
  "Mahmoud Ahmed. All rights reserved.": "محمود أحمد. جميع الحقوق محفوظة.",
  "Close project details": "إغلاق تفاصيل المشروع",
  "Previous project image": "الصورة السابقة",
  "Next project image": "الصورة التالية",
  "Project scope": "نطاق المشروع",
  "Key responsibilities": "المسؤوليات الرئيسية",
  "Close certificate preview": "إغلاق معاينة الشهادة",
  "Mahmoud Ahmed | Project Manager - ELV & ICT": "محمود أحمد · مدير مشاريع ELV وICT",
  "Portfolio of Mahmoud Ahmed, PMP-certified Project Manager specializing in ELV and ICT projects in Saudi Arabia.": "بورتفوليو محمود أحمد، مدير مشاريع معتمد بشهادة PMP ومتخصص في مشاريع ELV وICT في السعودية.",
  "Project Management Professional": "محترف إدارة المشاريع",
  "Cisco Certified Network Associate": "مشارك معتمد في شبكات سيسكو",
  "Structured Cabling System LCS³": "نظام الكابلات الهيكلية LCS³",
  "IP Video Surveillance System Certified Associate": "مشارك معتمد في أنظمة المراقبة بالفيديو عبر الشبكة",
  "Data Center Infrastructure": "البنية التحتية لمراكز البيانات",
  "Grey Space in Datacenters Training": "تدريب المساحات الرمادية في مراكز البيانات",
  "EG Products & Reyee SD-WAN Training": "تدريب منتجات EG وتقنية Reyee SD-WAN"
};

  const loader = document.getElementById("site-loader");
  const portrait = document.querySelector(".portrait-shell img");
  const critical = [portrait?.decode ? portrait.decode().catch(() => {}) : Promise.resolve()];
  if (document.fonts?.ready) critical.push(document.fonts.ready);
  Promise.race([
    Promise.allSettled(critical),
    new Promise((resolve) => window.setTimeout(resolve, 2200))
  ]).then(() => window.requestAnimationFrame(() => {
    if (loader) {
      loader.classList.add("is-ready");
      window.setTimeout(() => loader.remove(), 200);
    }
  }));

  function text(value) {
    return language === "ar" && typeof value === "string" ? (Object.hasOwn(labels, value) ? labels[value] : value) : value;
  }

  function localize(record, fields) {
    if (language !== "ar") return record;
    const result = { ...record };
    for (const field of fields) {
      const override = record.ar?.[field];
      if (Array.isArray(record[field])) result[field] = Array.isArray(override) && override.length ? override : record[field].map(text);
      else result[field] = typeof override === "string" && override.trim() ? override : text(record[field]);
    }
    return result;
  }

  function applyAuthoredTranslation(node) {
    const value = node.dataset.arContent;
    const mode = node.dataset.arMode || "text";
    if (mode === "list") {
      node.replaceChildren(...value.split("\n").filter((line) => line.trim()).map((line) => {
        const item = document.createElement("li");
        item.textContent = line;
        return item;
      }));
    } else if (mode === "content") {
      node.setAttribute("content", value);
    } else if (mode === "leading" || mode === "trailing") {
      const edge = mode === "leading" ? node.firstChild : node.lastChild;
      if (edge?.nodeType === Node.TEXT_NODE) edge.textContent = mode === "leading" ? value + " " : " " + value;
      else if (mode === "leading") node.prepend(value + " ");
      else node.append(" " + value);
    } else {
      node.textContent = value;
    }
  }

  root.lang = language;
  root.dir = language === "ar" ? "rtl" : "ltr";
  if (language === "ar") {
    document.querySelectorAll("[data-ar-content]").forEach(applyAuthoredTranslation);
    document.title = text(document.title.trim());
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = text(description.content);
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.parentElement?.closest("script,style,[data-ar-content]")) continue;
      const source = node.textContent.trim().replace(/\s+/g, " ");
      const translated = text(source);
      if (translated !== source) node.textContent = node.textContent.replace(/^\s*([\s\S]*?)\s*$/, (whole, content) => whole.replace(content, translated));
    }
    for (const attr of ["aria-label", "alt"]) {
      document.querySelectorAll("[" + attr + "]").forEach((node) => node.setAttribute(attr, text(node.getAttribute(attr))));
    }
  }
  const cv = document.querySelector(".hero-actions a[download]");
  if (cv) {
    const files = { ar: cv.dataset.cvAr, en: cv.getAttribute("href") };
    const alternate = language === "ar" ? "en" : "ar";
    const fileLanguage = files[language] ? language : alternate;
    const path = files[fileLanguage];
    cv.hidden = !path;
    if (path) {
      cv.setAttribute("href", path);
      if (fileLanguage === "ar") cv.download = "Mahmoud_Ahmed_CV_AR.pdf";
      if (fileLanguage !== language) {
        const note = document.createElement("span");
        note.className = "cv-file-language";
        note.textContent = fileLanguage === "en" ? "(الإنجليزية)" : "(Arabic)";
        cv.append(note);
      }
    }
  }
  const languages = { ar: { flag: "sa", name: "العربية" }, en: { flag: "gb", name: "English" } };
  function languageIcon(code) {
    const flag = document.createElement("img");
    flag.src = "assets/img/flags/" + languages[code].flag + ".svg";
    flag.alt = "";
    flag.width = 20;
    flag.height = 15;
    return flag;
  }
  function addLanguageSwitcher(parent, layout) {
    if (!parent) return;
    const switcher = document.createElement("details");
    switcher.className = "site-language site-language-" + layout;
    const summary = document.createElement("summary");
    summary.append(languageIcon(language), languages[language].name);
    summary.setAttribute("aria-label", language === "ar" ? "اختيار لغة الموقع" : "Choose site language");
    const options = document.createElement("div");
    options.className = "site-language-menu";
    for (const [code, option] of Object.entries(languages)) {
      const link = document.createElement("a");
      const target = new URL(url);
      target.searchParams.set("lang", code);
      link.href = target.href;
      link.lang = code;
      link.hreflang = code;
      link.setAttribute("aria-label", option.name);
      if (code === language) link.setAttribute("aria-current", "true");
      link.append(languageIcon(code), option.name);
      link.addEventListener("click", () => {
        if (themePreview) return;
        try { localStorage.setItem(preferenceKey, code); } catch {}
      });
      options.append(link);
    }
    switcher.append(summary, options);
    document.addEventListener("click", (event) => {
      if (!switcher.contains(event.target)) switcher.open = false;
    });
    switcher.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && switcher.open) {
        switcher.open = false;
        summary.focus();
      }
    });
    parent.append(switcher);
  }
  if (switcherEnabled) {
    addLanguageSwitcher(document.querySelector(".nav-social"), "wide");
    addLanguageSwitcher(document.querySelector("#primary-nav"), "narrow");
  }

  return { language, text, localize };
})();
