import React from "react";

type Mistake = {
  wrong: string;
  correct: string;
  detail: string;
};

type Props = {
  result: "Win" | "Lose";
  affection: number;
  mistakes: Mistake[];
  onRestart: () => void;
};

export const PostGameSummary = ({ result, affection, mistakes, onRestart }: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-700 text-white p-6">
      <h1 className="text-4xl font-bold mb-4">
        {result === "Win" ? "🏆 Victory!" : "💀 Game Over"}
      </h1>
      <p className="text-lg mb-6">Điểm thiện cảm còn lại: {affection}</p>

      {mistakes.length > 0 && (
        <div className="w-full max-w-2xl mb-6 overflow-auto">
          <h2 className="text-2xl font-semibold mb-2">Các lỗi Keigo đã mắc phải</h2>
          <table className="w-full table-auto bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <thead>
              <tr className="bg-white/20">
                <th className="px-4 py-2">Từ dùng sai</th>
                <th className="px-4 py-2">Từ đúng</th>
                <th className="px-4 py-2">Giải thích</th>
              </tr>
            </thead>
            <tbody>
              {mistakes.map((m, i) => (
                <tr key={i} className="border-t border-white/10">
                  <td className="px-4 py-2 text-center">{m.wrong}</td>
                  <td className="px-4 py-2 text-center">{m.correct}</td>
                  <td className="px-4 py-2">{m.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={onRestart}
        className="mt-4 px-6 py-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold rounded-xl shadow-lg transition"
      >
        Chơi lại
      </button>
    </div>
  );
};
