const state = {
  savedAt: 0,
  ratio: "9:16",
  activeHook: 0,
  isPreviewPlaying: false,
  bpm: 126,
  key: "F minor",
  assets: [
    { name: "product_spin.mov", type: "video", size: "42 MB", color: "#0fb9b1" },
    { name: "founder_voice.wav", type: "audio", size: "18 MB", color: "#ff4f8b" },
    { name: "texture_macro.jpg", type: "image", size: "6 MB", color: "#f8c945" }
  ],
  hooks: [
    "Your routine is about to feel expensive.",
    "The glow shot starts before the bottle opens.",
    "Stop scrolling. This is the serum edit."
  ],
  clips: {
    video: [
      { name: "Cold open", duration: 4, color: "#0fb9b1" },
      { name: "Texture macro", duration: 5, color: "#5ce0d7" },
      { name: "Founder proof", duration: 6, color: "#f8c945" },
      { name: "Routine reveal", duration: 7, color: "#ff4f8b" },
      { name: "CTA packshot", duration: 5, color: "#78df86" }
    ],
    voice: [
      { name: "Hook VO", duration: 5, color: "#ff4f8b" },
      { name: "Benefit VO", duration: 12, color: "#ff8bb0" },
      { name: "CTA VO", duration: 6, color: "#ff4f8b" }
    ],
    music: [
      { name: "Pulse intro", duration: 8, color: "#f8c945" },
      { name: "Bass lift", duration: 14, color: "#e3b13c" },
      { name: "Button ending", duration: 6, color: "#f8c945" }
    ],
    captions: [
      { name: "Hook block", duration: 5, color: "#f7f7f2" },
      { name: "3 claims", duration: 12, color: "#f7f7f2" },
      { name: "Tap CTA", duration: 4, color: "#f7f7f2" }
    ]
  },
  captions: [
    { time: "00:00", text: "Your routine is about to feel expensive." },
    { time: "00:04", text: "Clean ingredients, sharp results, no wasted steps." },
    { time: "00:11", text: "Layer it before moisturizer and let the glow build." },
    { time: "00:22", text: "Launch bundle is live today." }
  ],
  channels: [
    { name: "Kick", color: "#0fb9b1", steps: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0] },
    { name: "Snare", color: "#ff4f8b", steps: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0] },
    { name: "Hat", color: "#f8c945", steps: [1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,0] },
    { name: "Bass", color: "#78df86", steps: [1,0,0,1,0,0,1,0,1,0,0,1,0,1,0,0] },
    { name: "Vox", color: "#5ce0d7", steps: [0,0,1,0,0,1,0,0,0,0,1,0,0,1,0,0] }
  ],
  mixer: [
    { name: "Voice", role: "cleanup", level: 70, volume: 76, pan: 0, muted: false, solo: false },
    { name: "Beat", role: "score", level: 62, volume: 62, pan: -4, muted: false, solo: false },
    { name: "SFX", role: "texture", level: 48, volume: 45, pan: 12, muted: false, solo: false },
    { name: "Master", role: "-14 LUFS", level: 82, volume: 82, pan: 0, muted: false, solo: false }
  ],
  exports: [
    { name: "TikTok vertical", format: "1080x1920 H.264", progress: 100, status: "ready" },
    { name: "Instagram Reels", format: "1080x1920 H.264", progress: 100, status: "ready" },
    { name: "YouTube Shorts", format: "1080x1920 H.264", progress: 86, status: "rendering" },
    { name: "LinkedIn square", format: "1080x1080 H.264", progress: 62, status: "queued" },
    { name: "Podcast audio", format: "WAV + MP3", progress: 100, status: "ready" },
    { name: "Team review", format: "watermarked MP4", progress: 32, status: "queued" }
  ],
  approvals: [
    { area: "Brand", detail: "Colors, logo lockup, and outro card match kit.", status: "clear" },
    { area: "Claims", detail: "Avoid direct medical language in the benefit VO.", status: "review" },
    { area: "Audio", detail: "Voice print and licensed score are attached.", status: "clear" },
    { area: "Captions", detail: "Safe area checked for TikTok, Reels, and Shorts.", status: "clear" }
  ]
};

const els = {};
let audioContext;
let beatTimer;
let beatStep = 0;

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  bindEvents();
  renderAll();
  startAutosaveClock();
  drawMeters();
});

