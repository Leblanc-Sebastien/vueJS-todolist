import type { Todo } from "@/interfaces/Todos.interface";

export const listTodo: Todo[] = JSON.parse(localStorage.getItem('todoList'))
