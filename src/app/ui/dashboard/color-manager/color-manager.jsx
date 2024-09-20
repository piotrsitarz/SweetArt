export default function ColorManager({
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
}) {
  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Color Manager</h2>
      <form
        onSubmit={editingColor ? handleUpdateColor : handleCreateColor}
        className="mb-6"
      >
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Color name"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Value
          </label>
          <input
            type="color"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full border rounded-md"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {editingColor ? "Update Color" : "Create Color"}
        </button>
        {editingColor ? (
          <button
            className="px-4 py-2 ml-4 bg-red-100 bg-blue-500 text-white rounded-md hover:bg-red-600"
            onClick={handleCancelEditing}
          >
            Cancel
          </button>
        ) : null}
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {isLoading ? (
        <div class="text-center">
          <div role="status">
            <svg
              aria-hidden="true"
              class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <ul>
          {colors.map((color) => (
            <li key={color.id} className="mb-4 flex items-center">
              <div
                className="w-10 h-10 rounded-full"
                style={{ backgroundColor: color.value }}
              ></div>
              <div className="ml-4 flex-1">
                <p className="text-lg font-semibold">{color.name}</p>
                <p className="text-gray-600">{color.value}</p>
              </div>
              <button
                onClick={() => {
                  setEditingColor(color);
                  setName(color.name);
                  setValue(color.value);
                }}
                className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteColor(color.id)}
                className="ml-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
