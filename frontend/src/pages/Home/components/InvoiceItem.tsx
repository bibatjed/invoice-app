import { useNavigate } from "react-router-dom";
import { InvoiceItem as InvoiceItemProps } from "../api/invoice";
import Status from "../../../components/Status";
import { useMemo } from "react";
import { calculateDueDate } from "@src/util/date";
export default function InvoiceItem(props: InvoiceItemProps) {
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate(`/${props.invoice_tag}`);
  };

  const paymentDue = useMemo(() => {
    return calculateDueDate(props.invoice_date, props.payment_terms);
  }, [props.invoice_date, props.payment_terms]);
  return (
    <div onClick={handleOnClick} className="bg-custom-white hover:cursor-pointer flex flex-col justify-between p-5 px-10 gap-5 rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">
          <span className="text-custom-medium-grey">#</span>
          {props.invoice_tag}
        </h3>
        <span className="text-custom-medium-grey text-base">{props.bill_to_client_name}</span>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1.5">
          <span className="text-custom-medium-grey text-base">Due {paymentDue}</span>
          <span className="text-base font-bold">&#163;{props.total}</span>
        </div>
        <div className="w-28">
          <Status status={props.status} />
        </div>
      </div>
    </div>
  );
}
