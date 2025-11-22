import useGetTableData from "@/hooks/useGetTableData";
export default function Table() {
  const { data: table } = useGetTableData();

  return (
    <div className="p-3 bg-white overflow-x-auto">
      <h5 className="font-bold mb-5">{table?.data.indicatorHeader}</h5>

      <table
        className="w-full text-sm text-right border-collapse"
        dangerouslySetInnerHTML={{ __html: table?.data.tableHtml || "" }}
      />
    </div>
  );
}
