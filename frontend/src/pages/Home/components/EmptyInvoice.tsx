import Empty from "@src/assets/illustration-empty.svg";
export default function EmptyInvoice() {
  return (
    <div className="flex mt-28 w-[85%] mx-auto flex-col gap-3 items-center">
      <img src={Empty} alt="Empty img" className="w-[80%]" />
      <h1 className="text-3xl font-bold dark:text-custom-white">There is nothing here</h1>
      <p className="text-center text-custom-medium-grey dark:text-custom-white">
        Create an invoice by cliking the <span className="font-bold">New</span> button and get started
      </p>
    </div>
  );
}
