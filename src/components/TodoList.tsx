import { useState } from 'react';
import { useGlobalState } from '../hooks/useGlobalState';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export const TodoList = () => {
  const [todos, setTodos] = useGlobalState<Todo[]>('todos', []);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos((prevTodos) => prevTodos ? [
        ...prevTodos,
        { id: Date.now(), text: newTodo.trim(), completed: false },
      ] : [{ id: Date.now(), text: newTodo.trim(), completed: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos((prevTodos) =>
      prevTodos?.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ) ?? []
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prevTodos) => prevTodos?.filter((todo) => todo.id !== id) ?? []);
  };

  return (
    <div>
      <h1>Список задач</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Добавить новую задачу"
      />
      <button onClick={addTodo}>Добавить</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span
              onClick={() => toggleTodo(todo.id)}
              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
};