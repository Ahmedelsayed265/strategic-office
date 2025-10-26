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

const ALL_VALUE = "all";

export default function MultiRegionSelect() {
  const [open, setOpen] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  const toggleRegion = (value: string) => {
    if (value === ALL_VALUE) {
      if (selectedRegions.length === regions.length) {
        setSelectedRegions([]);
      } else {
        setSelectedRegions(regions.map((r) => r.value));
      }
      return;
    }

    let updated = selectedRegions.includes(value)
      ? selectedRegions.filter((r) => r !== value)
      : [...selectedRegions, value];

    if (updated.length === regions.length) {
      updated = regions.map((r) => r.value);
    }

    setSelectedRegions(updated);
  };

  const isAllSelected = selectedRegions.length === regions.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between bg-[#F8F9FC] border-0 px-4 h-[40px] rounded-[8px] hover:bg-[#F8F9FC]"
        >
          {selectedRegions.length > 0
            ? isAllSelected
              ? "الكل"
              : `${selectedRegions.length} مناطق مختارة`
            : "النطاق العمراني"}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => toggleRegion(ALL_VALUE)}
                className="flex items-center gap-2 font-semibold"
              >
                <Check
                  className={cn(
                    "h-4 w-4",
                    isAllSelected ? "opacity-100 text-green-600" : "opacity-0"
                  )}
                />
                الكل
              </CommandItem>

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
