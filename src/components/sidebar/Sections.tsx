import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useThemeStore } from "./store";
import useGetSections from "@/hooks/useGetSections";

export default function Sections() {
  const { open, setOpen } = useThemeStore();
  const { data, isLoading } = useGetSections();
  const [searchParams, setSearchParams] = useSearchParams();

  const [sectors, setSectors] = useState(data?.data.mainSectors || []);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedSection = searchParams.get("section");

  useEffect(() => {
    if (data?.data.mainSectors) {
      setSectors(data.data.mainSectors);
    }
  }, [data]);

  const handleSelect = (sectionId: number) => {
    setSearchParams({ section: sectionId.toString() });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (!data?.data.mainSectors) return;
    const filtered = data.data.mainSectors.filter((sector) =>
      sector.name.toLowerCase().includes(query.toLowerCase())
    );
    setSectors(filtered);
  };

  const renderSkeleton = () => (
    <ul className="flex flex-col gap-2">
      {Array.from({ length: 6 }).map((_, idx) => (
        <li
          key={idx}
          className="p-3 rounded-md animate-pulse bg-gray-200 h-10"
        />
      ))}
    </ul>
  );

  return (
    <div
      className={`h-full bg-[#019a8c] pattern-overlay flex flex-col p-4 transition-all 
        ${open ? "gap-6" : "gap-4"} `}
      style={{
        width: open ? "var(--card-width)" : "100px",
      }}
    >
      <div
        className={`flex items-center ${
          open ? "justify-between" : "justify-center mb-2"
        }`}
      >
        {open && <h6 className="text-white font-semibold">القطاعات</h6>}

        <button onClick={() => setOpen(!open)}>
          <img src="/icons/menu.svg" alt="menu" className="h-6 w-6" />
        </button>
      </div>

      {open ? (
        <div className="border border-[#D5D7DA8F] flex items-center gap-2 p-2 ">
          <img src="/icons/search.svg" alt="search" className="h-4" />
          <input
            type="text"
            placeholder="بحث"
            value={searchQuery}
            onChange={handleSearch}
            className="bg-transparent text-white placeholder:text-white outline-none w-full"
          />
        </div>
      ) : (
        <div
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <img src="/icons/search.svg" alt="search" className="h-4" />
          <h6 className="text-white">بحث</h6>
        </div>
      )}

      <div className="overflow-y-auto h-full p-1 sections">
        {isLoading ? (
          renderSkeleton()
        ) : (
          <ul className="flex flex-col gap-2 overflow-y-auto">
            {sectors?.map((sector) => {
              const isActive = selectedSection === sector?.id?.toString();

              return (
                <li
                  key={sector.id}
                  onClick={() => handleSelect(sector.id)}
                  className={`p-3 flex gap-2 cursor-pointer text-white ${
                    isActive ? "bg-white !text-[#25935F]" : "hover:bg-white/20"
                  } ${
                    open
                      ? ""
                      : "flex flex-col items-center justify-center gap-2"
                  }`}
                >
                  <img
                    src="/icons/chart-up.svg"
                    alt="الإستثمار"
                    className={`transition-all duration-200 ${
                      isActive
                        ? ""
                        : "brightness-0 invert group-hover:brightness-100 group-hover:invert-0"
                    } `}
                  />
                  <span className={open ? "" : "text-center  text-[14px]"}>
                    {sector.name}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
