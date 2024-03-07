import Main from "@src/layout/Main";
import { useNavigate, useParams } from "react-router-dom";
import ArrowIconLeft from "@src/assets/icon-arrow-left.svg";
import Status from "@src/components/Status";
import Button from "@src/components/Button";
import { useCallback, useEffect, useState } from "react";
import { GetInvoiceTypeDetailed, deleteInvoiceDetailed, getInvoiceDetailed, markInvoicePaid } from "./api/detailedInvoice";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";

export default function DetailedInvoice() {
  const { invoiceTag } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<GetInvoiceTypeDetailed | null>(null);

  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (invoiceTag) {
      getInvoiceDetailed(invoiceTag).then((data) => {
        setData(data);
      });
    }
  }, [invoiceTag]);

  const handleOnBackButton = () => {
    navigate("/");
  };

  const handleConfirmModalOnCancel = useCallback(() => {
    setIsConfirmDeleteModalOpen(false);
  }, []);

  const handleConfirmModalOnDelete = useCallback(() => {
    if (invoiceTag)
      deleteInvoiceDetailed(invoiceTag).then(() => {
        navigate("/");
      });
  }, [invoiceTag]);

  const handleOnClickMarkAsPaid = useCallback(() => {
    if (invoiceTag) {
      markInvoicePaid(invoiceTag).then(() => {
        setData((prevData) => {
          return {
            ...prevData!,
            status: "paid",
          };
        });
      });
    }
  }, []);

  return (
    <>
      <Main>
        <div>
          <button onClick={handleOnBackButton} type="button" className="flex items-center  gap-5">
            <img src={ArrowIconLeft} className="w-2 h-3" alt="ArrowIconLeft" />
            <span className="text-[15px] font-bold">Go back</span>
          </button>
        </div>

        <div className="bg-custom-white rounded-2xl mt-[31px] px-[24px] pt-[24px] pb-[27px] flex items-center justify-between">
          <span className="text-[13px] font-normal text-custom-medium-grey">Status</span>
          <div className="w-[104px] h-[40px]">
            <Status status={data?.status ?? "pending"} />
          </div>
        </div>

        <div className="bg-custom-white rounded-2xl mt-[16px] px-[24px] pt-[25px] pb-[24px]">
          <div>
            <h2 className="text-[15px] font-bold">
              <span className="text-custom-medium-grey">#</span>
              {data?.invoice_tag}
            </h2>
            <h3 className="text-custom-medium-grey text-[13px] font-medium">{data?.project_description}</h3>
          </div>
          <div className="mt-[30px] flex flex-col gap-0.5">
            <span className="text-custom-medium-grey text-[13px] font-medium">{data?.bill_from_street_address}</span>
            <span className="text-custom-medium-grey text-[13px] font-medium">{data?.bill_from_city}</span>
            <span className="text-custom-medium-grey text-[13px] font-medium">{data?.bill_from_post_code}</span>

            <span className="text-custom-medium-grey text-[13px] font-medium">{data?.bill_from_country}</span>
          </div>

          <div className="mt-[31px] flex flex-wrap">
            <div className="flex flex-col mr-[61px] justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-custom-medium-grey text-[13px] font-medium">Invoice Date</span>
                <span className="text-[15px] font-bold">{String(data?.invoice_date)}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-custom-medium-grey text-[13px] font-medium">Payment Due</span>
                <span className="text-[15px] font-bold">{String(data?.invoice_date)}</span>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-col gap-1">
                <span className="text-custom-medium-grey text-[13px] font-medium">Bill To</span>
                <span className="text-[15px] font-bold">{data?.bill_to_client_name}</span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-custom-medium-grey text-[13px] font-medium">{data?.bill_to_street_address}</span>
                <span className="text-custom-medium-grey text-[13px] font-medium">{data?.bill_to_city}</span>
                <span className="text-custom-medium-grey text-[13px] font-medium">{data?.bill_to_post_code}</span>

                <span className="text-custom-medium-grey text-[13px] font-medium">{data?.bill_to_country}</span>
              </div>
            </div>

            <div className="flex flex-col flex-1 gap-1 mt-[32px]">
              <span className="text-custom-medium-grey text-[13px] font-medium"> Sent to</span>
              <span className="text-[15px] font-bold">{data?.bill_to_client_email}</span>
            </div>
          </div>

          <div className="bg-custom-light-grey rounded-lg mt-[38px] ">
            <div className="p-6 flex flex-col gap-3">
              {data?.invoice_items?.map((items) => {
                return (
                  <div key={items.id} className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[15px] font-bold">{items.item_name}</span>
                      <span className="text-[15px] text-custom-medium-grey font-bold">
                        {items.quantity} x £ {items.price}
                      </span>
                    </div>

                    <div>
                      <span className="text-[15px] font-bold">£ {items.total}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-custom-dark-blue p-6 rounded-b-lg text-custom-white flex justify-between items-center ">
              <span className="text-[13px] font-medium">Grand Total</span>

              <span className="text-[24px] font-bold">£ 556.00</span>
            </div>
          </div>
        </div>

        <div className="h-[91px] w-screen -translate-x-[6%] flex flex-col items-center justify-center sticky bg-custom-white mt-[56px]">
          <div className="flex gap-3">
            <div className="w-[73px] h-[48px]">
              <Button onClick={() => {}} type="button" text="Edit" variant="secondary" />
            </div>
            <div className="w-[89px] h-[48px]">
              <Button onClick={() => setIsConfirmDeleteModalOpen(true)} type="button" text="Delete" variant="danger" />
            </div>
            <div className="w-[149px] h-[48px]">
              <Button type="button" onClick={handleOnClickMarkAsPaid} text="Mark as Paid" variant="primary" />
            </div>
          </div>
        </div>
      </Main>

      <ConfirmDeleteModal invoice_tag={`#${invoiceTag}`} isOpen={isConfirmDeleteModalOpen} onCancel={handleConfirmModalOnCancel} onDelete={handleConfirmModalOnDelete} />
    </>
  );
}
