import Main from "@src/layout/Main";
import { useNavigate, useParams } from "react-router-dom";
import ArrowIconLeft from "@src/assets/icon-arrow-left.svg";
import Status from "@src/components/Status";
import Button from "@src/components/Button";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EditInvoice, GetInvoiceTypeDetailed, deleteInvoiceDetailed, editInvoice, getInvoiceDetailed, markInvoicePaid } from "./api/detailedInvoice";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import InvoiceForm from "../../components/InvoiceForm";
import cn from "clsx";
import { calculateDueDate } from "@src/util/date";

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

  const paymentDue = useMemo(() => {
    if (data?.invoice_date && data.payment_terms) {
      return calculateDueDate(data?.invoice_date as unknown as string, data?.payment_terms);
    }
  }, [data?.invoice_date, data?.payment_terms]);

  const [toggleEditInvoice, setToggleEditInvoice] = useState(false);

  const viewRef = useRef<HTMLHeadingElement | null>(null);
  const mainViewRef = useRef<HTMLHeadingElement | null>(null);
  useEffect(() => {
    if (mainViewRef.current && toggleEditInvoice) {
      mainViewRef.current.scrollIntoView();
    }
    if (viewRef.current && toggleEditInvoice) {
      viewRef.current.scrollTo({
        top: 0,
      });
    }
    if (toggleEditInvoice) {
      document.body.classList.add("overflow-y-hidden");
    } else {
      document.body.classList.remove("overflow-y-hidden");
    }
  }, [toggleEditInvoice]);

  const handleEditInvoiceData = useCallback(
    async (submitData: EditInvoice) => {
      if (invoiceTag) {
        const result = await editInvoice(invoiceTag, submitData);
        setData(result.data);
      }
    },
    [editInvoice, invoiceTag]
  );

  return (
    <>
      <Main innerRef={mainViewRef}>
        <div>
          <button onClick={handleOnBackButton} type="button" className="flex items-center  gap-5">
            <img src={ArrowIconLeft} className="w-2 h-3" alt="ArrowIconLeft" />
            <span className="text-[15px] font-bold">Go back</span>
          </button>
        </div>

        <div className="bg-custom-white rounded-2xl mt-[31px] px-[24px] pt-[24px] pb-[27px] flex items-center justify-between">
          <div className="flex items-center justify-between w-full md:w-0 md:gap-7">
            <span className="text-[13px] font-normal text-custom-medium-grey">Status</span>
            <div className="w-[104px] h-[40px]">
              <Status status={data?.status ?? "pending"} />
            </div>
          </div>

          {/* Table view button */}
          <div className="gap-3 hidden md:flex">
            <div className="w-[73px] h-[48px]">
              <Button
                onClick={() => {
                  setToggleEditInvoice(true);
                }}
                type="button"
                text="Edit"
                variant="secondary"
              />
            </div>
            <div className="w-[89px] h-[48px]">
              <Button onClick={() => setIsConfirmDeleteModalOpen(true)} type="button" text="Delete" variant="danger" />
            </div>
            <div className="w-[149px] h-[48px]">
              <Button type="button" onClick={handleOnClickMarkAsPaid} text="Mark as Paid" variant="primary" />
            </div>
          </div>
        </div>

        <div className="bg-custom-white rounded-2xl mt-[16px] px-[24px] pt-[25px] pb-[24px]">
          <div className="md:flex md:flex-row md:justify-between">
            <div className="flex gap-1.5 flex-col">
              <h2 className="text-[15px] font-bold">
                <span className="text-custom-medium-grey">#</span>
                {data?.invoice_tag}
              </h2>
              <h3 className="text-custom-medium-grey text-[13px] font-medium">{data?.project_description}</h3>
            </div>
            <div className="mt-[30px] md:mt-0 md:mr-6 flex flex-col gap-0.5">
              <span className="text-custom-medium-grey text-[13px] font-medium">{data?.bill_from_street_address}</span>
              <span className="text-custom-medium-grey text-[13px] font-medium">{data?.bill_from_city}</span>
              <span className="text-custom-medium-grey text-[13px] font-medium">{data?.bill_from_post_code}</span>

              <span className="text-custom-medium-grey text-[13px] font-medium">{data?.bill_from_country}</span>
            </div>
          </div>

          <div className="mt-[31px] flex flex-wrap md:flex-nowrap">
            <div className="flex flex-col mr-[61px] md:mr-[118px] justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-custom-medium-grey text-[13px] font-medium">Invoice Date</span>
                <span className="text-[15px] font-bold">{String(data?.invoice_date)}</span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-custom-medium-grey text-[13px] font-medium">Payment Due</span>
                <span className="text-[15px] font-bold">{paymentDue}</span>
              </div>
            </div>

            <div className="flex flex-col md:mr-[117px]">
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

            <div className="flex flex-col flex-1 min-w-[420px] md:min-w-0 gap-1 mt-[32px] md:mt-0">
              <span className="text-custom-medium-grey text-[13px] font-medium"> Sent to</span>
              <span className="text-[15px] font-bold">{data?.bill_to_client_email}</span>
            </div>
          </div>

          <div className="bg-custom-light-grey rounded-lg mt-[38px] ">
            <div className="p-6 flex flex-col gap-3">
              <div className="hidden md:flex md:w-full text-[13px] font-medium text-custom-medium-grey">
                <span className="flex-grow-[2]">Item Name</span>
                <span className="flex-grow-[1] text-right"> QTY.</span>
                <span className="flex-grow-[1] text-right"> Price</span>
                <span className="flex-grow-[1] text-right">Total</span>
              </div>
              {data?.invoice_items?.map((items) => {
                return (
                  <div key={items.id} className="flex justify-between md:justify-normal items-center">
                    <div className="flex flex-col flex-1 md:flex-row text-[15px] font-bold">
                      <span className="md:flex-grow-[2.3] md:min-w-[268px] md:max-w-[268px]">{items.item_name}</span>
                      <span className="md:hidden text-custom-medium-grey">
                        {items.quantity} x £ {items.price}
                      </span>
                      <span className="hidden md:inline md:flex-grow-[1] md:text-right">{items.quantity}</span>
                      <span className="hidden md:inline md:flex-grow-[1] md:text-right">£ {items.price}</span>
                      <span className="hidden md:inline md:flex-grow-[1] md:text-right">£ {items.total}</span>
                    </div>

                    <div className="md:hidden">
                      <span className="text-[15px] font-bold">£ {items.total}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-custom-dark-blue p-6 rounded-b-lg text-custom-white flex justify-between items-center ">
              <span className="text-[13px] font-medium">Amount Due</span>

              <span className="text-[24px] font-bold">£ 556.00</span>
            </div>
          </div>
        </div>

        <div className="h-[91px] w-screen -translate-x-6 flex flex-col items-center justify-center sticky bg-custom-white mt-[56px] md:hidden">
          <div className="flex gap-3">
            <div className="w-[73px] h-[48px]">
              <Button
                onClick={() => {
                  setToggleEditInvoice(true);
                }}
                type="button"
                text="Edit"
                variant="secondary"
              />
            </div>
            <div className="w-[89px] h-[48px]">
              <Button onClick={() => setIsConfirmDeleteModalOpen(true)} type="button" text="Delete" variant="danger" />
            </div>
            <div className="w-[149px] h-[48px]">
              <Button type="button" onClick={handleOnClickMarkAsPaid} text="Mark as Paid" variant="primary" />
            </div>
          </div>
        </div>

        <div
          ref={viewRef}
          className={cn("absolute top-0 left-0 transition overflow-x-hidden -translate-x-full z-30 w-screen md:w-[616px]", {
            ["translate-x-0"]: toggleEditInvoice,
          })}
        >
          <InvoiceForm
            key={1}
            defaultValue={data as GetInvoiceTypeDetailed}
            submit={handleEditInvoiceData}
            isEdit
            onDiscard={() => {
              setToggleEditInvoice(false);
            }}
          />
        </div>
        <div
          className={cn("fixed z-20 inset-0 bg-black bg-opacity-25", {
            ["hidden"]: !toggleEditInvoice,
          })}
        />
      </Main>

      <ConfirmDeleteModal invoice_tag={`#${invoiceTag}`} isOpen={isConfirmDeleteModalOpen} onCancel={handleConfirmModalOnCancel} onDelete={handleConfirmModalOnDelete} />
    </>
  );
}
