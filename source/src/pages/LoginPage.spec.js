import { render, screen } from "@testing-library/vue";
import LoginPage from "./LoginPage.vue";

const setup = async () => {
  render(LoginPage);
};

describe("Login Page", () => {
  describe("Layout", () => {
    it("has a login header", async () => {
      await setup();
      const header = screen.queryByRole("heading", { name: Login });
      expect(header).toBeInTheDocument();
    });

    it("has email input", async () => {
      await setup();
      const input = screen.queryByLabelText("E-mail");
      expect(input).toBeInTheDocument();
    });

    it("has password input", async () => {
      await setup();
      const input = screen.queryByLabelText("Password");
      expect(input).toBeInTheDocument();
    });

    it("has password type for password input", async () => {
      await setup();
      const input = screen.queryByLabelText("Password");
      expect(input.type).toBe("password");
    });
  });
});
