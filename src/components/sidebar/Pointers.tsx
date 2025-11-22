import useGetPointers from "@/hooks/useGetPointers";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";

export default function Pointers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSection = searchParams.get("section");
  const selectedPointer = searchParams.get("pointer");

  const { data, isLoading } = useGetPointers();
  const [pointers, setPointers] = useState(data?.data ?? []);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (data?.data) {
      setPointers(data.data);
    }
  }, [data]);

  if (!selectedSection) return null;

  const handleSelectPointer = (id: string) => {
    setSearchParams((prev) => {
      prev.set("pointer", id);
      return prev;
    });
  };

  const filteredPointers = pointers.filter((pointer) =>
    pointer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div
        className="bg-white h-full p-4 overflow-y-auto flex flex-col gap-6"
        style={{
          width: "var(--card-width)",
        }}
      >
        <h6 className="font-semibold text-[#333]">المؤشرات</h6>

        <div className="border border-[#D5D7DA8F] flex items-center gap-2 p-2">
          <img
            src="/icons/search.svg"
            alt="search"
            className="h-4 brightness-0 invert-[10%]"
          />
          <input
            type="text"
            placeholder="بحث"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-[#333] placeholder:text-[#999] outline-none w-full"
          />
        </div>

        <div className="overflow-y-auto h-full p-1">
          {isLoading ? (
            <ul className="flex flex-col gap-2">
              {Array.from({ length: 6 }).map((_, idx) => (
                <li
                  key={idx}
                  className="p-3 rounded-md animate-pulse bg-gray-200 h-10"
                />
              ))}
            </ul>
          ) : (
            <ul className="flex flex-col gap-2">
              {filteredPointers?.map((pointer) => (
                <li
                  onClick={() => handleSelectPointer(pointer.id.toString())}
                  key={pointer.id}
                  className={`p-3 cursor-pointer text-sm ${
                    pointer.id.toString() === selectedPointer
                      ? "bg-[#25935F]/10 text-[#25935F] font-semibold"
                      : "hover:bg-[#F2F2F2]"
                  }`}
                >
                  {pointer.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
