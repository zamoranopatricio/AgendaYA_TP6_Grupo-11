## E2E-01 — Horario ocupado oculto

### Arrange
- Existe el tipo de evento "Consulta".
- Existe el día "30/09/2026".
- Los horarios configurados son:
  - 09:00
  - 10:00
  - 11:00
  - 12:00
- El horario 10:00 figura como ocupado en localStorage.
- El usuario se encuentra en la pantalla de selección de fecha.

### Act
- El usuario selecciona el día 30/09/2026.

### Assert
- El horario 09:00 es visible.
- El horario 10:00 no es visible ni seleccionable.
- El horario 11:00 es visible.
- El horario 12:00 es visible.


## E2E-02 — Horario deja de estar disponible

### Arrange
- Existe el tipo de evento "Consulta".
- Existe el día "30/09/2026".
- El horario 11:00 se encuentra disponible.
- El usuario selecciona 11:00.
- Antes de confirmar la reserva, el horario 11:00 pasa a estar ocupado.

### Act
- El usuario completa los datos obligatorios.
- Presiona el botón "Confirmar reserva".

### Assert
- No se crea una nueva reserva.
- Se muestra el mensaje:
  "El horario seleccionado ya no está disponible."
- La reserva existente para las 11:00 no se modifica.
- El usuario puede volver a elegir otro horario.