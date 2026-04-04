const DEFAULT_API_BASE = "http://localhost:8000";
const DEFAULT_API_KEY = "dev-admin-key";
let pollingTimer = null;
let currentReport = null;
const sessionStats = {
  submittedJobs: new Set(),
  completedJobs: new Set(),
  failedJobs: new Set(),
  reportsReady: new Set()
};

const els = {
  introLoader: document.getElementById("introLoader"),
  apiBaseInput: document.getElementById("apiBaseInput"),
  apiKeyInput: document.getElementById("apiKeyInput"),
  themeToggle: document.getElementById("themeToggle"),
  saveApiKey: document.getElementById("saveApiKey"),
  backendHealthBadge: document.getElementById("backendHealthBadge"),
  submitJob: document.getElementById("submitJob"),
  submitBatch: document.getElementById("submitBatch"),
  clearUpload: document.getElementById("clearUpload"),
  audioUrl: document.getElementById("audioUrl"),
  batchUrls: document.getElementById("batchUrls"),
  audioFile: document.getElementById("audioFile"),
  languageHint: document.getElementById("languageHint"),
  submitState: document.getElementById("submitState"),
  jobIdInput: document.getElementById("jobIdInput"),
  checkStatus: document.getElementById("checkStatus"),
  startPolling: document.getElementById("startPolling"),
  retryJob: document.getElementById("retryJob"),
  progressBar: document.getElementById("progressBar"),
  statusTimeline: document.getElementById("statusTimeline"),
  statusDetails: document.getElementById("statusDetails"),
  statusStageLabel: document.getElementById("statusStageLabel"),
  statusRetryLabel: document.getElementById("statusRetryLabel"),
  statusHealthLabel: document.getElementById("statusHealthLabel"),
  reportEmpty: document.getElementById("reportEmpty"),
  reportContent: document.getElementById("reportContent"),
  summaryText: document.getElementById("summaryText"),
  insightPayment: document.getElementById("insightPayment"),
  insightRejection: document.getElementById("insightRejection"),
  insightKeywords: document.getElementById("insightKeywords"),
  rawTranscript: document.getElementById("rawTranscript"),
  cleanTranscript: document.getElementById("cleanTranscript"),
  focusRaw: document.getElementById("focusRaw"),
  focusClean: document.getElementById("focusClean"),
  sopScore: document.getElementById("sopScore"),
  sopChecks: document.getElementById("sopChecks"),
  paymentPrimary: document.getElementById("paymentPrimary"),
  paymentBars: document.getElementById("paymentBars"),
  paymentEvidence: document.getElementById("paymentEvidence"),
  rejectionPrimary: document.getElementById("rejectionPrimary"),
  rejectionReasons: document.getElementById("rejectionReasons"),
  rejectionEvidence: document.getElementById("rejectionEvidence"),
  keywordList: document.getElementById("keywordList"),
  downloadJson: document.getElementById("downloadJson"),
  loadSopTemplate: document.getElementById("loadSopTemplate"),
  sopTemplateList: document.getElementById("sopTemplateList"),
  executiveBrief: document.getElementById("executiveBrief"),
  recommendationList: document.getElementById("recommendationList"),
  copySummary: document.getElementById("copySummary"),
  copyJobId: document.getElementById("copyJobId"),
  waveform: document.getElementById("waveform"),
  distributionBars: document.getElementById("distributionBars"),
  kpiCompletion: document.getElementById("kpiCompletion"),
  kpiSop: document.getElementById("kpiSop"),
  kpiPayment: document.getElementById("kpiPayment"),
  kpiRisk: document.getElementById("kpiRisk"),
  batchResult: document.getElementById("batchResult"),
  toast: document.getElementById("toast")
};

function normalizeApiBase(value) {
  const raw = (value || "").trim();
  if (!raw) return DEFAULT_API_BASE;

  let normalized = raw.replace(/\/+$/, "");
  if (normalized.endsWith("/health")) {
    normalized = normalized.slice(0, -"/health".length);
  }

  return normalized || DEFAULT_API_BASE;
}

