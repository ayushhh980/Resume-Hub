// Multi-step form logic
let currentStep = 1;

function nextStep() {
  document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
  currentStep++;
  document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
}

function prevStep() {
  document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
  currentStep--;
  document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
}

function addEducationEntry() {
  const container = document.getElementById('education-entries');
  const entry = container.children[0].cloneNode(true);
  container.appendChild(entry);
}

function addExperienceEntry() {
  const container = document.getElementById('experience-entries');
  const entry = container.children[0].cloneNode(true);
  container.appendChild(entry);
}




function addPortfolioEntry() {
  const container = document.getElementById('portfolio-entries');
  const entry = container.children[0].cloneNode(true);
  container.appendChild(entry);
}


function removeEntry(btn) {
  btn.parentElement.remove();
}

// Drag & drop sections
let draggedItem = null;
const sectionsContainer = document.getElementById('sections-order');

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

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.section-item:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateSectionsOrder() {
  const order = Array.from(sectionsContainer.children).map(item => item.dataset.section);
  localStorage.setItem('sectionsOrder', JSON.stringify(order));
}

// Customization
const themeColor = document.getElementById('theme-color');
const themeFont = document.getElementById('theme-font');
const themeSpacing = document.getElementById('theme-spacing');
const themeDark = document.getElementById('theme-dark');

function updateTheme() {
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

[themeColor, themeFont, themeSpacing, themeDark].forEach(el => el.addEventListener('input', updateTheme));

// Load theme
const savedTheme = JSON.parse(localStorage.getItem('theme') || '{}');
themeColor.value = savedTheme.color || '#007bff';
themeFont.value = savedTheme.font || 'Arial';
themeSpacing.value = savedTheme.spacing || 1;
themeDark.checked = savedTheme.dark || false;
updateTheme();

// Init order
const savedOrder = localStorage.getItem('sectionsOrder');
if (savedOrder) {
  const order = JSON.parse(savedOrder);
  order.forEach(sec => {
    const item = document.querySelector(`[data-section="${sec}"]`);
    if (item) sectionsContainer.appendChild(item);
  });
}


// Photo upload
document.getElementById('profile-photo').addEventListener('change', async (e) => {

  const formData = new FormData();
  formData.append('profilePic', e.target.files[0]);
  try {
    const res = await fetch('/api/upload/profile-pic', {
      method: 'POST',
      headers: authHeader(),
      body: formData
    });

    const data = await res.json();
    // Save path
    console.log('Photo:', data.filePath);
  } catch (err) {
    console.error(err);
  }
});

// Collect data
function collectFormData() {
  const data = {
    personalInformation: {
      fullName: document.getElementById('personal-fullName').value,
      // all personal fields
    },
education: Array.from(document.querySelectorAll('.ed-degree')).map((deg, i) => ({
      degree: deg.value,
      field: document.querySelectorAll('.ed-field')[i].value,
      // etc
    })),
    portfolio: Array.from(document.querySelectorAll('.port-title')).map((title, i) => ({
      title: title.value,
      desc: document.querySelectorAll('.port-desc')[i].value,
      link: document.querySelectorAll('.port-link')[i].value,
      image: document.querySelectorAll('.port-image')[i].dataset.url || ''
    })),

    sectionsOrder: JSON.parse(localStorage.getItem('sectionsOrder') || '[]'),
    // similar for experience etc
  };
  return data;
}


// Full API integration
let currentResumeId = null;

async function loadResumes() {
  try {
    const res = await fetch('/api/resumes/user-resumes', { headers: authHeader() });
    const resumes = await res.json();

    if (resumes.length) {
      currentResumeId = resumes[0]._id; // load latest
      populateForm(resumes[0]);
    }
  } catch (err) {
    console.error('Load resumes error', err);
  }
}

async function saveResume() {
  const data = collectFormData();
  try {
    let res;
    if (currentResumeId) {
      res = await fetch(`/api/resumes/update-resume/${currentResumeId}`, {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

    } else {
      res = await fetch('/api/resumes/create-resume', {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const newResume = await res.json();
      currentResumeId = newResume._id;
    }
    alert(`Saved! Share: http://localhost:5000/api/resume/share/${currentResumeId}`);

    updatePreview(); // live sync
  } catch (err) {
    alert('Save error: ' + err.message);
  }
}


function populateForm(resume) {
  // Fill form from resume data
  document.getElementById('personal-fullName').value = resume.personalInformation?.fullName || '';
  // fill all fields...
  updatePreview();
}

document.addEventListener('DOMContentLoaded', loadResumes);

document.getElementById('save-resume').onclick = saveResume;

