import { useThemeStore } from "./store";

export default function Sections() {
  const { open, setOpen } = useThemeStore();

  return (
    <div
      className={`h-full  rounded-[12px] bg-[#25935F] pattern-overlay flex flex-col p-4 ${
        open ? "w-[286px]" : "w-[120px]"
      } ${open ? "gap-6" : "gap-4"} `}
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
        <ul className="flex flex-col gap-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <li
              className={`group flex items-center gap-3 rounded-[8px] p-3 text-white cursor-pointer hover:bg-white hover:!text-[#25935F]  ${
                open ? "" : "flex-col text-center"
              } ${i === 1 ? "bg-white !text-[#25935F]" : ""}`}
              key={i}
            >
              <img
                src="/icons/chart-up.svg"
                alt="الإستثمار"
                className={`transition-all duration-200 ${
                  i === 1
                    ? ""
                    : "brightness-0 invert group-hover:brightness-100 group-hover:invert-0"
                }`}
              />
              الإستثمار
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
