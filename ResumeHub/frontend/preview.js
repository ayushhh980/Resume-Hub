// Dynamic template preview with export
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const templateType = urlParams.get('template') || 'general';
  const isLive = urlParams.get('live') === '1';

  const preview = document.getElementById('resume-preview');
  const tmplPath = `../templates/${templateType}.json`;

  function updatePreview() {
    const dataStr = sessionStorage.getItem('previewData') || localStorage.getItem('resumeData') || '{}';
    const data = JSON.parse(dataStr);

    fetch(tmplPath)
      .then(res => res.json())
      .then(tmpl => {
        preview.style.fontFamily = tmpl.fonts;
        preview.className = `resume ${tmpl.layout}`;
        preview.innerHTML = generateLayout(tmpl, data);
      })
      .catch(() => preview.innerHTML = '<p>Loading...</p>');
  }

  updatePreview();
  if (isLive) setInterval(updatePreview, 500);

  document.getElementById('export-pdf').onclick = () => {
    html2pdf().set({ margin: 1, filename: 'resume.pdf', html2canvas: { scale: 2 } }).from(preview).save();
  };

  document.getElementById('export-word').onclick = () => {
    const content = preview.innerText;
    const blob = new Blob(['Resume Content: ' + content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.doc';
    a.click();
  };
});

function generateLayout(tmpl, data) {
  const sections = {
    personalInformation: data.personalInformation || {},
    summary: data.summary || '',
    education: data.education || [],
    experience: data.experience || [],
    skills: data.skills || [],
    projects: data.projects || [],
    certifications: data.certifications || [],
    achievements: data.achievements || [],
    languages: data.languages || [],
    portfolio: data.portfolio || []
  };

  let html = `
    <header class="resume-header">
      <h1>${sections.personalInformation.fullName || ''}</h1>
      <p>${sections.personalInformation.professionalTitle || ''}</p>
      <p>${sections.personalInformation.email || ''}</p>
    </header>
  `;

const sectionsOrder = data.sectionsOrder || tmpl.sections;
  sectionsOrder.forEach(sec => {
    html += `<section class="resume-${sec}">
      <h2>${sec.charAt(0).toUpperCase() + sec.slice(1)}</h2>`;
    if (Array.isArray(sections[sec])) {
      sections[sec].forEach(item => html += `<div class="item">${Object.values(item).join(' ')}</div>`);
    } else {
      html += `<p>${sections[sec]}</p>`;
    }
    html += '</section>';
  });


  return html;
}

