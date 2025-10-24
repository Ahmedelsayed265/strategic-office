import { useSearchParams } from "react-router";
import { useThemeStore } from "./store";

export default function Sections() {
  const { open, setOpen } = useThemeStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedSection = searchParams.get("section");

  const handleSelect = (sectionName: string) => {
    if (selectedSection === sectionName) {
      searchParams.delete("section");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ section: sectionName });
    }
  };

  const sections = [
    "استعمالات الأرضي",
    "الإبتكار",
    "الإستثمار",
    "الاتصالات وتقنية المعلومات",
    "البنية التحتية",
    "الزراعة",
    "الصناعة",
  ];

  return (
    <div
      className={`h-full bg-[#25935F] pattern-overlay flex flex-col p-4 transition-all 
        ${selectedSection ? "rounded-r-[12px]" : "rounded-[12px]"}
        ${open ? "w-[286px]" : "w-[120px]"} 
        ${open ? "gap-6" : "gap-4"} `}
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
        <div className="border border-[#D5D7DA8F] flex items-center gap-2 p-2 rounded-[8px]">
          <img src="/icons/search.svg" alt="search" className="h-4" />
          <input
            type="text"
            placeholder="بحث"
            className="bg-transparent text-white placeholder:text-white"
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

      <div className="overflow-y-auto h-full">
        <ul className="flex flex-col gap-2 overflow-y-auto">
          {sections.map((sectionName) => {
            const isActive = selectedSection === sectionName;
            return (
              <li
                key={sectionName}
                onClick={() => handleSelect(sectionName)}
                className={`p-3 flex gap-2 rounded-[8px] cursor-pointer text-white ${
                  isActive ? "bg-white !text-[#25935F]" : "hover:bg-white/20"
                } ${
                  open ? "" : "flex flex-col items-center justify-center gap-2"
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
                <span className={open ? "" : "text-center  text-[14px]"}>{sectionName}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
