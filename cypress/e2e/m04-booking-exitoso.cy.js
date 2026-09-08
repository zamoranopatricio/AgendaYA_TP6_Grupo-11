describe('AgendaYA - M04 Proceso de Reserva Público', () => {

    beforeEach(() => {
        // Abre el frontend servido
        cy.visit('http://127.0.0.1:5500/agendaya-tp6/frontend/index.html');
    });

    it('Permite completar el flujo completo de reserva exitosa (Happy Path)', () => {
        // Arrange: Cargar los datos de la reserva en el formulario
        cy.get('[data-cy="service-select"]').select('Consulta Inicial');
        cy.get('[data-cy="timeslot-select"]').select('2026-10-15 10:00');
        cy.get('[data-cy="name-input"]').type('Juan Perez');
        cy.get('[data-cy="email-input"]').type('juan.perez@test.com');

        // Act: Confirmar la reserva haciendo clic en el botón
        cy.get('[data-cy="submit-booking"]').click();

        // Assert: Verificar mensaje de confirmación y el log de notificación simulado (M06)
        cy.get('[data-cy="booking-confirmation"]')
            .should('be.visible')
            .and('contain', '¡Reserva Confirmada!')
            .and('contain', 'Juan Perez');

        cy.get('[data-cy="notifications-log"]')
            .should('contain', 'juan.perez@test.com');
    });

});