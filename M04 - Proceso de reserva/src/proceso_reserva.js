function validarEmail(email) {
    if (typeof email !== 'string') return false;
    const trimmed = email.trim();
    if (trimmed.length === 0) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

function cumpleAntelacionMinima(fechaTurno, horasMinimas = 2) {
    if (!fechaTurno) return false;
    const turno = new Date(fechaTurno);
    const ahora = new Date();
    if (isNaN(turno.getTime())) return false;
    return (turno.getTime() - ahora.getTime()) / (1000 * 60 * 60) >= horasMinimas;
}

// Una selección temporal no bloquea el turno; una reserva pendiente o confirmada sí.
function estaHorarioDisponible(tipoEvento, fecha, hora, reservas) {
    return !reservas.some(reserva =>
        reserva.tipoEvento === tipoEvento &&
        reserva.fecha === fecha &&
        reserva.hora === hora &&
        ['PENDIENTE', 'CONFIRMADA'].includes(String(reserva.estado).toUpperCase())
    );
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validarEmail, cumpleAntelacionMinima, estaHorarioDisponible };
}

const horariosConfigurados = {
    Consulta: { '2026-09-30': ['09:00', '10:00', '11:00', '12:00'] },
    'Consulta Inicial': { '2026-10-15': ['10:00', '11:00'] },
    Seguimiento: { '2026-10-16': ['09:00', '10:00'] }
};
const reservasKey = 'm04-reservas';
const form = typeof document !== 'undefined' ? document.getElementById('booking-form') : null;

