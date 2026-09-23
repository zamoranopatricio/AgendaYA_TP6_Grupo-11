

// =============================================================
// M06 – Navegación entre vistas (solo si existe la nav)
// =============================================================
const navBookingBtn   = document.getElementById('nav-booking-btn');
const navTemplatesBtn = document.getElementById('nav-templates-btn');
const viewBooking     = document.getElementById('view-booking');
const viewTemplates   = document.getElementById('view-templates');

if (navBookingBtn && navTemplatesBtn) {
  function showView(view) {
    if (view === 'booking') {
      if (viewBooking)   viewBooking.style.display   = 'block';
      if (viewTemplates) viewTemplates.style.display = 'none';
      navBookingBtn.classList.add('active');
      navTemplatesBtn.classList.remove('active');
    } else {
      if (viewBooking)   viewBooking.style.display   = 'none';
      if (viewTemplates) viewTemplates.style.display = 'block';
      navBookingBtn.classList.remove('active');
      navTemplatesBtn.classList.add('active');
    }
  }

  navBookingBtn.addEventListener('click',   () => showView('booking'));
  navTemplatesBtn.addEventListener('click', () => showView('templates'));
}

// =============================================================
// M06 – Plantillas de Email (US_005 / M06-R04F)
//       Solo se inicializa si los elementos existen en la página
// =============================================================
const CHAR_LIMIT = 2000;

const templateTextarea = document.getElementById('template-textarea');
const charCounter      = document.getElementById('char-counter');
const templateError    = document.getElementById('template-error');
const successModal     = document.getElementById('success-modal');
const btnSave          = document.getElementById('btn-save-template');
const btnReset         = document.getElementById('btn-reset-template');
const btnCloseModal    = document.getElementById('btn-close-modal');

// Pestañas de tipo de plantilla
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// --- Contador de caracteres ---
function updateCharCounter() {
  if (!templateTextarea || !charCounter) return;
  const len = templateTextarea.value.length;
  charCounter.textContent = `${len} / ${CHAR_LIMIT} caracteres`;
  charCounter.classList.toggle('counter-warning', len > CHAR_LIMIT * 0.9);
  charCounter.classList.toggle('counter-error',   len >= CHAR_LIMIT);
}

templateTextarea?.addEventListener('input', updateCharCounter);

// --- Inserción de variables en la posición del cursor ---
function insertVariable(variable) {
  if (!templateTextarea) return;
  const start = templateTextarea.selectionStart;
  const end   = templateTextarea.selectionEnd;
  const text  = templateTextarea.value;

  templateTextarea.value = text.slice(0, start) + variable + text.slice(end);

  // Reposicionar el cursor tras la variable insertada
  const newPos = start + variable.length;
  templateTextarea.selectionStart = newPos;
  templateTextarea.selectionEnd   = newPos;
  templateTextarea.focus();

  updateCharCounter();
}

document.querySelector('[data-cy="btn-var-nombre-invitado"]')
  ?.addEventListener('click', () => insertVariable('[Nombre_Invitado]'));
document.querySelector('[data-cy="btn-var-nombre-prof"]')
  ?.addEventListener('click', () => insertVariable('[Nombre_Prof]'));
document.querySelector('[data-cy="btn-var-fecha"]')
  ?.addEventListener('click', () => insertVariable('[Fecha]'));
document.querySelector('[data-cy="btn-var-hora"]')
  ?.addEventListener('click', () => insertVariable('[Hora]'));

// --- Guardar Cambios: validaciones ---
btnSave?.addEventListener('click', () => {
  if (!templateTextarea || !templateError || !successModal) return;

  const text = templateTextarea.value;

  templateError.style.display = 'none';
  templateError.textContent   = '';
  successModal.style.display  = 'none';

  if (text.length > CHAR_LIMIT) {
    templateError.textContent   = 'Error: La plantilla supera el límite de 2000 caracteres';
    templateError.style.display = 'block';
    return;
  }

  if (!text.includes('[Fecha]')) {
    templateError.textContent   = 'Error: La plantilla debe incluir obligatoriamente la variable [Fecha]';
    templateError.style.display = 'block';
    return;
  }

  if (!text.includes('[Hora]')) {
    templateError.textContent   = 'Error: La plantilla debe incluir obligatoriamente la variable [Hora]';
    templateError.style.display = 'block';
    return;
  }

  // Válido → mostrar modal de éxito
  successModal.style.display = 'block';
});

// --- Restablecer ---
btnReset?.addEventListener('click', () => {
  if (!templateTextarea || !templateError || !successModal) return;
  templateTextarea.value      = '';
  templateError.style.display = 'none';
  successModal.style.display  = 'none';
  updateCharCounter();
});

// --- Cerrar modal ---
btnCloseModal?.addEventListener('click', () => {
  if (successModal) successModal.style.display = 'none';
});

