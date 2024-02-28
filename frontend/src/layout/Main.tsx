import { ReactNode } from "react";
import Header from "./Header";

export default function Main(props: { children: ReactNode | ReactNode[] }) {
  return (
    <div className="min-h-screen bg-custom-light-grey">
      <Header />
      <div className="w-[90%] mx-auto mt-10">{props.children}</div>
    </div>
  );
}
