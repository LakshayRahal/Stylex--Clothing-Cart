import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ProductFilter({ filters, handleFilter }) {
  return (
    <div
      className="
        bg-background rounded-lg shadow-sm
        md:sticky md:top-20 md:h-[calc(100vh-5rem)]
        md:overflow-y-auto
      "
    >
 
      <div className="p-4 border-b md:block hidden">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>

    
      <div
        className="
          p-4
          flex md:flex-col gap-6
          overflow-x-auto md:overflow-visible
          whitespace-nowrap md:whitespace-normal
        "
      >
        {Object.keys(filterOptions).map((keyItem) => (
          <div key={keyItem} className="min-w-[180px] md:min-w-0">
            <h3 className="text-base font-bold capitalize">{keyItem}</h3>

            <div className="grid gap-2 mt-2">
              {filterOptions[keyItem].map((option) => (
                <Label
                  key={option.id}
                  className="flex items-center gap-2 font-medium"
                >
                  <Checkbox
                    checked={
                      filters?.[keyItem]?.includes(option.id)
                    }
                    onCheckedChange={() =>
                      handleFilter(keyItem, option.id)
                    }
                  />
                  {option.label}
                </Label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
