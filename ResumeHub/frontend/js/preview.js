// Preview logic
document.addEventListener('DOMContentLoaded', () => {
  const data = JSON.parse(sessionStorage.getItem('previewData') || '{}');
  const preview = document.getElementById('resume-preview');
  const template = data.template || 'general'; // from data

  // Load template from /templates/${template}.json
  fetch(`../templates/${template}.json`)
    .then(res => res.json())
    .then(tmpl => {
      preview.innerHTML = renderResume(tmpl, data);
    });

  document.getElementById('export-pdf').onclick = exportPDF;

  function renderResume(template, data) {
    return `
      <div class="resume">
        <h1>${data.personal?.fullName || ''}</h1>
        <p>${data.personal?.email || ''}</p>
        ${template.sections.map(sec => `<section><h2>${sec}</h2></section>`).join('')}
      </div>
    `;
  }

  function exportPDF() {
    const element = document.getElementById('resume-preview');
    html2pdf().set({ margin: 1, filename: 'resume.pdf' }).from(element).save();
  }
});

