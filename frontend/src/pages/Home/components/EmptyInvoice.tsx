import Empty from "@src/assets/illustration-empty.svg";
export default function EmptyInvoice() {
  return (
    <div>
      <img src={Empty} alt="Empty img" />
      <h1>There is nothing here</h1>
      <p>Create an invoice by cliking the New button and get started</p>
    </div>
  );
}
