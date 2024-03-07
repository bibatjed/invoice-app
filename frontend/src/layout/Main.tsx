import { ReactNode } from "react";
import Header from "./Header";

export default function Main(props: { children: ReactNode | ReactNode[] }) {
  return (
    <div className="min-h-screen bg-custom-light-grey">
      <Header />
      <div className="px-6 mx-auto mt-10 overflow-x-hidden">{props.children}</div>
    </div>
  );
}
