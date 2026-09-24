
# SPEC — M04 Proceso de Reserva

## 1. Objetivo

Implementar el flujo mínimo de reserva pública de AgendaYA correspondiente
al módulo M04, permitiendo que un Usuario Invitado pueda:

1. Visualizar los tipos de eventos disponibles.
2. Seleccionar un tipo de evento.
3. Visualizar los días disponibles para dicho evento.
4. Seleccionar un día.
5. Visualizar únicamente los horarios disponibles.
6. Seleccionar un horario.
7. Completar los datos necesarios para generar la reserva.
8. Crear la reserva.
9. Recibir posteriormente la posibilidad de confirmar o cancelar
   la reserva mediante la notificación correspondiente.

La implementación debe contemplar especialmente el manejo de horarios que
ya no se encuentran disponibles.

---

# 2. Trazabilidad

## Requisitos funcionales relacionados

### M04-R01F

El sistema debe mostrar los tipos de eventos configurados por el
Administrador y permitir al Usuario Invitado seleccionar uno.

Una vez seleccionado un tipo de evento deben poder visualizarse las fechas
y horas disponibles correspondientes.

### M04-R02F

El Usuario Invitado puede confirmar o cancelar una reserva a través de la
notificación enviada por correo electrónico.

La acción realizada debe actualizar el estado de la reserva.

### M04-R03F

El sistema debe ocultar automáticamente los turnos que ya hayan sido
tomados por otros usuarios.

El Usuario Invitado solamente debe visualizar horarios disponibles.

### M04-R04F

Una vez seleccionado un tipo de evento, el sistema debe mostrar un
calendario con los días y horarios disponibles.

El Usuario Invitado puede seleccionar el turno que prefiera.

Al seleccionar un turno se genera una reserva temporal.

---

# 3. Historias de Usuario relacionadas

## US_009 — Visualizar tipos de eventos

Como Usuario Invitado quiero visualizar los tipos de eventos disponibles
para poder elegir uno.

## US_013 — Seleccionar tipo de evento

Como Usuario Invitado quiero seleccionar uno de los tipos de eventos
mostrados para visualizar su disponibilidad de fechas y horarios.

## US_014 — Visualizar solamente turnos disponibles

Como Usuario Invitado quiero visualizar únicamente los turnos disponibles
para evitar seleccionar horarios que ya hayan sido tomados por otros
usuarios.

## US_015 — Visualizar días disponibles

Como Usuario Invitado quiero visualizar los días disponibles
correspondientes al tipo de evento seleccionado para luego consultar sus
horarios.

## US_016 — Visualizar horarios disponibles

Como Usuario Invitado quiero visualizar los horarios disponibles del día
seleccionado para poder elegir un turno.

## US_017 — Seleccionar turno disponible

Como Usuario Invitado quiero seleccionar un turno disponible para iniciar
el proceso de reserva.

## US_010 — Confirmar reserva

Como Usuario Invitado quiero poder confirmar la reserva a través del mail
recibido para dejar constancia de mi asistencia.

## US_011 — Cancelar reserva

Como Usuario Invitado quiero poder cancelar la reserva a través del mail
recibido para dejar constancia de mi ausencia.

---

# 4. Actor principal

Usuario Invitado.

El Usuario Invitado no necesita encontrarse registrado ni autenticado para
realizar una reserva.

---

# 5. Precondiciones

- El Usuario Invitado posee acceso al enlace público de AgendaYA.
- Existe al menos un tipo de evento configurado.
- Existen días y horarios configurados para al menos uno de los tipos de
  evento.
- El sistema dispone de información que permite distinguir horarios
  disponibles de horarios ya reservados.

---

# 6. Flujo principal

## Paso 1 — Selección de tipo de evento

El sistema muestra al Usuario Invitado los tipos de eventos disponibles.

El usuario selecciona uno.

El sistema guarda temporalmente la selección realizada.

---

## Paso 2 — Selección de fecha

Una vez seleccionado el evento, el sistema muestra únicamente los días
disponibles correspondientes al mismo.

El Usuario Invitado selecciona un día.

El sistema guarda temporalmente la fecha seleccionada.

---

## Paso 3 — Visualización de horarios

El sistema obtiene los horarios configurados para:

