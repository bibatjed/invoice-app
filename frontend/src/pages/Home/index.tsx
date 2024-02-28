import Main from "@src/layout/Main";
import Button from "@src/components/Button";
import EmptyInvoice from "./components/EmptyInvoice";
import MyDropdown from "@src/components/Dropdown";
import InvoiceList from "./components/InvoiceList";
import useInfiniteLoadingInvoice from "./hooks/useInfiniteLoadingInvoice";

export default function Home() {
  const { data, bottomRef, isLoading } = useInfiniteLoadingInvoice();
  return (
    <Main>
      <div className="w-full">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">Invoices</h1>
            <h3 className="text-custom-medium-grey text-base">{data.count} Invoices</h3>
          </div>

          <div className="flex items-center gap-4">
            <MyDropdown />
            <div className="w-28 h-14">
              <Button withAddIcon variant="primary" text="New" />
            </div>
          </div>
        </div>

        {data.count === 0 && isLoading == false ? <EmptyInvoice /> : <InvoiceList result={data.result} />}
        {isLoading && <span>...Loading</span>}
        <div ref={bottomRef} />
      </div>
    </Main>
  );
}