function cacheElements() {
  const ids = [
    "assetList",
    "dropZone",
    "fileInput",
    "filePickButton",
    "hookRow",
    "timeline",
    "ruler",
    "sequencer",
    "mixer",
    "captionList",
    "exportGrid",
    "approvalList",
    "briefInput",
    "vibeSelect",
    "bpmInput",
    "keySelect",
    "lengthSelect",
    "previewFrame",
    "previewMedia",
    "previewTitleCard",
    "captionOverlay",
    "previewPlatform",
    "previewBpm",
    "saveState",
    "cutScore",
    "audioScore",
    "riskScore",
    "formatScore",
    "waveCanvas",
    "meterCanvas",
    "toastStack",
    "generateCutButton",
    "composeScoreButton",
    "cleanVoiceButton",
    "checkComplianceButton",
    "renderQueueButton",
    "renderPackTopButton",
    "downloadProjectButton",
    "copyBriefButton",
    "captionButton",
    "masterButton",
    "approveAllButton",
    "randomBeatButton",
    "playBeatButton",
    "addClipButton",
    "shuffleCutButton",
    "tightenButton",
    "previewPlayButton",
    "rewindButton",
    "splitButton",
    "swingSlider",
    "sidechainSlider",
    "brightnessSlider",
    "captionCaseSelect",
    "captionPositionSelect",
    "captionEmphasisSlider",
    "forbiddenInput"
  ];

  ids.forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function bindEvents() {
  document.querySelectorAll(".deck-tab").forEach((button) => {
    button.addEventListener("click", () => activatePanel(button.dataset.panel));
  });

  document.querySelectorAll(".rail-item").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.jump;
      document.querySelectorAll(".rail-item").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      if (target === "studio") {
        document.getElementById("studio").scrollIntoView({ behavior: "smooth", block: "start" });
        activatePanel("timelinePanel");
      } else {
        const panel = `${target}Panel`;
        activatePanel(panel);
        document.querySelector(".lower-deck").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  document.querySelectorAll(".segment").forEach((button) => {
    button.addEventListener("click", () => {
      state.ratio = button.dataset.ratio;
      document.querySelectorAll(".segment").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      updatePreviewRatio();
      touchSave();
    });
  });

  els.filePickButton.addEventListener("click", () => els.fileInput.click());
  els.fileInput.addEventListener("change", (event) => addFiles(event.target.files));

  ["dragenter", "dragover"].forEach((type) => {
    els.dropZone.addEventListener(type, (event) => {
      event.preventDefault();
      els.dropZone.classList.add("is-over");
    });
  });

  ["dragleave", "drop"].forEach((type) => {
    els.dropZone.addEventListener(type, (event) => {
      event.preventDefault();
      els.dropZone.classList.remove("is-over");
    });
  });

  els.dropZone.addEventListener("drop", (event) => addFiles(event.dataTransfer.files));
  els.dropZone.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      els.fileInput.click();
    }
  });

  els.generateCutButton.addEventListener("click", generateFullCut);
  els.composeScoreButton.addEventListener("click", composeScore);
  els.cleanVoiceButton.addEventListener("click", cleanVoice);
  els.checkComplianceButton.addEventListener("click", runBrandCheck);
  els.renderQueueButton.addEventListener("click", renderQueue);
  els.renderPackTopButton.addEventListener("click", renderQueue);
  els.downloadProjectButton.addEventListener("click", downloadProject);
  els.copyBriefButton.addEventListener("click", copyBrief);
  els.captionButton.addEventListener("click", autoCaption);
  els.masterButton.addEventListener("click", masterMix);
  els.approveAllButton.addEventListener("click", approveClearItems);
  els.randomBeatButton.addEventListener("click", humanizeBeat);
  els.playBeatButton.addEventListener("click", toggleBeatPlayback);
  els.addClipButton.addEventListener("click", addClip);
  els.shuffleCutButton.addEventListener("click", shuffleCut);
  els.tightenButton.addEventListener("click", tightenGaps);
  els.previewPlayButton.addEventListener("click", togglePreview);
  els.rewindButton.addEventListener("click", rewindPreview);
  els.splitButton.addEventListener("click", splitAtPlayhead);

  [els.bpmInput, els.keySelect, els.vibeSelect, els.lengthSelect].forEach((input) => {
    input.addEventListener("input", () => {
      state.bpm = Number(els.bpmInput.value);
      state.key = els.keySelect.value;
      renderPreviewMeta();
      touchSave();
    });
  });

  [els.swingSlider, els.sidechainSlider, els.brightnessSlider].forEach((input) => {
    input.addEventListener("input", () => {
      drawWaveform();
      touchSave();
    });
  });

  [els.captionCaseSelect, els.captionPositionSelect, els.captionEmphasisSlider].forEach((input) => {
    input.addEventListener("input", () => {
      applyCaptionStyle();
      touchSave();
    });
  });

  window.addEventListener("resize", () => {
    drawMeters();
    drawWaveform();
  });
}

