import { useState, useEffect } from "react";
import axios from "axios";

export function useTodos() {
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:8000/todos/");
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async (newTodo) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/todos/",
        newTodo
      );
      if (response.status === 200 || response.status === 201) {
        await fetchTodos();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding todo:", error);
      return false;
    }
  };

  // Add other todo operations here (toggle, edit, delete)

  useEffect(() => {
    fetchTodos();
  }, []);

  return { todos, fetchTodos, addTodo };
}
