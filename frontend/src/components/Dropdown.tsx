import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import ArrowDown from "@src/assets/icon-arrow-down.svg";
import cn from "clsx";

export default function Example() {
  const [show, setShow] = useState(false);
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button onClick={() => setShow((prev) => !prev)} className="inline-flex gap-1 w-full bg-none justify-center items-center  text-lg font-bold text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
          Filter{" "}
          <img
            src={ArrowDown}
            className={cn("w-3 h-2 transition rotate-0", {
              ["rotate-180"]: show,
            })}
          />
        </Menu.Button>
      </div>
      <Transition show={show} as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y  divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="px-1 py-1 ">
            <Menu.Item>{({ active, close }) => <button className={`${active ? "bg-violet-500 text-white" : "text-gray-900"} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>Draft</button>}</Menu.Item>
            <Menu.Item>{({ active, close }) => <button className={`${active ? "bg-violet-500 text-white" : "text-gray-900"} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>Pending</button>}</Menu.Item>
            <Menu.Item>{({ active, close }) => <button className={`${active ? "bg-violet-500 text-white" : "text-gray-900"} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>Paid</button>}</Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
