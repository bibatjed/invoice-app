import Main from "@src/layout/Main";
import Button from "@src/components/Button";
import EmptyInvoice from "./components/EmptyInvoice";
import DropDown from "@src/pages/Home/components/Dropdown";
import InvoiceList from "./components/InvoiceList";
import useInfiniteLoadingInvoice from "./hooks/useInfiniteLoadingInvoice";
import InvoiceForm from "../../components/InvoiceForm";
import cn from "clsx";
import { useMediaQuery } from "usehooks-ts";
import { useCallback, useEffect, useRef, useState } from "react";
import { postInvoice, PostInvoice } from "./api/invoice";

export default function Home() {
  const { data, bottomRef, isLoading, setStatusFilter, postInvoiceData } = useInfiniteLoadingInvoice();
  const [toggleAddInvoice, setToggleAddInvoice] = useState(false);
  const matches = useMediaQuery("(min-width: 768px)");

  const viewRef = useRef<HTMLHeadingElement | null>(null);
  useEffect(() => {
    if (viewRef.current && toggleAddInvoice) {
      viewRef.current.scrollIntoView();
    }
    if (toggleAddInvoice) {
      document.body.classList.add("overflow-y-hidden");
    } else {
      document.body.classList.remove("overflow-y-hidden");
    }
  }, [toggleAddInvoice]);

  const handlePostInvoiceData = useCallback(
    async (submitData: PostInvoice) => {
      const result = await postInvoice(submitData);
      postInvoiceData(result.data);
    },
    [postInvoiceData]
  );
  return (
    <Main innerRef={viewRef}>
      <div className="w-full">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-3xl dark:text-custom-white font-bold">Invoices</h1>
            <h3 className="text-custom-medium-grey dark:text-custom-white text-base">{data.count} Invoices</h3>
          </div>

          <div className="flex items-center gap-4">
            <DropDown onQueryChange={setStatusFilter} />
            <div className="w-24 h-14 md:w-[150px]">
              <Button
                onClick={() => {
                  setToggleAddInvoice(true);
                }}
                withAddIcon
                variant="primary"
                text={matches ? "New Invoice" : "New"}
              />
            </div>
          </div>
        </div>

        {data.count === 0 && isLoading == false ? <EmptyInvoice /> : <InvoiceList result={data.result} />}
        <div ref={bottomRef} />
        {isLoading && <span>...Loading</span>}
      </div>

      <div
        className={cn("absolute top-0 left-0 transition flex flex-col overflow-auto -translate-x-full z-30 md:overflow-x-hidden w-screen md:w-[616px]", {
          ["translate-x-0"]: toggleAddInvoice,
        })}
      >
        <InvoiceForm
          submit={handlePostInvoiceData}
          onDiscard={() => {
            setToggleAddInvoice(false);
          }}
        />
      </div>
      <div
        className={cn("fixed z-20 inset-0 bg-black bg-opacity-25", {
          ["hidden"]: !toggleAddInvoice,
        })}
      />
    </Main>
  );
}
