import Input from "@src/components/Input";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddInvoiceType, addInvoiceSchema } from "../validate";
import Button from "@src/components/Button";
import Select from "@src/components/Select";
import DatePicker from "@src/components/DatePicker";
import { postInvoice } from "../api/invoice";

export default function InvoiceForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,

    control,
  } = useForm<AddInvoiceType>({
    defaultValues: {
      payment_terms: "net_1_day",
    },
    resolver: zodResolver(addInvoiceSchema),
  });

  const invoice_items = watch("invoice_items");

  const { fields, append } = useFieldArray({
    control,
    name: "invoice_items",
  });

  const onSubmit = async (data: AddInvoiceType) => {
    try {
      const submitData = {
        ...data,
        invoice_items: data.invoice_items.map((val) => {
          const price = Number(val.price);
          const quantity = Number(val.quantity);
          return {
            item_name: val.item_name,
            price: price,
            quantity: quantity,
            total: price * quantity,
          };
        }),
      };

      await postInvoice(submitData);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="w-full bg-custom-white p-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-[24px] font-bold">New Invoice</h1>

        <h3 className="text-custom-purple text-[15px]">Bill From</h3>

        <div>
          <span className="text-custom-medium-grey text-[13px] font-normal">Street Address</span>
          <div className="h-[48px]">
            <Input {...register("bill_from_street_address")} />
          </div>
        </div>

        <div>
          <span className="text-custom-medium-grey text-[13px] font-normal">City</span>
          <div className="h-[48px]">
            <Input {...register("bill_from_city")} />
          </div>
        </div>

        <div>
          <span className="text-custom-medium-grey text-[13px] font-normal">Post Code</span>
          <div>
            <Input {...register("bill_from_post_code")} />
          </div>
        </div>

        <div>
          <span className="text-custom-medium-grey text-[13px] font-normal">Country</span>

          <div className="h-[48px]">
            <Input {...register("bill_from_country")} />
          </div>
        </div>

        <h3 className="text-custom-purple text-[15px] mt-[41px]">Bill To</h3>

        <div>
          <span className="text-custom-medium-grey text-[13px] font-normal">Client&#8217;s Name</span>

          <div className="h-[48px]">
            <Input {...register("bill_to_client_name")} />
          </div>
        </div>

        <div>
          <span className="text-custom-medium-grey text-[13px] font-normal">Client&#8217;s Email</span>

          <div className="h-[48px]">
            <Input {...register("bill_to_client_email")} />
          </div>
        </div>

        <div>
          <span className="text-custom-medium-grey text-[13px] font-normal">Street Address</span>

          <div className="h-[48px]">
            <Input {...register("bill_to_street_address")} />
          </div>
        </div>

        <div>
          <span className="text-custom-medium-grey text-[13px] font-normal">City</span>

          <div className="h-[48px]">
            <Input {...register("bill_to_city")} />
          </div>
        </div>

        <div>
          <span className="text-custom-medium-grey text-[13px] font-normal">Post Code</span>

          <div className="h-[48px]">
            <Input {...register("bill_to_post_code")} />
          </div>
        </div>

        <div>
          <span className="text-custom-medium-grey text-[13px] font-normal">Country</span>

          <div className="h-[48px]">
            <Input {...register("bill_to_country")} />
          </div>
        </div>

        <div>
          <span className="text-custom-medium-grey text-[13px] font-normal">Invoice Date</span>
          <div className="h-[48px]">
            <DatePicker {...register("invoice_date")} />
          </div>
        </div>

        <div>
          <span className="text-custom-medium-grey text-[13px] font-normal">Payment Terms</span>

          <div className="h-[48px]">
            <Select control={control} name="payment_terms" />
          </div>
        </div>

        <div>
          <span className="text-custom-medium-grey text-[13px] font-normal">Project Description</span>

          <div className="h-[48px]">
            <Input {...register("project_description")} />
          </div>
        </div>

        <h3>Item list</h3>
        {fields.map((_, index) => {
          return (
            <div key={index}>
              <div>
                <span className="text-custom-medium-grey text-[13px] font-normal">Item Name</span>
                <Input {...register(`invoice_items.${index}.item_name`)} />
              </div>

              <div>
                <span className="text-custom-medium-grey text-[13px] font-normal">Qty</span>
                <Input type="number" step="1" pattern="\d+" {...register(`invoice_items.${index}.quantity`)} />
              </div>

              <div>
                <span className="text-custom-medium-grey text-[13px] font-normal">Price</span>
                <Input type="number" step="1" pattern="\d+" {...register(`invoice_items.${index}.price`)} />
              </div>

              <div>
                <span className="text-custom-medium-grey text-[13px] font-normal">Total</span>
                <Input readOnly value={Number(invoice_items[index].price) * Number(invoice_items[index].quantity)} />
              </div>
            </div>
          );
        })}

        <button type="button" onClick={() => append({ item_name: "", price: 0, quantity: 0 })}>
          + Add new Item
        </button>

        <div>
          <Button type="button" text="Discard" variant="primary" />

          <Button type="button" text="Save as Draft" variant="primary" />

          <Button type="submit" text="Save & Send" variant="primary" />
        </div>
      </form>
    </div>
  );
}
