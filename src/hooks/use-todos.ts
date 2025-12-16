"use client";

import useSWR, { mutate as globalMutate } from "swr";
import { useCallback } from "react";

export interface TodoItem {
  id: number;
  content: string;
  done: boolean;
  column: "today" | "later";
  createdAt: string;
  updatedAt: string;
}

interface TodosResponse {
  success: boolean;
  data: TodoItem[];
  source: string;
  timestamp: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useTodos() {
  const { data, error, isLoading, mutate } = useSWR<TodosResponse>(
    "/api/blinko",
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  const todos = data?.data || [];

  // Filter by column
  const todayTodos = todos.filter((t) => t.column === "today");
  const laterTodos = todos.filter((t) => t.column === "later");

  // Statistics
  const totalCount = todos.length;
  const doneCount = todos.filter((t) => t.done).length;

  // Create a new todo
  const createTodo = useCallback(
    async (content: string, column: "today" | "later" = "today") => {
      try {
        const response = await fetch("/api/blinko", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, column, done: false }),
        });

        if (!response.ok) {
          throw new Error("Failed to create todo");
        }

        // Revalidate the list
        mutate();
        return true;
      } catch (error) {
        console.error("Create todo error:", error);
        return false;
      }
    },
    [mutate]
  );

  // Toggle done status
  const toggleTodo = useCallback(
    async (todo: TodoItem) => {
      // Optimistic update
      const optimisticData: TodosResponse = {
        ...data!,
        data: todos.map((t) =>
          t.id === todo.id ? { ...t, done: !t.done } : t
        ),
      };

      try {
        mutate(optimisticData, false);

        const response = await fetch("/api/blinko", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: todo.id,
            done: !todo.done,
            content: todo.content,
            column: todo.column,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to toggle todo");
        }

        // Revalidate
        mutate();
        return true;
      } catch (error) {
        console.error("Toggle todo error:", error);
        // Revert on error
        mutate();
        return false;
      }
    },
    [data, todos, mutate]
  );

  // Update todo content
  const updateTodo = useCallback(
    async (todo: TodoItem, newContent: string) => {
      try {
        const response = await fetch("/api/blinko", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: todo.id,
            done: todo.done,
            content: newContent,
            column: todo.column,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update todo");
        }

        mutate();
        return true;
      } catch (error) {
        console.error("Update todo error:", error);
        return false;
      }
    },
    [mutate]
  );

  // Move todo between columns
  const moveTodo = useCallback(
    async (todo: TodoItem, newColumn: "today" | "later") => {
      // Optimistic update
      const optimisticData: TodosResponse = {
        ...data!,
        data: todos.map((t) =>
          t.id === todo.id ? { ...t, column: newColumn } : t
        ),
      };

      try {
        mutate(optimisticData, false);

        const response = await fetch("/api/blinko", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: todo.id,
            done: todo.done,
            content: todo.content,
            column: newColumn,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to move todo");
        }

        mutate();
        return true;
      } catch (error) {
        console.error("Move todo error:", error);
        mutate();
        return false;
      }
    },
    [data, todos, mutate]
  );

  // Delete todo
  const deleteTodo = useCallback(
    async (id: number) => {
      // Optimistic update
      const optimisticData: TodosResponse = {
        ...data!,
        data: todos.filter((t) => t.id !== id),
      };

      try {
        mutate(optimisticData, false);

        const response = await fetch(`/api/blinko?id=${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete todo");
        }

        mutate();
        return true;
      } catch (error) {
        console.error("Delete todo error:", error);
        mutate();
        return false;
      }
    },
    [data, todos, mutate]
  );

  return {
    todos,
    todayTodos,
    laterTodos,
    totalCount,
    doneCount,
    isLoading,
    isError: !!error,
    source: data?.source,
    refresh: mutate,
    createTodo,
    toggleTodo,
    updateTodo,
    moveTodo,
    deleteTodo,
  };
}
