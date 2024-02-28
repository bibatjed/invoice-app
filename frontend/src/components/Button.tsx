import cn from "clsx";
import IconPlus from "@src/assets/icon-plus.svg";
interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  withAddIcon?: boolean;
  text: string;
  variant: "primary" | "secondary";
}
export default function Button(props: IButton) {
  return (
    <button
      className={cn("bg-custom-purple rounded-full text-custom-white hover:bg-custom-light-purple h-full w-full", {
        ["opacity-55"]: props.disabled,
      })}
      {...props}
    >
      <div className="flex items-center justify-center gap-2.5">
        {props.withAddIcon && (
          <div className="bg-custom-white rounded-full size-10 flex items-center justify-center">
            <img src={IconPlus} className="size-1/3" />
          </div>
        )}
        <span className="text-lg">{props.text}</span>
      </div>
    </button>
  );
}
