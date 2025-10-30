import { useSearchParams } from "react-router";
import { useState } from "react";
import InvestmentChartCard from "./components/footer/InvestmentChartCard";
import Header from "./components/header/Header";
import MainCharts from "./components/main/MainCharts";
import Sidebar from "./components/sidebar/Sidebar";
import TableFilter from "./components/main/TableFilter";
import { ChevronDown, ChevronUp } from "lucide-react";

function App() {
  const [showChart, setShowChart] = useState(false);
  const [searchParams] = useSearchParams();
  const mainView = searchParams.get("mainView") || "indicator";

  return (
    <div className="bg-[#F8F9FC] h-full w-full p-5 flex flex-col gap-4">
      <Header />

      <main className="h-[calc(100vh-282px)] w-full flex gap-4">
        <Sidebar />

        <div className="flex flex-col w-full gap-4 h-full overflow-y-auto">
          <MainCharts />

          <div className="flex w-full gap-4 flex-col items-center">
            {mainView == "indicator" && (
              <>
                <div className="flex items-center justify-end mb-2">
                  <button
                    className="flex items-center gap-1 text-sm bg-gray-100 px-3 py-1 rounded-md hover:bg-gray-200"
                    onClick={() => setShowChart((prev) => !prev)}
                  >
                    {showChart ? <ChevronUp /> : <ChevronDown />}
                  </button>
                </div>
                {showChart && <InvestmentChartCard />}
              </>
            )}

            {mainView == "map" && <TableFilter />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
