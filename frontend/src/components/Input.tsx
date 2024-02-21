interface IInput extends React.HTMLAttributes<HTMLInputElement> {
  value?: string;
}
export default function Input(props: IInput) {
  return (
    <div className="border-2 border-custom-light-grey rounded-md p-3 px-4 w-full focus-within:border-custom-purple">
      <input className="outline-none w-full text-lg font-bold" {...props} />
    </div>
  );
}
