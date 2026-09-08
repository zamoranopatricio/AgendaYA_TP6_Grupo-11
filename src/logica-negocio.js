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

module.exports = { validarEmail, cumpleAntelacionMinima };