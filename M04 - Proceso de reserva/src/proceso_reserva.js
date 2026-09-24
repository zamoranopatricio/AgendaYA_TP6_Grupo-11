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

// Función 3: Verifica si una reserva es cancelable (Estado confirmada y > 24hs)
function esCancelable(reserva, fechaActual = new Date()) {
    if (!reserva || reserva.estado !== 'confirmada') return false;
    const fechaReserva = new Date(reserva.fecha);
    if (isNaN(fechaReserva.getTime())) return false;

    const diferenciaMs = fechaReserva.getTime() - fechaActual.getTime();
    const horasDiferencia = diferenciaMs / (1000 * 60 * 60);
    return horasDiferencia >= 24;
}

// Función 4: Busca reservas por email (reutiliza validarEmail)
function buscarReservasPorEmail(email, reservas) {
    if (!validarEmail(email)) return [];
    return reservas.filter(r => r.email === email);
}

// Función 5: Solicita cancelación (valida y genera token de expiración)
function solicitarCancelacion(reserva, fechaActual = new Date()) {
    if (!esCancelable(reserva, fechaActual)) return null;
    // Simula generar un token con 15 minutos de validez
    return {
        reservaId: reserva.id,
        fechaSolicitud: fechaActual.toISOString()
    };
}

// Función 6: Confirma cancelación validando 15 minutos (900000 ms)
function confirmarCancelacion(reserva, fechaSolicitudIso, fechaConfirmacion = new Date()) {
    if (!reserva || reserva.estado !== 'confirmada') return false;
    const fechaSolicitud = new Date(fechaSolicitudIso);
    if (isNaN(fechaSolicitud.getTime())) return false;
    
    const diferenciaMs = fechaConfirmacion.getTime() - fechaSolicitud.getTime();
    if (diferenciaMs >= 0 && diferenciaMs <= 15 * 60 * 1000) {
        reserva.estado = 'cancelada';
        return true;
    }
    return false;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validarEmail, cumpleAntelacionMinima, esCancelable, buscarReservasPorEmail, solicitarCancelacion, confirmarCancelacion };
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

  // =============================================================
  // Lógica de "Mis Reservas"
  // =============================================================
  const misReservasContainer = document.getElementById('mis-reservas-container');
  const mensajeCancelacion = document.getElementById('mensaje-cancelacion-resultado');
  const emailBusquedaInput = document.getElementById('email-busqueda');
  const btnBuscarReservas = document.getElementById('btn-buscar-reservas');

  // Datos hardcodeados simulando reservas del usuario
  let reservasUsuario = [
    { id: 1, email: "invitado@test.com", servicio: "Consulta Inicial", fecha: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), estado: "confirmada" }, 
    { id: 2, email: "invitado@test.com", servicio: "Seguimiento", fecha: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(), estado: "confirmada" }, 
    { id: 3, email: "otro@test.com", servicio: "Consulta Inicial", fecha: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), estado: "confirmada" },
    // Reservas de prueba para evaluar los distintos estados visuales
    { id: 4, email: "ejemplo@correo.com", servicio: "Consulta Inicial", fecha: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), estado: "confirmada" }, // Faltan 3 días -> Cancelable
    { id: 5, email: "ejemplo@correo.com", servicio: "Seguimiento", fecha: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), estado: "confirmada" }, // Faltan 12 hs -> No cancelable
    { id: 6, email: "ejemplo@correo.com", servicio: "Consulta Inicial", fecha: new Date(Date.now() + 100 * 60 * 60 * 1000).toISOString(), estado: "cancelada" }, // Estado distinto a confirmada -> No cancelable
    { id: 7, email: "ejemplo@correo.com", servicio: "Seguimiento", fecha: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), estado: "confirmada" } // Fue hace 2 días -> No cancelable
  ];

  let reservasVisualizadas = []; // Reservas del usuario actual

  if (btnBuscarReservas) {
      btnBuscarReservas.addEventListener('click', () => {
          const email = emailBusquedaInput?.value.trim() ?? '';
          if (!validarEmail(email)) {
              if (mensajeCancelacion) {
                  mensajeCancelacion.innerText = 'Por favor, ingrese un email válido para buscar.';
                  mensajeCancelacion.style.display = 'block';
                  mensajeCancelacion.style.color = 'red';
              }
              if (misReservasContainer) misReservasContainer.innerHTML = '';
              return;
          }
          if (mensajeCancelacion) mensajeCancelacion.style.display = 'none';
          reservasVisualizadas = buscarReservasPorEmail(email, reservasUsuario);
          renderizarReservas();
      });
  }

  function renderizarReservas() {
    if (!misReservasContainer) return;
    misReservasContainer.innerHTML = '';
    
    if (reservasVisualizadas.length === 0) {
      misReservasContainer.innerHTML = '<p>No se encontraron reservas para este correo.</p>';
      return;
    }

    reservasVisualizadas.forEach(reserva => {
        const div = document.createElement('div');
        div.className = 'summary-box';
        div.style.marginBottom = '10px';
        const fechaFormateada = new Date(reserva.fecha).toLocaleString();
        
        let html = `
            <p><strong>Servicio:</strong> ${reserva.servicio}</p>
            <p><strong>Fecha:</strong> ${fechaFormateada}</p>
            <p><strong>Estado:</strong> <span data-cy="estado-reserva">${reserva.estado}</span></p>
        `;

        if (esCancelable(reserva)) {
            html += `<button data-cy="btn-cancelar-reserva" data-id="${reserva.id}" class="btn-cancelar" style="background-color: #ffc107; color: black; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;">Solicitar Cancelación</button>`;
        } else if (reserva.estado === 'confirmada') {
            html += `<p style="color: #dc3545; font-size: 0.9em;">(No cancelable - Faltan menos de 24hs)</p>`;
        }
        
        div.innerHTML = html;
        misReservasContainer.appendChild(div);
    });

    // Agregar listeners a los botones de solicitar cancelación
    document.querySelectorAll('.btn-cancelar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const reserva = reservasUsuario.find(r => r.id === id);
            
            const token = solicitarCancelacion(reserva);
            if (token) {
                // Actualizar el estado visual del botón
                e.target.innerText = 'Notificación de cancelación enviada';
                e.target.style.backgroundColor = '#6c757d';
                e.target.style.color = 'white';
                e.target.disabled = true;
                e.target.style.cursor = 'default';

                if (mensajeCancelacion) {
                    mensajeCancelacion.style.display = 'none';
                }
                
                // NOTA: No inyectamos el enlace de confirmación en pantalla
                // ya que ese flujo corresponde al módulo M06 (Notificaciones).
            } else {
                if (mensajeCancelacion) {
                    mensajeCancelacion.innerText = 'No se pudo solicitar la cancelación.';
                    mensajeCancelacion.style.display = 'block';
                    mensajeCancelacion.style.color = 'red';
                }
            }
        });
    });
  }
}
