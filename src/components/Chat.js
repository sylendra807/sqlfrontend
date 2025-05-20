import { useState } from "react";

export default function Chat({ chat, updateChat }) {
  const [input, setInput] = useState("");

  const handleGenerateSQL = async () => {
    if (!input.trim()) return;

    try {
      const response = await fetch("http://127.0.0.1:5000/generate-sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ natural_language: input }),
      });

      const data = await response.json();
      const query = data.sql_query; // ensure this matches the Flask response key

      const newMessages = [
        ...chat.messages,
        { role: "user", text: input },
        { role: "assistant", text: query },
      ];

      updateChat({
        ...chat,
        messages: newMessages,
        sqlQuery: query,
        resultData: [],
        title: chat.title || input.slice(0, 30),
      });

      setInput("");
    } catch (error) {
      console.error("Failed to generate SQL:", error);
    }
  };

  const handleRunQuery = async () => {
    if (!chat.sqlQuery?.trim()) return;

    try {
      const response = await fetch("http://localhost:8080/run-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: chat.sqlQuery }),
      });

      const data = await response.json();
       console.log(data);
       
      updateChat({
        ...chat,
        resultData: data.results || [],
      });
    } catch (error) {
      console.error("Failed to run query:", error);
    }
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-[#F5F5DC] p-6 overflow-y-auto">
      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          className="flex-1 border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
          placeholder="Enter your prompt..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerateSQL()}
        />
        <button
          onClick={handleGenerateSQL}
          className="bg-[#4CAF50] hover:bg-green-700 text-white px-5 py-2 rounded-xl"
        >
          Generate SQL
        </button>
      </div>

      {chat.sqlQuery && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-sm text-gray-800">{chat.sqlQuery}</span>
            <button
              onClick={handleRunQuery}
              className="ml-4 bg-blue-600 hover:bg-blue-800 text-white px-3 py-1 rounded"
            >
              Run Query
            </button>
          </div>
        </div>
      )}

      {chat.resultData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow">
            <thead>
              <tr>
                {Object.keys(chat.resultData[0]).map((key) => (
                  <th key={key} className="px-4 py-2 border bg-[#4CAF50] text-white">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chat.resultData.map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((val, i) => (
                    <td key={i} className="border px-4 py-2">
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 space-y-2">
        {chat.messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
            <div
              className={`p-2 rounded-lg ${
                msg.role === "user" ? "bg-[#4CAF50] text-white" : "bg-gray-300 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
