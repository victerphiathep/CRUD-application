// src/components/TodoCard.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { IoCheckboxOutline, IoCheckbox } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export function TodoCard({ todo, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description);

  const handleSaveEdit = () => {
    onEdit({
      ...todo,
      title: editedTitle,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedTitle(todo.title);
    setEditedDescription(todo.description);
    setIsEditing(false);
  };

  return (
    
    <Dialog>
      <DialogTrigger asChild>
        <div className="bg-white shadow rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow flex flex-row justify-between items-center">
          <div className="flex-grow">
            <h2 className="text-xl font-bold">{todo.title}</h2>
          </div>
          <div className="flex items-center">
          <div
        className="cursor-pointer mr-2 flex"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(todo.id);
        }}
      >
        {todo.done ? (
          <IoCheckbox size={24} className="text-[#faa356]" />
        ) : (
          <IoCheckboxOutline size={24} className="text-[#faa356]" />
        )}
      </div>
          </div>
        </div>
      </DialogTrigger>



      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {isEditing ? "Edit Task" : todo.title}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-4">
            {isEditing ? (
              <>
                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Title:
                  </label>
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Description:
                  </label>
                  <Textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </>
            ) : (
              <div className="border rounded p-4 bg-gray-50">
                <h3 className="text-sm font-semibold mb-2">Description:</h3>
                <p className="text-sm text-gray-600">{todo.description}</p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold">Status:</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => onToggle(todo.id)}
                  className="w-4 h-4"
                />
                <span className="text-sm">
                  {todo.done ? "Completed" : "Pending"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
                <Button
                  className="cursor-pointer"
                  onClick={handleSaveEdit}
                  disabled={!editedTitle.trim() || !editedDescription.trim()}
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit className="mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => onDelete(todo.id)}
                >
                  <MdDelete className="mr-2" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
        <div
        className="cursor-pointer mr-2 flex"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(todo.id);
        }}
      >
        {todo.done ? (
          <IoCheckbox size={24} className="text-[#faa356]" />
        ) : (
          <IoCheckboxOutline size={24} className="text-[#faa356]" />
        )}
      </div>
      </DialogContent>
      
    </Dialog>
  );
}

TodoCard.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    done: PropTypes.bool.isRequired,
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
