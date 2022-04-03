/// <reference types="Cypress" />

describe("Registro de nuevo usuario", () => {
    it("Inicia en Pagina Login", () => {
        cy.visit("localhost");
        cy.get("[data-cy='titulo-login']").should("exist");
    });

    it("Boton registrar", () => {
        const btn = cy.get("[data-cy='btn-crear-cuenta']");
        btn.should("exist");
        btn.click();
        cy.get("[data-cy='titulo-crear']").should("exist");
    });

    it("Campos existen", () => {
        cy.get("[data-cy='input-nombre']").should("exist");
        cy.get("[data-cy='input-apellido']").should("exist");
        cy.get("[data-cy='input-telefono']").should("exist");
        cy.get("[data-cy='input-email']").should("exist");
        cy.get("[data-cy='input-password']").should("exist");
        cy.get("[data-cy='btn-crear']").should("exist");
    });

    it("Campos vacios", () => {
        cy.get("[data-cy='btn-crear']").click();
        cy.get(".alerta").should("exist");
    });

    it("Llenar campos incorrectamente", () => {
        cy.get("[data-cy='input-nombre']").type("Juan Juan Juan JuanJuan JuanJuan JuanJuan Juan Juan Juan Juan Juan");

        cy.get("[data-cy='input-apellido']").type(" Apellido largo  Apellido largo  Apellido largo  Apellido largo  Apellido largo  Apellido largo  Apellido largo  Apellido largo ");

        cy.get("[data-cy='input-telefono']").type("55123311982839830101");

        cy.get("[data-cy='input-email']").type("elcorreomaslargodelmundoelcorreomaslargodelmundo@correoslargos.com");

        cy.get("[data-cy='input-password']").type("12345678910olkjsdsqws12323");

        cy.get("[data-cy='btn-crear']").click();

        cy.get(".alerta").should("exist");
    });
});