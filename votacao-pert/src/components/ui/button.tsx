export function Button({ children, ...props }) {
    return (
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
        {...props}
      >
        {children}
      </button>
    );
  }
  