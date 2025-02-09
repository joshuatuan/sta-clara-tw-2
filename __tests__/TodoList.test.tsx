import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  addTodoTask,
  updateTodoTaskState,
  deleteTodoTask,
} from "@/lib/actions/todoListActions";
import { Task } from "@/app/types/globals";
import TodoList from "@/components/features/ToDoList";

jest.mock("@/lib/actions/todoListActions");

const initialTasks: Task[] = [
  {
    id: "1",
    user_id: "1",
    task: "Task 1",
    is_completed: false,
    created_at: "",
    updated_at: null,
  },
  {
    id: "2",
    user_id: "1",
    task: "Task 2",
    is_completed: true,
    created_at: "",
    updated_at: null,
  },
];

describe("TodoList", () => {
  it("renders initial tasks", () => {
    render(<TodoList initialTasks={initialTasks} />);
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  it("adds a new task", async () => {
    (addTodoTask as jest.Mock).mockResolvedValue({
      id: "3",
      user_id: "1",
      task: "New Task",
      is_completed: false,
      created_at: "",
      updated_at: null,
    });

    render(<TodoList initialTasks={initialTasks} />);

    fireEvent.change(screen.getByPlaceholderText("Enter task"), {
      target: { value: "New Task" },
    });
    fireEvent.click(screen.getByText("Add"));

    await waitFor(() =>
      expect(screen.getByText("New Task")).toBeInTheDocument(),
    );
  });

  it("updates a task state", async () => {
    (updateTodoTaskState as jest.Mock).mockResolvedValue({});

    render(<TodoList initialTasks={initialTasks} />);

    const checkbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(checkbox);

    await waitFor(() => expect(checkbox).toBeChecked());
  });

  it("deletes a task", async () => {
    (deleteTodoTask as jest.Mock).mockResolvedValue({});

    render(<TodoList initialTasks={initialTasks} />);

    fireEvent.click(screen.getAllByRole("button", { name: /Delete task/i })[0]);

    await waitFor(() =>
      expect(screen.queryByText("Task 1")).not.toBeInTheDocument(),
    );
  });
});