function renderAll() {
  renderAssets();
  renderHooks();
  renderRuler();
  renderTimeline();
  renderSequencer();
  renderMixer();
  renderCaptions();
  renderExports();
  renderApprovals();
  renderPreviewMeta();
  updatePreviewRatio();
  applyCaptionStyle();
  drawWaveform();
}

function renderAssets() {
  els.assetList.innerHTML = "";
  state.assets.forEach((asset, index) => {
    const item = document.createElement("button");
    item.className = "asset-item";
    item.type = "button";
    item.innerHTML = `
      <span class="asset-thumb" style="background:${asset.color}"></span>
      <span>
        <strong>${escapeHtml(asset.name)}</strong>
        <span>${escapeHtml(asset.type)} - ${escapeHtml(asset.size)}</span>
      </span>
    `;
    item.addEventListener("click", () => previewAsset(index));
    els.assetList.appendChild(item);
  });
}

function renderHooks() {
  els.hookRow.innerHTML = "";
  state.hooks.forEach((hook, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `hook-card${index === state.activeHook ? " is-active" : ""}`;
    card.innerHTML = `<span>Hook ${index + 1}</span><strong>${escapeHtml(hook)}</strong>`;
    card.addEventListener("click", () => {
      state.activeHook = index;
      els.captionOverlay.textContent = hook;
      renderHooks();
      touchSave();
    });
    els.hookRow.appendChild(card);
  });
}

function renderRuler() {
  els.ruler.innerHTML = "";
  for (let i = 0; i < 10; i += 1) {
    const tick = document.createElement("span");
    tick.textContent = `${i * 3}s`;
    els.ruler.appendChild(tick);
  }
}

function renderTimeline() {
  els.timeline.innerHTML = "";
  const tracks = [
    ["Video", "cuts", state.clips.video],
    ["Voice", "dialog", state.clips.voice],
    ["Music", "score", state.clips.music],
    ["Captions", "text", state.clips.captions]
  ];

  tracks.forEach(([label, role, clips]) => {
    const track = document.createElement("section");
    track.className = "track";
    track.innerHTML = `
      <div class="track-label">
        <strong>${label}</strong>
        <span>${role}</span>
      </div>
      <div class="track-lane"></div>
    `;
    const lane = track.querySelector(".track-lane");
    clips.forEach((clip) => {
      const clipEl = document.createElement("button");
      clipEl.className = "clip";
      clipEl.type = "button";
      clipEl.style.setProperty("--clip-color", clip.color);
      clipEl.style.width = `${Math.max(58, clip.duration * 23)}px`;
      clipEl.innerHTML = `<span>${escapeHtml(clip.name)}</span><small>${clip.duration}s</small>`;
      clipEl.addEventListener("click", () => {
        els.captionOverlay.textContent = clip.name;
        showToast(`${clip.name} selected`);
      });
      lane.appendChild(clipEl);
    });
    els.timeline.appendChild(track);
  });
}

function renderSequencer() {
  els.sequencer.innerHTML = "";
  state.channels.forEach((channel, channelIndex) => {
    const row = document.createElement("div");
    row.className = "seq-row";
    const label = document.createElement("div");
    label.className = "seq-label";
    label.textContent = channel.name;
    row.appendChild(label);

    channel.steps.forEach((on, stepIndex) => {
      const step = document.createElement("button");
      step.className = `seq-step${on ? " is-on" : ""}`;
      step.type = "button";
      step.style.setProperty("--step-color", channel.color);
      step.setAttribute("aria-label", `${channel.name} step ${stepIndex + 1}`);
      step.addEventListener("click", () => {
        state.channels[channelIndex].steps[stepIndex] = state.channels[channelIndex].steps[stepIndex] ? 0 : 1;
        renderSequencer();
        drawWaveform();
        touchSave();
      });
      row.appendChild(step);
    });
    els.sequencer.appendChild(row);
  });
}

