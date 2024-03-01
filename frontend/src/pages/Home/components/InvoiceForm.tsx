import Input from "@src/components/Input";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddInvoiceType, addInvoiceSchema } from "../validate";
import Button from "@src/components/Button";
import Select from "@src/components/Select";
import DatePicker from "@src/components/DatePicker";
import IconDelete from "@src/assets/icon-delete.svg";
import { InvoiceItem, postInvoice } from "../api/invoice";

export default function InvoiceForm(props: { onDiscard: () => void; postInvoiceData: (data: InvoiceItem) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    control,
  } = useForm<AddInvoiceType>({
    defaultValues: {
      payment_terms: "net_1_day",
      invoice_items: [],
    },
    resolver: zodResolver(addInvoiceSchema),
  });

  const invoice_items = watch("invoice_items");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "invoice_items",
  });

  const onDiscard = () => {
    reset();
    props.onDiscard();
  };

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

      const result = await postInvoice(submitData);
      props.postInvoiceData(result.data);
      onDiscard();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="w-full bg-custom-white p-6 mt-20 h-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-[24px] font-bold">New Invoice</h1>

        <h3 className="text-custom-purple text-[15px] mt-[22px]">Bill From</h3>

        <div>
          <span className="text-custom-medium-grey text-[13px] font-normal">Street Address</span>
          <div className="h-[48px]">
            <Input {...register("bill_from_street_address")} />
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-3 mt-[25px]">
          <div className="basis-[152px]">
            <span className="text-custom-medium-grey text-[13px] font-normal">City</span>
            <div className="h-[48px]">
              <Input {...register("bill_from_city")} />
            </div>
          </div>

          <div className="basis-[152px]">
            <span className="text-custom-medium-grey text-[13px] font-normal">Post Code</span>
            <div>
              <Input {...register("bill_from_post_code")} />
            </div>
          </div>

          <div className="basis-full">
            <span className="text-custom-medium-grey text-[13px] font-normal">Country</span>

            <div className="h-[48px]">
              <Input {...register("bill_from_country")} />
            </div>
          </div>
        </div>

        <h3 className="text-custom-purple text-[15px] mt-[41px]">Bill To</h3>

        <div className="flex flex-col gap-4">
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

          <div className="flex flex-wrap justify-between gap-3">
            <div className="basis-[152px]">
              <span className="text-custom-medium-grey text-[13px] font-normal">City</span>

              <div className="h-[48px]">
                <Input {...register("bill_to_city")} />
              </div>
            </div>

            <div className="basis-[152px]">
              <span className="text-custom-medium-grey text-[13px] font-normal">Post Code</span>

              <div className="h-[48px]">
                <Input {...register("bill_to_post_code")} />
              </div>
            </div>

            <div className="basis-full">
              <span className="text-custom-medium-grey text-[13px] font-normal">Country</span>

              <div className="h-[48px]">
                <Input {...register("bill_to_country")} />
              </div>
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
        </div>

        <h3 className="text-[18px] text-custom-medium-grey font-bolda mt-[69px] mb-9">Item list</h3>
        <div className="flex flex-col gap-5">
          {fields.map((_, index) => {
            return (
              <div key={index} className="last:mb-[48px] flex flex-col gap-3">
                <div className="">
                  <span className="text-custom-medium-grey text-[13px] font-normal">Item Name</span>
                  <div className="h-[48px]">
                    <Input {...register(`invoice_items.${index}.item_name`)} />
                  </div>
                </div>

                <div className="flex justify-center gap-2 items-center">
                  <div>
                    <span className="text-custom-medium-grey text-[13px] font-normal">Qty</span>
                    <div className="h-[48px] w-[64px]">
                      <Input {...register(`invoice_items.${index}.quantity`)} />
                    </div>
                  </div>

                  <div>
                    <span className="text-custom-medium-grey text-[13px] font-normal">Price</span>

                    <div className="min-h-[48px] w-[100px]">
                      <Input {...register(`invoice_items.${index}.price`)} />
                    </div>
                  </div>

                  <div>
                    <span className="text-custom-medium-grey text-[13px] font-normal">Total</span>
                    <div className="h-[48px] w-[110px]">
                      <Input readOnly value={Number(invoice_items?.[index]?.price ?? 0) * Number(invoice_items?.[index]?.quantity ?? 0)} />
                    </div>
                  </div>

                  <button className="h-[48px] flex items-center " onClick={() => remove(index)}>
                    {" "}
                    <img className="size-4 mt-5 h-5" src={IconDelete} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button className="text-[15px] bg-custom-light-grey w-full p-3.5 text-custom-medium-grey rounded-full" type="button" onClick={() => append({ item_name: "", price: 0, quantity: 0 })}>
          + Add new Item
        </button>

        <div className="h-[155px] flex flex-col">
          <div className="h-[50%] -translate-x-6 w-screen bg-gradient-to-br from-slate-100 to-gray-300 opacity-40"></div>
          <div className="flex justify-between bg-custom-white items-end basis-[50%]">
            <div className="w-[86px] h-14">
              <Button onClick={onDiscard} type="button" text="Discard" variant="secondary" />
            </div>
            <div className="w-[117px] h-14">
              <Button type="button" text="Save as Draft" variant="tertiary" />
            </div>
            <div className="w-[112px] h-14">
              <Button type="submit" text="Save & Send" variant="primary" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