- el tipo de evento seleccionado;
- el día seleccionado.

Antes de mostrarlos, debe excluir aquellos horarios que se encuentren
ocupados.

El Usuario Invitado debe visualizar solamente horarios reservables.

---

## Paso 4 — Selección de horario

El Usuario Invitado selecciona uno de los horarios disponibles.

El sistema registra temporalmente:

- tipo de evento;
- fecha;
- horario.

En este momento puede generarse una reserva temporal según M04-R04F.
con la reserva temporal no se debe quitar la disponibilidad de los horarios, si no hasta que se cree la reserva poniendo los últimos datos necesarios


---

## Paso 5 — Datos de la reserva

El sistema muestra el formulario correspondiente al paso final del proceso
de reserva.

Durante este paso debe mostrarse persistentemente un resumen con:

- tipo de evento seleccionado;
- fecha seleccionada;
- horario seleccionado.

Los campos obligatorios no pueden quedar vacíos.

Si faltan datos obligatorios, el sistema debe impedir la creación de la
reserva y mostrar un mensaje de error visible.

---

## Paso 6 — Confirmación de creación

Antes de crear definitivamente la reserva, el sistema debe volver a
verificar que el horario seleccionado continúe disponible.

Si continúa disponible:

- se crea la reserva;
- el horario pasa a considerarse ocupado;
- se muestra al Usuario Invitado una confirmación visible;
- se almacenan los datos necesarios para continuar el flujo de
  notificaciones.

---

# 7. Manejo de horario no disponible

Esta sección implementa el flujo opcional indicado para M04 en TP6.

## Caso A — Horario ya ocupado antes de visualizar la pantalla

Si un horario ya se encuentra reservado cuando el Usuario Invitado consulta
la disponibilidad:

- dicho horario no debe mostrarse como seleccionable;
- solamente deben mostrarse los horarios libres.

### Ejemplo

Horarios configurados:

- 09:00
- 10:00
- 11:00
- 12:00

Horarios ocupados:

- 10:00

Horarios mostrados:

- 09:00
- 11:00
- 12:00

El horario 10:00 no debe poder seleccionarse.

---

## Caso B — Horario deja de estar disponible durante el proceso

Puede ocurrir que:

1. El Usuario A visualice 11:00 como disponible.
2. Seleccione 11:00.
3. Antes de que complete su reserva, dicho horario sea ocupado.
4. El Usuario A intente confirmar.

Antes de generar definitivamente la reserva, el sistema debe verificar
nuevamente la disponibilidad.

Si el turno dejó de estar disponible:

- la reserva NO debe crearse;
- no debe sobrescribirse la reserva existente;
- debe mostrarse el mensaje:

  "El horario seleccionado ya no está disponible."

- el usuario debe poder volver a seleccionar otro horario disponible.

---

# 8. Regla de disponibilidad

Un horario es reservable únicamente cuando no existe una reserva activa
asociada a la misma combinación de:

- tipo de evento;
- fecha;
- horario.

Debe existir una función de lógica de negocio independiente de la interfaz
que permita determinar si un horario se encuentra disponible.

Ejemplo conceptual:

estaHorarioDisponible(tipoEvento, fecha, hora, reservas)

Resultado:

true / false

La interfaz no debe ser la responsable exclusiva de decidir la
disponibilidad.

---

# 9. Persistencia para TP6

No se requiere un backend real.

Para esta implementación académica puede utilizarse localStorage para
almacenar:

- selección actual del usuario;
- reservas simuladas;
- horarios ocupados;
- reserva temporal.

Ejemplo conceptual de reserva:

{
  "tipoEvento": "Consulta",
  "fecha": "2026-09-30",
  "hora": "11:00",
  "estado": "pendiente"
}

La implementación con localStorage corresponde solamente al frontend
mínimo requerido para TP6 y no representa la arquitectura definitiva de
producción.

---

# 10. Navegación hacia atrás

El Usuario Invitado debe poder volver a pasos anteriores del flujo.

Por ejemplo:

Horario
→ Fecha
→ Evento

Los datos cargados previamente no deben perderse automáticamente al
retroceder.

Si una selección anterior modifica las opciones posteriores, el sistema
debe recalcular la disponibilidad.

