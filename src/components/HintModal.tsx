import React from "react";

type Props = {
  isOpen: boolean;
  isLoading: boolean;
  keywords: string[];
  onClose: () => void;
  onSelectKeyword?: (keyword: string) => void;
};

export const HintModal = ({
  isOpen,
  isLoading,
  keywords,
  onClose,
  onSelectKeyword,
}: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-gradient-to-b from-amber-50 to-orange-100 border-4 border-amber-400 rounded-3xl p-6 max-w-md w-full shadow-2xl relative text-gray-800">
        <div className="text-center mb-4">
          <span className="inline-block bg-amber-500 text-white font-black text-sm uppercase px-4 py-1 rounded-full shadow-md">
            💡 Gợi ý Kính ngữ (Keigo) (-5 Điểm)
          </span>
          <p className="text-xs text-amber-800 mt-2 font-medium">
            Chọn hoặc ghi nhớ mẫu câu bên dưới để trả lời Trưởng phòng:
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-bold text-amber-700">Đang tìm gợi ý từ Yamada...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 my-4">
            {keywords.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-4">Chưa có gợi ý phù hợp.</p>
            ) : (
              keywords.map((kw, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (onSelectKeyword) {
                      onSelectKeyword(kw);
                    }
                  }}
                  className="w-full text-left p-3.5 bg-white hover:bg-amber-100/80 active:scale-98 border-2 border-amber-300 rounded-2xl font-bold text-sm text-gray-800 shadow-sm transition-all duration-200 hover:shadow-md flex items-center gap-2 group"
                >
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-white flex items-center justify-center text-xs font-black shrink-0">
                    {idx + 1}
                  </span>
                  <span className="group-hover:text-amber-900 transition-colors">
                    {kw}
                  </span>
                </button>
              ))
            )}
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold rounded-xl shadow-md transition-all text-sm text-center"
          >
            Đóng & Tiếp tục lượt chơi
          </button>
        </div>
      </div>
    </div>
  );
};
