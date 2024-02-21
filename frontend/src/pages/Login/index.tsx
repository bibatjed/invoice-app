import { useForm, SubmitHandler } from "react-hook-form";
import Input from "@src/components/Input";
import Button from "@src/components/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginUserType } from "./validate";
import { loginUser } from "./api/loginUser";
// import { registerUser } from "./api/postUser";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    clearErrors,
    setError,
    watch,
  } = useForm<LoginUserType>({
    resolver: zodResolver(LoginSchema),
  });

  //remove custom error when either of field changes
  useEffect(() => {
    const subscription = watch((data) => {
      console.log(data);
      if (errors.root != null) {
        clearErrors("root");
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginUserType> = async (data) => {
    try {
      setIsLoading(true);
      const token = (await loginUser(data)).data.token;
      localStorage.setItem("accessToken", token);
    } catch (e) {
      if (e instanceof AxiosError && e.response?.status) {
        setError("root", {
          type: "random",
          message: "Invalid email or password",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onClickSignUp = () => {
    navigate("/register");
  };
  console.log(errors);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="border-2 p-9 max-h-[95vh]  overflow-y-scroll max-w-xs lg:w-full lg:max-w-lg border-custom-light-grey rounded-md">
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-xl">Login User</h2>

          <div className="flex flex-col gap-2.5">
            <div>
              <span className="text-custom-medium-grey text-base font-medium">Email</span>
              <div>
                <Input error={errors.email != null || errors.root != null} {...register("email")} />
              </div>
              {errors.email && <span className="text-sm font-medium text-red-600">{errors.email.message}</span>}
            </div>
            <div>
              <span className="text-custom-medium-grey text-base font-medium">Password</span>
              <div>
                <Input error={errors.password != null || errors.root != null} {...register("password")} type="password" />
              </div>
              {errors.password && <span className="text-sm font-medium text-red-600">{errors.password.message}</span>}
              {errors.root && errors.password == null && <span className="text-sm font-medium text-red-600">{errors.root.message}</span>}
            </div>
          </div>
        </div>

        <div className="w-full h-12 mt-4">
          <Button disabled={!isValid || isLoading} type="submit" text="Login" variant="primary" />
        </div>
        <div className="w-full h-12 mt-4">
          <Button onClick={onClickSignUp} disabled={isLoading} type="button" text="Sign Up" variant="primary" />
        </div>
      </form>
    </div>
  );
}
