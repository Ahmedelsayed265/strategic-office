interface IndicatorNameProps {
  name: string;
}

export default function IndicatorName({ name }: IndicatorNameProps) {
  return (
    <div className="bg-white flex items-center flex-col">
      <div className="bg-[#03998d] text-white w-full py-2">
        <h5 className="text-center text-[20px]">
          إســــــــــــــــــــــــــــــم المؤشـــــــــــــــــــــــــر
        </h5>
      </div>
      <div className="flex items-center justify-center h-full p-4">
        <b className="text-[#25935F] text-center">{name}</b>
      </div>
    </div>
  );
}