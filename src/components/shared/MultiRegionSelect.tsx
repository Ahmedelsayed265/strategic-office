import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const regions = [
  { label: "منطقة جازان", value: "Jazan" },
  { label: "منطقة عسير", value: "Asir" },
  { label: "منطقة نجران", value: "Najran" },
  { label: "منطقة الباحة", value: "Baha" },
];

export default function MultiRegionSelect() {
  const [open, setOpen] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  const toggleRegion = (value: string) => {
    setSelectedRegions((prev) =>
      prev.includes(value)
        ? prev.filter((r) => r !== value)
        : [...prev, value]
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between bg-[#F8F9FC] border-0 px-4 h-[40px] rounded-[8px] hover:bg-[#F8F9FC]"
        >
          {selectedRegions.length > 0
            ? `${selectedRegions.length} مناطق مختارة`
            : "النطاق العمراني"}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {regions.map((region) => (
                <CommandItem
                  key={region.value}
                  onSelect={() => toggleRegion(region.value)}
                  className="flex items-center gap-2"
                >
                  <Check
                    className={cn(
                      "h-4 w-4",
                      selectedRegions.includes(region.value)
                        ? "opacity-100 text-green-600"
                        : "opacity-0"
                    )}
                  />
                  {region.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
