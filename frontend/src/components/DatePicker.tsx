import { forwardRef } from "react";

//TODO: match datepicker design
export default forwardRef<HTMLInputElement, any>(function DatePicker(props, ref) {
  return (
    <div>
      <input type="date" ref={ref} {...props} />
    </div>
  );
});
