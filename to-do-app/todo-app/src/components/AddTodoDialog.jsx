// src/components/AddTodoDialog.jsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function AddTodoDialog({
  title,
  setTitle,
  description,
  setDescription,
  handleAdd,
  isLoading,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const TITLE_LIMIT = 50;
  const DESCRIPTION_LIMIT = 250;

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    if (newTitle.length <= TITLE_LIMIT) {
      setTitle(newTitle);
    }
  };

  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    if (newDescription.length <= DESCRIPTION_LIMIT) {
      setDescription(newDescription);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;
    await handleAdd();
    setIsOpen(false);
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          style={{ color: "#faa356" }}
          className="mr-4 cursor-pointer hover:cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add Task"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Add New Task</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="title"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block"
              >
                Task Title
              </label>
              <div className="relative">
                <Input
                  id="title"
                  className="px-4 py-2 border rounded"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Enter your task"
                  style={{ color: "#faa356" }}
                  disabled={isLoading}
                  maxLength={TITLE_LIMIT}
                />
                <span className="absolute right-2 bottom-2 text-xs text-gray-400">
                  {title.length}/{TITLE_LIMIT}
                </span>
              </div>
            </div>
            <div>
              <label
                htmlFor="description"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block"
              >
                Task Description
              </label>
              <div className="relative">
                <Textarea
                  id="description"
                  className="px-4 py-2 border rounded min-h-[100px] resize-none"
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="Enter description"
                  style={{ color: "#faa356" }}
                  disabled={isLoading}
                  maxLength={DESCRIPTION_LIMIT}
                />
                <span className="absolute right-2 bottom-2 text-xs text-gray-400">
                  {description.length}/{DESCRIPTION_LIMIT}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                isLoading ||
                !title.trim() ||
                !description.trim() ||
                title.length > TITLE_LIMIT ||
                description.length > DESCRIPTION_LIMIT
              }
              className="cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Adding...
                </div>
              ) : (
                "Save Task"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
