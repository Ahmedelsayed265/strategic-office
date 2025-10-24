import { Card, CardContent, CardHeader } from "../ui/card";
import FilterHeader from "./FilterHeader";

export default function MainCharts() {
  return (
    <Card className="w-full">
      <CardHeader className="border-b border-[#F4F5F6] flex flex-col gap-3">
        <FilterHeader />
      </CardHeader>

      <CardContent className="h-[340px] p-2"></CardContent>
    </Card>
  );
}
