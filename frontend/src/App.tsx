import Button from "./components/Button";
import Input from "./components/Input";

function App() {
  return (
    <>
      <div className="h-svh w-svw flex justify-center items-center">
        <div className="w-36">
          <Button variant="primary" text="New Invoice" />
        </div>
        <div className="w-64">
          <Input />
        </div>
      </div>
    </>
  );
}

export default App;
