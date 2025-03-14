// Font categories 
const fontCategories = {
  'serif': [
    'Playfair Display', 'Lora', 'Merriweather', 'Source Serif Pro', 'Libre Baskerville',
    'Crimson Text', 'EB Garamond', 'Cormorant Garamond', 'Bitter', 'Spectral',
    'Noto Serif', 'Cardo', 'IBM Plex Serif', 'Zilla Slab', 'Tinos', 'Arvo', 
    'Alegreya', 'Neuton', 'PT Serif', 'Prata', 'Gloock', 'Alice', 'Lustria'
  ],
  'sans-serif': [
    'Hubot Sans', 'Inter', 'Roboto', 'Montserrat', 'Poppins', 'Open Sans', 'Raleway',
    'Work Sans', 'Nunito', 'Quicksand', 'DM Sans', 'Manrope', 'Karla', 'Outfit',
    'Rubik', 'Oxygen', 'Exo', 'Mulish', 'Heebo', 'Asap', 'Barlow'
  ],
  'display': [
    'Oswald', 'Archivo Black', 'Bebas Neue', 'Righteous', 'Anton', 'Fjalla One',
    'Staatliches', 'Alfa Slab One', 'Comfortaa', 'Josefin Sans', 'Paytone One',
    'Secular One', 'Shrikhand', 'Ultra', 'Bangers', 'Black Ops One'
  ],
  'handwriting': [
    'Pacifico', 'Caveat', 'Dancing Script', 'Satisfy', 'Indie Flower',
    'Just Another Hand', 'Shadows Into Light', 'Patrick Hand', 'Great Vibes',
    'Courgette', 'Kalam', 'Yellowtail'
  ],
  'monospace': [
    'JetBrains Mono', 'Fira Code', 'Space Mono', 'Share Tech Mono', 'Inconsolata',
    'Ubuntu Mono', 'Cousine', 'PT Mono', 'Roboto Mono', 'Source Code Pro'
  ]
};

// Map to track loaded fonts and app state
const loadedFonts = new Map();
const state = {
  headingFont: 'Hubot Sans',
  bodyFont: 'Inter',
  headingWeight: 700,
  bodyWeight: 400,
  headingCategory: 'all',
  bodyCategory: 'all',
  darkMode: true,
  favorites: JSON.parse(localStorage.getItem('fontPairFavorites')) || [],
  headingText: 'Typography is what language looks like.',
  bodyText: 'Good typography establishes a visual hierarchy for meaning by contrasting styles and sizes. A great font combination creates harmony between elements.'
};

// Preview text options
const previewMessages = [
  {
    heading: "Typography is what language looks like.",
    body: "Good typography establishes a visual hierarchy for meaning by contrasting styles and sizes. A great font combination creates harmony between elements."
  },
  {
    heading: "Font pairing is both art and science.",
    body: "Finding the perfect balance between fonts is about creating contrast while maintaining harmony. Your headings and body text should complement each other."
  },
  {
    heading: "Great design begins with typography.",
    body: "The fonts you choose set the tone for your entire design. They convey personality, establish brand identity, and guide the reader's eye through your content."
  }
];

// DOM Elements reference
let elements;

