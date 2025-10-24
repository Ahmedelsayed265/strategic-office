import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function FilterHeader() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center bg-[#F8F9FC] p-1 rounded-md">
          <button className="py-2 px-4 text-[#fff] bg-[#25935F] rounded-md">
            عرض المؤشر
          </button>
          <button className="py-2 px-4 text-[#6C737F] rounded-md">
            بيانات وصفية
          </button>
          <button className="py-2 px-4 text-[#6C737F] rounded-md">
            عرض علي الخريطة
          </button>
        </div>

        <div className="flex items-center gap-6 bg-[#F8F9FC] py-3 px-6 rounded-md text-[#1F2A37]">
          <h6>طريقة العرض</h6>

          <RadioGroup defaultValue="option-one" className="flex flex-row gap-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="option-one" id="option-one" />
              <label htmlFor="option-one" className="text-[#6C737F]">
                رسم بياني
              </label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem value="option-two" id="option-two" />
              <label htmlFor="option-two" className="text-[#6C737F]">
                جدول
              </label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select>
            <SelectTrigger className="w-full px-4 !h-[40px] rounded-[8px] border-0 bg-[#F8F9FC]">
              <SelectValue placeholder="نوع الرسم البياني" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="cols">أعمدة</SelectItem>
              <SelectItem value="cols">خطي</SelectItem>
              <SelectItem value="cols">دائري</SelectItem>
              <SelectItem value="cols">قرص</SelectItem>
            </SelectContent>
          </Select>
          
          <Select>
            <SelectTrigger className="w-full px-4 !h-[40px] rounded-[8px] border-0 bg-[#F8F9FC]">
              <SelectValue placeholder="نوع الرسم البياني" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="cols">أعمدة</SelectItem>
              <SelectItem value="cols">خطي</SelectItem>
              <SelectItem value="cols">دائري</SelectItem>
              <SelectItem value="cols">قرص</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <button className="bg-[#DFF6E7] p-2 rounded-[8px]">
            <img src="/icons/pdf-02.svg" alt="pdf" />
          </button>
          <button className="bg-[#DFF6E7] p-2 rounded-[8px]">
            <img src="/icons/Vector.svg" alt="pdf" />
          </button>
        </div>
      </div>
    </>
  );
}