function renderMixer() {
  els.mixer.innerHTML = "";
  state.mixer.forEach((channel, index) => {
    const strip = document.createElement("section");
    strip.className = "channel-strip";
    strip.innerHTML = `
      <div class="channel-head">
        <strong>${escapeHtml(channel.name)}</strong>
        <span>${escapeHtml(channel.role)}</span>
      </div>
      <div class="meter"><span class="meter-fill" style="--level:${channel.level}%"></span></div>
      <label>
        <span>Volume ${channel.volume}</span>
        <input data-mix="${index}" data-field="volume" type="range" min="0" max="100" value="${channel.volume}">
      </label>
      <label>
        <span>Pan ${channel.pan}</span>
        <input data-mix="${index}" data-field="pan" type="range" min="-50" max="50" value="${channel.pan}">
      </label>
      <div class="channel-buttons">
        <button class="mini-button${channel.muted ? " is-active" : ""}" data-mix="${index}" data-toggle="muted" type="button">Mute</button>
        <button class="mini-button${channel.solo ? " is-active" : ""}" data-mix="${index}" data-toggle="solo" type="button">Solo</button>
      </div>
    `;
    els.mixer.appendChild(strip);
  });

  els.mixer.querySelectorAll("input[type='range']").forEach((slider) => {
    slider.addEventListener("input", () => {
      const index = Number(slider.dataset.mix);
      const field = slider.dataset.field;
      state.mixer[index][field] = Number(slider.value);
      state.mixer[index].level = Math.min(100, Math.max(10, Number(slider.value) + 8));
      renderMixer();
      drawMeters();
      touchSave();
    });
  });

  els.mixer.querySelectorAll("[data-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.mix);
      const field = button.dataset.toggle;
      state.mixer[index][field] = !state.mixer[index][field];
      renderMixer();
      touchSave();
    });
  });
}

function renderCaptions() {
  els.captionList.innerHTML = "";
  state.captions.forEach((caption, index) => {
    const item = document.createElement("div");
    item.className = "caption-item";
    item.innerHTML = `
      <span class="caption-time">${escapeHtml(caption.time)}</span>
      <input value="${escapeAttribute(caption.text)}" aria-label="Caption ${index + 1}">
      <button class="icon-button" type="button" aria-label="Use caption ${index + 1}" title="Use caption">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>
      </button>
    `;
    const input = item.querySelector("input");
    input.addEventListener("input", () => {
      state.captions[index].text = input.value;
      if (index === 0) {
        els.captionOverlay.textContent = input.value;
      }
      touchSave();
    });
    item.querySelector("button").addEventListener("click", () => {
      els.captionOverlay.textContent = input.value;
      showToast("Caption sent to preview");
    });
    els.captionList.appendChild(item);
  });
}

function renderExports() {
  els.exportGrid.innerHTML = "";
  state.exports.forEach((item) => {
    const card = document.createElement("section");
    const pillClass = item.status === "ready" ? "" : item.status === "rendering" ? " warn" : " fail";
    card.className = "export-card";
    card.innerHTML = `
      <header>
        <strong>${escapeHtml(item.name)}</strong>
        <span class="status-pill${pillClass}">${escapeHtml(item.status)}</span>
      </header>
      <p>${escapeHtml(item.format)}</p>
      <div class="progress"><span style="--progress:${item.progress}%"></span></div>
    `;
    els.exportGrid.appendChild(card);
  });
}

function renderApprovals() {
  els.approvalList.innerHTML = "";
  state.approvals.forEach((item, index) => {
    const card = document.createElement("section");
    const pillClass = item.status === "clear" || item.status === "approved" ? "" : item.status === "review" ? " warn" : " fail";
    card.className = "approval-item";
    card.innerHTML = `
      <header>
        <strong>${escapeHtml(item.area)}</strong>
        <span class="status-pill${pillClass}">${escapeHtml(item.status)}</span>
      </header>
      <p>${escapeHtml(item.detail)}</p>
      <div class="approval-actions">
        <button class="tool-button" data-approve="${index}" type="button">Approve</button>
        <button class="tool-button" data-fix="${index}" type="button">Rewrite</button>
      </div>
    `;
    els.approvalList.appendChild(card);
  });

  els.approvalList.querySelectorAll("[data-approve]").forEach((button) => {
    button.addEventListener("click", () => {
      state.approvals[Number(button.dataset.approve)].status = "approved";
      renderApprovals();
      updateRiskScore();
      touchSave();
    });
  });

  els.approvalList.querySelectorAll("[data-fix]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = state.approvals[Number(button.dataset.fix)];
      item.detail = "Language softened and routed back through brand-safe captions.";
      item.status = "clear";
      renderApprovals();
      updateRiskScore();
      showToast(`${item.area} rewrite complete`);
      touchSave();
    });
  });
}

function addFiles(fileList) {
  const files = Array.from(fileList || []);
  if (!files.length) return;

  files.forEach((file) => {
    const type = file.type.split("/")[0] || "file";
    const color = type === "video" ? "#0fb9b1" : type === "audio" ? "#ff4f8b" : "#f8c945";
    const asset = {
      name: file.name,
      type,
      size: formatBytes(file.size),
      color,
      url: URL.createObjectURL(file),
      mime: file.type
    };
    state.assets.unshift(asset);
  });

  renderAssets();
  previewAsset(0);
  showToast(`${files.length} asset${files.length > 1 ? "s" : ""} added`);
  touchSave();
}

