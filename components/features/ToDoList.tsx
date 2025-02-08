"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  addTodoTask,
  updateTodoTaskState,
  deleteTodoTask,
} from "@/lib/actions/todoListActions";
import { Trash } from "lucide-react";
import { Task } from "@/app/types/globals";

export default function TodoList({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks || []);
  const [newTask, setNewTask] = useState("");

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.is_completed === b.is_completed) return 0; // keep order if both are completed or both are not
      return a.is_completed ? 1 : -1; // move completed tasks to the bottom
    });
  }, [tasks]);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;

    const tempId = Date.now().toString(); // temp ID for UI update

    const optimisticTask = {
      id: tempId,
      user_id: "",
      task: newTask,
      is_completed: false,
      created_at: new Date().toISOString(),
      updated_at: null,
    };

    setTasks((prev) => [...prev, optimisticTask]); // optimistic update
    setNewTask("");

    try {
      const newTaskFromDB = await addTodoTask(newTask);

      setTasks((prev) =>
        prev.map((task) => (task.id === tempId ? { ...newTaskFromDB } : task)),
      );
    } catch (error) {
      setTasks((prev) => prev.filter((task) => task.id !== tempId));
      console.error("Error adding task:", error);
    }
  };

  // updating a task (optimistic update)
  const handleUpdateTaskState = async (id: string) => {
    // Optimistic update
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, is_completed: !task.is_completed } : task,
      ),
    );

    try {
      await updateTodoTaskState(id);
    } catch (error) {
      // revert optimistic update on error
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, is_completed: !task.is_completed } : task,
        ),
      );
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    const deletedTask = tasks.find((task) => task.id === id);

    // optimistic update
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));

    try {
      await deleteTodoTask(id);
    } catch (error) {
      // Revert optimistic update on error
      if (deletedTask) {
        setTasks((prevTasks) => [...prevTasks, deletedTask]);
      }
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="flex max-w-xl flex-col gap-4">
      <div className="flex gap-2">
        <Input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter task"
          className="w-full max-w-lg"
        />
        <Button onClick={handleAddTask}>Add</Button>
      </div>
      {tasks.length === 0 ? (
        <p className="text-muted-foreground">No tasks yet</p>
      ) : (
        <ul className="space-y-2">
          {sortedTasks.map((task) => (
            <li
              key={task.id}
              className={`flex items-center justify-between gap-1 rounded-md bg-accent/70 p-1 pl-2 transition-all hover:shadow-sm ${task.is_completed ? "bg-accent hover:bg-accent/70" : "hover:bg-accent"}`}
            >
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={!task.is_completed}
                  onCheckedChange={() => handleUpdateTaskState(task.id)}
                />
                <span
                  className={`font-medium ${task.is_completed ? "text-muted-foreground" : ""} `}
                >
                  {task.task}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="hover:shadow-sm"
                onClick={() => handleDeleteTask(task.id)}
              >
                <Trash />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
