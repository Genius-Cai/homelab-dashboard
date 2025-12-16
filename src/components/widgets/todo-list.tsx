"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTodos, TodoItem } from "@/hooks/use-todos";

export function TodoList() {
  const {
    todayTodos,
    laterTodos,
    totalCount,
    doneCount,
    isLoading,
    source,
    createTodo,
    toggleTodo,
    updateTodo,
    moveTodo,
    deleteTodo,
  } = useTodos();

  return (
    <Card className="hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-sm transition-all duration-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          ☐ TODO
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground font-mono">
              {isLoading ? "SYNCING..." : source === "blinko" ? "SYNCED" : "LOCAL"}
            </span>
            <Badge variant="outline" className="text-[10px] px-1.5">
              {doneCount}/{totalCount}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Two column layout */}
        <div className="grid grid-cols-2 gap-4">
          {/* Today column */}
          <TodoColumn
            title="TODAY"
            todos={todayTodos}
            column="today"
            onToggle={toggleTodo}
            onUpdate={updateTodo}
            onMove={moveTodo}
            onDelete={deleteTodo}
            onCreate={createTodo}
          />

          {/* Later column */}
          <TodoColumn
            title="LATER"
            todos={laterTodos}
            column="later"
            onToggle={toggleTodo}
            onUpdate={updateTodo}
            onMove={moveTodo}
            onDelete={deleteTodo}
            onCreate={createTodo}
          />
        </div>

        {/* Footer with sync indicator */}
        <div className="mt-4 pt-2 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
          <span>[{totalCount} items · {doneCount} done]</span>
          <span className={source === "blinko" ? "text-success" : ""}>
            {source === "blinko" ? "🔄 Blinko" : "📴 Offline"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

interface TodoColumnProps {
  title: string;
  todos: TodoItem[];
  column: "today" | "later";
  onToggle: (todo: TodoItem) => Promise<boolean>;
  onUpdate: (todo: TodoItem, content: string) => Promise<boolean>;
  onMove: (todo: TodoItem, column: "today" | "later") => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
  onCreate: (content: string, column: "today" | "later") => Promise<boolean>;
}

function TodoColumn({
  title,
  todos,
  column,
  onToggle,
  onUpdate,
  onMove,
  onDelete,
  onCreate,
}: TodoColumnProps) {
  const [newTodo, setNewTodo] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTodo.trim()) {
      const success = await onCreate(newTodo.trim(), column);
      if (success) {
        setNewTodo("");
      }
    }
    if (e.key === "Escape") {
      setNewTodo("");
      inputRef.current?.blur();
    }
  };

  return (
    <div className="space-y-2">
      {/* Column header */}
      <div className="flex items-center gap-2 pb-1 border-b border-border/50">
        <span className="text-[10px] font-bold tracking-wider text-muted-foreground">
          {title}
        </span>
        <Badge variant="outline" className="text-[10px] px-1 ml-auto">
          {todos.filter((t) => !t.done).length}
        </Badge>
      </div>

      {/* Todo items */}
      <div className="space-y-1 min-h-[80px]">
        {todos.map((todo) => (
          <TodoItemRow
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onUpdate={onUpdate}
            onMove={onMove}
            onDelete={onDelete}
            targetColumn={column === "today" ? "later" : "today"}
          />
        ))}

        {todos.length === 0 && (
          <div className="text-xs text-muted-foreground/50 italic py-2">
            No tasks
          </div>
        )}
      </div>

      {/* Add new todo input */}
      <div className="flex items-center gap-2 text-sm group">
        <span className="h-4 w-4 border-2 border-border border-dashed flex items-center justify-center text-muted-foreground/50 text-xs">
          +
        </span>
        <input
          ref={inputRef}
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add task..."
          className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/50 placeholder:italic"
        />
      </div>
    </div>
  );
}

interface TodoItemRowProps {
  todo: TodoItem;
  onToggle: (todo: TodoItem) => Promise<boolean>;
  onUpdate: (todo: TodoItem, content: string) => Promise<boolean>;
  onMove: (todo: TodoItem, column: "today" | "later") => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
  targetColumn: "today" | "later";
}

function TodoItemRow({
  todo,
  onToggle,
  onUpdate,
  onMove,
  onDelete,
  targetColumn,
}: TodoItemRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(todo.content);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    onToggle(todo);
  };

  const handleEdit = () => {
    setEditContent(todo.content);
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSave = async () => {
    if (editContent.trim() && editContent !== todo.content) {
      await onUpdate(todo, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    }
    if (e.key === "Escape") {
      setEditContent(todo.content);
      setIsEditing(false);
    }
  };

  const handleMove = () => {
    onMove(todo, targetColumn);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  return (
    <div className="flex items-center gap-2 text-sm group cursor-pointer hover:bg-accent/50 p-1 -mx-1 transition-colors">
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        className={`h-4 w-4 border-2 border-border flex items-center justify-center font-mono text-xs shrink-0
          ${todo.done ? "bg-primary text-primary-foreground" : "group-hover:bg-accent"}`}
      >
        {todo.done ? "✓" : " "}
      </button>

      {/* Content */}
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="flex-1 bg-accent/30 border border-border px-1 py-0.5 text-sm outline-none"
        />
      ) : (
        <span
          onClick={handleEdit}
          className={`flex-1 truncate ${todo.done ? "line-through text-muted-foreground" : ""}`}
        >
          {todo.content}
        </span>
      )}

      {/* Actions (visible on hover) */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Move button */}
        <button
          onClick={handleMove}
          className="text-[10px] text-muted-foreground hover:text-foreground px-1"
          title={`Move to ${targetColumn}`}
        >
          {targetColumn === "later" ? "→" : "←"}
        </button>
        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="text-[10px] text-destructive/50 hover:text-destructive px-1"
          title="Delete"
        >
          ×
        </button>
      </div>
    </div>
  );
}
