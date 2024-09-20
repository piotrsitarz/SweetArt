"use client";

import { useState } from "react";
import ColorManager from "@/app/ui/dashboard/color-manager/color-manager";
import useFetchColors from "@/app/utils/hooks/useFetchColors";

export default function Page() {
  const { colors, isLoading, error, createColor, updateColor, deleteColor } =
    useFetchColors();
  const [name, setName] = useState("");
  const [value, setValue] = useState("#000");
  const [editingColor, setEditingColor] = useState(null);

  const handleCreateColor = (e) => {
    e.preventDefault();
    createColor(name, value);
    setName("");
    setValue("#000");
  };

  const handleUpdateColor = (e) => {
    e.preventDefault();
    if (editingColor) {
      updateColor(editingColor.id, name, value);
      handleCancelEditing();
    }
  };

  const handleDeleteColor = (id) => {
    deleteColor(id);
  };

  const handleCancelEditing = () => {
    setName("");
    setValue("#000");
    setEditingColor(null);
  };

  return (
    <ColorManager
      {...{
        colors,
        isLoading,
        setName,
        name,
        setValue,
        value,
        setEditingColor,
        editingColor,
        error,
        handleCreateColor,
        handleUpdateColor,
        handleCancelEditing,
        handleDeleteColor,
      }}
    />
  );
}