function previewAsset(index) {
  const asset = state.assets[index];
  if (!asset || !asset.url) {
    els.previewMedia.classList.remove("has-file");
    return;
  }

  els.previewMedia.innerHTML = "";
  els.previewMedia.classList.add("has-file");
  if (asset.type === "video") {
    const video = document.createElement("video");
    video.src = asset.url;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.controls = false;
    els.previewMedia.appendChild(video);
    video.play().catch(() => {});
  } else if (asset.type === "image") {
    const img = document.createElement("img");
    img.src = asset.url;
    img.alt = asset.name;
    els.previewMedia.appendChild(img);
  } else {
    els.previewMedia.classList.remove("has-file");
    els.previewMedia.innerHTML = `<div class="preview-grid"></div><div class="preview-title">${escapeHtml(asset.name)}</div>`;
  }

  showToast(`${asset.name} loaded in preview`);
}

function generateFullCut() {
  const brief = els.briefInput.value.trim();
  const vibe = els.vibeSelect.value;
  const length = parseInt(els.lengthSelect.value, 10) || 30;
  const nouns = extractNouns(brief);
  const product = nouns[0] || "drop";
  const second = nouns[1] || "proof";
  const third = nouns[2] || "launch";

  state.hooks = [
    `${capitalize(product)} finally gets the edit it deserves.`,
    `This is the ${second} cut people rewatch twice.`,
    `A ${vibe.toLowerCase()} launch built for the first three seconds.`
  ];
  state.activeHook = 0;
  state.clips.video = [
    { name: "Pattern interrupt", duration: 3, color: "#0fb9b1" },
    { name: `${capitalize(product)} macro`, duration: 5, color: "#5ce0d7" },
    { name: `${capitalize(second)} proof`, duration: 6, color: "#f8c945" },
    { name: "Hands in motion", duration: 5, color: "#ff4f8b" },
    { name: `${capitalize(third)} CTA`, duration: Math.max(4, length - 19), color: "#78df86" }
  ];
  state.clips.voice = [
    { name: "Scroll stop", duration: 4, color: "#ff4f8b" },
    { name: "Benefit ladder", duration: 11, color: "#ff8bb0" },
    { name: "Trust line", duration: 6, color: "#ff4f8b" },
    { name: "CTA", duration: 4, color: "#ff8bb0" }
  ];
  state.clips.music = [
    { name: `${vibe} intro`, duration: 8, color: "#f8c945" },
    { name: "Drop groove", duration: 12, color: "#e3b13c" },
    { name: "Logo button", duration: 5, color: "#f8c945" }
  ];
  state.captions = [
    { time: "00:00", text: state.hooks[0] },
    { time: "00:04", text: `A ${vibe.toLowerCase()} cut with clean proof points.` },
    { time: "00:12", text: "Every claim stays brand safe and caption ready." },
    { time: "00:24", text: "Export the full launch pack now." }
  ];

  els.previewTitleCard.textContent = product;
  els.captionOverlay.textContent = state.hooks[0];
  state.exports.forEach((item, index) => {
    item.progress = index < 2 ? 100 : 18 + index * 8;
    item.status = index < 2 ? "ready" : "queued";
  });

  renderAll();
  showToast("Full cut generated with hooks, timeline, captions, and export queue");
  touchSave();
}

function composeScore() {
  const base = Number(els.bpmInput.value) || 126;
  state.bpm = base;
  state.channels.forEach((channel, channelIndex) => {
    channel.steps = channel.steps.map((value, stepIndex) => {
      if (channelIndex === 0) return stepIndex % 4 === 0 ? 1 : value;
      if (channelIndex === 1) return stepIndex === 4 || stepIndex === 12 ? 1 : 0;
      if (channelIndex === 2) return stepIndex % 2 === 0 || Math.random() > 0.78 ? 1 : 0;
      return Math.random() > 0.62 ? 1 : 0;
    });
  });
  state.clips.music = [
    { name: `${els.vibeSelect.value} motif`, duration: 8, color: "#f8c945" },
    { name: `${state.key} bass`, duration: 12, color: "#78df86" },
    { name: "Beat-synced stabs", duration: 7, color: "#ff4f8b" }
  ];
  renderSequencer();
  renderTimeline();
  drawWaveform();
  renderPreviewMeta();
  showToast(`Original ${state.key} score composed at ${state.bpm} BPM`);
  touchSave();
}