if (form) {
    const serviceSelect = document.getElementById('service-select');
    const dateSelect = document.getElementById('date-select');
    const timeslotSelect = document.getElementById('timeslot-select');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const steps = {
        event: document.getElementById('step-event'),
        date: document.getElementById('step-date'),
        time: document.getElementById('step-time')
    };
    const summary = document.querySelector('[data-cy="booking-summary"]');
    const summaryService = document.getElementById('summary-service');
    const summaryDate = document.getElementById('summary-date');
    const summaryTime = document.getElementById('summary-time');
    const errorDiv = document.querySelector('[data-cy="error-message"]');
    const unavailableDiv = document.querySelector('[data-cy="time-unavailable-error"]');
    const chooseAnotherTime = document.querySelector('[data-cy="choose-another-time"]');
    const continueToDate = document.querySelector('[data-cy="continue-to-date"]');
    const continueToTime = document.querySelector('[data-cy="continue-to-time"]');
    const continueToDetails = document.querySelector('[data-cy="continue-to-details"]');
    const successDiv = document.querySelector('[data-cy="booking-confirmation"]');
    const notificationsLog = document.getElementById('notifications-log');

    function leerReservas() {
        try {
            const reservas = JSON.parse(localStorage.getItem(reservasKey) || '[]');
            return Array.isArray(reservas) ? reservas : [];
        } catch (_) {
            return [];
        }
    }

    function mostrarPaso(paso) {
        Object.entries(steps).forEach(([nombre, elemento]) => {
            elemento.hidden = nombre !== paso;
        });
        summary.hidden = paso !== 'details';
        form.hidden = paso !== 'details';
        continueToDate.hidden = paso !== 'event' || !serviceSelect.value;
        continueToTime.hidden = paso !== 'date' || !dateSelect.value;
        continueToDetails.hidden = paso !== 'time' || !timeslotSelect.value;
    }

    function ocultarErrores() {
        errorDiv.hidden = true;
        unavailableDiv.hidden = true;
        chooseAnotherTime.hidden = true;
    }

    function agregarOpcion(select, valor, texto) {
        const opcion = document.createElement('option');
        opcion.value = valor;
        opcion.textContent = texto;
        select.appendChild(opcion);
    }

    function horariosLibres() {
        const horarios = horariosConfigurados[serviceSelect.value]?.[dateSelect.value] || [];
        const reservas = leerReservas();
        return horarios.filter(hora => estaHorarioDisponible(serviceSelect.value, dateSelect.value, hora, reservas));
    }

    function actualizarResumen() {
        summaryService.textContent = serviceSelect.value;
        summaryDate.textContent = dateSelect.value;
        summaryTime.textContent = timeslotSelect.value;
    }

    function actualizarFechas() {
        const anterior = dateSelect.value;
        dateSelect.replaceChildren();
        agregarOpcion(dateSelect, '', '-- Elija una fecha --');
        const reservas = leerReservas();
        Object.entries(horariosConfigurados[serviceSelect.value] || {}).forEach(([fecha, horarios]) => {
            if (horarios.some(hora => estaHorarioDisponible(serviceSelect.value, fecha, hora, reservas))) {
                agregarOpcion(dateSelect, fecha, fecha);
            }
        });
        if ([...dateSelect.options].some(opcion => opcion.value === anterior)) dateSelect.value = anterior;
        else timeslotSelect.value = '';
    }

    function actualizarHorarios() {
        const anterior = timeslotSelect.value;
        timeslotSelect.replaceChildren();
        agregarOpcion(timeslotSelect, '', '-- Elija un horario --');
        horariosLibres().forEach(hora => agregarOpcion(timeslotSelect, hora, hora));
        if ([...timeslotSelect.options].some(opcion => opcion.value === anterior)) timeslotSelect.value = anterior;
    }

    serviceSelect.addEventListener('change', () => {
        ocultarErrores();
        dateSelect.value = '';
        timeslotSelect.value = '';
        actualizarFechas();
        if (serviceSelect.value) mostrarPaso('date');
    });
    continueToDate.addEventListener('click', () => {
        actualizarFechas();
        mostrarPaso('date');
    });

    dateSelect.addEventListener('change', () => {
        ocultarErrores();
        timeslotSelect.value = '';
        actualizarHorarios();
        if (dateSelect.value) mostrarPaso('time');
    });
    continueToTime.addEventListener('click', () => {
        actualizarHorarios();
        mostrarPaso('time');
    });

    timeslotSelect.addEventListener('change', () => {
        ocultarErrores();
        if (timeslotSelect.value) {
            actualizarResumen();
            mostrarPaso('details');
        }
    });
    continueToDetails.addEventListener('click', () => {
        actualizarResumen();
        mostrarPaso('details');
    });

    document.querySelector('[data-cy="back-to-event"]').addEventListener('click', () => {
        ocultarErrores();
        mostrarPaso('event');
    });
    document.querySelector('[data-cy="back-to-date"]').addEventListener('click', () => {
        ocultarErrores();
        actualizarFechas();
        mostrarPaso('date');
    });
    function volverAHorarios() {
        ocultarErrores();
        actualizarHorarios();
        mostrarPaso('time');
    }
    document.querySelector('[data-cy="back-to-time"]').addEventListener('click', volverAHorarios);
    chooseAnotherTime.addEventListener('click', volverAHorarios);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        ocultarErrores();
        const nombre = nameInput.value.trim();
        const email = emailInput.value.trim();
        const tipoEvento = serviceSelect.value;
        const fecha = dateSelect.value;
        const hora = timeslotSelect.value;

        if (!tipoEvento || !fecha || !hora || !nombre || !email) {
            errorDiv.textContent = 'Por favor complete todos los campos obligatorios.';
            errorDiv.hidden = false;
            return;
        }
        if (!validarEmail(email)) {
            errorDiv.textContent = 'Ingrese un formato de correo electrónico válido.';
            errorDiv.hidden = false;
            return;
        }

        // Releer justo antes de guardar: lo mostrado al seleccionar puede haber cambiado.
        const reservas = leerReservas();
        if (!estaHorarioDisponible(tipoEvento, fecha, hora, reservas)) {
            unavailableDiv.textContent = 'El horario seleccionado ya no está disponible.';
            unavailableDiv.hidden = false;
            chooseAnotherTime.hidden = false;
            return;
        }

        reservas.push({ tipoEvento, fecha, hora, nombre, email, estado: 'PENDIENTE' });
        localStorage.setItem(reservasKey, JSON.stringify(reservas));
        mostrarPaso('success');
        successDiv.hidden = false;
        successDiv.textContent = `¡Reserva Pendiente de Confirmación! Solicitud registrada para ${nombre} (${email}) el ${fecha} a las ${hora} para ${tipoEvento}.`;
        notificationsLog.textContent = `Correo enviado a ${email}: recibimos tu solicitud de turno para ${tipoEvento} el ${fecha} a las ${hora}.`;
    });
}
