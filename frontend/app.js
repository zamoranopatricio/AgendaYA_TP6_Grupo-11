const form = document.getElementById('booking-form');
const serviceSelect = document.getElementById('service-select');
const timeslotSelect = document.getElementById('timeslot-select');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const summaryDatetime = document.getElementById('summary-datetime');
const summaryService = document.getElementById('summary-service');
const errorDiv = document.querySelector('[data-cy="error-message"]');
const successDiv = document.querySelector('[data-cy="booking-confirmation"]');
const detailsP = document.getElementById('confirmation-details');
const notificationsLog = document.getElementById('notifications-log');

// Actualizar resumen persistente
serviceSelect.addEventListener('change', () => summaryService.innerText = serviceSelect.value || 'No seleccionado');
timeslotSelect.addEventListener('change', () => summaryDatetime.innerText = timeslotSelect.value || 'No seleccionado');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorDiv.style.display = 'none';

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const timeslot = timeslotSelect.value;
    const service = serviceSelect.value;

    // Validación básica
    if (!timeslot || !name || !email || !service) {
        errorDiv.innerText = 'Por favor complete todos los campos obligatorios.';
        errorDiv.style.display = 'block';
        return;
    }

    // Validación de email
    if (!email.includes('@') || !email.includes('.')) {
        errorDiv.innerText = 'Ingrese un formato de correo electrónico válido.';
        errorDiv.style.display = 'block';
        return;
    }

    // Estado Pendiente en Booking (M04)
    form.style.display = 'none';

    // Asignamos el contenido directamente sin depender de tags hijos preexistentes
    successDiv.innerHTML = `
    <h3 style="margin-top: 0; color: #856404;">¡Reserva Pendiente de Confirmación!</h3>
    <p id="confirmation-details">
      Solicitud registrada para <strong>${name}</strong> (${email}) el día <strong>${timeslot}</strong> para <strong>${service}</strong>.<br><br>
      <em>Por favor revise su correo para aceptar el turno y confirmar su asistencia.</em>
    </p>
  `;
    successDiv.style.backgroundColor = '#fff3cd';
    successDiv.style.borderColor = '#ffeeba';
    successDiv.style.color = '#856404';
    successDiv.style.display = 'block';

    // Simulación Notificación M06
    notificationsLog.innerHTML = `
    <strong>Correo enviado a ${email}:</strong><br>
    Hola ${name}, recibimos tu solicitud de turno para "${service}" el día ${timeslot}. 
    Hacé clic en el siguiente enlace para confirmar tu reserva: <br>
    <a href="#" style="color: #0d6efd; font-weight: bold;">[Confirmar Turno]</a>
  `;
});