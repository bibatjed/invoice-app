import { Fragment, useMemo, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import cn from "clsx";
import ArrowDown from "@src/assets/icon-arrow-down.svg";
import { UseControllerProps, useController } from "react-hook-form";
import { AddInvoiceType } from "@src/pages/Home/validate";
const netOption = [
  { name: "Net 1 Day", value: "net_1_day" },
  { name: "Net 7 Days", value: "net_7_days" },
  { name: "Net 14 Days", value: "net_14_days" },
  { name: "Net 30 Days", value: "net_30_days" },
];

export default function Select(props: UseControllerProps<AddInvoiceType>) {
  const [show, setShow] = useState(false);

  const {
    field,
    formState: {},
  } = useController({
    name: props.name,
    control: props.control,
  });

  const selectedNet = useMemo(() => {
    return netOption.find((val) => val.value === field.value);
  }, [field.value]);

  return (
    <div className="w-full h-full">
      <Listbox {...field}>
        <div className="relative mt-1">
          <Listbox.Button onClick={() => setShow((prev) => !prev)} className={cn("border-2 border-custom-light-grey items-center flex justify-between rounded-md p-2.5 h-full px-4 w-full hover:border-custom-purple focus-within:border-custom-purple", {})}>
            <span className="truncate text-left text-[15px] font-bold">{selectedNet?.name}</span>
            <img
              src={ArrowDown}
              className={cn("w-3 h-2 transition rotate-0", {
                ["rotate-180"]: show,
              })}
            />
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"></span>
          </Listbox.Button>
          <Transition as={Fragment} show={show} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {netOption.map((person, personIdx) => (
                <Listbox.Option onClick={() => setShow((prev) => !prev)} key={personIdx} className={({ active }) => `relative cursor-default border-b-2 border-custom-light-grey border-opacity-60 last:border-b-0 select-none font-bold py-2 pl-5 pr-4 ${active ? "text-custom-purple" : "text-black"}`} value={person.value}>
                  {() => (
                    <>
                      <span className={`text-left truncate text-[15px] font-bold`}>{person.name}</span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
