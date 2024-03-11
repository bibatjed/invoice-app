import Main from "@src/layout/Main";
import Button from "@src/components/Button";
import EmptyInvoice from "./components/EmptyInvoice";
import MyDropdown from "@src/pages/Home/components/Dropdown";
import InvoiceList from "./components/InvoiceList";
import useInfiniteLoadingInvoice from "./hooks/useInfiniteLoadingInvoice";
import InvoiceForm from "../../components/InvoiceForm";
import cn from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { AddInvoiceType } from "./validate";
import { postInvoice, PostInvoice } from "./api/invoice";

export default function Home() {
  const { data, bottomRef, isLoading, setStatusFilter, postInvoiceData } = useInfiniteLoadingInvoice();
  const [toggleAddInvoice, setToggleAddInvoice] = useState(false);

  const viewRef = useRef<HTMLHeadingElement | null>(null);
  useEffect(() => {
    if (viewRef.current && toggleAddInvoice) {
      viewRef.current.scrollTo({
        top: 0,
      });
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
    <Main>
      <div className="w-full">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">Invoices</h1>
            <h3 className="text-custom-medium-grey text-base">{data.count} Invoices</h3>
          </div>

          <div className="flex items-center gap-4">
            <MyDropdown onQueryChange={setStatusFilter} />
            <div className="w-24 h-14">
              <Button
                onClick={() => {
                  setToggleAddInvoice(true);
                }}
                withAddIcon
                variant="primary"
                text="New"
              />
            </div>
          </div>
        </div>

        {data.count === 0 && isLoading == false ? <EmptyInvoice /> : <InvoiceList result={data.result} />}
        <div ref={bottomRef} />
        {isLoading && <span>...Loading</span>}
      </div>

      <div
        ref={viewRef}
        className={cn("absolute top-0 left-0 transition overflow-y-scroll -translate-x-full z-30 max-h-screen w-screen", {
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
    </Main>
  );
}
