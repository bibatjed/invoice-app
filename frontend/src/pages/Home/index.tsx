import Main from "@src/layout/Main";
import { useEffect, useState } from "react";
import { GetInvoicesType, getInvoices } from "./api/invoice";
import Button from "@src/components/Button";
import EmptyInvoice from "./components/EmptyInvoice";
import MyDropdown from "@src/components/Dropdown";
import InvoiceItem from "./components/InvoiceItem";

export default function Home() {
  const [data, setData] = useState<GetInvoicesType>({
    result: [],
    pages: 0,
    count: 0,
  });
  useEffect(() => {
    getInvoices().then((data) => {
      setData(data);
    });
  }, []);
  return (
    <Main>
      <div className="w-full">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">Invoices</h1>
            <h3 className="text-custom-medium-grey text-base">{data.count} Invoices</h3>
          </div>

          <MyDropdown />
          <div className="w-28 h-14">
            <Button withAddIcon variant="primary" text="New" />
          </div>
        </div>

        <div className="flex mt-10 flex-col gap-4">
          {data.count > 0 &&
            data.result.map((value) => {
              return <InvoiceItem key={value.invoice_tag} {...value} />;
            })}
        </div>
        {data.count === 0 && <EmptyInvoice />}
      </div>
    </Main>
  );
}