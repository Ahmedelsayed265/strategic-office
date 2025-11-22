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
import { useSearchParams } from "react-router";

interface Option {
  label: string;
  value: string;
}

interface MultiOptionSelectProps {
  placeholder?: string;
  options: Option[];
  paramKey: string;
  onChange: (key: string, values: string[]) => void;
}

const ALL_VALUE = "all";

export default function MultiOptionSelect({
  placeholder = "اختر",
  options,
  paramKey,
  onChange,
}: MultiOptionSelectProps) {
  const [open, setOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const param = searchParams.get(paramKey);
    if (param) {
      const values = param.split("-");
      setSelectedValues(values);
    } else {
      setSelectedValues([]);
    }
  }, [searchParams, paramKey]);

  const toggleValue = (value: string) => {
    if (value === ALL_VALUE) {
      if (selectedValues.length === options.length) {
        setSelectedValues([]);
        onChange(paramKey, []);
      } else {
        const allValues = options.map((opt) => opt.value);
        setSelectedValues(allValues);
        onChange(paramKey, allValues);
      }
      return;
    }

    const updated = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    setSelectedValues(updated);
    onChange(paramKey, updated);
  };

  const isAllSelected = selectedValues.length === options.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between bg-[#F8F9FC] text-[#737373] border-0 px-4 h-[40px] hover:bg-[#F8F9FC] shadow-none"
        >
          {selectedValues.length > 0
            ? isAllSelected
              ? "الكل"
              : `${selectedValues.length} عناصر مختارة`
            : placeholder}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[220px] p-0 right-0">
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => toggleValue(ALL_VALUE)}
                className="flex items-center gap-2 font-semibold cursor-pointer"
              >
                <Check
                  className={cn(
                    "h-4 w-4 border ",
                    isAllSelected ? "opacity-100 text-green-600" : "opacity-0"
                  )}
                />
                الكل
              </CommandItem>

              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  onSelect={() => toggleValue(opt.value)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Check
                    className={cn(
                      "h-4 w-4 border ",
                      selectedValues.includes(opt.value)
                        ? "opacity-100 text-green-600"
                        : "opacity-0"
                    )}
                  />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
