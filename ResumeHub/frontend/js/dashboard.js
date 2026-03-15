let currentStep = 1;
const STORAGE_KEY = 'resumeData';

function nextStep() {
  const current = document.querySelector(`[data-step="${currentStep}"]`);
  if (current) current.classList.remove('active');
  currentStep = Math.min(currentStep + 1, 10);
  const next = document.querySelector(`[data-step="${currentStep}"]`);
  if (next) next.classList.add('active');
}

function prevStep() {
  const current = document.querySelector(`[data-step="${currentStep}"]`);
  if (current) current.classList.remove('active');
  currentStep = Math.max(currentStep - 1, 1);
  const prev = document.querySelector(`[data-step="${currentStep}"]`);
  if (prev) prev.classList.add('active');
}

function addEducationEntry() {
  const container = document.getElementById('education-entries');
  const entry = container.children[0].cloneNode(true);
  entry.querySelectorAll('input, textarea').forEach(el => {
    el.value = '';
  });
  container.appendChild(entry);
}

function addExperienceEntry() {
  const container = document.getElementById('experience-entries');
  const entry = container.children[0].cloneNode(true);
  entry.querySelectorAll('input, textarea').forEach(el => {
    el.value = '';
  });
  container.appendChild(entry);
}

function addPortfolioEntry() {
  const container = document.getElementById('portfolio-entries');
  const entry = container.children[0].cloneNode(true);
  entry.querySelectorAll('input, textarea').forEach(el => {
    if (el.type === 'file') return;
    el.value = '';
  });
  container.appendChild(entry);
}

function removeEntry(btn) {
  const parent = btn.parentElement;
  const container = parent.parentElement;
  if (container.children.length > 1) {
    parent.remove();
  }
}

let draggedItem = null;
const sectionsContainer = document.getElementById('sections-order');

