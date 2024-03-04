import Main from "@src/layout/Main";
import { useParams } from "react-router-dom";

export default function DetailedInvoice() {
  let { invoiceTag } = useParams();
  return (
    <Main>
      <div>hello {invoiceTag}</div>
    </Main>
  );
}
