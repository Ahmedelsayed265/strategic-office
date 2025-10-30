import GaugeComponent from "react-gauge-component";

export default function PointerChart() {
  return (
    <div className="bg-white p-4 flex flex-col ">
      <h6 className="relative text-md mb-2 after:content-[''] after:absolute after:start-[-16px] after:top-0 after:h-full after:w-[2px] after:rounded-full after:bg-[#25935F]">
        قيمة المؤشر لعام 2025 = <b className="text-[#25935F]">{79.44}</b>
      </h6>

      <GaugeComponent
        value={79.44}
        type="semicircle"
        arc={{
          subArcs: [
            { limit: 30, color: "#EA4228" },
            { limit: 60, color: "#F5CD19" },
            { limit: 100, color: "#5BE12C" },
          ],
        }}
        labels={{
          valueLabel: { formatTextValue: () => "" },
        }}
        pointer={{ color: "#23AC6B", length: 0.7, width: 12 }}
      />
    </div>
  );
}
