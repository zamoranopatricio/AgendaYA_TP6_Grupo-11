// Función 1: Validación de formato de email (Caso de estudio Integrante 1)
function validarEmail(email) {
    if (typeof email !== 'string') return false;
    const trimmed = email.trim();
    if (trimmed.length === 0) return false;

    // Expresión regular estándar para emails
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(trimmed);
}

// Función 2: Verificación de anticipación mínima (ej: 2 horas de antelación)
function cumpleAntelacionMinima(fechaTurno, horasMinimas = 2) {
    if (!fechaTurno) return false;
    const turno = new Date(fechaTurno);
    const ahora = new Date();
    if (isNaN(turno.getTime())) return false;

    const diferenciaMs = turno.getTime() - ahora.getTime();
    const horasDiferencia = diferenciaMs / (1000 * 60 * 60);
    return horasDiferencia >= horasMinimas;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validarEmail, cumpleAntelacionMinima };
}

// =============================================================
// M04 – Lógica de Reserva de Turno (solo en proceso_reserva.html)
// =============================================================
const form = typeof document !== 'undefined'
  ? document.getElementById('booking-form')
  : null;

if (form) {
  const serviceSelect    = document.getElementById('service-select');
  const timeslotSelect   = document.getElementById('timeslot-select');
  const nameInput        = document.getElementById('name');
  const emailInput       = document.getElementById('email');
  const summaryDatetime  = document.getElementById('summary-datetime');
  const summaryService   = document.getElementById('summary-service');
  const errorDiv         = document.querySelector('[data-cy="error-message"]');
  const successDiv       = document.querySelector('[data-cy="booking-confirmation"]');
  const notificationsLog = document.getElementById('notifications-log');

  // Actualizar resumen persistente
  serviceSelect?.addEventListener('change', () => {
    summaryService.innerText = serviceSelect.value || 'No seleccionado';
  });
  timeslotSelect?.addEventListener('change', () => {
    summaryDatetime.innerText = timeslotSelect.value || 'No seleccionado';
  });

  // Manejo del envío
  form.addEventListener('submit', (e) => {
    // Evita la recarga de página (elimina el '?' de la URL)
    e.preventDefault();

    if (errorDiv) errorDiv.style.display = 'none';

    const name     = nameInput?.value.trim()     ?? '';
    const email    = emailInput?.value.trim()    ?? '';
    const timeslot = timeslotSelect?.value       ?? '';
    const service  = serviceSelect?.value        ?? '';

    // Validación de campos
    if (!timeslot || !name || !email || !service) {
      if (errorDiv) {
        errorDiv.innerText     = 'Por favor complete todos los campos obligatorios.';
        errorDiv.style.display = 'block';
      }
      return;
    }

    // Validación de email
    if (!email.includes('@') || !email.includes('.')) {
      if (errorDiv) {
        errorDiv.innerText     = 'Ingrese un formato de correo electrónico válido.';
        errorDiv.style.display = 'block';
      }
      return;
    }

    // Ocultar formulario y mostrar estado pendiente
    form.style.display = 'none';

    if (successDiv) {
      successDiv.innerHTML = `
        <h2>¡Reserva Pendiente de Confirmación!</h2>
        <p>Solicitud registrada para <strong>${name}</strong> (${email}) el día <strong>${timeslot}</strong> para <strong>${service}</strong>.</p>
        <p><em>Por favor revise su correo para aceptar el turno y confirmar su asistencia.</em></p>
      `;
      successDiv.style.display = 'block';
    }

    // Log de notificación M06
    if (notificationsLog) {
      notificationsLog.innerHTML = `
        <strong>Correo enviado a ${email}:</strong><br>
        Hola ${name}, recibimos tu solicitud de turno para "${service}" el día ${timeslot}.
        Hacé clic en el enlace adjunto para confirmar tu reserva.
      `;
    }
  });
}
