import cn from "clsx";
interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  withAddIcon?: boolean;
  text: string;
  variant: "primary" | "secondary";
}
export default function Button(props: IButton) {
  return (
    <button
      className={cn("bg-custom-purple p-3 flex items-center justify-center rounded-3xl text-lg text-custom-white hover:bg-custom-light-purple h-full w-full", {
        ["opacity-55"]: props.disabled,
      })}
      {...props}
    >
      {props.text}
    </button>
  );
}
