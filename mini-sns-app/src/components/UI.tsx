export const Button = ({ children, ...props }: any) => (
  <button
    {...props}
    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
  >
    {children}
  </button>
);

export const Input = ({ ...props }: any) => (
  <input
    {...props}
    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
);

export const TextArea = ({ ...props }: any) => (
  <textarea
    {...props}
    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
);
