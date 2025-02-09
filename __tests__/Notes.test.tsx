import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { upsertNote } from "@/lib/actions/notesActions";
import Notes from "@/components/features/Notes";

// Mock the upsertNote action.
jest.mock("@/lib/actions/notesActions", () => ({
  upsertNote: jest.fn(),
}));

// Mock the useRouter hook from next/navigation.
const mockRefresh = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRefresh,
  }),
}));

const initialContent = {
  id: "test_id",
  content: "Initial note",
  created_at: "2025",
  user_id: "test_user_id",
};

// Dummy implementations for external UI components can be left as they are
// assuming that they render an accessible role or text.

describe("Notes Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows 'Create Note' button when initial note is empty", () => {
    render(<Notes initialNotes={null} />);
    expect(
      screen.getByRole("button", { name: /create note/i }),
    ).toBeInTheDocument();
  });

  it("shows 'Edit Notes' button and markdown display when initial note exists", () => {
    render(<Notes initialNotes={initialContent} />);
    expect(
      screen.getByRole("button", { name: /edit notes/i }),
    ).toBeInTheDocument();

    // Check that Markdown content is rendered.
    expect(screen.getByText(initialContent.content)).toBeInTheDocument();
  });

  it("enters editing mode when clicking the edit button", () => {
    render(<Notes initialNotes={null} />);
    const button = screen.getByRole("button", { name: /create note/i });
    fireEvent.click(button);
    // Check that the textarea is now in the document.
    expect(screen.getByPlaceholderText(/enter notes/i)).toBeInTheDocument();
  });

  it("updates the text and cancels editing", () => {
    render(<Notes initialNotes={initialContent} />);
    const editButton = screen.getByRole("button", { name: /edit notes/i });
    fireEvent.click(editButton);

    const textarea = screen.getByPlaceholderText(
      /enter notes/i,
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "Changed note" } });
    expect(textarea.value).toBe("Changed note");

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    // After cancel, editing mode should exit and original text persists.
    expect(
      screen.queryByPlaceholderText(/enter notes/i),
    ).not.toBeInTheDocument();
    expect(screen.getByText(initialContent.content)).toBeInTheDocument();
  });

  it("saves changes and refreshes the router", async () => {
    render(<Notes initialNotes={initialContent} />);
    const editButton = screen.getByRole("button", { name: /edit notes/i });
    fireEvent.click(editButton);

    const textarea = screen.getByPlaceholderText(
      /enter notes/i,
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "Saved note" } });
    const saveButton = screen.getByRole("button", { name: /^save$/i });
    fireEvent.submit(textarea.closest("form")!);

    await waitFor(() => {
      expect(upsertNote).toHaveBeenCalledWith("Saved note");
      expect(mockRefresh).toHaveBeenCalled();
    });

    // Editing mode should be closed and new note be displayed.
    expect(
      screen.queryByPlaceholderText(/enter notes/i),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Saved note")).toBeInTheDocument();
  });
});
