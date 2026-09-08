describe('AgendaYA - M04 Proceso de Reserva Público', () => {

    beforeEach(() => {
        // Abre el frontend servido
        cy.visit('/frontend/index.html');
    });

    it('Permite completar el flujo completo de reserva exitosa (Happy Path)', () => {
        // Arrange: Cargar los datos de la reserva en el formulario
        cy.get('[data-cy="service-select"]').select('Consulta Inicial');
        cy.get('[data-cy="timeslot-select"]').select('2026-10-15 10:00');
        cy.get('[data-cy="name-input"]').type('Patricio Zamorano');
        cy.get('[data-cy="email-input"]').type('patricio.zamorano@test.com');

        // Act: Confirmar la reserva haciendo clic en el botón
        cy.get('[data-cy="submit-booking"]').click();

        // Assert: Verificar mensaje de confirmación y el log de notificación simulado (M06)
        cy.get('[data-cy="booking-confirmation"]')
            .should('be.visible')
            .and('contain', '¡Reserva Confirmada!')
            .and('contain', 'Patricio Zamorano');

        cy.get('[data-cy="notifications-log"]')
            .should('contain', 'patricio.zamorano@test.com');
    });

});