function cleanVoice() {
  const voice = state.mixer.find((channel) => channel.name === "Voice");
  if (voice) {
    voice.level = 74;
    voice.volume = 78;
    voice.pan = 0;
  }
  state.approvals = state.approvals.map((item) => {
    if (item.area === "Audio") {
      return { ...item, detail: "Noise floor reduced, plosives softened, and license note attached.", status: "clear" };
    }
    return item;
  });
  renderMixer();
  renderApprovals();
  els.audioScore.textContent = "-14 LUFS";
  showToast("Voice cleaned with gate, de-ess, compression, and loudness target");
  touchSave();
}

function runBrandCheck() {
  const forbidden = (els.forbiddenInput.value || "")
    .split(/\n+/)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  const text = `${els.briefInput.value} ${state.captions.map((caption) => caption.text).join(" ")}`.toLowerCase();
  const found = forbidden.filter((term) => text.includes(term));
  const claim = state.approvals.find((item) => item.area === "Claims");
  if (claim) {
    if (found.length) {
      claim.detail = `Flagged terms: ${found.join(", ")}. Rewrite before final publish.`;
      claim.status = "blocked";
    } else {
      claim.detail = "No forbidden claims found in brief, captions, or voiceover.";
      claim.status = "clear";
    }
  }
  updateRiskScore();
  renderApprovals();
  showToast(found.length ? "Brand check found claims to rewrite" : "Brand check passed");
  touchSave();
}

function renderQueue() {
  let delay = 0;
  state.exports.forEach((item, index) => {
    item.status = "rendering";
    item.progress = Math.max(item.progress, 12);
    setTimeout(() => animateExport(index), delay);
    delay += 220;
  });
  renderExports();
  activatePanel("exportPanel");
  showToast("Render pack started");
  touchSave();
}

function animateExport(index) {
  const item = state.exports[index];
  if (!item) return;
  const interval = setInterval(() => {
    item.progress = Math.min(100, item.progress + 8 + Math.floor(Math.random() * 12));
    if (item.progress >= 100) {
      item.status = "ready";
      clearInterval(interval);
    }
    renderExports();
  }, 180);
}

function downloadProject() {
  const payload = {
    app: "VibeCut Studio",
    exportedAt: new Date().toISOString(),
    brief: els.briefInput.value,
    vibe: els.vibeSelect.value,
    bpm: state.bpm,
    key: state.key,
    assets: state.assets.map(({ name, type, size }) => ({ name, type, size })),
    hooks: state.hooks,
    clips: state.clips,
    captions: state.captions,
    approvals: state.approvals,
    exports: state.exports
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "vibecut-project.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Project JSON exported");
}

function copyBrief() {
  const summary = [
    "VibeCut Studio project",
    `Brief: ${els.briefInput.value.trim()}`,
    `Vibe: ${els.vibeSelect.value}`,
    `Tempo: ${state.bpm} BPM`,
    `Hooks: ${state.hooks.join(" | ")}`
  ].join("\n");

  if (navigator.clipboard) {
    navigator.clipboard.writeText(summary).then(() => showToast("Project brief copied"));
  } else {
    showToast("Clipboard unavailable in this browser");
  }
}

function autoCaption() {
  const hook = state.hooks[state.activeHook];
  const words = hook.split(" ");
  state.captions = [
    { time: "00:00", text: hook },
    { time: "00:03", text: `${words.slice(0, 4).join(" ")} with the beat.` },
    { time: "00:08", text: "Proof points land before the drop." },
    { time: "00:18", text: "The final card is ready for every platform." }
  ];
  state.clips.captions = [
    { name: "Hook caption", duration: 4, color: "#f7f7f2" },
    { name: "Benefit caption", duration: 8, color: "#f7f7f2" },
    { name: "Proof caption", duration: 7, color: "#f7f7f2" },
    { name: "CTA caption", duration: 4, color: "#f7f7f2" }
  ];
  renderCaptions();
  renderTimeline();
  els.captionOverlay.textContent = hook;
  showToast("Captions timed to hook and CTA");
  touchSave();
}

function masterMix() {
  state.mixer.forEach((channel) => {
    if (channel.name === "Master") {
      channel.level = 82;
      channel.volume = 82;
    } else {
      channel.level = Math.max(44, Math.min(76, channel.level));
    }
  });
  els.audioScore.textContent = "-14 LUFS";
  renderMixer();
  drawMeters();
  showToast("Mix mastered to -14 LUFS");
  touchSave();
}

function approveClearItems() {
  state.approvals.forEach((item) => {
    if (item.status === "clear") item.status = "approved";
  });
  renderApprovals();
  updateRiskScore();
  showToast("Clear review items approved");
  touchSave();
}

