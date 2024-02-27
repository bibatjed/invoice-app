import { ReactNode } from "react";
import Header from "./Header";

export default function Main(props: { children: ReactNode | ReactNode[] }) {
  return (
    <div>
      <Header />
      {props.children}
    </div>
  );
}
