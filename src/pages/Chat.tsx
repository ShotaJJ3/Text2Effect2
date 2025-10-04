import Rain from "../components/Rain";

function Chat() {
  return (
    <div className="m-0 font-sans">
      <div
        id="container"
        className="flex flex-col items-center justify-center min-h-screen p-8 text-center transition-colors duration-7-- ease-linear bg-[#f0f2f5] text-[#333]"
      >
        <h1 className="text-5xl mb-10 font-bold">感情分析エフェクト</h1>
        <p className="m-6 text-xl">文章を入力すると、その感情に応じて背景が変わります。</p>

        <textarea
          id="text-input"
          placeholder="ここに文章を入力してください..."
          rows={5}
          className="w-full max-w-[500px] p-4 text-base rounded-lg border border-gray-300 my-6 mt-6 mb-4 resize-y"
        ></textarea>
        <button
          id="analyze-button"
          className="m-3 py-3 px-8 text-base font-bold border-0 rounded-lg bg-[#007bff] text-white cursor-pointer transition-colors duration-300
        hover:border-2 hover:border-[#007bff] hover:text-[#007bff] hover:bg-white
        disabled:bg-[#aaa] disabled:cursor-not-allowed"
        >
          感情を分析する
        </button>
        <Rain/>

        <div id="result" className="mt-8 py-4 px-8 rounded-lg bg-white/70 shadow-md hidden"></div>
      </div>
    </div>
  );
}

export default Chat;


// /* --- エフェクト部分 --- */
// .container.effect-positive {
//     background-color: #ffefd5;
//     color: #4c3b1e;
// }

// .container.effect-negative {
//     background-color: #465a70;
//     color: #e0e0e0;
// }
