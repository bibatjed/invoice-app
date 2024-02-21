import cn from "clsx";
interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  withAddIcon?: boolean;
  text: string;
  variant: "primary" | "secondary";
}
export default function Button(props: IButton) {
  return (
    <button className={cn("bg-custom-purple p-3 rounded-3xl text-lg text-custom-white hover:bg-custom-light-purple h-full w-full")} {...props}>
      {props.text}
    </button>
  );
}
