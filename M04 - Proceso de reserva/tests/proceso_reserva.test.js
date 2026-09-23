const { validarEmail, cumpleAntelacionMinima } = require('../src/proceso_reserva');

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

});