import dayjs from "dayjs";
const paymentTermsObj = {
  net_1_day: 1,
  net_7_days: 7,
  net_14_days: 14,
  net_30_days: 30,
};
export const calculateDueDate = (invoiceDate: string, paymentTerms: "net_1_day" | "net_7_days" | "net_14_days" | "net_30_days") => {
  return dayjs(invoiceDate)
    .add(paymentTermsObj[paymentTerms] ?? 0, "day")
    .format("D MMM YYYY");
};
