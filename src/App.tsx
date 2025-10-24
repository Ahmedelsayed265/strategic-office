import InvestmentChartCard from "./components/footer/InvestmentChartCard";
import InvestmentPieCard from "./components/footer/InvestmentPieCard";
import Header from "./components/header/Header";
import Sidebar from "./components/sidebar/Sidebar";

function App() {
  return (
      <div className="bg-[#F8F9FC] h-full w-full p-5 flex flex-col gap-4">
        <Header />

        <main className="h-[calc(100vh-248px)] w-full flex gap-4">
          <Sidebar />

          <div className="flex w-full gap-4">
            <div className="w-1/2">
              <InvestmentPieCard />
            </div>
            <div className="w-1/2">
              <InvestmentChartCard />
            </div>
          </div>
        </main>
      </div>
  );
}

export default App;
