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
serviceSelect.addEventListener('change', () => summaryService.innerText = serviceSelect.value);
timeslotSelect.addEventListener('change', () => summaryDatetime.innerText = timeslotSelect.value || 'Seleccione un horario');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorDiv.style.display = 'none';

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const timeslot = timeslotSelect.value;
    const service = serviceSelect.value;

    // Validación básica
    if (!timeslot || !name || !email) {
        errorDiv.innerText = 'Por favor complete todos los campos obligatorios.';
        errorDiv.style.display = 'block';
        return;
    }

    // Éxito en Booking (M04)
    form.style.display = 'none';
    detailsP.innerText = `Turno confirmado para ${name} (${email}) el día ${timeslot} para ${service}.`;
    successDiv.style.display = 'block';

    // Simulación Notificación M06
    notificationsLog.innerHTML = `<strong>Correo enviado a ${email}:</strong><br>Hola ${name}, tu turno para "${service}" el día ${timeslot} ha sido confirmado con éxito.`;
});