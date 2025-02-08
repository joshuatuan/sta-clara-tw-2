import { Task } from "@/app/types/globals";
import TodoList from "@/components/features/ToDoList";
import { getUserTasks } from "@/lib/data-service";

export default async function ToDoListPage() {
  const tasks = (await getUserTasks()) as Task[];

  // console.log("Tasks:", tasks);

  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold">Todo List</h1>
      <TodoList initialTasks={tasks} />
    </>
  );
}
