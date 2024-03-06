import cn from "clsx";
import IconPlus from "@src/assets/icon-plus.svg";
interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  withAddIcon?: boolean;
  text: string;
  variant: "primary" | "secondary" | "tertiary" | "danger";
}
export default function Button(props: IButton) {
  return (
    <button
      className={cn(" rounded-full  h-full w-full", {
        ["opacity-55"]: props.disabled,
        ["bg-custom-purple text-custom-white hover:bg-custom-light-purple"]: props.variant === "primary",
        ["bg-custom-light-grey font-semibold text-custom-lighter-purple "]: props.variant === "secondary",
        ["bg-custom-dark-blue text-custom-light-grey"]: props.variant === "tertiary",
        ["bg-custom-red text-custom-white"]: props.variant === "danger",
      })}
      {...props}
    >
      <div className="flex items-center justify-center gap-2.5">
        {props.withAddIcon && (
          <div
            className={cn(" rounded-full size-10 flex items-center justify-center", {
              ["bg-custom-white"]: props.variant === "primary",
            })}
          >
            <img src={IconPlus} className="size-1/3" />
          </div>
        )}
        <span className="text-[15px]">{props.text}</span>
      </div>
    </button>
  );
}
