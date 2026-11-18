"use strict";

const Portfolio = (() => {
  const repository = "MAhmoud2527/My-Portfolio";
  const branch = "master";
  const baseline = "ac7b5ef9e99121fa984f11e322f68af094081bcf";
  const paths = {
    page: "index.html",
    projects: "assets/js/projects.js",
    certifications: "assets/js/certifications.js"
  };
  const globals = {
    projects: "PORTFOLIO_PROJECTS",
    certifications: "PORTFOLIO_CERTIFICATIONS"
  };
  const sectionNames = {
    hero: "الرئيسية", about: "نبذة عني", projects: "المشاريع", experience: "الخبرة المهنية",
    certifications: "الشهادات", expertise: "المهارات", contact: "التواصل"
  };
  const files = { image: "image/jpeg,image/png,image/webp,image/gif", pdf: "application/pdf" };

  function parseRecords(kind, source) {
    const prefix = "window." + globals[kind] + " = ";
    const text = source.trim();
    if (!text.startsWith(prefix) || !text.endsWith(";")) throw new Error(tr("صيغة الملف غير متوقعة: ") + paths[kind]);
    const raw = text.slice(prefix.length, -1);
    // The original data files use unquoted keys, comments and trailing commas.
    // Match quoted strings first so their contents are preserved verbatim.
    const json = raw.replace(/"(?:\\.|[^"\\])*"|\/\/[^\r\n]*|[a-zA-Z_]\w*(?=\s*:)|,(?=\s*[}\]])/g, (token) => {
      if (token.startsWith('"')) return token;
      if (token.startsWith("//") || token === ",") return "";
      return JSON.stringify(token);
    });
    const records = JSON.parse(json);
    if (!Array.isArray(records) || records.some((record) => !record || typeof record.id !== "string")) {
      throw new Error(tr("بيانات غير صالحة: ") + paths[kind]);
    }
    return records;
  }

  function writeRecords(kind, records) {
    return "window." + globals[kind] + " = " + JSON.stringify(records, null, 2) + ";\n";
  }

  async function request(token, path, options = {}) {
    const response = await fetch("https://api.github.com" + path, {
      method: options.method || "GET",
      headers: { Accept: "application/vnd.github+json", Authorization: "Bearer " + token, "X-GitHub-Api-Version": "2022-11-28", ...(options.body ? { "Content-Type": "application/json" } : {}) },
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: "no-store",
      redirect: "error"
    });
    const data = await response.json();
    if (!response.ok) {
      const error = new Error("GitHub (" + response.status + ") · " + (data.message || tr("تعذر إتمام الطلب")));
      error.status = response.status;
      throw error;
    }
    return data;
  }

  function repoRequest(token, endpoint, options) {
    return request(token, "/repos/" + repository + endpoint, options);
  }

  async function readFile(token, path, ref) {
    const result = await repoRequest(token, "/contents/" + path + "?ref=" + encodeURIComponent(ref));
    if (result.encoding !== "base64") throw new Error(tr("تعذر قراءة ") + path);
    const bytes = Uint8Array.from(atob(result.content), (char) => char.charCodeAt(0));
    return { content: new TextDecoder("utf-8", { fatal: true }).decode(bytes), sha: result.sha };
  }

  function readHead(token) {
    return repoRequest(token, "/git/ref/heads/" + branch);
  }

  async function encodeFile(file) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    let binary = "";
    for (let offset = 0; offset < bytes.length; offset += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
    }
    return btoa(binary);
  }

  async function publish(token, snapshot, changes, uploads) {
    const ref = await readHead(token);
    const parent = ref.object.sha;
    if (parent !== snapshot) {
      const conflict = new Error(tr("اتغيّرت نسخة GitHub أثناء التعديل. راجع النسخة الجديدة قبل محاولة النشر مرة تانية."));
      conflict.status = 409;
      throw conflict;
    }
    const parentCommit = await repoRequest(token, "/git/commits/" + parent);
    const tree = changes.map(({ path, content }) => ({ path, mode: "100644", type: "blob", content }));
    for (const { path, file } of uploads) {
      const blob = await repoRequest(token, "/git/blobs", { method: "POST", body: { content: await encodeFile(file), encoding: "base64" } });
      tree.push({ path, mode: "100644", type: "blob", sha: blob.sha });
    }
    const nextTree = await repoRequest(token, "/git/trees", { method: "POST", body: { base_tree: parentCommit.tree.sha, tree } });
    const commit = await repoRequest(token, "/git/commits", { method: "POST", body: { message: "Update portfolio content from dashboard", tree: nextTree.sha, parents: [parent] } });
    try {
      await repoRequest(token, "/git/refs/heads/" + branch, { method: "PATCH", body: { sha: commit.sha, force: false } });
    } catch (error) {
      const actual = await readHead(token).catch(() => null);
      if (actual?.object.sha !== commit.sha) throw error;
    }
    return commit.sha;
  }

  function validLink(value, kind) {
    if (!value || /^#[a-z][\w-]*$/i.test(value)) return true;
    if (kind === "image" || kind === "pdf") return /^assets\/(?!.*(?:\.\.|[?#\\]))[^<>\r\n]+$/u.test(value);
    if (/^mailto:[^\s?]+@[^\s?]+$/i.test(value) || /^tel:\+?[0-9 ()-]+$/i.test(value)) return true;
    try {
      const url = new URL(value);
      return url.protocol === "https:" && !url.username && !url.password;
    } catch {
      return false;
    }
  }

  return { repository, baseline, paths, sectionNames, files, parseRecords, writeRecords, request, repoRequest, readFile, readHead, publish, validLink };
})();
