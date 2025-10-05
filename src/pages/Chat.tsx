import {useState} from "react"
import AngryEffect2 from "../components/AngryEffect2";
import GoodMarkEffect from "../components/GoodMarkEffect";
import HappyEffect2 from "../components/HappyEffect2";
import JoyfulEffect2 from "../components/JoyfulEffect2";
import LightningEffect from "../components/LightningEffect";
import NormalEffect2 from "../components/NormalEffect2";
import NormalMoodEffect from "../components/NormalMoodEffect";
import RainEffect from "../components/RainEffect";
import RandomEmotionEffect from "../components/RandomEmotionEffect";
import SadEffect2 from "../components/SadEffect2";
import SakuraEffect from "../components/SakuraEffect";
import Kamihubuki from "../components/Kamihubuki";
import Lt2 from "../components/Lt2";
import Rain from "../components/Rain"
import BabyEffect from "../components/BabyEffect";
import Snow from "../components/Snow";


type AnalyzeResult = {
  sentiment: string;
  scores: {
    positive: number;
    negative: number;
  };
};

function Chat() {
  const [word, setWord] = useState("")
  const [result, setResult] = useState<AnalyzeResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAnalyze = async() =>{
    //入力がない場合は何もしない
    if(!word){
      setError('テキストを入力してください。');
      return;
    }

    setLoading(true);
    setError("");
    try {
      // ...JSONデータを送信...
      const response = await fetch('http://127.0.0.1:5000/analyze', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({text: word}),
    });

    //エラーチェック
    if(!response.ok){
      const errorData = await response.json();
      throw new Error(errorData.error || "APIからのエラーレスポンス");
    }

    //エラーじゃなければデータをセット
    const data = await response.json();
      setResult(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
};

  const renderEffect = () =>{
    if(!result) return null;
    console.log(result.sentiment);
    if (result.sentiment === "NEGATIVE" && result.scores.negative > 0.7)
      return <>
      {/* <AngryEffect2 isActive={true} intensity={"heavy"}/> */}
      <Lt2/>
      <Rain/>
      <BabyEffect isActive/>
      </>
    if (result.sentiment === "NEGATIVE")
      return <RainEffect isActive={true} intensity={"heavy"}/>;
    if (result.sentiment === "POSITIVE" && result.scores.positive > 0.7)
      return <>
      <Kamihubuki/>
      <SakuraEffect isActive={true} intensity={"heavy"}/>

      </>
    if (result.sentiment === "POSITIVE")
      return <SakuraEffect isActive={true} intensity={"heavy"}/>;

    if (result.sentiment === "MIXED" && result.scores.positive > result.scores.negative)
      return <>
      {/* <BabyEffect isActive></BabyEffect> */}
      <Snow isActive></Snow>
      <SakuraEffect isActive></SakuraEffect>
      {/* <Rain></Rain> */}
      {/* <Lt2></Lt2> */}
      </>

    if (result.sentiment === "MIXED" && result.scores.positive < result.scores.negative)
      return<>
      <Rain></Rain>
      <SakuraEffect isActive></SakuraEffect>
      </>


    if (result.sentiment === "NEUTRAL")
      return <>
        <NormalEffect2 isActive={true} intensity={"strong"}/>
      </>

    return null;

  }
//import {useState} from "react";



  //const[isGoodMarkActive, setIsGoodMarkActive] = useState(false);
  return (
    <div className="m-0 font-sans">
      {renderEffect()}
      <div
        id="container"
        className="flex flex-col items-center justify-center min-h-screen p-8 text-center transition-colors duration-7-- ease-linear bg-[#f0f2f5] text-[#333]"
      >
        <h1 className="text-5xl mb-10 font-bold">感情分析エフェクト</h1>
        <p className="m-6 text-xl">文章を入力すると、その感情に応じて背景が変わります。</p>

        <textarea
          id="text-input"
          placeholder="ここに文章を入力してください..."
          value={word}
          onChange={(e) => setWord(e.target.value)}
          rows={5}
          className="w-full max-w-[500px] p-4 text-base rounded-lg border border-gray-300 my-6 mt-6 mb-4 resize-y"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault(); // デフォルトの改行動作をキャンセル
              handleAnalyze(); // 感情分析関数を呼び出す
            }
          }
          }
        ></textarea>
        <button
          id="analyze-button"
          className="m-3 py-3 px-8 text-base font-bold border-0 rounded-lg bg-[#007bff] text-white cursor-pointer transition-colors duration-300
          hover:border-2 hover:border-[#007bff] hover:text-[#007bff] hover:bg-white
          disabled:bg-[#aaa] disabled:cursor-not-allowed"
          onClick={handleAnalyze}
        >
          感情を分析する
        </button>
        {error && <p className="mt-4 text-red-600 font-bold">{error}</p>}

        {result && (
          <div className="mt-8 p-6 bg-white bg-opacity-80 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2">分析結果</h2>
            <p className="text-xl mb-1">感情: **{result.sentiment}**</p>
            <p className="text-sm text-gray-600">ポジティブ: {(result.scores.positive * 100).toFixed(2)}%</p>
            <p className="text-sm text-gray-600">ネガティブ: {(result.scores.negative * 100).toFixed(2)}%</p>
          </div>
        )}
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
