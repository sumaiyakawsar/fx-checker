import Header from "@/components/Header/Header";
import LiveTicker from "@/components/LiveTicker/LiveTicker";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f0f0f]">
      <Header />
      <LiveTicker />
    </main>
  );
}