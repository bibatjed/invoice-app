import { ReactNode } from "react";
import Header from "./Header";

export default function Main(props: { children: ReactNode | ReactNode[]; innerRef?: any }) {
  return (
    <div ref={props.innerRef} className="min-h-screen bg-custom-light-grey lg:flex lg:flex-row lg:relative">
      <Header />
      <div className="px-6 mx-auto mt-10 overflow-x-hidden lg:w-full lg:max-w-[730px]">{props.children}</div>
    </div>
  );
}