// Initialize DOM element references
function initElementRefs() {
  elements = {
    heading: {
      display: document.getElementById('heading-font-display'),
      select: document.getElementById('heading-font-select'),
      shuffleBtn: document.getElementById('shuffle-heading'),
      categories: document.getElementById('heading-categories'),
      previewEl: document.querySelector('.preview-heading'),
      weightSlider: document.getElementById('heading-weight'),
      weightValue: document.getElementById('heading-weight-value')
    },
    body: {
      display: document.getElementById('body-font-display'),
      select: document.getElementById('body-font-select'),
      shuffleBtn: document.getElementById('shuffle-body'),
      categories: document.getElementById('body-categories'),
      previewEl: document.querySelector('.preview-body'),
      weightSlider: document.getElementById('body-weight'),
      weightValue: document.getElementById('body-weight-value')
    },
    shuffleAllBtn: document.getElementById('shuffle-all'),
    statusEl: document.getElementById('status'),
    themeSwitch: document.getElementById('theme-switch'),
    favoritesBtn: document.getElementById('add-favorite-btn'),
    favoritesList: document.getElementById('favorites-list'),
    exportCssBtn: document.getElementById('export-css-btn'),
    exportImageBtn: document.getElementById('export-image-btn'),
    fullscreenBtn: document.getElementById('fullscreen-btn'),
    previewContainer: document.querySelector('.preview'),
    favoriteModal: document.getElementById('save-favorite-modal'),
    favoriteNameInput: document.getElementById('favorite-name-input'),
    cancelSaveBtn: document.getElementById('cancel-save-btn'),
    confirmSaveBtn: document.getElementById('confirm-save-btn')
  };
}

