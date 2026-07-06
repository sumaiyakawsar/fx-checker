import Header from "@/components/Header/Header";
import LiveTicker from "@/components/LiveTicker/LiveTicker";
import Converter from "@/components/Converter/Converter";
import Button from "@/components/UI/Button/Button";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f0f0f]">
      <Header />
      <LiveTicker />
      <Converter />

  
    </main>
  );
}