function getApiBase() {
  return normalizeApiBase(localStorage.getItem("calliq-api-base") || DEFAULT_API_BASE);
}

function getApiKey() {
  return localStorage.getItem("calliq-api-key") || DEFAULT_API_KEY;
}

async function api(path, options = {}) {
  const response = await fetch(`${getApiBase()}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

async function loadOverview() {
  try {
    const healthResponse = await fetch(`${getApiBase()}/health`);
    if (!healthResponse.ok) throw new Error("Health check failed");
    const health = await healthResponse.json();
    els.backendHealthBadge.textContent = health.status === "ok" ? "Backend ready" : "Backend check";
    els.backendHealthBadge.classList.add("good");
  } catch {
    els.backendHealthBadge.textContent = "Backend unavailable";
    els.backendHealthBadge.classList.remove("good");
  }

  updateOverviewMetrics();
}

function updateOverviewMetrics() {
  const submitted = sessionStats.submittedJobs.size;
  const completed = sessionStats.completedJobs.size;
  const reportsReady = sessionStats.reportsReady.size;
  const failed = sessionStats.failedJobs.size;
  const active = Math.max(submitted - completed - failed, 0);
  const percent = (value) => (submitted ? Math.round((value / submitted) * 100) : 0);

  els.kpiCompletion.textContent = String(submitted);
  els.kpiSop.textContent = String(completed);
  els.kpiPayment.textContent = String(reportsReady);
  els.kpiRisk.textContent = String(failed);

  buildDistributionBars([
    { label: "Completed", value: percent(completed) },
    { label: "Active", value: percent(active) },
    { label: "Reports Ready", value: percent(reportsReady) },
    { label: "Failed", value: percent(failed) }
  ]);
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.remove("hidden");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => els.toast.classList.add("hidden"), 2600);
}

function animateCounter(node) {
  const target = Number(node.dataset.target || "0");
  let value = 0;
  const step = Math.max(1, Math.round(target / 28));
  const timer = window.setInterval(() => {
    value = Math.min(target, value + step);
    node.textContent = value;
    if (value >= target) window.clearInterval(timer);
  }, 40);
}

function typeText(target, text) {
  target.textContent = "";
  let index = 0;
  const timer = window.setInterval(() => {
    target.textContent = text.slice(0, index + 1);
    index += 3;
    if (index >= text.length) {
      target.textContent = text;
      window.clearInterval(timer);
    }
  }, 12);
}

function switchSection(sectionId) {
  document.querySelectorAll(".panel").forEach((panel) => panel.classList.toggle("active", panel.id === sectionId));
  document.querySelectorAll(".nav-link").forEach((button) => button.classList.toggle("active", button.dataset.section === sectionId));
}

function setTimelineStage(progress, status) {
  const steps = Array.from(els.statusTimeline.querySelectorAll(".timeline-step"));
  let activeIndex = 0;
  if (status === "failed") {
    if (progress >= 70) activeIndex = 2;
    else if (progress >= 25) activeIndex = 1;
    steps.forEach((step, index) => {
      step.classList.toggle("active", index <= activeIndex);
    });
    els.statusStageLabel.textContent = "Failed";
    els.statusHealthLabel.textContent = "Attention";
    return;
  }
  if (progress >= 25) activeIndex = 1;
  if (progress >= 70) activeIndex = 2;
  if (status === "completed" || progress >= 100) activeIndex = 3;

  steps.forEach((step, index) => {
    step.classList.toggle("active", index <= activeIndex);
  });

  const stageLabels = ["Queued", "Transcription", "Analytics", "Completed"];
  els.statusStageLabel.textContent = stageLabels[activeIndex];
  els.statusHealthLabel.textContent = status === "completed" ? "Stable" : "Running";
}

function buildWaveform() {
  els.waveform.innerHTML = "";
  Array.from({ length: 48 }).forEach((_, index) => {
    const bar = document.createElement("div");
    const height = 24 + Math.round(Math.abs(Math.sin(index * 0.5)) * 84);
    bar.className = "wave-bar";
    bar.style.height = `${height}px`;
    bar.style.animationDelay = `${index * 0.06}s`;
    els.waveform.appendChild(bar);
  });
}

function buildDistributionBars(items = []) {
  const rows = items.length
    ? items
    : [
        { label: "Completed", value: 0 },
        { label: "Active", value: 0 },
        { label: "Reports Ready", value: 0 },
        { label: "Failed", value: 0 }
      ];

  els.distributionBars.innerHTML = "";
  rows.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "distribution-row";
    row.innerHTML = `
      <div class="distribution-label"><span>${item.label}</span><span>${item.value}%</span></div>
      <div class="distribution-track"><div class="distribution-fill" style="width:${item.value}%; animation-delay:${index * 0.1}s"></div></div>
    `;
    els.distributionBars.appendChild(row);
  });
}

function createTag(text) {
  const span = document.createElement("span");
  span.className = "tag";
  span.textContent = text;
  return span;
}

function createStackItem(title, subtitle) {
  const div = document.createElement("div");
  div.innerHTML = `<strong>${title}</strong><div>${subtitle}</div>`;
  return div;
}

function buildExecutiveBrief(report) {
  els.executiveBrief.innerHTML = "";
  [
    ["Conversation Outcome", report.summary.slice(0, 140) + (report.summary.length > 140 ? "..." : "")],
    ["SOP Compliance", `${report.sop_validation.score}% process adherence detected`],
    ["Payment Intent", `${report.payment_analysis.primary_category} surfaced as the strongest intent signal`]
  ].forEach(([title, text]) => {
    els.executiveBrief.appendChild(createStackItem(title, text));
  });
}

function buildRecommendations(report) {
  els.recommendationList.innerHTML = "";
  const suggestions = [];
  if (report.sop_validation.score < 80) suggestions.push(["Improve SOP Flow", "Coach agents on missed greeting, verification, or closing cues."]);
  if (report.rejection_analysis.has_rejection) suggestions.push(["Handle Objection Earlier", `Primary objection: ${report.rejection_analysis.primary_reason}. Introduce rebuttal scripts sooner.`]);
  if (report.payment_analysis.primary_category === "Unknown") suggestions.push(["Strengthen Payment Framing", "Calls are not surfacing a clear payment option. Use clearer commitment prompts."]);
  if (!suggestions.length) suggestions.push(["Maintain Momentum", "This call looks healthy. Use it as a benchmark example for the team."]);

  suggestions.forEach(([title, text]) => {
    els.recommendationList.appendChild(createStackItem(title, text));
  });
}

function setTranscriptFocus(target) {
  const rawCard = els.rawTranscript.closest(".card");
  const cleanCard = els.cleanTranscript.closest(".card");
  const focusRaw = target === "raw";
  rawCard.style.borderColor = focusRaw ? "rgba(34, 211, 238, 0.28)" : "";
  cleanCard.style.borderColor = !focusRaw ? "rgba(34, 211, 238, 0.28)" : "";
  els.focusRaw.classList.toggle("active", focusRaw);
  els.focusClean.classList.toggle("active", !focusRaw);
  (focusRaw ? els.rawTranscript : els.cleanTranscript).scrollIntoView({ behavior: "smooth", block: "nearest" });
}

async function submitJob() {
  try {
    els.submitState.textContent = "Submitting";
    const formData = new FormData();
    if (els.audioUrl.value.trim()) formData.append("audio_url", els.audioUrl.value.trim());
    if (els.batchUrls.value.trim()) formData.append("audio_urls", els.batchUrls.value.trim());
    if (els.audioFile.files[0]) formData.append("audio_file", els.audioFile.files[0]);
    formData.append("language_hint", els.languageHint.value);

    const result = await fetch(`${getApiBase()}/api/v1/calls/analyze`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getApiKey()}`
      },
      body: formData
    }).then(async (response) => {
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    });

    sessionStats.submittedJobs.add(result.job_id);
    sessionStats.completedJobs.delete(result.job_id);
    sessionStats.failedJobs.delete(result.job_id);
    sessionStats.reportsReady.delete(result.job_id);

    els.jobIdInput.value = result.job_id;
    els.submitState.textContent = `Queued: ${result.job_id}`;
    switchSection("status");
    showToast("Job submitted successfully.");
    await loadOverview();
    beginPolling();
  } catch (error) {
    els.submitState.textContent = "Failed";
    showToast(error.message || "Unable to submit job.");
  }
}

