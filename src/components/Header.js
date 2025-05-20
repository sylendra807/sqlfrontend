export default function Header() {
  return (
    <div className="h-16 bg-white border-b px-6 flex items-center justify-between shadow-sm">
      <h1 className="text-xl font-semibold text-[#333]">New Chat</h1>
      <button className="bg-gray-100 hover:bg-gray-200 px-3 py-1 text-sm rounded">
        ⚙ Settings
      </button>
    </div>
  );
}
