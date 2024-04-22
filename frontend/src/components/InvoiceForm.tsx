import Input from "@src/components/Input";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddInvoiceType, addInvoiceSchema } from "../pages/Home/validate";
import Button from "@src/components/Button";
import Select from "@src/components/Select";
import DatePicker from "@src/components/DatePicker";
import IconDelete from "@src/assets/icon-delete.svg";
import { PostInvoice } from "../pages/Home/api/invoice";
import { EditInvoice, GetInvoiceTypeDetailed } from "@src/pages/DetailedInvoice/api/detailedInvoice";
import { useEffect } from "react";

type DefaultValue = GetInvoiceTypeDetailed;

export default function InvoiceForm(props: { onDiscard: () => void; defaultValue?: DefaultValue; isEdit?: boolean; submit: (data: PostInvoice | EditInvoice) => Promise<void> }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, defaultValues },
    watch,
    reset,
    control,
  } = useForm<AddInvoiceType>({
    resolver: zodResolver(addInvoiceSchema),
    defaultValues: {
      ...(props.isEdit
        ? {}
        : {
            payment_terms: "net_1_day",
            invoice_items: [],
          }),
    },
  });

  useEffect(() => {
    if (props.isEdit) {
      reset({
        bill_from_city: props.defaultValue?.bill_from_city,
        bill_from_country: props.defaultValue?.bill_from_city,
        bill_from_post_code: props.defaultValue?.bill_from_post_code,
        bill_from_street_address: props.defaultValue?.bill_from_street_address,
        bill_to_city: props.defaultValue?.bill_to_city,
        bill_to_client_email: props.defaultValue?.bill_to_client_email,
        bill_to_client_name: props.defaultValue?.bill_to_client_name,
        bill_to_country: props.defaultValue?.bill_to_country,
        bill_to_post_code: props.defaultValue?.bill_to_post_code,
        bill_to_street_address: props.defaultValue?.bill_to_street_address,
        invoice_date: props.defaultValue?.invoice_date,
        invoice_items: props.defaultValue?.invoice_items,
        payment_terms: props.defaultValue?.payment_terms,
        project_description: props.defaultValue?.project_description,
      });
    }
  }, [props.isEdit, props.defaultValue]);

  const invoice_items = watch("invoice_items");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "invoice_items",
  });

  const onDiscard = () => {
    reset(
      props.defaultValue || {
        payment_terms: "net_1_day",
        invoice_items: [],
      }
    );
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
            ...val,
            item_name: val.item_name,
            price: price,
            quantity: quantity,
            total: price * quantity,
          };
        }),
      };

      await props.submit(submitData);
      onDiscard();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="w-full relative z-10 lg:mt-0  bg-custom-white dark:bg-custom-darker-blue  p-6 mt-20 h-full md:rounded-tr-2xl md:rounded-br-2xl md:pt-[59px] md:px-[56px]">
      <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto overflow-x-hidden h-[calc(100vh-120px)] md:h-[calc(100vh-150px)] lg:h-[calc(100vh-83px)]">
        <h1 className="text-[24px] font-bold dark:text-custom-white">{props.isEdit ? "Edit" : "New"} Invoice</h1>

        <h3 className="text-custom-purple text-[15px] mt-[22px]">Bill From</h3>

        <div>
          <span className="text-custom-medium-grey text-[13px] font-normal">Street Address</span>
          <div className="h-[48px]">
            <Input {...register("bill_from_street_address")} error={errors.bill_from_street_address != null} />
          </div>
          {errors.bill_from_street_address && <span className="text-sm font-medium text-red-600">{errors.bill_from_street_address.message}</span>}
        </div>

        <div className="flex flex-wrap md:flex-nowrap justify-between gap-3 md:gap-8 mt-[25px]">
          <div className="basis-[152px] md:basis-0 md:flex-1">
            <span className="text-custom-medium-grey text-[13px] font-normal">City</span>
            <div className="h-[48px]">
              <Input {...register("bill_from_city")} error={errors.bill_from_city != null} />
            </div>

            {errors.bill_from_city && <span className="text-sm font-medium text-red-600">{errors.bill_from_city.message}</span>}
          </div>

          <div className="basis-[152px] md:basis-0 md:flex-1">
            <span className="text-custom-medium-grey text-[13px] font-normal">Post Code</span>
            <div>
              <Input {...register("bill_from_post_code")} error={errors.bill_from_post_code != null} />
            </div>

            {errors.bill_from_post_code && <span className="text-sm font-medium text-red-600">{errors.bill_from_post_code.message}</span>}
          </div>

          <div className="basis-full md:basis-0 md:flex-1">
            <span className="text-custom-medium-grey text-[13px] font-normal">Country</span>

            <div className="h-[48px]">
              <Input {...register("bill_from_country")} error={errors.bill_from_country != null} />
            </div>
            {errors.bill_from_country && <span className="text-sm font-medium text-red-600">{errors.bill_from_country.message}</span>}
          </div>
        </div>

        <h3 className="text-custom-purple text-[15px] mt-[41px]">Bill To</h3>

        <div className="flex flex-col gap-4">
          <div>
            <span className="text-custom-medium-grey text-[13px] font-normal">Client&#8217;s Name</span>

            <div className="h-[48px]">
              <Input {...register("bill_to_client_name")} error={errors.bill_to_client_name != null} />
            </div>
            {errors.bill_to_client_name && <span className="text-sm font-medium text-red-600">{errors.bill_to_client_name.message}</span>}
          </div>

          <div>
            <span className="text-custom-medium-grey text-[13px] font-normal">Client&#8217;s Email</span>

            <div className="h-[48px]">
              <Input {...register("bill_to_client_email")} error={errors.bill_to_client_email != null} />
            </div>
            {errors.bill_to_client_email && <span className="text-sm font-medium text-red-600">{errors.bill_to_client_email.message}</span>}
          </div>

          <div>
            <span className="text-custom-medium-grey text-[13px] font-normal">Street Address</span>

            <div className="h-[48px]">
              <Input {...register("bill_to_street_address")} error={errors.bill_to_street_address != null} />
            </div>
            {errors.bill_to_street_address && <span className="text-sm font-medium text-red-600">{errors.bill_to_street_address.message}</span>}
          </div>

          <div className="flex flex-wrap justify-between gap-3 md:flex-nowrap md:gap-8">
            <div className="basis-[152px] md:basis-0 md:flex-1">
              <span className="text-custom-medium-grey text-[13px] font-normal">City</span>

              <div className="h-[48px]">
                <Input {...register("bill_to_city")} error={errors.bill_to_city != null} />
              </div>
              {errors.bill_to_city && <span className="text-sm font-medium text-red-600">{errors.bill_to_city.message}</span>}
            </div>

            <div className="basis-[152px] md:basis-0 md:flex-1">
              <span className="text-custom-medium-grey text-[13px] font-normal">Post Code</span>

              <div className="h-[48px]">
                <Input {...register("bill_to_post_code")} error={errors.bill_to_post_code != null} />
              </div>
              {errors.bill_to_post_code && <span className="text-sm font-medium text-red-600">{errors.bill_to_post_code.message}</span>}
            </div>

            <div className="basis-full md:basis-0 md:flex-1">
              <span className="text-custom-medium-grey text-[13px] font-normal">Country</span>

              <div className="h-[48px]">
                <Input {...register("bill_to_country")} error={errors.bill_to_country != null} />
              </div>
              {errors.bill_to_country && <span className="text-sm font-medium text-red-600">{errors.bill_to_country.message}</span>}
            </div>
          </div>
          <div className="flex flex-col gap-5 md:items-center md:flex-row md:mt-[45px] md:gap-5">
            <div className="md:flex-1">
              <span className="text-custom-medium-grey text-[13px] font-normal">Invoice Date</span>
              <div className="h-[45px]">
                <DatePicker {...register("invoice_date")} />
              </div>
              {errors.invoice_date && <span className="text-sm font-medium text-red-600">{errors.invoice_date.message}</span>}
            </div>

            <div className="md:flex-1">
              <span className="text-custom-medium-grey text-[13px] font-normal">Payment Terms</span>

              <div className="h-[48px]">
                <Select control={control} name="payment_terms" />
              </div>
              {errors.payment_terms && <span className="text-sm font-medium text-red-600">{errors.payment_terms.message}</span>}
            </div>
          </div>

          <div>
            <span className="text-custom-medium-grey text-[13px] font-normal">Project Description</span>

            <div className="h-[48px]">
              <Input {...register("project_description")} error={errors.project_description != null} />
            </div>
            {errors.project_description && <span className="text-sm font-medium text-red-600">{errors.project_description.message}</span>}
          </div>
        </div>

        <h3 className="text-[18px] text-custom-medium-grey font-bolda mt-[69px] mb-9">Item list</h3>
        <div className="flex flex-col gap-5">
          {fields.map((_, index) => {
            return (
              <div key={index} className="last:mb-[48px] flex flex-col md:flex-row md:gap-6 ">
                <div className="md:w-[205px]">
                  <span className="text-custom-medium-grey text-[13px] font-normal">Item Name</span>
                  <div className="h-[48px]">
                    <Input {...register(`invoice_items.${index}.item_name`)} error={errors.invoice_items?.[index]?.item_name != null} />
                  </div>
                </div>

                <div className="flex justify-center gap-2 items-center">
                  <div className="md:basis-[46px]">
                    <span className="text-custom-medium-grey text-[13px] font-normal">Qty</span>
                    <div className="h-[48px] w-[64px]">
                      <Input {...register(`invoice_items.${index}.quantity`)} error={errors.invoice_items?.[index]?.quantity != null} />
                    </div>
                  </div>

                  <div className="md:basis-[100px]">
                    <span className="text-custom-medium-grey text-[13px] font-normal">Price</span>

                    <div className="min-h-[48px] w-[100px]">
                      <Input {...register(`invoice_items.${index}.price`)} error={errors.invoice_items?.[index]?.price != null} />
                    </div>
                  </div>

                  <div>
                    <span className="text-custom-medium-grey text-[13px] font-normal">Total</span>
                    <div className="h-[48px] w-[74px]">
                      <Input readOnly value={Number(invoice_items?.[index]?.price ?? 0) * Number(invoice_items?.[index]?.quantity ?? 0)} />
                    </div>
                  </div>

                  <button className="h-[48px] flex items-center shrink-0" onClick={() => remove(index)}>
                    {" "}
                    <img className="size-4 mt-5 h-5" src={IconDelete} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button className="text-[15px] bg-custom-light-grey dark:text-custom-white dark:bg-custom-dark-blue w-full p-3.5 text-custom-medium-grey rounded-full" type="button" onClick={() => append({ item_name: "", price: 0, quantity: 0 })}>
          + Add new Item
        </button>

        {errors.invoice_items && <span className="text-sm block mt-6 font-medium text-red-600">- All fields must be added</span>}

        <div className="h-[155px] flex flex-col md:justify-end">
          <div className="h-[50%] md:hidden -translate-x-6 w-screen bg-gradient-to-br from-slate-100 to-gray-300 opacity-40"></div>
          <div className="flex justify-end md:justify-start gap-3 dark:bg-custom-darker-blue bg-custom-white items-end basis-[50%]">
            <div className="w-[86px] h-14 md:w-[96px] ">
              <Button onClick={onDiscard} type="button" text={props.isEdit ? "Cancel" : "Discard"} variant="secondary" />
            </div>
            {!props.isEdit && (
              <div className="w-[117px] h-14 md:w-[133px] md:ml-[139px]">
                <Button type="button" text="Save as Draft" variant="tertiary" />
              </div>
            )}
            <div className="w-[112px] h-14 md:w-[128px]">
              <Button type="submit" disabled={props.isEdit && !isDirty} text={props.isEdit ? "Save Changes" : "Save & Send"} variant="primary" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
