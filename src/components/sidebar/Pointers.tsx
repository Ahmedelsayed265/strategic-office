import { useSearchParams } from "react-router";

export default function Pointers() {
  const [searchParams] = useSearchParams();
  const selectedSection = searchParams.get("section");

  const pointers = [
    "تطور معدل انتشار الإنترنت",
    "مؤشرات نقل واستخدام تقنية المعلومات والاتصالات",
    "جودة الخدمات - سرعة الشبكات من خلال الشركات المشغلة Zain",
    "نسبة الخدمات غير اللاسلكية في القطاع العام",
    "نسبة الوصول إلى الإنترنت المنزلي",
    "تطور معدل انتشار الإنترنت",
    "مؤشرات نقل واستخدام تقنية المعلومات والاتصالات",
    "جودة الخدمات - سرعة الشبكات من خلال الشركات المشغلة Zain",
    "نسبة الخدمات غير اللاسلكية في القطاع العام",
    "نسبة الوصول إلى الإنترنت المنزلي",
    "تطور معدل انتشار الإنترنت",
    "مؤشرات نقل واستخدام تقنية المعلومات والاتصالات",
    "جودة الخدمات - سرعة الشبكات من خلال الشركات المشغلة Zain",
    "نسبة الخدمات غير اللاسلكية في القطاع العام",
    "نسبة الوصول إلى الإنترنت المنزلي",
  ];
  if (!selectedSection) return null;

  return (
    <>
      <div
        className="bg-white h-full  p-4 overflow-y-auto  flex flex-col gap-6"
        style={{
          width: "var(--card-width)",
        }}
      >
        <h6 className="font-semibold text-[#333] ">المؤشرات</h6>

        <div className="border border-[#D5D7DA8F] flex items-center gap-2 p-2 ">
          <img
            src="/icons/search.svg"
            alt="search"
            className="h-4 brightness-0 invert-[10%] "
          />

          <input
            type="text"
            placeholder="بحث"
            className="bg-transparent text-[#333] placeholder:text-[#999] outline-none w-full"
          />
        </div>

        <div className="overflow-y-auto h-full p-1">
          <ul className="flex flex-col gap-2">
            {pointers.map((pointer, i) => (
              <li
                key={i}
                className={`p-3 cursor-pointer text-sm ${
                  i === 0
                    ? "bg-[#25935F]/10 text-[#25935F] font-semibold"
                    : "hover:bg-[#F2F2F2]"
                }`}
              >
                {pointer}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