if (sectionsContainer) {
  sectionsContainer.addEventListener('dragstart', e => {
    draggedItem = e.target;
    e.target.classList.add('dragging');
  });

  sectionsContainer.addEventListener('dragend', e => {
    e.target.classList.remove('dragging');
    draggedItem = null;
  });

  sectionsContainer.addEventListener('dragover', e => e.preventDefault());

  sectionsContainer.addEventListener('drop', e => {
    e.preventDefault();
    const afterElement = getDragAfterElement(sectionsContainer, e.clientY);
    if (afterElement == null) {
      sectionsContainer.appendChild(draggedItem);
    } else {
      sectionsContainer.insertBefore(draggedItem, afterElement);
    }
    updateSectionsOrder();
    updatePreview();
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.section-item:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    }
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateSectionsOrder() {
  if (!sectionsContainer) return;
  const order = Array.from(sectionsContainer.children).map(item => item.dataset.section);
  localStorage.setItem('sectionsOrder', JSON.stringify(order));
}

const themeColor = document.getElementById('theme-color');
const themeFont = document.getElementById('theme-font');
const themeSpacing = document.getElementById('theme-spacing');
const themeDark = document.getElementById('theme-dark');

function updateTheme() {
  if (!themeColor || !themeFont || !themeSpacing || !themeDark) return;

  document.documentElement.style.setProperty('--primary-color', themeColor.value);
  document.documentElement.style.setProperty('--font-family', themeFont.value);
  document.documentElement.style.setProperty('--section-spacing', themeSpacing.value + 'em');

  if (themeDark.checked) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  localStorage.setItem('theme', JSON.stringify({
    color: themeColor.value,
    font: themeFont.value,
    spacing: themeSpacing.value,
    dark: themeDark.checked
  }));
  updatePreview();
}

if (themeColor && themeFont && themeSpacing && themeDark) {
  [themeColor, themeFont, themeSpacing, themeDark].forEach(el => {
    el.addEventListener('input', updateTheme);
  });
}

const savedTheme = JSON.parse(localStorage.getItem('theme') || '{}');
if (themeColor) themeColor.value = savedTheme.color || '#007bff';
if (themeFont) themeFont.value = savedTheme.font || 'Arial';
if (themeSpacing) themeSpacing.value = savedTheme.spacing || 1;
if (themeDark) themeDark.checked = !!savedTheme.dark;
updateTheme();

const savedOrder = localStorage.getItem('sectionsOrder');
if (savedOrder && sectionsContainer) {
  const order = JSON.parse(savedOrder);
  order.forEach(sec => {
    const item = document.querySelector(`[data-section="${sec}"]`);
    if (item) sectionsContainer.appendChild(item);
  });
}

function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function collectEducation() {
  return Array.from(document.querySelectorAll('#education-entries .entry')).map(entry => ({
    degree: entry.querySelector('.ed-degree')?.value?.trim() || '',
    field: entry.querySelector('.ed-field')?.value?.trim() || '',
    institution: entry.querySelector('.ed-institution')?.value?.trim() || '',
    startYear: entry.querySelector('.ed-start')?.value?.trim() || '',
    endYear: entry.querySelector('.ed-end')?.value?.trim() || '',
    cgpa: entry.querySelector('.ed-cgpa')?.value?.trim() || '',
    description: entry.querySelector('.ed-desc')?.value?.trim() || ''
  })).filter(ed => ed.degree || ed.institution || ed.field);
}

function collectExperience() {
  return Array.from(document.querySelectorAll('#experience-entries .entry')).map(entry => ({
    jobTitle: entry.querySelector('.exp-title')?.value?.trim() || '',
    company: entry.querySelector('.exp-company')?.value?.trim() || '',
    employmentType: entry.querySelector('.exp-type')?.value?.trim() || '',
    startDate: entry.querySelector('.exp-start')?.value?.trim() || '',
    endDate: entry.querySelector('.exp-end')?.value?.trim() || '',
    description: entry.querySelector('.exp-desc')?.value?.trim() || '',
    achievements: entry.querySelector('.exp-achieve')?.value?.trim() || ''
  })).filter(exp => exp.jobTitle || exp.company);
}

function collectPortfolio() {
  return Array.from(document.querySelectorAll('#portfolio-entries .entry')).map(entry => ({
    title: entry.querySelector('.port-title')?.value?.trim() || '',
    description: entry.querySelector('.port-desc')?.value?.trim() || '',
    link: entry.querySelector('.port-link')?.value?.trim() || ''
  })).filter(item => item.title || item.description || item.link);
}

function collectFormData() {
  const templateSelect = document.getElementById('template-select');
  const selectedTemplate = templateSelect?.value && templateSelect.value !== 'Select Template'
    ? templateSelect.value
    : 'general';

  return {
    personalInformation: {
      fullName: val('personal-fullName'),
      professionalTitle: val('personal-professionalTitle'),
      email: val('personal-email'),
      phone: val('personal-phone'),
      address: val('personal-address'),
      linkedin: val('personal-linkedin'),
      github: val('personal-github')
    },
    education: collectEducation(),
    experience: collectExperience(),
    skills: val('skills').split(',').map(s => s.trim()).filter(Boolean),
    portfolio: collectPortfolio(),
    sectionsOrder: JSON.parse(localStorage.getItem('sectionsOrder') || '[]'),
    templateType: selectedTemplate,
    updatedAt: new Date().toISOString()
  };
}

function populateForm(resume) {
  if (!resume) return;

  document.getElementById('personal-fullName').value = resume.personalInformation?.fullName || '';
  document.getElementById('personal-professionalTitle').value = resume.personalInformation?.professionalTitle || '';
  document.getElementById('personal-email').value = resume.personalInformation?.email || '';
  document.getElementById('personal-phone').value = resume.personalInformation?.phone || '';
  document.getElementById('personal-address').value = resume.personalInformation?.address || '';
  document.getElementById('personal-linkedin').value = resume.personalInformation?.linkedin || '';
  document.getElementById('personal-github').value = resume.personalInformation?.github || '';

  const templateSelect = document.getElementById('template-select');
  if (templateSelect && resume.templateType) {
    templateSelect.value = resume.templateType;
  }

  const skillsInput = document.getElementById('skills');
  if (skillsInput) {
    skillsInput.value = Array.isArray(resume.skills) ? resume.skills.join(', ') : '';
  }
}

function updatePreview() {
  const data = collectFormData();
  sessionStorage.setItem('previewData', JSON.stringify(data));

  const iframe = document.getElementById('live-preview');
  if (!iframe) return;

  const nextSrc = `preview.html?template=${encodeURIComponent(data.templateType || 'general')}&live=1`;
  if (!iframe.src || !iframe.src.endsWith(nextSrc)) {
    iframe.src = nextSrc;
  }
}

function saveLocalResume() {
  const data = collectFormData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  sessionStorage.setItem('previewData', JSON.stringify(data));
  alert('Saved locally in browser storage.');
}

function toBase64Unicode(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  bytes.forEach(byte => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function fromBase64Unicode(base64Text) {
  const binary = atob(base64Text);
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

function inferRepoFromLocation() {
  const host = window.location.hostname || '';
  const pathnameParts = window.location.pathname.split('/').filter(Boolean);

  if (host.endsWith('.github.io')) {
    return {
      owner: host.split('.')[0],
      repo: pathnameParts[0] || ''
    };
  }

  return { owner: '', repo: '' };
}

function buildDefaultDataPath() {
  const user = JSON.parse(localStorage.getItem('resumehubUser') || '{}');
  const resume = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  const candidate = user.email || user.name || resume.personalInformation?.fullName || 'resume';
  return `ResumeHub/data/${slugify(candidate) || 'resume'}-data.json`;
}

function saveGitHubConfig(cfg) {
  localStorage.setItem('resumehubGithubConfig', JSON.stringify(cfg));
}

function getGitHubConfigFromInputs() {
  const owner = document.getElementById('gh-owner')?.value.trim() || '';
  const repo = document.getElementById('gh-repo')?.value.trim() || '';
  const branch = document.getElementById('gh-branch')?.value.trim() || 'main';
  const path = document.getElementById('gh-path')?.value.trim() || buildDefaultDataPath();
  const token = document.getElementById('gh-token')?.value.trim() || '';

  if (!owner || !repo || !branch || !path) {
    return null;
  }

  return { owner, repo, branch, path, token };
}

function initializeGitHubConfigInputs() {
  const saved = JSON.parse(localStorage.getItem('resumehubGithubConfig') || '{}');
  const inferred = inferRepoFromLocation();

  const defaults = {
    owner: saved.owner || inferred.owner || 'ayushhh980',
    repo: saved.repo || inferred.repo || 'Resume-Hub',
    branch: saved.branch || 'main',
    path: saved.path || buildDefaultDataPath(),
    token: saved.token || ''
  };

  document.getElementById('gh-owner').value = defaults.owner;
  document.getElementById('gh-repo').value = defaults.repo;
  document.getElementById('gh-branch').value = defaults.branch;
  document.getElementById('gh-path').value = defaults.path;
  document.getElementById('gh-token').value = defaults.token;
}

function getGitHubConfig() {
  const cfg = getGitHubConfigFromInputs();
  if (!cfg) return null;
  saveGitHubConfig(cfg);
  return cfg;
}

async function fetchGitHubFileMeta(cfg) {
  const endpoint = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${cfg.path}`;
  const headers = {
    Accept: 'application/vnd.github+json'
  };
  if (cfg.token) {
    headers.Authorization = `Bearer ${cfg.token}`;
  }

  const response = await fetch(`${endpoint}?ref=${encodeURIComponent(cfg.branch)}`, {
    headers
  });

  if (response.status === 404) {
    return { sha: null };
  }

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(`GitHub read failed: ${msg}`);
  }

  const data = await response.json();
  return { sha: data.sha, content: data.content };
}

async function saveToGitHub() {
  try {
    const cfg = getGitHubConfig();
    if (!cfg) return;
    if (!cfg.token) {
      alert('GitHub token required for save. Add token in GitHub Config.');
      return;
    }

    const data = collectFormData();
    const body = {
      message: 'Update resume data from static frontend',
      branch: cfg.branch,
      content: toBase64Unicode(JSON.stringify(data, null, 2))
    };

    const existing = await fetchGitHubFileMeta(cfg);
    if (existing.sha) {
      body.sha = existing.sha;
    }

    const endpoint = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${cfg.path}`;
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(`GitHub write failed: ${msg}`);
    }

    saveLocalResume();
    alert('Saved to GitHub repository successfully.');
  } catch (err) {
    alert(err.message);
  }
}

async function loadFromGitHub() {
  try {
    const cfg = getGitHubConfig();
    if (!cfg) return;

    const existing = await fetchGitHubFileMeta(cfg);
    if (!existing.content) {
      alert('No file found at the given path.');
      return;
    }

    const parsed = JSON.parse(fromBase64Unicode(existing.content.replace(/\n/g, '')));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    populateForm(parsed);
    updatePreview();
    alert('Loaded resume data from GitHub file.');
  } catch (err) {
    alert(err.message);
  }
}

function loadLocalResume() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);
    populateForm(parsed);
    sessionStorage.setItem('previewData', JSON.stringify(parsed));
  } catch (err) {
    console.error('Invalid local resume data', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initializeGitHubConfigInputs();
  loadLocalResume();
  updatePreview();

  document.getElementById('save-resume').addEventListener('click', saveLocalResume);
  document.getElementById('save-github').addEventListener('click', saveToGitHub);
  document.getElementById('load-github').addEventListener('click', loadFromGitHub);
  document.getElementById('save-gh-config').addEventListener('click', () => {
    const cfg = getGitHubConfigFromInputs();
    if (!cfg) {
      alert('Please fill owner, repo, branch and path.');
      return;
    }
    saveGitHubConfig(cfg);
    alert('GitHub config saved.');
  });

  document.getElementById('preview-btn').addEventListener('click', () => {
    const data = collectFormData();
    sessionStorage.setItem('previewData', JSON.stringify(data));
    window.open(`preview.html?template=${encodeURIComponent(data.templateType || 'general')}`, '_blank');
  });

  document.getElementById('template-select').addEventListener('change', updatePreview);

  document.getElementById('logout').addEventListener('click', () => {
    sessionStorage.removeItem('previewData');
    window.location.href = '../index.html';
  });

  document.getElementById('dark-toggle').addEventListener('click', () => {
    if (!themeDark) return;
    themeDark.checked = !themeDark.checked;
    updateTheme();
  });

  document.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('input', () => {
      sessionStorage.setItem('previewData', JSON.stringify(collectFormData()));
    });
  });
});