function humanizeBeat() {
  state.channels.forEach((channel) => {
    channel.steps = channel.steps.map((value, index) => {
      if (index % 4 === 0 && channel.name === "Kick") return 1;
      if (Math.random() > 0.86) return value ? 0 : 1;
      return value;
    });
  });
  renderSequencer();
  drawWaveform();
  showToast("Beat humanized");
  touchSave();
}

function addClip() {
  const name = ["Close detail", "Proof card", "Hand move", "Logo flash", "Reaction cut"][Math.floor(Math.random() * 5)];
  state.clips.video.push({
    name,
    duration: 3 + Math.floor(Math.random() * 5),
    color: ["#0fb9b1", "#ff4f8b", "#f8c945", "#78df86"][Math.floor(Math.random() * 4)]
  });
  renderTimeline();
  showToast(`${name} added to video lane`);
  touchSave();
}

function shuffleCut() {
  state.clips.video = shuffleArray(state.clips.video);
  state.clips.music = shuffleArray(state.clips.music);
  renderTimeline();
  showToast("Timeline order shuffled");
  touchSave();
}

function tightenGaps() {
  Object.keys(state.clips).forEach((key) => {
    state.clips[key] = state.clips[key].map((clip) => ({
      ...clip,
      duration: Math.max(2, clip.duration - (clip.duration > 6 ? 1 : 0))
    }));
  });
  renderTimeline();
  showToast("Gaps tightened and pacing improved");
  touchSave();
}

function togglePreview() {
  state.isPreviewPlaying = !state.isPreviewPlaying;
  els.previewFrame.classList.toggle("is-playing", state.isPreviewPlaying);
  els.previewPlayButton.innerHTML = state.isPreviewPlaying
    ? `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M8 5h3v14H8zM13 5h3v14h-3z"/></svg>Pause cut`
    : `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>Play cut`;

  const video = els.previewMedia.querySelector("video");
  if (video) {
    if (state.isPreviewPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }
}

function rewindPreview() {
  const video = els.previewMedia.querySelector("video");
  if (video) video.currentTime = 0;
  state.activeHook = 0;
  els.captionOverlay.textContent = state.hooks[0];
  renderHooks();
  showToast("Preview rewound");
}

function splitAtPlayhead() {
  state.clips.video.splice(1, 0, { name: "Beat split", duration: 2, color: "#f8c945" });
  renderTimeline();
  showToast("Split inserted on nearest beat");
  touchSave();
}

function activatePanel(panelId) {
  document.querySelectorAll(".deck-tab").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.panel === panelId);
  });
  document.querySelectorAll(".deck-panel").forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === panelId);
  });
  if (panelId === "soundPanel") drawWaveform();
}

function updatePreviewRatio() {
  els.previewFrame.classList.remove("ratio-vertical", "ratio-square", "ratio-wide");
  if (state.ratio === "1:1") els.previewFrame.classList.add("ratio-square");
  else if (state.ratio === "16:9") els.previewFrame.classList.add("ratio-wide");
  else els.previewFrame.classList.add("ratio-vertical");
}

function renderPreviewMeta() {
  const checked = Array.from(document.querySelectorAll(".platform-set input:checked")).map((input) => input.value);
  els.previewPlatform.textContent = checked[0] || "Review";
  els.previewBpm.textContent = `${Number(els.bpmInput.value) || state.bpm} BPM`;
  els.formatScore.textContent = String(checked.length);
}

function applyCaptionStyle() {
  const mode = els.captionCaseSelect.value;
  const position = els.captionPositionSelect.value;
  const emphasis = Number(els.captionEmphasisSlider.value);

  let text = state.captions[0]?.text || state.hooks[state.activeHook];
  if (mode === "Uppercase") text = text.toUpperCase();
  if (mode === "Title") text = text.replace(/\w\S*/g, (word) => capitalize(word.toLowerCase()));
  els.captionOverlay.textContent = text;
  els.captionOverlay.style.fontSize = `${Math.max(14, Math.min(28, 14 + emphasis / 6))}px`;
  els.captionOverlay.style.bottom = position === "Top safe area" ? "auto" : position === "Center punch" ? "45%" : "58px";
  els.captionOverlay.style.top = position === "Top safe area" ? "48px" : "auto";
}

function updateRiskScore() {
  const blocked = state.approvals.some((item) => item.status === "blocked");
  const review = state.approvals.some((item) => item.status === "review");
  els.riskScore.textContent = blocked ? "Blocked" : review ? "Review" : "Clear";
}

