import { useState, useEffect } from "react";
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

export default function MultiRegionSelect({
  value = [],
  onChange,
}: {
  value?: string[];
  onChange?: (val: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(value);

  // ✅ Lock body scroll when dropdown open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const toggleRegion = (val: string) => {
    const newRegions = selectedRegions.includes(val)
      ? selectedRegions.filter((r) => r !== val)
      : [...selectedRegions, val];
    setSelectedRegions(newRegions);
    onChange?.(newRegions);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between bg-[#F8F9FC] border-0 px-4 h-[40px] rounded-[8px] text-gray-700"
        >
          {selectedRegions.length > 0
            ? `${selectedRegions.length} مناطق مختارة`
            : "النطاق العمراني"}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[250px] p-0 rounded-lg shadow-lg border bg-white"
        sideOffset={4}
        align="start"
        style={{
          zIndex: 9999, // ✅ make sure it's above everything
        }}
      >
        <Command>
          <CommandList>
            <CommandGroup>
              {regions.map((region) => (
                <CommandItem
                  key={region.value}
                  onSelect={() => toggleRegion(region.value)}
                  className="flex items-center gap-2 cursor-pointer select-none"
                >
                  <Check
                    className={cn(
                      "h-4 w-4 transition-opacity duration-150",
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
