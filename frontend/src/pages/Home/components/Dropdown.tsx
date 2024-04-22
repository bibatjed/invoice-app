import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import ArrowDown from "@src/assets/icon-arrow-down.svg";
import cn from "clsx";
import { useMediaQuery } from "usehooks-ts";

interface IDropdown {
  onQueryChange: (query: string) => void;
}
export default function Dropdown(props: IDropdown) {
  const [show, setShow] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const matches = useMediaQuery("(min-width: 768px)");

  const handleOnClickQuery = (filter: string) => {
    setFilterQuery((prev) => {
      const splitString = prev.split(",").filter((val) => val);
      const filterIndex = splitString.findIndex((val) => val === filter);
      if (filterIndex > -1) {
        splitString.splice(filterIndex, 1);
      } else {
        splitString.unshift(filter);
      }

      return splitString.join(",");
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      props.onQueryChange(filterQuery);
    }, 500);

    return () => clearTimeout(timeout);
  }, [filterQuery]);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button onClick={() => setShow((prev) => !prev)} className="inline-flex gap-1 w-full bg-none justify-center items-center  text-lg font-bold text-black focus:outline-none focus-visible:ring-2 dark:text-custom-white focus-visible:ring-white/75">
          {matches ? "Filter by status" : "Filter"}
          <img
            src={ArrowDown}
            className={cn("w-3 h-2 transition rotate-0", {
              ["rotate-180"]: show,
            })}
          />
        </Menu.Button>
      </div>
      <Transition show={show} as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
        <Menu.Items className="absolute right-0 mt-2 w-52 origin-top-right divide-y  divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="px-4 py-1 font-bold text-[15px]">
            <Menu.Item>
              <button onClick={() => handleOnClickQuery("draft")} className={`group flex w-full gap-3 items-center rounded-md px-2 py-2 `}>
                <input type="checkbox" className="accent-custom-purple" readOnly checked={filterQuery.includes("draft")} />
                Draft
              </button>
            </Menu.Item>
            <Menu.Item>
              <button onClick={() => handleOnClickQuery("pending")} className={`group flex w-full gap-3 items-center rounded-md px-2 py-2 `}>
                <input type="checkbox" className="accent-custom-purple" readOnly checked={filterQuery.includes("pending")} />
                Pending
              </button>
            </Menu.Item>
            <Menu.Item>
              <button onClick={() => handleOnClickQuery("paid")} className={`group flex w-full gap-3 items-center rounded-md px-2 py-2`}>
                <input type="checkbox" className="accent-custom-purple" checked={filterQuery.includes("paid")} />
                Paid
              </button>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
