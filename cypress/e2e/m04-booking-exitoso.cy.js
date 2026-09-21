describe('AgendaYA - M04 Proceso de Reserva Público', () => {

    beforeEach(() => {
        cy.visit('/frontend/index.html');
    });

    it('Permite completar el flujo completo de reserva exitosa (Happy Path)', () => {
        // Arrange
        cy.get('[data-cy="service-select"]').select('Consulta Inicial');
        cy.get('[data-cy="timeslot-select"]').select('2026-10-15 10:00');
        cy.get('[data-cy="name-input"]').type('Patricio Zamorano');
        cy.get('[data-cy="email-input"]').type('patricio.zamorano@test.com');

        // Act
        cy.get('[data-cy="submit-booking"]').click();

        // Assert
        cy.get('[data-cy="booking-confirmation"]')
            .should('be.visible')
            .and('contain', '¡Reserva Pendiente de Confirmación!')
            .and('contain', 'Patricio Zamorano');

        cy.get('[data-cy="notifications-log"]')
            .should('contain', 'patricio.zamorano@test.com');
    });

});