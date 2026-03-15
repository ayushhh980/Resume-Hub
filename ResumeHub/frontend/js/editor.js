// Drag drop editor
// Use HTML5 Drag and Drop API
const sortable = document.getElementById('sortable-sections');

function addSection(type) {
  const section = document.createElement('div');
  section.className = 'editor-section';
  section.draggable = true;
  section.innerHTML = `<h3>${type}</h3><textarea></textarea>`;
  sortable.appendChild(section);
}

// Make sortable
sortable.addEventListener('dragover', e => e.preventDefault());
sortable.addEventListener('drop', e => {
  e.preventDefault();
  // Reorder logic
});

