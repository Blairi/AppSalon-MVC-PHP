/// <reference types="Cypress" />
describe('Comportamiento de Usuario', () => {
    it("Inicia en Pagina Login", () => {
        cy.visit("localhost");
        cy.get("[data-cy='titulo-login']").should("exist");
    });

    it("Iniciar Sesión", () => {
        cy.get("[data-cy='input-email']").should("exist");
        cy.get("[data-cy='input-password']").should("exist");

        cy.get("[data-cy='input-email']").type("correo@correo.com");
        cy.get("[data-cy='input-password']").type("123456");

        cy.get("[data-cy='formulario-login']").submit();

        cy.get("[data-cy='titulo-crear-cita']").should("exist");
    });

    it("Seleccionar Servicio", () => {
        cy.get("[data-cy='servicio']").should("exist").first();
        cy.get("[data-cy='servicio']").first().click();

        cy.get("[data-cy='btn-siguiente']").should("exist");
        cy.get("[data-cy='btn-siguiente']").click();
    });

    it("Seleccionar Datos", () => {
        cy.get("[data-cy='input-fecha']").should("exist");
        cy.get("[data-cy='input-fecha']").type("2022-03-31");

        cy.get("[data-cy='input-hora']").should("exist");
        cy.get("[data-cy='input-hora']").type("11:33");

        cy.get("[data-cy='btn-siguiente']").should("exist");
        cy.get("[data-cy='btn-siguiente']").click();
    });

    it("Reservar Cita", () => {
        cy.get("[data-cy='btn-reservar-cita']").should("exist");
        cy.get("[data-cy='btn-reservar-cita']").click();

        cy.get(".swal2-confirm").should("exist");
        cy.get(".swal2-confirm").click();
    });
});