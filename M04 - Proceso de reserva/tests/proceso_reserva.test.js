const { validarEmail, cumpleAntelacionMinima, esCancelable, buscarReservasPorEmail, solicitarCancelacion, confirmarCancelacion } = require('../src/proceso_reserva');

describe('Suite de Tests Unitarios - Integrante 1 (M04 Booking)', () => {

    // Test 1: Caso normal válido
    it('Debe retornar true para un email válido estándar', () => {
        expect(validarEmail('invitado@test.com')).toBe(true);
    });

    // Test 2: Caso de error / inválido (sin arroba ni dominio)
    it('Debe retornar false si el email no contiene el símbolo @ ni dominio', () => {
        expect(validarEmail('invitadotest.com')).toBe(false);
    });

    // Test 3: Caso límite / borde (espacios antes o después)
    it('Debe retornar true si el email tiene espacios en blanco al inicio o final (haciendo trim)', () => {
        expect(validarEmail('  usuario@empresa.com  ')).toBe(true);
    });

    // Test 4: Caso de error / inválido (tipo nulo o vacío)
    it('Debe retornar false si el email es null, undefined o una cadena vacía', () => {
        expect(validarEmail('')).toBe(false);
        expect(validarEmail(null)).toBe(false);
        expect(validarEmail(undefined)).toBe(false);
    });

    // Test 5: Caso de función 2 (Caso normal y borde de antelación)
    it('Debe retornar true si la fecha del turno supera la antelación mínima de 2 horas', () => {
        const fechaFutura = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(); // 4 horas en el futuro
        expect(cumpleAntelacionMinima(fechaFutura, 2)).toBe(true);
    });

    // ==========================================
    // Nuevos Tests para Cancelación (M04) - Nuevo Flujo
    // ==========================================

    // Test 6: buscarReservasPorEmail
    it('buscarReservasPorEmail debe retornar un array vacío si el email es inválido', () => {
        const reservas = [{ email: 'test@test.com' }];
        expect(buscarReservasPorEmail('inválido', reservas)).toEqual([]);
    });

    // Test 7: solicitarCancelacion (Error)
    it('solicitarCancelacion debe retornar null si la reserva no cumple antelación de 24hs', () => {
        const ahora = new Date('2026-01-01T10:00:00Z');
        const reserva = { id: 1, estado: 'confirmada', fecha: new Date('2026-01-02T09:59:59Z').toISOString() };
        expect(solicitarCancelacion(reserva, ahora)).toBeNull();
    });

    // Test 8: solicitarCancelacion (Normal)
    it('solicitarCancelacion debe retornar el token si la reserva cumple la regla (>24hs)', () => {
        const ahora = new Date('2026-01-01T10:00:00Z');
        const reserva = { id: 1, estado: 'confirmada', fecha: new Date('2026-01-03T10:00:00Z').toISOString() };
        const token = solicitarCancelacion(reserva, ahora);
        expect(token).not.toBeNull();
        expect(token.reservaId).toBe(1);
    });

    // Test 9: confirmarCancelacion (Normal)
    it('confirmarCancelacion debe cambiar estado a cancelada y retornar true si faltan <= 15 mins', () => {
        const reserva = { id: 1, estado: 'confirmada' };
        const fechaSolicitud = new Date('2026-01-01T10:00:00Z');
        const fechaConfirmacion = new Date('2026-01-01T10:05:00Z'); // 5 minutos después
        const exito = confirmarCancelacion(reserva, fechaSolicitud.toISOString(), fechaConfirmacion);
        expect(exito).toBe(true);
        expect(reserva.estado).toBe('cancelada');
    });

    // Test 10: solicitarCancelacion (Error de estado)
    it('solicitarCancelacion debe retornar null si la reserva ya se encuentra cancelada', () => {
        const ahora = new Date('2026-01-01T10:00:00Z');
        const reserva = { id: 1, estado: 'cancelada', fecha: new Date('2026-01-03T10:00:00Z').toISOString() };
        expect(solicitarCancelacion(reserva, ahora)).toBeNull();
    });

});