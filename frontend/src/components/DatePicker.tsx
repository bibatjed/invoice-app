import { forwardRef } from "react";
import cn from "clsx";

export default forwardRef<HTMLInputElement, any>(function DatePicker(props, ref) {
  return (
    <div
      className={cn("border-2 border-custom-light-grey rounded-md hover:border-custom-purple p-2.5 h-full px-4 w-full focus-within:border-custom-purple", {
        ["border-red-500 focus-within:border-red-500"]: props.error,
        ["border-none text-custom-medium-grey"]: props.readOnly,
      })}
    >
      <input type="date" className="outline-none w-full" ref={ref} {...props} />
    </div>
  );
});
