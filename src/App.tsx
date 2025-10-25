import InvestmentChartCard from "./components/footer/InvestmentChartCard";
import InvestmentPieCard from "./components/footer/InvestmentPieCard";
import Header from "./components/header/Header";
import MainCharts from "./components/main/MainCharts";
import Sidebar from "./components/sidebar/Sidebar";

function App() {
  return (
    <div className="bg-[#F8F9FC] h-full w-full p-5 flex flex-col gap-4">
      <Header />

      <main className="h-[calc(100vh-248px)] w-full flex gap-4">
        <Sidebar />

        <div className="flex flex-col w-full gap-4 h-full overflow-y-auto">
          <MainCharts />

          <div className="flex w-full gap-4">
            <InvestmentPieCard />
            <InvestmentChartCard />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
