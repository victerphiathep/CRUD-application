// src/App.jsx
import { useState, useEffect } from "react";
import { TodoHeader } from "./components/TodoHeader";
import { AddTodoDialog } from "./components/AddTodoDialog";
import { TodoCard } from "./components/TodoCard";
import axios from "axios";
import "./App.css";
import Footer from "./components/Footer";
import { IoCheckbox, IoCheckboxOutline } from "react-icons/io5";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch todos
  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:8000/todos/");
      setTodos(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setError("Failed to fetch todos");
    } finally {
      setIsLoading(false);
    }
  };

  // Add todo
  const handleAdd = async () => {
    if (!title.trim() || !description.trim()) return;

    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:8000/todos/",
        {
          title,
          description,
          done: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setTodos((prevTodos) => [...prevTodos, response.data]);
        setTitle("");
        setDescription("");
        setError(null);
      }
    } catch (error) {
      console.error("Error adding todo:", error);
      setError("Failed to add todo");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle todo completion
  const handleToggle = async (todoId) => {
    try {
      const todo = todos.find((t) => t.id === todoId);
      const response = await axios.patch(
        `http://localhost:8000/todos/${todoId}`,
        {
          done: !todo.done,
        }
      );

      if (response.status === 200) {
        setTodos(
          todos.map((t) => (t.id === todoId ? { ...t, done: !t.done } : t))
        );
        setError(null);
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
      setError("Failed to update todo");
    }
  };

  // Edit todo
  const handleEdit = async (updatedTodo) => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `http://localhost:8000/todos/${updatedTodo.id}`,
        {
          title: updatedTodo.title,
          description: updatedTodo.description,
          done: updatedTodo.done,
        }
      );

      if (response.status === 200) {
        setTodos(
          todos.map((todo) =>
            todo.id === updatedTodo.id ? response.data : todo
          )
        );
        setError(null);
      }
    } catch (error) {
      console.error("Error editing todo:", error);
      setError("Failed to edit todo");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete todo
  const handleDelete = async (todoId) => {
    try {
      setIsLoading(true);
      const response = await axios.delete(
        `http://localhost:8000/todos/${todoId}/`
      ); // Note the trailing slash

      if (response.status === 200 || response.status === 204) {
        // FastAPI might return 204 for successful deletion
        setTodos(todos.filter((t) => t.id !== todoId));
        setError(null);
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      setError("Failed to delete todo");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete all completed todos
  const handleDeleteCompleted = () => {
    const completedTodos = todos.filter((todo) => todo.done);
    Promise.all(
      completedTodos.map((todo) =>
        axios.delete(`http://localhost:8000/todos/${todo.id}`)
      )
    )
      .then(() => {
        setTodos(todos.filter((todo) => !todo.done));
        setError(null);
      })
      .catch((error) => {
        console.error("Error deleting completed todos:", error);
        setError("Failed to delete completed todos");
      });
  };

  // Load todos when component mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-[#21262d] p-8">
      <TodoHeader />

      <div className="flex flex-col items-center">
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

        <div className="mb-8">
          <AddTodoDialog
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            handleAdd={handleAdd}
            isLoading={isLoading}
          />
        </div>

        {isLoading ? (
          <div className="text-white text-center">Loading...</div>
        ) : (
          <div
            className="grid grid-cols-1 gap-4 w-full max-w-4xl"
            style={{ color: "#0d1117" }}
          >
            {todos.length === 0 ? (
              <p className="text-center text-white">No todos found.</p>
            ) : (
              todos.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        )}
        
      </div>
      <div>
      </div>
      <Footer />
    </div>
    
  );
}

export default App;
