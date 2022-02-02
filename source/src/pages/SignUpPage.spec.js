import SignUpPage from "./SignUpPage.vue";
import { render, screen, waitFor } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";
import i18n from "../locales/i18n";
import en from "../locales/en.json";
import ptbr from "../locales/ptbr.json";
import LanguageSelector from "../components/LanguageSelector.vue";

let requestBody;
let counter = 0;
let acceptLanguageHeader;
const server = setupServer(
  rest.post("/api/1.0/users", (req, res, ctx) => {
    requestBody = req.body;
    counter += 1;
    acceptLanguageHeader = req.headers.get("Accept-Language");
    return res(ctx.status(200));
  })
);

beforeAll(() => server.listen());

beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});

afterAll(() => server.close());

describe("Sign Up Page", () => {
  describe("Layout", () => {
    const setup = () => {
      render(SignUpPage, { global: { plugins: [i18n] } });
    };

    it("has Sign Up Header", () => {
      setup();
      const header = screen.queryByRole("heading", { name: "Sign Up" });
      expect(header).toBeInTheDocument();
    });

    it("has username input", () => {
      setup();
      const input = screen.queryByLabelText("Username");
      expect(input).toBeInTheDocument();
    });

    it("has email input", () => {
      setup();
      const input = screen.queryByLabelText("E-mail");
      expect(input).toBeInTheDocument();
    });

    it("has password input", () => {
      setup();
      const input = screen.queryByLabelText("Password");
      expect(input).toBeInTheDocument();
    });

    it("has password type for password input", () => {
      setup();
      const input = screen.queryByLabelText("Password");
      expect(input.type).toBe("password");
    });

    it("has password repeat input", () => {
      setup();
      const input = screen.queryByLabelText("Password Repeat");
      expect(input).toBeInTheDocument();
    });

    it("has password type for password repeat input", () => {
      setup();
      const input = screen.queryByLabelText("Password Repeat");
      expect(input.type).toBe("password");
    });

    it("has Sign Up Button", () => {
      setup();
      const button = screen.queryByRole("button", { name: "Sign Up" });
      expect(button).toBeInTheDocument();
    });

    it("disables de button initially", () => {
      setup();
      const button = screen.queryByRole("button", { name: "Sign Up" });
      expect(button).toBeDisabled();
    });
  });

  describe("Interactions", () => {
    var button, passwordInput, passwordRepeatInput, usernameInput;
    const setup = async () => {
      render(SignUpPage, { global: { plugins: [i18n] } });
      usernameInput = screen.queryByLabelText("Username");
      const emailInput = screen.queryByLabelText("E-mail");
      passwordInput = screen.queryByLabelText("Password");
      passwordRepeatInput = screen.queryByLabelText("Password Repeat");

      await userEvent.type(usernameInput, "user1");
      await userEvent.type(emailInput, "user1@mail.com");

      await userEvent.type(passwordInput, "P4ssword");
      await userEvent.type(passwordRepeatInput, "P4ssword");

      button = screen.queryByRole("button", { name: "Sign Up" });
    };

    const generateValidationError = (field, message) => {
      return rest.post("/api/1.0/users", (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            validationErrors: {
              [field]: message,
            },
          })
        );
      });
    };

    it("enables the button when the password and password repeat fields  have the same value", async () => {
      await setup();

      expect(button).toBeEnabled();
    });

    it("sends username, email and password to backend after clicking the button", async () => {
      await setup();

      await userEvent.click(button);
      await screen.findByText(en.accountActivationNotification);

      expect(requestBody).toEqual({
        username: "user1",
        email: "user1@mail.com",
        password: "P4ssword",
      });
    });

    it("does not allow clicking to the button when is ongoind api call", async () => {
      await setup();

      await userEvent.click(button);
      await userEvent.click(button);

      await screen.findByText(en.accountActivationNotification);

      expect(counter).toBe(1);
    });

    it("displays the spinner while api request in progress", async () => {
      await setup();

      await userEvent.click(button);

      const spinner = screen.queryByRole("status");
      expect(spinner).toBeInTheDocument();
    });

    it("does not display spinner when there is no api request", async () => {
      await setup();
      const spinner = screen.queryByRole("status");
      expect(spinner).not.toBeInTheDocument();
    });

    it("displays account activation information after seccessful sign up request", async () => {
      await setup();

      await userEvent.click(button);

      const text = await screen.findByText(en.accountActivationNotification);

      expect(text).toBeInTheDocument();
    });

    it("does not display account activation message before sign up request", async () => {
      await setup();
      const text = screen.queryByText(en.accountActivationNotification);
      expect(text).not.toBeInTheDocument();
    });

    it("does not display account activation information after failing sign up request", async () => {
      server.use(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(400));
        })
      );
      await setup();

      await userEvent.click(button);

      const text = screen.queryByText(en.accountActivationNotification);

      expect(text).not.toBeInTheDocument();
    });

    it("hides sign up form after successful sign up request", async () => {
      await setup();

      const form = screen.queryByTestId("form-sign-up");

      await userEvent.click(button);

      await waitFor(() => {
        expect(form).not.toBeInTheDocument();
      });
    });

    it.each`
      field         | message
      ${"username"} | ${"Username cannot be null"}
      ${"email"}    | ${"E-mail cannot be null"}
      ${"password"} | ${"password cannot be null"}
    `("displays $message for field $field", async ({ field, message }) => {
      server.use(generateValidationError(field, message));
      await setup();

      await userEvent.click(button);

      const text = await screen.findByText(message);

      expect(text).toBeInTheDocument();
    });

    it("hides spinner after error response recieved", async () => {
      server.use(
        generateValidationError("username", "Username cannot be null")
      );
      await setup();

      await userEvent.click(button);

      await screen.findByText("Username cannot be null");
      const spinner = screen.queryByRole("status");

      expect(spinner).not.toBeInTheDocument();
    });

    it("enables the button after error response recieved", async () => {
      server.use(
        generateValidationError("username", "Username cannot be null")
      );

      await setup();

      await userEvent.click(button);

      await screen.findByText("Username cannot be null");
      expect(button).toBeEnabled();
    });

    it("displays mismatch message for password repeat input", async () => {
      await setup();

      await userEvent.type(passwordInput, "pass1");
      await userEvent.type(passwordRepeatInput, "pass2");

      const text = await screen.findByText(en.passwordMismatchValidation);

      expect(text).toBeInTheDocument();
    });

    it.each`
      field         | message                      | label
      ${"username"} | ${"Username cannot be null"} | ${"Username"}
      ${"email"}    | ${"E-mail cannot be null"}   | ${"E-mail"}
      ${"password"} | ${"password cannot be null"} | ${"Password"}
    `(
      "clears validation error when $field field is upadted",
      async ({ field, message, label }) => {
        server.use(generateValidationError(field, message));

        await setup();

        await userEvent.click(button);

        const text = await screen.findByText(message);
        const input = screen.queryByLabelText(label);

        await userEvent.type(input, "updated");
        expect(text).not.toBeInTheDocument();
      }
    );
  });

  describe("Internationalization", () => {
    let portugueseLanguage,
      englishLanguage,
      username,
      email,
      button,
      password,
      passwordRepeat;
    const setup = () => {
      const app = {
        components: {
          SignUpPage,
          LanguageSelector,
        },
        template: `
    <SignUpPage />
    <LanguageSelector />
  `,
      };

      render(app, {
        global: {
          plugins: [i18n],
        },
      });

      portugueseLanguage = screen.queryByTitle("Português");
      englishLanguage = screen.queryByTitle("English");
      password = screen.queryByLabelText(en.password);
      passwordRepeat = screen.queryByLabelText(en.passwordRepeat);
      username = screen.queryByLabelText(en.username);
      email = screen.queryByLabelText(en.email);
      button = screen.queryByRole("button", { name: en.signUp });
    };

    it("initially displays all text in english", async () => {
      setup();

      expect(
        screen.queryByRole("heading", { name: en.signUp })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: en.signUp })
      ).toBeInTheDocument();
      expect(screen.queryByLabelText(en.username)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.email)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.password)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.passwordRepeat)).toBeInTheDocument();
    });

    it("displays all text in portuguese after selecting that language", async () => {
      setup();

      await userEvent.click(portugueseLanguage);

      expect(
        screen.queryByRole("heading", { name: ptbr.signUp })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: ptbr.signUp })
      ).toBeInTheDocument();
      expect(screen.queryByLabelText(ptbr.username)).toBeInTheDocument();
      expect(screen.queryByLabelText(ptbr.email)).toBeInTheDocument();
      expect(screen.queryByLabelText(ptbr.password)).toBeInTheDocument();
      expect(screen.queryByLabelText(ptbr.passwordRepeat)).toBeInTheDocument();
    });

    it("displays all text in english after page is translated to Portuguese", async () => {
      setup();

      await userEvent.click(portugueseLanguage);

      await userEvent.click(englishLanguage);

      expect(
        screen.queryByRole("heading", { name: en.signUp })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: en.signUp })
      ).toBeInTheDocument();
      expect(screen.queryByLabelText(en.username)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.email)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.password)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.passwordRepeat)).toBeInTheDocument();
    });
    it("displays password mismatch validation in portuguese", async () => {
      setup();

      await userEvent.click(portugueseLanguage);
      await userEvent.type(password, "P4ssword");
      await userEvent.type(passwordRepeat, "N3wP4ss");

      const validation = screen.queryByText(ptbr.passwordMismatchValidation);

      expect(validation).toBeInTheDocument();
    });

    it("sends accept-language having en to backend for sign up request ", async () => {
      await setup();

      await userEvent.type(username, "user1");
      await userEvent.type(email, "user1@mail.com");
      await userEvent.type(password, "p4assword");
      await userEvent.type(passwordRepeat, "p4assword");
      await userEvent.click(button);
      await screen.queryByText(en.accountActivationNotification);

      expect(acceptLanguageHeader).toBe("en");
    });

    it("sends accept-language having ptbr after that language is selected", async () => {
      setup();

      await userEvent.click(portugueseLanguage);
      await userEvent.type(username, "user1");
      await userEvent.type(email, "uzaer1@mail.com");
      await userEvent.type(password, "P4ssword");
      await userEvent.type(passwordRepeat, "P4ssword");
      await userEvent.click(button);
      await screen.findByText(ptbr.accountActivationNotification);

      expect(acceptLanguageHeader).toBe("ptbr");
    });

    it("displays account activation information in Portuguese after selecting that language", async () => {
      setup();

      await userEvent.click(portugueseLanguage);

      await userEvent.type(username, "user1");
      await userEvent.type(email, "user1@mail.com");
      await userEvent.type(password, "P4ssword");
      await userEvent.type(passwordRepeat, "P4ssword");
      await userEvent.click(button);
      const accountActivation = await screen.findByText(
        ptbr.accountActivationNotification
      );

      expect(accountActivation).toBeInTheDocument();
    });
  });
});