Ejemplo:

El usuario seleccionó:

Consulta
→ 30/09
→ 11:00

Luego cambia el evento.

El sistema debe volver a calcular los días y horarios correspondientes al
nuevo evento.

---

# 11. Restricciones de experiencia de usuario

El proceso de reserva debe cumplir con los requisitos no funcionales
definidos previamente para M04:

- el Usuario Invitado no necesita registrarse;
- debe mostrarse un resumen persistente durante el paso final;
- debe poder retroceder sin perder innecesariamente los datos cargados;
- el flujo debe estar preparado para ser utilizado desde dispositivos
  móviles;
- la interfaz debe mantenerse simple y comprensible.

---

# 12. Requisitos específicos del TP6

Todos los elementos interactivos utilizados por Cypress deben tener un
atributo data-cy descriptivo.

Ejemplos:

data-cy="event-type"
data-cy="date-option"
data-cy="time-option"
data-cy="booking-form"
data-cy="confirm-booking"
data-cy="booking-success"
data-cy="time-unavailable-error"

Los tests E2E no deben depender principalmente de:

- clases CSS;
- posición del elemento;
- texto visible utilizado como selector.

---

# 13. Estados posibles de la reserva

Para el alcance del TP6 se podrán utilizar como mínimo:

TEMPORAL
PENDIENTE
CONFIRMADA
CANCELADA

La selección de un turno puede generar una reserva TEMPORAL.

Al finalizar correctamente el formulario se genera una reserva PENDIENTE
de confirmación.

La confirmación posterior desde el correo puede cambiar su estado a
CONFIRMADA.

La cancelación puede cambiarla a CANCELADA.

---

# 14. Comportamiento posterior a la reserva

Una reserva creada correctamente debe contener los datos necesarios para
que M06 pueda generar la notificación correspondiente.

Como mínimo:

- tipo de evento;
- fecha;
- horario;
- datos necesarios del Usuario Invitado;
- estado de la reserva.

M06 será responsable de simular la construcción/envío de la notificación.

M04 será responsable del proceso de reserva y de reaccionar posteriormente
a las acciones Confirmar/Cancelar correspondientes.

---

# 15. Casos que deben poder testearse

La implementación debe permitir como mínimo comprobar automáticamente:

### M04-01 — Selección correcta

Dado que existen tipos de eventos disponibles,
cuando el usuario selecciona uno,
entonces puede continuar hacia la selección de fecha.

### M04-02 — Visualización de días

Dado un tipo de evento seleccionado,
cuando el usuario accede al calendario,
entonces visualiza únicamente los días disponibles correspondientes.

### M04-03 — Visualización de horarios

Dado un día seleccionado,
cuando el sistema muestra horarios,
entonces muestra solamente los disponibles.

### M04-04 — Horario ocupado

Dado que 10:00 ya se encuentra reservado,
cuando el usuario consulta los horarios,
entonces 10:00 no puede seleccionarse.

### M04-05 — Horario ocupado durante el proceso

Dado que el usuario seleccionó un horario inicialmente disponible,
cuando dicho horario deja de estar disponible antes de crear la reserva,
entonces el sistema bloquea la reserva y muestra:

"El horario seleccionado ya no está disponible."

### M04-06 — Formulario incompleto

Dado que existe al menos un campo obligatorio vacío,
cuando el usuario intenta confirmar,
entonces la reserva no se crea y se muestra un mensaje de error.

### M04-07 — Reserva exitosa

Dado un turno válido y disponible y datos válidos,
cuando el usuario confirma el formulario,
entonces se crea la reserva y aparece una confirmación visible.

### M04-08 — Navegación hacia atrás

Dado que el usuario ya seleccionó información,
cuando vuelve al paso anterior,
entonces los datos compatibles con la selección actual se conservan.

---

# 16. Fuera del alcance

Para esta implementación del TP6 no es necesario:

- utilizar una base de datos real;
- crear un backend;
- implementar autenticación del Usuario Invitado;
- enviar emails reales;
- implementar concurrencia real entre múltiples servidores o usuarios;
- desarrollar la aplicación AgendaYA completa.

El objetivo es reproducir de forma observable y testeable el comportamiento
definido por los requisitos y las historias de usuario.