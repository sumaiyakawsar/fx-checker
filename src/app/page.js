import Header from "@/component/Header/Header";
import LiveTicker from "@/component/LiveTicker/LiveTicker";
import Converter from "@/component/Converter/Converter";
import Dashboard from "@/component/Dashboard/Dashboard"; 
import StaleRatesBanner from "@/component/UI/StaleRatesBanner/StaleRatesBanner";

export default function Home() {
    return (
        <main className="min-h-screen bg-bg">
            <Header />
            <LiveTicker />
            <div className="container mx-auto mt-14 px-6 flex flex-col gap-10">
                <StaleRatesBanner />
                <Converter />
                <Dashboard />
            </div>
        </main>
    );
}