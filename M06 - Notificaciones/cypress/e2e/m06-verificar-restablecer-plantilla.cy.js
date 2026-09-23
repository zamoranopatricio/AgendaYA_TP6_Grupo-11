describe('AgendaYA - M06 Verificar restablecer plantilla', () => {

    it('Verifica el restablecimiento de una plantilla', () => {
        // Arrange
        cy.visit('/M06 - Notificaciones/frontend/plantillas.html');
        const plantilla = 'Le recordamos su turno el día [Fecha] a las [Hora].';
        cy.get('[data-cy="template-textarea"]').clear().type(plantilla);
        cy.get('[data-cy="template-textarea"]').should('have.value', plantilla);
        cy.get('[data-cy="char-counter"]')
            .should('have.text', `${plantilla.length} / 2000 caracteres`);

        // Act
        cy.get('[data-cy="btn-reset-template"]').click();

        // Assert
        cy.get('[data-cy="template-textarea"]').should('have.value', '');
        cy.get('[data-cy="char-counter"]').should('have.text', '0 / 2000 caracteres');
    });

});
