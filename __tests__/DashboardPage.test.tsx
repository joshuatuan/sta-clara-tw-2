import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { getUser } from "@/lib/data-service";
import { deleteAccountAction, signOutAction } from "@/lib/actions/auth";
import Dashboard from "@/components/features/Dashboard";
import { UserData } from "@/app/types/globals";

export const mockUser: UserData = {
  email: "test@example.com",
  id: "123",
  created_at: "2023-10-01T00:00:00.000Z",
};
// Mock getUser
jest.mock("@/lib/data-service", () => ({
  getUser: jest.fn(),
}));

// Mock Server Actions
jest.mock("@/lib/actions/auth", () => ({
  deleteAccountAction: jest.fn(),
  signOutAction: jest.fn(),
}));

describe("DashBoardPage", () => {
  beforeEach(() => {
    // Mock getUser to return a user
    (getUser as jest.Mock).mockResolvedValue(mockUser);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the user email", async () => {
    render(<Dashboard user={mockUser} />);

    // Wait for the user email to be rendered
    const emailElement = await screen.findByText(mockUser.email as string);
    expect(emailElement).toBeInTheDocument();
  });

  it("renders the Delete Account and Sign out buttons", async () => {
    render(<Dashboard user={mockUser} />);

    // Wait for the buttons to be rendered
    const deleteButton = await screen.findByText("Delete Account");
    const signOutButton = await screen.findByText("Sign out");

    expect(deleteButton).toBeInTheDocument();
    expect(signOutButton).toBeInTheDocument();
  });

  it("calls deleteAccountAction when Delete Account button is clicked", async () => {
    render(<Dashboard user={mockUser} />);

    // Find and open the AlertButton (if necessary)
    const deleteButton = screen.getByRole("button", {
      name: /delete account/i,
    });
    fireEvent.click(deleteButton); // This should open the alert

    // Wait for the form to appear
    const deleteForm = await screen.findByTestId("form-delete-account");

    // Simulate form submission
    fireEvent.submit(deleteForm);

    // Ensure deleteAccountAction was called
    expect(deleteAccountAction).toHaveBeenCalled();
  });

  it("calls signOutAction when Sign out button is clicked", async () => {
    render(<Dashboard user={mockUser} />);

    // Wait for the form to be rendered
    const signOutForm = await screen.findByTestId("form-sign-out");

    // Simulate form submission
    fireEvent.submit(signOutForm);

    // Ensure signOutAction was called
    expect(signOutAction).toHaveBeenCalled();
  });
});
