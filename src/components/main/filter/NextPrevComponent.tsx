import useGetFilterData from "@/hooks/useGetFilterData";
import useGetPointers from "@/hooks/useGetPointers";
import { updateSearchParams } from "@/updateParams";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

export default function NextPrevComponent() {
  const { data: pointers } = useGetPointers();
  const [searchParams, setSearchParams] = useSearchParams();
  const [pointersIds, setPointersIds] = useState<number[]>([]);
  const mainView = searchParams.get("mainView") || "indicator";
  const { data: indicatorData } = useGetFilterData();

  useEffect(() => {
    if (pointers?.data) {
      setPointersIds(pointers.data.map((p) => p.id));
    }
  }, [pointers]);

  const handlePrev = () => {
    const current = Number(searchParams.get("pointer")) || 0;
    const currentIndex = pointersIds.indexOf(current);
    const prevId = pointersIds[currentIndex - 1];
    if (prevId !== undefined) {
      updateSearchParams(
        setSearchParams,
        { pointer: prevId.toString() },
        "pointer"
      );
    }
  };

  const handleNext = () => {
    const current = Number(searchParams.get("pointer")) || 0;
    const currentIndex = pointersIds.indexOf(current);
    const nextId = pointersIds[currentIndex + 1];
    if (nextId !== undefined) {
      updateSearchParams(
        setSearchParams,
        { pointer: nextId.toString() },
        "pointer"
      );
    }
  };

  return (
    <div
      className={`flex items-center mt-4 ${
        mainView === "metadata" ? "justify-end" : "justify-between"
      }`}
    >
      {mainView !== "metadata" && (
        <p className="text-[16px]">
          وحدة القياس :{" "}
          <b className="text-[#25935F]">{indicatorData?.data.migUnit}</b>
        </p>
      )}

      <div className="flex items-center gap-2">
        <button
          className="p-2 px-4 bg-gray-100"
          onClick={handlePrev}
          disabled={
            !searchParams.get("pointer") ||
            pointersIds.indexOf(Number(searchParams.get("pointer"))) <= 0
          }
        >
          السابق
        </button>
        <button
          className="p-2 px-4 bg-gray-100"
          onClick={handleNext}
          disabled={
            !searchParams.get("pointer") ||
            pointersIds.indexOf(Number(searchParams.get("pointer"))) ===
              pointersIds.length - 1
          }
        >
          التالى
        </button>
      </div>
    </div>
  );
}
