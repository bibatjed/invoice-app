import cn from "clsx";
export default function Status(props: { status: "pending" | "paid" | "draft" }) {
  return (
    <div
      className={cn("rounded-lg size-full p-2.5 flex justify-center items-center gap-2.5", {
        ["bg-orange-50"]: props.status === "pending",
        ["bg-green-50"]: props.status === "paid",
        ["bg-gray-200"]: props.status === "draft",
      })}
    >
      <div
        className={cn("size-2 rounded-full", {
          ["bg-orange-400"]: props.status === "pending",
          ["bg-green-400"]: props.status === "paid",
          ["bg-black"]: props.status === "draft",
        })}
      ></div>
      <span
        className={cn(" capitalize text-[15px] font-bold", {
          ["text-orange-400"]: props.status === "pending",
          ["text-green-400"]: props.status === "paid",
          ["text-black-400"]: props.status === "draft",
        })}
      >
        {props.status}
      </span>
    </div>
  );
}
