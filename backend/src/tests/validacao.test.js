const { emailValido } = require("../utils/validacao");

describe("Validação de e-mail", () => {
  test("deve aceitar um e-mail válido", () => {
    expect(emailValido("candidato@email.com")).toBe(true);
  });

  test("deve rejeitar um e-mail inválido", () => {
    expect(emailValido("email-invalido")).toBe(false);
  });
});