// Load font using Promise
function loadFont(fontName, weights = [400, 700]) {
  return new Promise((resolve, reject) => {
    if (loadedFonts.has(fontName) || fontName === 'Hubot Sans') {
      loadedFonts.set(fontName, true);
      return resolve();
    }
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@${weights.join(',')}&display=swap`;
    
    link.onload = () => {
      loadedFonts.set(fontName, true);
      resolve();
    };
    
    link.onerror = () => reject(`Failed to load font: ${fontName}`);
    document.head.appendChild(link);
  });
}

// Show status message
function showStatus(message, duration = 2500) {
  elements.statusEl.textContent = message;
  elements.statusEl.classList.add('active');
  
  setTimeout(() => elements.statusEl.classList.remove('active'), duration);
}

// Populate select options with fonts
function populateSelectOptions() {
  const allFonts = [...new Set([].concat(...Object.values(fontCategories)))].sort();
  
  ['heading', 'body'].forEach(type => {
    elements[type].select.innerHTML = '';
    allFonts.forEach(fontName => {
      const option = document.createElement('option');
      option.value = fontName;
      option.textContent = fontName;
      option.style.fontFamily = fontName;
      elements[type].select.appendChild(option);
    });
    elements[type].select.value = state[`${type}Font`];
  });
}

// Apply fonts to preview
async function applyFonts() {
  try {
    await Promise.all([
      loadFont(state.headingFont, [state.headingWeight]),
      loadFont(state.bodyFont, [state.bodyWeight])
    ]);
    
    // Update font displays and previews
    ['heading', 'body'].forEach(type => {
      const font = state[`${type}Font`];
      const weight = state[`${type}Weight`];
      
      elements[type].display.textContent = font;
      elements[type].display.style.fontFamily = `'${font}', sans-serif`;
      elements[type].previewEl.style.fontFamily = `'${font}', sans-serif`;
      elements[type].previewEl.style.fontWeight = weight;
    });
    
    // Set CSS variables
    document.documentElement.style.setProperty('--heading-font', `'${state.headingFont}', sans-serif`);
    document.documentElement.style.setProperty('--body-font', `'${state.bodyFont}', sans-serif`);
    
    // Animation reset
    elements.heading.previewEl.style.animation = 'none';
    elements.body.previewEl.style.animation = 'none';
    void elements.previewContainer.offsetWidth; // Force reflow
    elements.heading.previewEl.style.animation = 'fadeUp 0.5s ease forwards';
    elements.body.previewEl.style.animation = 'fadeUp 0.5s 0.1s ease forwards';
  } catch (error) {
    console.error('Error applying fonts:', error);
    showStatus('Error loading fonts. Using fallback.');
  }
}

// Get random font from a category
function getRandomFont(category = 'all') {
  const fonts = category === 'all' 
    ? [...new Set([].concat(...Object.values(fontCategories)))]
    : fontCategories[category] || fontCategories['sans-serif'];
  
  return fonts[Math.floor(Math.random() * fonts.length)];
}

// Set active category button
function setActiveCategory(categoryContainer, category) {
  categoryContainer.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });
}

// Get the selected category
function getSelectedCategory(type) {
  const activeBtn = elements[type].categories.querySelector('.category-btn.active');
  return activeBtn ? activeBtn.dataset.category : 'all';
}

// Shuffle font for the specified type
function shuffleFont(type) {
  const category = getSelectedCategory(type);
  const currentFont = state[`${type}Font`];
  let newFont;
  
  do {
    newFont = getRandomFont(category);
  } while (newFont === currentFont && Object.values(fontCategories).some(fonts => fonts.length > 1));
  
  state[`${type}Font`] = newFont;
  elements[type].select.value = newFont;
  applyFonts();
  
  showStatus(`${type.charAt(0).toUpperCase() + type.slice(1)} font set to ${newFont}`);
}

// Shuffle both fonts
function shuffleBoth() {
  shuffleFont('heading');
  shuffleFont('body');
  
  if (Math.random() > 0.7) cyclePreviewText();
}

// Cycle preview text
function cyclePreviewText() {
  const randomMessage = previewMessages[Math.floor(Math.random() * previewMessages.length)];
  
  state.headingText = randomMessage.heading;
  state.bodyText = randomMessage.body;
  
  elements.heading.previewEl.textContent = randomMessage.heading;
  elements.body.previewEl.textContent = randomMessage.body;
}

// Toggle dark mode
function toggleDarkMode() {
  state.darkMode = !state.darkMode;
  document.body.classList.toggle('dark-mode', state.darkMode);
  
  const icon = elements.themeSwitch.querySelector('i');
  if (state.darkMode) {
    icon.classList.replace('fa-moon', 'fa-sun');
    showStatus('Dark mode enabled');
  } else {
    icon.classList.replace('fa-sun', 'fa-moon');
    showStatus('Light mode enabled');
  }
}

// Favorite handling functions
function showSaveFavoriteModal() {
  elements.favoriteModal.classList.add('active');
  elements.favoriteNameInput.focus();
  
  elements.favoriteNameInput.value = `${state.headingFont} + ${state.bodyFont}`;
  elements.favoriteNameInput.select();
}

function hideSaveFavoriteModal() {
  elements.favoriteModal.classList.remove('active');
  elements.favoriteNameInput.value = '';
}

function addToFavorites() {
  showSaveFavoriteModal();
}

function saveNamedFontPair() {
  const pairName = elements.favoriteNameInput.value.trim() || `${state.headingFont} + ${state.bodyFont}`;
  
  const newFavorite = {
    id: Date.now(),
    name: pairName,
    headingFont: state.headingFont,
    bodyFont: state.bodyFont,
    headingWeight: state.headingWeight,
    bodyWeight: state.bodyWeight
  };
  
  // Check for duplicates
  const alreadyExists = state.favorites.some(fav => 
    fav.headingFont === newFavorite.headingFont && 
    fav.bodyFont === newFavorite.bodyFont &&
    fav.headingWeight === newFavorite.headingWeight &&
    fav.bodyWeight === newFavorite.bodyWeight
  );
  
  if (alreadyExists) {
    showStatus('This font pair is already in your favorites');
    hideSaveFavoriteModal();
    return;
  }
  
  state.favorites.push(newFavorite);
  localStorage.setItem('fontPairFavorites', JSON.stringify(state.favorites));
  
  updateFavoritesList();
  showStatus(`Font pair "${pairName}" added to favorites`);
  hideSaveFavoriteModal();
}

// Update the favorites list in the UI
function updateFavoritesList() {
  elements.favoritesList.innerHTML = '';
  
  if (state.favorites.length === 0) {
    elements.favoritesList.innerHTML = '<div class="favorite-item empty-favorites">No favorites saved yet.</div>';
    return;
  }
  
  state.favorites.forEach(favorite => {
    const favoriteItem = document.createElement('div');
    favoriteItem.className = 'favorite-item';
    
    // Create font previews
    const headingPreview = document.createElement('div');
    headingPreview.className = 'favorite-heading';
    headingPreview.style.fontFamily = `'${favorite.headingFont}', sans-serif`;
    headingPreview.style.fontWeight = favorite.headingWeight;
    headingPreview.textContent = 'Aa';
    
    const bodyPreview = document.createElement('div');
    bodyPreview.className = 'favorite-body';
    bodyPreview.style.fontFamily = `'${favorite.bodyFont}', sans-serif`;
    bodyPreview.style.fontWeight = favorite.bodyWeight;
    bodyPreview.textContent = 'Aa';
    
    // Font info
    const fontInfo = document.createElement('div');
    fontInfo.className = 'favorite-info';
    fontInfo.innerHTML = `<div>${favorite.name || `${favorite.headingFont} + ${favorite.bodyFont}`}</div>`;
    
    // Action buttons
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'favorite-actions';
    
    // Apply button
    const applyButton = document.createElement('button');
    applyButton.className = 'favorite-action-btn';
    applyButton.innerHTML = '<i class="fas fa-check"></i>';
    applyButton.title = 'Apply this font pair';
    applyButton.addEventListener('click', () => {
      state.headingFont = favorite.headingFont;
      state.bodyFont = favorite.bodyFont;
      state.headingWeight = favorite.headingWeight;
      state.bodyWeight = favorite.bodyWeight;
      
      elements.heading.select.value = favorite.headingFont;
      elements.body.select.value = favorite.bodyFont;
      elements.heading.weightSlider.value = favorite.headingWeight;
      elements.body.weightSlider.value = favorite.bodyWeight;
      elements.heading.weightValue.textContent = favorite.headingWeight;
      elements.body.weightValue.textContent = favorite.bodyWeight;
      
      applyFonts();
      showStatus(`Font pair "${favorite.name || `${favorite.headingFont} + ${favorite.bodyFont}`}" applied`);
    });
    
    // Delete button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'favorite-action-btn delete';
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.title = 'Delete this font pair';
    deleteButton.addEventListener('click', () => {
      state.favorites = state.favorites.filter(fav => fav.id !== favorite.id);
      localStorage.setItem('fontPairFavorites', JSON.stringify(state.favorites));
      updateFavoritesList();
      showStatus(`Font pair "${favorite.name || `${favorite.headingFont} + ${favorite.bodyFont}`}" removed`);
    });
    
    // Assemble the favorite item
    actionsContainer.appendChild(applyButton);
    actionsContainer.appendChild(deleteButton);
    
    favoriteItem.appendChild(headingPreview);
    favoriteItem.appendChild(bodyPreview);
    favoriteItem.appendChild(fontInfo);
    favoriteItem.appendChild(actionsContainer);
    
    elements.favoritesList.appendChild(favoriteItem);
  });
}

// Helper functions for CSS export
function getFontClassification(fontName) {
  if (fontCategories.serif.includes(fontName)) return "serif, medium contrast";
  if (fontCategories['sans-serif'].includes(fontName)) return "sans-serif, low contrast";
  if (fontCategories.display.includes(fontName)) return "display, high character";
  if (fontCategories.handwriting.includes(fontName)) return "script, flowing character";
  if (fontCategories.monospace.includes(fontName)) return "monospace, technical";
  return "mixed character";
}

function getGenericFamily(classification) {
  if (classification.includes("serif")) return "serif";
  if (classification.includes("sans-serif")) return "sans-serif";
  if (classification.includes("display")) return "sans-serif";
  if (classification.includes("script")) return "cursive";
  if (classification.includes("monospace")) return "monospace";
  return "sans-serif";
}

function getCategoryForFont(fontName) {
  for (const [category, fonts] of Object.entries(fontCategories)) {
    if (fonts.includes(fontName)) return category;
  }
  return 'sans-serif'; // Default
}

function determineContrastMatch(headingFont, bodyFont) {
  const headingCat = getCategoryForFont(headingFont);
  const bodyCat = getCategoryForFont(bodyFont);
  
  if (headingCat === bodyCat) return "Low (similar fonts)";
  
  if ((headingCat === 'serif' && bodyCat === 'sans-serif') || 
      (headingCat === 'sans-serif' && bodyCat === 'serif'))
    return "Moderate";
    
  if ((headingCat === 'display' || headingCat === 'handwriting') &&
      (bodyCat === 'serif' || bodyCat === 'sans-serif'))
    return "High";
  
  return "Moderate";
}

function determineStyleComplement(headingClass, bodyClass) {
  if ((headingClass.includes("serif") && bodyClass.includes("sans-serif")) ||
      (headingClass.includes("sans-serif") && bodyClass.includes("serif")) ||
      (headingClass.includes("display") && bodyClass.includes("serif")) ||
      (headingClass.includes("display") && bodyClass.includes("sans-serif")))
    return "Excellent";
    
  if (headingClass === bodyClass) return "Harmonious";
  
  return "Good";
}

// Copy CSS to clipboard
function copyCssToClipboard() {
  const now = new Date();
  const dateStr = now.toLocaleDateString();
  const timeStr = now.toLocaleTimeString();
  
  const headingClass = getFontClassification(state.headingFont);
  const bodyClass = getFontClassification(state.bodyFont);
  const contrastMatch = determineContrastMatch(state.headingFont, state.bodyFont);
  const styleComplement = determineStyleComplement(headingClass, bodyClass);
  
  const cssText = `/* Font Pair Export - ${state.headingFont}+${state.bodyFont} - ${dateStr}, ${timeStr}
   Heading: ${state.headingFont} (${headingClass})
   Body: ${state.bodyFont} (${bodyClass})
*/
@import url('https://fonts.googleapis.com/css2?family=${state.headingFont.replace(/ /g, '+')}:wght@${state.headingWeight}&family=${state.bodyFont.replace(/ /g, '+')}:wght@${state.bodyWeight}&display=swap');

:root {
  --heading-font: '${state.headingFont}', ${getGenericFamily(headingClass)};
  --body-font: '${state.bodyFont}', ${getGenericFamily(bodyClass)};
  --heading-weight: ${state.headingWeight};
  --body-weight: ${state.bodyWeight};
}

h1, h2, h3 {
  font-family: var(--heading-font);
  font-weight: var(--heading-weight);
}

body, p {
  font-family: var(--body-font);
  font-weight: var(--body-weight);
}

/* Pairing Notes: 
   Contrast Match: ${contrastMatch}
   Style Complement: ${styleComplement}
*/`;
  
  navigator.clipboard.writeText(cssText)
    .then(() => showStatus('CSS code copied to clipboard'))
    .catch(err => {
      showStatus('Failed to copy CSS');
      console.error('Failed to copy: ', err);
    });
}

// Export preview as image
function exportAsImage() {
  const preview = elements.previewContainer;
  showStatus('Preparing image for download...', 3000);
  
  html2canvas(preview, {
    backgroundColor: state.darkMode ? '#121212' : '#ffffff',
    scale: 2 // Higher quality
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = `fontpair-${state.headingFont}-${state.bodyFont}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showStatus('Image downloaded');
  }).catch(err => {
    console.error('Error exporting image:', err);
    showStatus('Failed to export image');
  });
}