async function submitBatchJobs() {
  const urls = els.batchUrls.value.trim();
  if (!urls) {
    showToast("Enter at least one batch audio URL.");
    return;
  }

  try {
    els.submitState.textContent = "Submitting batch";
    const formData = new FormData();
    formData.append("audio_urls", urls);
    formData.append("language_hint", els.languageHint.value);

    const result = await fetch(`${getApiBase()}/api/v1/calls/analyze-batch`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getApiKey()}`
      },
      body: formData
    }).then(async (response) => {
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    });

    result.batch_job_ids.forEach((jobId) => {
      sessionStats.submittedJobs.add(jobId);
      sessionStats.completedJobs.delete(jobId);
      sessionStats.failedJobs.delete(jobId);
      sessionStats.reportsReady.delete(jobId);
    });

    els.batchResult.classList.remove("hidden");
    els.batchResult.innerHTML = `
      <strong>Batch queued:</strong> ${result.queued_items} jobs<br />
      <strong>Job IDs:</strong><br />
      ${result.batch_job_ids.map((id) => `<div>${id}</div>`).join("")}
    `;
    els.jobIdInput.value = result.batch_job_ids[0] || "";
    els.submitState.textContent = `Batch queued: ${result.queued_items}`;
    showToast("Batch jobs submitted successfully.");
    await loadOverview();
    switchSection("status");
    beginPolling();
  } catch (error) {
    els.submitState.textContent = "Batch failed";
    showToast(error.message || "Unable to submit batch jobs.");
  }
}

async function loadStatus() {
  const jobId = els.jobIdInput.value.trim();
  if (!jobId) {
    showToast("Enter a job id first.");
    return;
  }

  try {
    const result = await api(`/api/v1/jobs/${jobId}`);
    sessionStats.submittedJobs.add(jobId);
    updateOverviewMetrics();

    els.progressBar.style.width = `${result.progress || 0}%`;
    setTimelineStage(result.progress || 0, result.status);
    els.statusRetryLabel.textContent = String(result.retry_count || 0);
    els.statusDetails.innerHTML = `
      <strong>Status:</strong> ${result.status}<br />
      <strong>Progress:</strong> ${result.progress}%<br />
      <strong>Retry Count:</strong> ${result.retry_count}<br />
      <strong>Error:</strong> ${result.error_message || "None"}
    `;

    if (result.status === "failed") {
      sessionStats.failedJobs.add(jobId);
      sessionStats.completedJobs.delete(jobId);
      sessionStats.reportsReady.delete(jobId);
      await loadOverview();
      return;
    }

    if (result.status === "completed") {
      sessionStats.completedJobs.add(jobId);
      sessionStats.failedJobs.delete(jobId);
      sessionStats.reportsReady.add(jobId);
      if (pollingTimer) {
        window.clearInterval(pollingTimer);
        pollingTimer = null;
      }
      await loadReport(jobId);
      switchSection("report");
      return;
    }

    await loadOverview();
  } catch (error) {
    showToast(error.message || "Unable to fetch job status.");
  }
}

function beginPolling() {
  if (pollingTimer) window.clearInterval(pollingTimer);
  loadStatus();
  pollingTimer = window.setInterval(loadStatus, 3000);
  showToast("Started polling job status.");
}

async function retryJob() {
  const jobId = els.jobIdInput.value.trim();
  if (!jobId) {
    showToast("Enter a failed job id first.");
    return;
  }

  try {
    const result = await api(`/api/v1/jobs/${jobId}/retry`, { method: "POST" });
    sessionStats.submittedJobs.add(jobId);
    sessionStats.failedJobs.delete(jobId);
    sessionStats.completedJobs.delete(jobId);
    sessionStats.reportsReady.delete(jobId);
    els.progressBar.style.width = `${result.progress || 0}%`;
    setTimelineStage(result.progress || 0, result.status);
    els.statusRetryLabel.textContent = String(result.retry_count || 0);
    showToast("Retry queued.");
    await loadOverview();
    beginPolling();
  } catch (error) {
    showToast(error.message || "Retry failed.");
  }
}

async function loadReport(jobId = els.jobIdInput.value.trim()) {
  if (!jobId) {
    showToast("Enter a completed job id first.");
    return;
  }

  try {
    const report = await api(`/api/v1/reports/${jobId}`);
    currentReport = report;
    sessionStats.submittedJobs.add(jobId);
    sessionStats.completedJobs.add(jobId);
    sessionStats.failedJobs.delete(jobId);
    sessionStats.reportsReady.add(jobId);

    els.reportEmpty.classList.add("hidden");
    els.reportContent.classList.remove("hidden");
    typeText(els.summaryText, report.summary);
    els.insightPayment.textContent = report.payment_analysis.primary_category;
    els.insightRejection.textContent = report.rejection_analysis.primary_reason || "None";
    els.insightKeywords.textContent = String(report.keywords.length);
    els.rawTranscript.textContent = report.transcript.raw;
    els.cleanTranscript.textContent = report.transcript.cleaned;

    const score = report.sop_validation.score;
    els.sopScore.textContent = score;
    els.sopScore.style.background = `conic-gradient(var(--cyan) 0deg, var(--violet) ${Math.max(
      8,
      (score / 100) * 360
    )}deg, rgba(255,255,255,0.08) ${Math.max(8, (score / 100) * 360)}deg 360deg)`;
    els.sopChecks.innerHTML = "";
    report.sop_validation.checks.forEach((check) => {
      els.sopChecks.appendChild(createStackItem(`${check.name} - ${check.passed ? "Passed" : "Missing"}`, check.evidence || "No evidence"));
    });

    els.paymentPrimary.textContent = report.payment_analysis.primary_category;
    els.paymentBars.innerHTML = "";
    Object.entries(report.payment_analysis.counts).forEach(([name, value]) => {
      const wrapper = document.createElement("div");
      wrapper.className = "metric-bar";
      wrapper.innerHTML = `
        <div class="metric-label"><span>${name}</span><span>${value}</span></div>
        <div class="metric-track"><div class="metric-fill" style="width:${Math.min(100, value * 25)}%"></div></div>
      `;
      els.paymentBars.appendChild(wrapper);
    });
    els.paymentEvidence.innerHTML = "";
    report.payment_analysis.evidence_phrases.forEach((item) => els.paymentEvidence.appendChild(createTag(item)));

    els.rejectionPrimary.textContent = report.rejection_analysis.primary_reason || "None";
    els.rejectionReasons.innerHTML = "";
    report.rejection_analysis.all_reasons.forEach((item) => els.rejectionReasons.appendChild(createTag(item)));
    els.rejectionEvidence.innerHTML = "";
    report.rejection_analysis.evidence.forEach((item) => els.rejectionEvidence.appendChild(createStackItem("Evidence", item)));

    els.keywordList.innerHTML = "";
    report.keywords.forEach((keyword) => els.keywordList.appendChild(createTag(keyword)));
    buildExecutiveBrief(report);
    buildRecommendations(report);
    await loadOverview();
    showToast("Report loaded.");
  } catch (error) {
    showToast(error.message || "Unable to fetch report.");
  }
}

async function loadSopTemplate() {
  try {
    const result = await api("/api/v1/admin/sop-template");
    els.sopTemplateList.innerHTML = "";
    Object.entries(result.template).forEach(([name, phrases]) => {
      const card = document.createElement("div");
      card.className = "card soft";
      const tagContainer = document.createElement("div");
      tagContainer.className = "tag-list";
      phrases.forEach((phrase) => tagContainer.appendChild(createTag(phrase)));
      card.innerHTML = `<strong>${name}</strong>`;
      card.appendChild(tagContainer);
      els.sopTemplateList.appendChild(card);
    });
  } catch (error) {
    showToast(error.message || "Unable to load SOP template.");
  }
}

function downloadJson() {
  if (!currentReport) {
    showToast("Load a report first.");
    return;
  }
  const blob = new Blob([JSON.stringify(currentReport, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `call-report-${currentReport.job_id}.json`;
  link.click();
}

function clearUploadForm() {
  els.audioUrl.value = "";
  els.batchUrls.value = "";
  els.audioFile.value = "";
  els.languageHint.value = "auto";
  els.submitState.textContent = "Idle";
  els.batchResult.classList.add("hidden");
  els.batchResult.innerHTML = "";
}

async function copyText(text, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage);
  } catch {
    showToast("Clipboard action failed.");
  }
}

function toggleTheme() {
  const nextTheme = document.body.classList.contains("light") ? "dark" : "light";
  document.body.classList.toggle("light", nextTheme === "light");
  localStorage.setItem("calliq-theme", nextTheme);
}

function init() {
  document.body.classList.toggle("light", localStorage.getItem("calliq-theme") === "light");
  const normalizedApiBase = getApiBase();
  localStorage.setItem("calliq-api-base", normalizedApiBase);
  els.apiBaseInput.value = normalizedApiBase;
  els.apiKeyInput.value = getApiKey();
  buildWaveform();
  document.querySelectorAll(".counter").forEach(animateCounter);
  loadOverview();
  window.setTimeout(() => els.introLoader.classList.add("hidden"), 1200);

  document.querySelectorAll(".nav-link").forEach((button) => {
    button.addEventListener("click", () => switchSection(button.dataset.section));
  });

  document.querySelectorAll("[data-jump]").forEach((button) => {
    button.addEventListener("click", () => switchSection(button.dataset.jump));
  });

  els.saveApiKey.addEventListener("click", () => {
    const normalized = normalizeApiBase(els.apiBaseInput.value);
    els.apiBaseInput.value = normalized;
    localStorage.setItem("calliq-api-base", normalized);
    localStorage.setItem("calliq-api-key", els.apiKeyInput.value.trim() || DEFAULT_API_KEY);
    showToast("API configuration saved.");
    loadOverview();
  });

  els.themeToggle.addEventListener("click", toggleTheme);
  els.submitJob.addEventListener("click", submitJob);
  els.submitBatch.addEventListener("click", submitBatchJobs);
  els.clearUpload.addEventListener("click", clearUploadForm);
  els.checkStatus.addEventListener("click", loadStatus);
  els.startPolling.addEventListener("click", beginPolling);
  els.retryJob.addEventListener("click", retryJob);
  els.downloadJson.addEventListener("click", downloadJson);
  els.loadSopTemplate.addEventListener("click", loadSopTemplate);
  els.copySummary.addEventListener("click", () => copyText(currentReport?.summary || "", "Summary copied."));
  els.copyJobId.addEventListener("click", () => copyText(els.jobIdInput.value.trim(), "Job ID copied."));
  els.focusRaw.addEventListener("click", () => setTranscriptFocus("raw"));
  els.focusClean.addEventListener("click", () => setTranscriptFocus("clean"));
}

init();
