import { forwardRef } from "react";
import cn from "clsx";

interface IInput extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, IInput>((props, ref) => {
  return (
    <div
      className={cn("border-2 border-custom-light-grey rounded-md hover:border-custom-purple p-2.5 h-full px-4 w-full dark:bg-custom-dark-blue  dark:text-custom-white focus-within:border-custom-purple", {
        ["border-red-500 focus-within:border-red-500"]: props.error,
        ["dark:border-custom-dark-blue"]: !props.error,
        ["border-none text-custom-medium-grey "]: props.readOnly,
      })}
    >
      <input ref={ref} className="outline-none bg-transparent w-full text-[15px] font-bold" {...props} />
    </div>
  );
});

export default Input;
