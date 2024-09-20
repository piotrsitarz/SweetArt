import { useState, useEffect } from "react";

const useFetchColors = () => {
  const [colors, setColors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchColors = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/colors");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setColors(data || []);
    } catch (error) {
      console.error("Error fetching colors:", error);
      setError("Failed to load colors. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const createColor = async (name, value) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/colors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, value }),
      });

      if (res.ok) {
        const newColor = await res.json();
        setColors((prev) => [...prev, newColor]);
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Something went wrong");
      }
    } catch (error) {
      setError("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const updateColor = async (id, name, value) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/colors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name, value }),
      });

      if (res.ok) {
        const updatedColor = await res.json();
        setColors((prev) =>
          prev.map((color) =>
            color.id === updatedColor.id ? updatedColor : color
          )
        );
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Something went wrong");
      }
    } catch (error) {
      setError("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteColor = async (id) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/colors", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setColors((prev) => prev.filter((color) => color.id !== id));
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Something went wrong");
      }
    } catch (error) {
      setError("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return { colors, isLoading, error, createColor, updateColor, deleteColor };
};

export default useFetchColors;
