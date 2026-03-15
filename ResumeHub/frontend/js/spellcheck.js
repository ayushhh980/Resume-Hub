// Free spellcheck w/ Typo.js CDN or simple dict
// Add to HTML: <script src="https://cdn.jsdelivr.net/npm/typo-js@1.1.0/Typo.js"></script>

const dictionary = {
  'resume': true,
  'portfolio': true,
  'linkedin': true,
  'github': true,
  // add common resume words
};

function checkSpelling(textarea) {
  const text = textarea.value;
  const words = text.split(/\s+/);
  let html = '';
  words.forEach(word => {
    if (dictionary[word.toLowerCase()] || !word.match(/[a-zA-Z]{3,}/)) {
      html += word + ' ';
    } else {
      html += `<span class="spell-error" data-word="${word}">${word}</span> `;
    }
  });
  textarea.style.height = 'auto';
  textarea.parentNode.insertAdjacentHTML('beforeend', `<div class="suggestions">${html}</div>`);
}

document.querySelectorAll('textarea').forEach(textarea => {
  textarea.addEventListener('input', () => checkSpelling(textarea));
  textarea.addEventListener('blur', () => {
    // suggestions popup
  });
});

// Right click correction
document.addEventListener('contextmenu', e => {
  if (e.target.classList.contains('spell-error')) {
    e.preventDefault();
    // suggest corrections from dict or algo
  }
});

