import { InvoiceItem as InvoiceItemProps } from "../api/invoice";
import InvoiceItem from "./InvoiceItem";
export default function InvoiceList(props: { result: InvoiceItemProps[] }) {
  return (
    <div className="flex mt-10 flex-col gap-4">
      {props.result.map((value) => {
        return <InvoiceItem key={value.invoice_tag} {...value} />;
      })}
    </div>
  );
}
