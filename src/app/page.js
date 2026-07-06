import Header from "@/component/Header/Header";
import LiveTicker from "@/component/LiveTicker/LiveTicker";
import Converter from "@/component/Converter/Converter";
import Button from "@/component/UI/Button/Button";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f0f0f]">
      <Header />
      <LiveTicker />
      <Converter />

  
    </main>
  );
}