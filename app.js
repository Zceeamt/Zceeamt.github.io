/* Renders the home page and project pages from projects.js.
   You shouldn't need to edit this file to add projects. */
(function () {
  "use strict";

  var SITE = window.SITE || {};
  var PROJECTS = window.PROJECTS || [];
  var app = document.getElementById("app");
  var current = null; // "home" or a project id
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- tiny DOM helper ---------- */
  function el(tag, attrs) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var value = attrs[key];
        if (value === null || value === undefined || value === false) return;
        if (key === "class") node.className = value;
        else if (key === "text") node.textContent = value;
        else if (key.indexOf("on") === 0) node.addEventListener(key.slice(2), value);
        else node.setAttribute(key, value === true ? "" : value);
      });
    }
    for (var i = 2; i < arguments.length; i++) append(node, arguments[i]);
    return node;
  }
  function append(node, child) {
    if (child === null || child === undefined || child === false || child === "") return;
    if (Array.isArray(child)) { child.forEach(function (c) { append(node, c); }); return; }
    node.append(child.nodeType ? child : document.createTextNode(String(child)));
  }
  function fill(node) {
    node.replaceChildren();
    for (var i = 1; i < arguments.length; i++) append(node, arguments[i]);
  }
  function has(list) { return Array.isArray(list) && list.length > 0; }
  function chunk(list, size) {
    var out = [];
    for (var i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
    return out;
  }
  function arrowLeft() {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("width", "16"); svg.setAttribute("height", "16");
    svg.setAttribute("viewBox", "0 0 16 16"); svg.setAttribute("aria-hidden", "true");
    var path = document.createElementNS(ns, "path");
    path.setAttribute("d", "M13 8H3m4.5-4.5L3 8l4.5 4.5");
    path.setAttribute("stroke", "currentColor"); path.setAttribute("stroke-width", "1.6");
    path.setAttribute("stroke-linecap", "round"); path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("fill", "none");
    svg.append(path);
    return svg;
  }

  // A retro OS window: navy title bar with a filename, then the body.
  function win(title, cls, body, tag, attrs) {
    attrs = attrs || {};
    attrs.class = "win" + (cls ? " " + cls : "");
    return el(tag || "div", attrs,
      el("div", { class: "win-bar" },
        el("span", { class: "win-title", text: title }),
        el("span", { class: "win-ctrls", "aria-hidden": "true" }, el("span"), el("span"))),
      el("div", { class: "win-body" }, body));
  }
  function fileName(p) { return p.file || (p.id + ".exe"); }

  /* ---------- contact ---------- */
  function hasContact() { return !!(SITE.email || SITE.phone || SITE.github || SITE.linkedin || SITE.cv); }
  function contactItems(includeLocation) {
    var items = [];
    if (includeLocation && SITE.location) items.push(el("li", { class: "plain", text: SITE.location }));
    if (SITE.email) items.push(el("li", null, el("a", { class: "link", href: "mailto:" + SITE.email, text: SITE.email })));
    if (SITE.phone) items.push(el("li", null, el("a", { class: "link", href: "tel:" + SITE.phone.replace(/\s/g, ""), text: SITE.phone })));
    if (SITE.github) items.push(el("li", null, el("a", { class: "link", href: SITE.github, target: "_blank", rel: "noopener", text: "GitHub" })));
    if (SITE.linkedin) items.push(el("li", null, el("a", { class: "link", href: SITE.linkedin, target: "_blank", rel: "noopener", text: "LinkedIn" })));
    if (SITE.cv) items.push(el("li", null, el("a", { class: "link", href: SITE.cv, target: "_blank", rel: "noopener", text: "CV (PDF)" })));
    return items;
  }

  /* ---------- media ---------- */
  var lightboxItems = [];

  function figure(item, opts) {
    opts = opts || {};
    var fig = el("figure");
    var caption = item.caption || "";

    if (item.youtube) {
      fig.style.setProperty("--r", 16 / 9);
      fig.append(el("div", { class: "yt" },
        el("iframe", {
          src: "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(youtubeId(item.youtube)),
          title: caption || "Video",
          loading: "lazy",
          allow: "accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen",
          allowfullscreen: true,
          referrerpolicy: "strict-origin-when-cross-origin"
        })));
    } else if (item.video) {
      var video = el("video", { src: item.video, poster: item.poster, controls: true, playsinline: true, preload: "metadata" });
      video.addEventListener("loadedmetadata", function () {
        if (video.videoWidth) fig.style.setProperty("--r", video.videoWidth / video.videoHeight);
      });
      // If the video file isn't uploaded yet, show the poster photo instead (or hide it).
      video.addEventListener("error", function () {
        if (item.poster) {
          video.replaceWith(imageButton({ src: item.poster, alt: item.alt, caption: caption }, fig));
          offerUpload(fig);
        } else fig.remove();
      });
      fig.append(video);
    } else if (item.src) {
      fig.append(imageButton(item, fig));
    }

    if (caption && !opts.noCaption) fig.append(el("figcaption", { text: caption }));
    return fig;
  }

  function imageButton(item, fig) {
    var caption = item.caption || "";
    var img = el("img", { src: item.src, alt: item.alt || caption, decoding: "async" });
    var setRatio = function () {
      if (img.naturalWidth) fig.style.setProperty("--r", img.naturalWidth / img.naturalHeight);
    };
    img.addEventListener("load", setRatio);
    if (img.complete) setRatio();
    var index = lightboxItems.push(item) - 1;
    return el("button", {
      class: "zoom",
      type: "button",
      "aria-label": "Enlarge image" + (caption ? ": " + caption : ""),
      onclick: function () { openLightbox(index); }
    }, img);
  }

  // Only on the claude.ai preview, and only for its owner: lets you upload the missing video from your phone.
  // On GitHub Pages window.claude doesn't exist, so this does nothing.
  function offerUpload(fig) {
    if (!window.claude || typeof window.claude.use !== "function") return;
    window.claude.use("assets").then(function (assets) {
      if (!assets || !fig.isConnected) return;
      var input = el("input", { type: "file", accept: "video/*", class: "visually-hidden", id: "video-upload-" + Math.random().toString(36).slice(2, 8) });
      var status = el("span", { class: "upload-status", role: "status" });
      var btn = el("button", { type: "button", class: "upload-btn", text: "Upload video", onclick: function () { input.click(); } });
      input.addEventListener("change", function () {
        var file = input.files && input.files[0];
        if (!file) return;
        if (file.size > 20 * 1024 * 1024) {
          status.textContent = "This clip is " + Math.round(file.size / 1048576) + " MB. The limit is 20 MB, so trim or compress it first.";
          return;
        }
        btn.disabled = true;
        status.textContent = "Uploading…";
        // iPhone clips are .MOV (video/quicktime). MOV and MP4 share the same container format,
        // so relabel it as MP4 for the upload; browsers then play it like any MP4.
        var blob = file;
        var isMov = /quicktime/i.test(file.type) || /\.mov$/i.test(file.name || "");
        if (isMov || !file.type) blob = new Blob([file], { type: "video/mp4" });
        assets.upload(blob).then(function (res) {
          var v = el("video", { src: res.url, controls: true, playsinline: true, preload: "metadata" });
          v.addEventListener("loadedmetadata", function () {
            if (v.videoWidth) fig.style.setProperty("--r", v.videoWidth / v.videoHeight);
          });
          v.addEventListener("error", function () {
            status.textContent = "Uploaded, but this browser can't play that video format. An MP4 plays everywhere.";
          });
          var current = fig.querySelector(".zoom");
          if (current) current.replaceWith(v);
          btn.remove();
          status.textContent = "Uploaded. Tell Claude in the chat and it will be added to the page for everyone.";
        }).catch(function (err) {
          btn.disabled = false;
          status.textContent = "Upload failed" + (err && err.message ? ": " + err.message : "") + ". Try again.";
        });
      });
      fig.append(el("div", { class: "upload" }, btn, status, input));
    }).catch(function () {});
  }

  // Accepts a bare video ID or any normal YouTube link.
  function youtubeId(value) {
    var match = String(value).match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([\w-]{11})/);
    return match ? match[1] : String(value).trim();
  }

  function rows(items, opts) {
    return chunk(items, items.length === 4 ? 2 : 3).map(function (group) {
      return el("div", { class: "row" + (opts && opts.extraClass ? " " + opts.extraClass : "") },
        group.map(function (item) { return figure(item, opts); }));
    });
  }

  // media can be a flat list, or a list of groups (each group is laid out on its own).
  function groups(media, opts) {
    if (Array.isArray(media[0])) {
      return media.filter(has).map(function (g) { return el("div", { class: "group" }, rows(g, opts)); });
    }
    return rows(media, opts);
  }

  /* ---------- home ---------- */
  function card(p) {
    return win(fileName(p), "card", [
      el("div", { class: "card-media" },
        p.cover ? el("img", { src: p.cover, alt: "", decoding: "async" }) : null),
      el("div", null,
        el("h3", { text: p.title }),
        p.summary ? el("p", { text: p.summary }) : null,
        el("div", { class: "meta" },
          p.type ? el("span", { class: "chip", text: p.type }) : null,
          p.year ? el("span", { class: "chip", text: p.year }) : null))
    ], "a", { href: "#" + p.id, id: "card-" + p.id });
  }

  function renderHome() {
    document.title = SITE.name || "Portfolio";
    lightboxItems = [];
    var nameParts = (SITE.name || "").split(" ");

    fill(app,
      el("section", { class: "desk" },
        el("div", { class: "sun", "aria-hidden": "true" }),
        win("about_me.txt", "hero-win", [
          el("h1", { class: "display" }, nameParts.map(function (part) { return el("span", { text: part }); })),
          SITE.tagline ? el("p", { class: "tagline", text: SITE.tagline }) : null,
          el("div", { class: "actions" },
            el("a", { class: "btn btn-primary", href: "#projects", text: "Open projects" }),
            SITE.github ? el("a", { class: "btn", href: SITE.github, target: "_blank", rel: "noopener", text: "GitHub" }) : null,
            SITE.linkedin ? el("a", { class: "btn", href: SITE.linkedin, target: "_blank", rel: "noopener", text: "LinkedIn" }) : null)
        ])),

      el("section", { class: "section", id: "projects", "aria-labelledby": "projects-title" },
        el("div", { class: "section-head" },
          el("h2", { class: "section-title", id: "projects-title", text: "Projects" }),
          el("span", { class: "section-sub", text: PROJECTS.length + " items" })),
        el("div", { class: "grid" }, PROJECTS.map(card))),

      has(SITE.about) || hasContact() ? el("section", { class: "section", id: "about", "aria-labelledby": "about-title" },
        el("div", { class: "section-head" },
          el("h2", { class: "section-title", id: "about-title", text: "About" })),
        win("readme.md", "about-win", el("div", { class: "prose", id: "contact" },
          has(SITE.about) ? SITE.about.map(function (t) { return el("p", { text: t }); }) : null,
          el("ul", { class: "contact-links" }, contactItems(true))))) : null
    );
  }

  /* ---------- project ---------- */
  function block(title, content) {
    return el("section", { class: "block" }, el("h2", { text: title }), el("div", { class: "body" }, content));
  }

  function section(s) {
    return el("section", { class: "block" },
      el("h2", { text: s.heading }),
      el("div", { class: "body" },
        has(s.text) ? el("div", { class: "prose" }, s.text.map(function (t) { return el("p", { text: t }); })) : null,
        has(s.steps) ? el("ol", { class: "steps" }, s.steps.map(function (t) { return el("li", null, el("span", { text: t })); })) : null),
      has(s.media) ? el("div", { class: "media" }, groups(s.media)) : null);
  }

  function renderProject(p) {
    document.title = p.title + " | " + (SITE.name || "Portfolio");
    lightboxItems = [];
    var i = PROJECTS.indexOf(p);
    var next = PROJECTS.length > 1 ? PROJECTS[(i + 1) % PROJECTS.length] : null;

    fill(app, el("article", { class: "project" },
      el("a", { class: "btn back", href: "#projects" }, arrowLeft(), "All projects"),

      win(fileName(p), "project-win", [
      el("header", { class: "project-head" },
        el("h1", { class: "project-title", tabindex: "-1", text: p.title }),
        p.intro ? el("p", { class: "lead", text: p.intro }) : null),

      has(p.facts) ? el("dl", { class: "facts" }, p.facts.map(function (f) {
        return el("div", null, el("dt", { text: f[0] }), el("dd", { text: f[1] }));
      })) : null,

      has(p.hero) ? el("div", { class: "hero" }, groups(p.hero)) : null,

      has(p.sections) ? p.sections.map(section) : null,

      has(p.specs) ? block("Specifications", el("div", { class: "specs-wrap" },
        el("table", { class: "specs" }, el("tbody", null, p.specs.map(function (s) {
          return el("tr", null, el("th", { scope: "row", text: s[0] }), el("td", { text: s[1] }));
        }))))) : null,

      has(p.skills) ? block("Skills used", el("ul", { class: "tags" }, p.skills.map(function (s) { return el("li", { text: s }); }))) : null,

      has(p.gallery) ? el("section", { class: "block" },
        el("h2", { text: "More photos" }),
        el("div", { class: "media" }, rows(p.gallery))) : null,

      has(p.links) ? block("Links", el("ul", { class: "link-list" }, p.links.map(function (l) {
        return el("li", null, el("a", { class: "link", href: l.url, target: "_blank", rel: "noopener", text: l.label }));
      }))) : null
      ]),

      next ? el("nav", { class: "pager", "aria-label": "More projects" },
        el("a", { href: "#" + next.id }, el("small", { text: "Next project" }), el("span", { text: next.title }))) : null
    ));
  }

  /* ---------- routing (uses #project-id so it works on any static host) ---------- */
  function scrollToTop() { window.scrollTo({ top: 0, left: 0, behavior: "auto" }); }

  function route() {
    var id = decodeURIComponent(location.hash.replace(/^#/, ""));
    var project = null;
    for (var i = 0; i < PROJECTS.length; i++) if (PROJECTS[i].id === id) project = PROJECTS[i];

    if (project) {
      if (current !== project.id) renderProject(project);
      current = project.id;
      scrollToTop();
      var title = app.querySelector(".project-title");
      if (title) title.focus({ preventScroll: true });
      return;
    }

    var cameFrom = current;
    var wasHome = current === "home";
    if (!wasHome) { renderHome(); current = "home"; }

    var target = id ? document.getElementById(id) : null;
    if (id === "projects" && cameFrom && cameFrom !== "home") {
      var c = document.getElementById("card-" + cameFrom);
      if (c) target = c;
    }
    if (target) {
      target.scrollIntoView({ block: "start", behavior: wasHome && !reduceMotion ? "smooth" : "auto" });
      if (target.classList.contains("card")) target.focus({ preventScroll: true });
    } else {
      scrollToTop();
    }
  }

  /* ---------- lightbox ---------- */
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lb-img");
  var lbCap = document.getElementById("lb-cap");
  var lbCount = document.getElementById("lb-count");
  var lbPrev = document.getElementById("lb-prev");
  var lbNext = document.getElementById("lb-next");
  var lbIndex = 0;

  function showLightbox() {
    var item = lightboxItems[lbIndex];
    if (!item) return;
    lbImg.src = item.src;
    lbImg.alt = item.alt || item.caption || "";
    lbCap.textContent = item.caption || "";
    lbCount.textContent = lightboxItems.length > 1 ? (lbIndex + 1) + " / " + lightboxItems.length : "";
    lbPrev.hidden = lbNext.hidden = lightboxItems.length < 2;
  }
  function openLightbox(index) {
    lbIndex = index;
    showLightbox();
    if (!lb.open) {
      if (typeof lb.showModal === "function") lb.showModal();
      else lb.setAttribute("open", "");
    }
  }
  function closeLightbox() { if (typeof lb.close === "function") lb.close(); else lb.removeAttribute("open"); }
  function step(delta) {
    if (lightboxItems.length < 2) return;
    lbIndex = (lbIndex + delta + lightboxItems.length) % lightboxItems.length;
    showLightbox();
  }

  document.getElementById("lb-close").addEventListener("click", closeLightbox);
  lbPrev.addEventListener("click", function () { step(-1); });
  lbNext.addEventListener("click", function () { step(1); });
  document.getElementById("lb-stage").addEventListener("click", function (e) {
    if (e.target === e.currentTarget) closeLightbox();
  });
  lb.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
  });
  var touchX = null;
  lb.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    touchX = null;
  });

  /* ---------- start ---------- */
  document.getElementById("copyright").textContent = "© " + new Date().getFullYear() + " " + (SITE.name || "");
  document.getElementById("brand").textContent = SITE.name || "Portfolio";
  var contactNav = document.querySelector("[data-needs-contact]");
  if (contactNav) contactNav.hidden = true; // contact details live in the About window
  if (!has(SITE.about) && !hasContact()) {
    var aboutLink = document.querySelector('.nav a[href="#about"]');
    if (aboutLink) aboutLink.parentNode.hidden = true;
  }
  document.getElementById("to-top").addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  window.addEventListener("hashchange", route);
  route();
})();