function toggleBeatPlayback() {
  if (beatTimer) {
    clearInterval(beatTimer);
    beatTimer = null;
    beatStep = 0;
    els.playBeatButton.textContent = "Play beat";
    renderSequencer();
    return;
  }

  audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
  const stepMs = (60 / (Number(els.bpmInput.value) || state.bpm)) * 250;
  beatTimer = setInterval(playBeatStep, stepMs);
  els.playBeatButton.textContent = "Stop beat";
  playBeatStep();
}

function playBeatStep() {
  renderSequencer();
  const rows = Array.from(els.sequencer.querySelectorAll(".seq-row"));
  rows.forEach((row) => {
    const step = row.querySelectorAll(".seq-step")[beatStep];
    if (step) step.classList.add("is-playing");
  });

  state.channels.forEach((channel) => {
    if (!channel.steps[beatStep]) return;
    if (channel.name === "Kick") playTone(70, 0.12, "sine", 0.45);
    if (channel.name === "Snare") playNoise(0.1, 0.28);
    if (channel.name === "Hat") playNoise(0.035, 0.11);
    if (channel.name === "Bass") playTone(110, 0.16, "sawtooth", 0.18);
    if (channel.name === "Vox") playTone(430, 0.07, "triangle", 0.09);
  });

  beatStep = (beatStep + 1) % 16;
}

function playTone(freq, duration, type, gainValue) {
  if (!audioContext) return;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioContext.currentTime);
  gain.gain.setValueAtTime(gainValue, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
  osc.connect(gain).connect(audioContext.destination);
  osc.start();
  osc.stop(audioContext.currentTime + duration);
}

function playNoise(duration, gainValue) {
  if (!audioContext) return;
  const bufferSize = audioContext.sampleRate * duration;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = audioContext.createBufferSource();
  const gain = audioContext.createGain();
  gain.gain.setValueAtTime(gainValue, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
  noise.buffer = buffer;
  noise.connect(gain).connect(audioContext.destination);
  noise.start();
}

function drawWaveform() {
  const canvas = els.waveCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#0b0f10";
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 16; i += 1) {
    const x = (i / 16) * width;
    ctx.fillStyle = i % 4 === 0 ? "rgba(248,201,69,0.18)" : "rgba(247,247,242,0.05)";
    ctx.fillRect(x, 0, 1, height);
  }

  const brightness = Number(els.brightnessSlider?.value || 58) / 100;
  const swing = Number(els.swingSlider?.value || 18) / 100;
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#5ce0d7";
  ctx.beginPath();
  for (let x = 0; x < width; x += 1) {
    const step = Math.floor((x / width) * 16);
    const intensity = state.channels.reduce((sum, channel) => sum + (channel.steps[step] ? 1 : 0), 0);
    const y = height / 2 + Math.sin(x * 0.07 + swing * 4) * (8 + intensity * 7) * brightness;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = "#ff4f8b";
  ctx.beginPath();
  for (let x = 0; x < width; x += 2) {
    const step = Math.floor((x / width) * 16);
    const hit = state.channels[1].steps[step] || state.channels[4].steps[step];
    const y = height / 2 + Math.cos(x * 0.045) * (hit ? 34 : 10);
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function drawMeters() {
  const canvas = els.meterCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(17,20,22,0.22)";
  ctx.fillRect(0, 0, width, height);

  const bars = 52;
  for (let i = 0; i < bars; i += 1) {
    const mix = state.mixer[i % state.mixer.length];
    const level = (mix.level / 100) * (0.38 + Math.abs(Math.sin(i * 0.9)) * 0.62);
    const barHeight = Math.max(4, level * height);
    const x = (i / bars) * width;
    ctx.fillStyle = i % 7 === 0 ? "#f8c945" : i % 5 === 0 ? "#ff4f8b" : "#0fb9b1";
    ctx.fillRect(x, height - barHeight, width / bars - 3, barHeight);
  }
}

function startAutosaveClock() {
  setInterval(() => {
    state.savedAt += 5;
    const minutes = Math.floor(state.savedAt / 60);
    const seconds = String(state.savedAt % 60).padStart(2, "0");
    els.saveState.textContent = `Autosaved ${minutes}:${seconds}`;
    drawMeters();
  }, 5000);
}

function touchSave() {
  state.savedAt = 0;
  els.saveState.textContent = "Autosaved 0:00";
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  els.toastStack.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function extractNouns(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 4)
    .filter((word) => !["clean", "video", "voiceover", "captions", "without", "feeling", "premium", "confident"].includes(word))
    .slice(0, 4);
}

function shuffleArray(items) {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

function capitalize(value) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("\n", " ");
}
