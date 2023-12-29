import { faker } from "@faker-js/faker/locale/id_ID";

describe(
  "Authentication Test",
  {
    env: {
      baseApiUrl:
        "https://foody-order-rest-api-git-preview-zylcom.vercel.app/api",
    },
  },
  () => {
    const password = "rahasia123";
    const randomName = faker.name.fullName();
    const randomUsername = faker.internet.userName();
    const randomPhoneNumber = faker.phone.number("0### #### ####");

    it("should logged as guest user if not have access token", () => {
      cy.intercept("GET", `${Cypress.env("baseApiUrl")}/users/guest`).as(
        "createGuestUser",
      );

      cy.visit("/login");

      cy.wait("@createGuestUser")
        .its("response.body.data.guestUserId")
        .should("exist");
    });

    it("should allow user to register new account", () => {
      cy.intercept("POST", `${Cypress.env("baseApiUrl")}/users`).as("register");

      cy.visit("/register");

      cy.getBySel("name-input").type(randomName);
      cy.getBySel("username-input").type(randomUsername);
      cy.get("#phone-number-input").type(randomPhoneNumber);
      cy.getBySel("password-input").type(password);
      cy.getBySel("confirm-password-input").type(password);
      cy.getBySel("form-register").submit();

      cy.wait("@register").then((interception) => {
        cy.wrap(interception).its("response.statusCode").should("equal", 201);
        cy.wrap(interception).its("response.body.data").should("exist");
      });
    });

    it("should fail register if username already in use", () => {
      cy.intercept("POST", `${Cypress.env("baseApiUrl")}/users`).as("register");

      cy.visit("/register");

      cy.getBySel("name-input").type(randomName);
      cy.getBySel("username-input").type(randomUsername);

      cy.get("#phone-number-input").type(randomPhoneNumber);
      cy.getBySel("password-input").type(password);
      cy.getBySel("confirm-password-input").type(password);
      cy.getBySel("form-register").submit();
      cy.contains("Another user with this username already exist.").should(
        "be.visible",
      );

      cy.wait("@register").its("response.statusCode").should("equal", 409);
    });

    it("should fail register if phone number is invalid", () => {
      cy.intercept("POST", `${Cypress.env("baseApiUrl")}/users`).as("register");

      cy.visit("/register");

      cy.getBySel("name-input").type(randomName);
      cy.getBySel("username-input").type(randomUsername);
      cy.get("#phone-number-input").type("123123123123123");
      cy.getBySel("password-input").type(password);
      cy.getBySel("confirm-password-input").type(password);
      cy.getBySel("form-register").submit();
      cy.contains("Phone number is invalid!").should("be.visible");

      cy.wait("@register").its("response.statusCode").should("equal", 400);
    });

    it("should fail register if password length less than 8", () => {
      cy.visit("/register");

      cy.getBySel("name-input").type(randomName);
      cy.getBySel("username-input").type(randomUsername);

      cy.get("#phone-number-input").type(randomPhoneNumber);
      cy.getBySel("password-input").type("123");
      cy.getBySel("confirm-password-input").type("123");
      cy.getBySel("form-register").submit();
      cy.contains("Your password must be at least 8 characters").should(
        "be.visible",
      );
    });

    it("should fail register if password and confirmation password not equal", () => {
      cy.visit("/register");

      cy.getBySel("name-input").type(randomName);
      cy.getBySel("username-input").type(randomUsername);

      cy.get("#phone-number-input").type(randomPhoneNumber);
      cy.getBySel("password-input").type("123");
      cy.getBySel("confirm-password-input").type("1");
      cy.getBySel("form-register").submit();

      cy.contains("Passwords don't match!").should("be.visible");
    });

    it("should fail to login if username is invalid", () => {
      cy.intercept("POST", `${Cypress.env("baseApiUrl")}/users/login`).as(
        "login",
      );

      cy.visit("/login");

      cy.getBySel("username-input").type("username");
      cy.getBySel("password-input").type(password);
      cy.getBySel("form-login").submit();
      cy.contains("Username or password invalid!").should("be.visible");

      cy.wait("@login").then((interception) => {
        cy.wrap(interception).its("response.statusCode").should("equal", 401);
        cy.wrap(interception).its("response.body.errors").should("exist");
      });
    });

    it("should fail to login if password is wrong", () => {
      cy.intercept("POST", `${Cypress.env("baseApiUrl")}/users/login`).as(
        "login",
      );

      cy.visit("/login");

      cy.getBySel("username-input").type(randomUsername);
      cy.getBySel("password-input").type("password");
      cy.getBySel("form-login").submit();
      cy.contains("Username or password invalid!").should("be.visible");

      cy.wait("@login").then((interception) => {
        cy.wrap(interception).its("response.statusCode").should("equal", 401);
        cy.wrap(interception).its("response.body.errors").should("exist");
      });
    });

    it("should allow a user to login", () => {
      cy.intercept("POST", `${Cypress.env("baseApiUrl")}/users/login`).as(
        "login",
      );

      cy.visit("/login");

      cy.getBySel("username-input").type(randomUsername);
      cy.getBySel("password-input").type(password);
      cy.getBySel("form-login").submit();

      cy.wait("@login").then((interception) => {
        cy.wrap(interception).its("response.statusCode").should("equal", 200);
        cy.wrap(interception).its("response.body.data").should("exist");
      });
    });
  },
);