// Toggle fullscreen preview
function toggleFullscreen() {
  const preview = elements.previewContainer;
  
  if (!document.fullscreenElement) {
    preview.requestFullscreen().then(() => {
      preview.classList.add('fullscreen');
    }).catch(err => {
      showStatus('Fullscreen mode not supported');
      console.error('Error enabling fullscreen:', err);
    });
  } else {
    document.exitFullscreen().then(() => {
      preview.classList.remove('fullscreen');
    });
  }
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  
  switch (e.key.toLowerCase()) {
    case 's': shuffleBoth(); break;
    case 'h': shuffleFont('heading'); break;
    case 'b': shuffleFont('body'); break;
    case 'd': toggleDarkMode(); break;
  }
}

// Set up event listeners
function setupEventListeners() {
  // Font selection changes
  ['heading', 'body'].forEach(type => {
    elements[type].select.addEventListener('change', e => {
      state[`${type}Font`] = e.target.value;
      applyFonts();
      showStatus(`${type.charAt(0).toUpperCase() + type.slice(1)} font set to ${state[`${type}Font`]}`);
    });
    
    // Weight controls
    elements[type].weightSlider.addEventListener('input', e => {
      state[`${type}Weight`] = parseInt(e.target.value);
      elements[type].weightValue.textContent = state[`${type}Weight`];
      applyFonts();
    });
  });
  
  // Shuffle buttons
  if (elements.heading.shuffleBtn) {
    elements.heading.shuffleBtn.addEventListener('click', () => shuffleFont('heading'));
  }
  
  if (elements.body.shuffleBtn) {
    elements.body.shuffleBtn.addEventListener('click', () => shuffleFont('body'));
  }
  
  if (elements.shuffleAllBtn) {
    elements.shuffleAllBtn.addEventListener('click', shuffleBoth);
  }
  
  // Category buttons for heading font
  if (elements.heading.categories) {
    const headingCategoryBtns = elements.heading.categories.querySelectorAll('.category-btn');
    headingCategoryBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const category = e.target.dataset.category;
        setActiveCategory(elements.heading.categories, category);
        state.headingCategory = category;
        shuffleFont('heading');
      });
    });
  }
  
  // Category buttons for body font
  if (elements.body.categories) {
    const bodyCategoryBtns = elements.body.categories.querySelectorAll('.category-btn');
    bodyCategoryBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const category = e.target.dataset.category;
        setActiveCategory(elements.body.categories, category);
        state.bodyCategory = category;
        shuffleFont('body');
      });
    });
  }
  
  // Mode toggle and feature buttons
  elements.themeSwitch.addEventListener('click', toggleDarkMode);
  elements.favoritesBtn.addEventListener('click', addToFavorites);
  elements.exportCssBtn.addEventListener('click', copyCssToClipboard);
  elements.exportImageBtn.addEventListener('click', exportAsImage);
  elements.fullscreenBtn.addEventListener('click', toggleFullscreen);
  
  // Modal events
  elements.cancelSaveBtn.addEventListener('click', hideSaveFavoriteModal);
  elements.confirmSaveBtn.addEventListener('click', saveNamedFontPair);
  elements.favoriteModal.addEventListener('click', (e) => {
    if (e.target === elements.favoriteModal) hideSaveFavoriteModal();
  });
  elements.favoriteNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') saveNamedFontPair();
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Load common fonts
async function preloadCommonFonts() {
  try {
    await Promise.all(['Inter', 'Roboto', 'Playfair Display'].map(font => loadFont(font)));
    console.log('Common fonts preloaded');
  } catch (error) {
    console.error('Failed to preload fonts:', error);
  }
}

// Initialize the app
function init() {
  initElementRefs();
  
  // Set dark mode by default
  state.darkMode = true;
  document.body.classList.add('dark-mode');
  
  // Update the icon for dark mode
  const icon = elements.themeSwitch.querySelector('i');
  if (icon) {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  }
  
  // Setup application
  populateSelectOptions();
  setupEventListeners();
  updateFavoritesList();
  preloadCommonFonts();
  
  // Initialize weight displays
  elements.heading.weightValue.textContent = state.headingWeight;
  elements.body.weightValue.textContent = state.bodyWeight;
  
  // Apply fonts
  applyFonts();
  
  // Set preview text
  elements.heading.previewEl.textContent = state.headingText;
  elements.body.previewEl.textContent = state.bodyText;
  
  // Welcome message
  showStatus('Welcome to FontySync - Dark mode enabled');
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', init); 