import { InvoiceItem as InvoiceItemProps } from "../api/invoice";
import Status from "./Status";
export default function InvoiceItem(props: InvoiceItemProps) {
  return (
    <div className="bg-custom-white flex flex-col justify-between p-5 px-10 gap-5 rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">
          <span className="text-custom-medium-grey">#</span>
          {props.invoice_tag}
        </h3>
        <span className="text-custom-medium-grey text-base">{props.bill_to_client_name}</span>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1.5">
          <span className="text-custom-medium-grey text-base">Due {props.invoice_date}</span>
          <span className="text-base font-bold">&#163;{props.total}</span>
        </div>
        <div className="w-28">
          <Status status={"draft"} />
        </div>
      </div>
    </div>
  );
}
