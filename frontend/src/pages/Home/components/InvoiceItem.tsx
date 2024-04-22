import { useNavigate } from "react-router-dom";
import { InvoiceItem as InvoiceItemProps } from "../api/invoice";
import Status from "@src/components/Status";
import { useMemo } from "react";
import { calculateDueDate } from "@src/util/date";
import { useMediaQuery } from "usehooks-ts";
import RightArrowSrc from "@src/assets/icon-arrow-right.svg";
export default function InvoiceItem(props: InvoiceItemProps) {
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate(`/${props.invoice_tag}`);
  };

  const matches = useMediaQuery("(min-width: 768px)");

  const paymentDue = useMemo(() => {
    return calculateDueDate(props.invoice_date, props.payment_terms);
  }, [props.invoice_date, props.payment_terms]);
  return (
    <div onClick={handleOnClick} className="bg-custom-white hover:cursor-pointer dark:bg-custom-dark-blue flex flex-col md:flex-row justify-between md:justify-normal p-5 px-10 gap-5 rounded-lg ">
      <div className="flex justify-between md:gap-7 items-center">
        <h3 className="font-bold text-lg dark:text-custom-white">
          <span className="text-custom-medium-grey">#</span>
          {props.invoice_tag}
        </h3>
        {matches ? <span className="text-custom-medium-grey dark:text-custom-white text-base">Due {paymentDue}</span> : <span className="text-custom-medium-grey text-base">{props.bill_to_client_name}</span>}
      </div>
      <div className="flex justify-between md:flex-1 items-center">
        <div className="flex flex-col md:flex-row md:flex-1 md:justify-around md:gap-0 gap-1.5">
          {matches ? <span className="text-custom-medium-grey dark:text-custom-white text-base">{props.bill_to_client_name}</span> : <span className="text-custom-medium-grey text-base">Due {paymentDue}</span>}
          <span className="text-base font-bold dark:text-custom-white">&#163;{props.total}</span>
        </div>
        <div className="w-28">
          <Status status={props.status} />
        </div>
        {matches && <img className="ml-7" src={RightArrowSrc} alt="right-arrow" />}
      </div>
    </div>
  );
}
