import UserPage from "./SignUpPage.vue";
import { render, screen, waitFor } from "@testing-library/vue";
import { setupServer } from "msw/node";
import { rest } from "msw";

const server = setupServer(
  rest.get("/api/1.0/users/:id", (req, res, ctx) => {
    if (req.params.id === 1) {
      return res(
        ctx.status(200),
        ctx.json({
          id: 1,
          username: "user1",
          email: "user1@mail.com",
          image: null,
        })
      );
    } else {
      return res(ctx.status(404), ctx.json({ message: "User not found" }));
    }
  })
);

beforeAll(() => server.listen());

beforeEach(() => {
  server.resetHandlers();
});

afterAll(() => server.close());

const setup = (id = 1) => {
  render(UserPage, {
    global: { mocks: { $route: { params: { id } } } },
  });
};

describe("User page", () => {
  it("displays username on page when user id found", async () => {
    setup();

    await waitFor(() => {
      expect(screen.queryByText("user1")).toBeInTheDocument();
    });
  });

  it("displays spinner while api call is in progress", () => {
    setup();
    const spinner = screen.queryByRole("status");
    expect(spinner).toBeInTheDocument();
  });

  it("displays error message recieved from backend when user not found", () => {
    setup(100);
    await waitFor(() => {
      expect(screen.queryByText("User not found")).toBeInTheDocument();
    });
  });
});
