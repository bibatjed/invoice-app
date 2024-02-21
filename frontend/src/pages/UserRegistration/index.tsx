import { useForm, SubmitHandler } from "react-hook-form";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterUserSchema, RegisterUserType } from "./validate";
import { registerUser } from "./api/postUser";
import { AxiosError } from "axios";
import { useState } from "react";

export default function UserRegistration() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm<RegisterUserType>({
    resolver: zodResolver(RegisterUserSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<RegisterUserType> = async (data) => {
    try {
      setIsLoading(true);
      await registerUser(data);
      alert("Success");
    } catch (e) {
      if (e instanceof AxiosError && e.response?.status) {
        setError(
          "email",
          {
            type: "custom",
            message: "Email is already registered",
          },
          { shouldFocus: true }
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="border-2 p-9 max-h-[95vh]  overflow-y-scroll max-w-xs lg:w-full lg:max-w-lg border-custom-light-grey rounded-md">
        <div className="flex flex-col gap-4">
          <h2 className="font-bold">Register User</h2>

          <div className="flex flex-col gap-2.5">
            <div>
              <span className="text-custom-medium-grey text-base font-medium">First Name</span>
              <div>
                <Input error={errors.firstName != null} {...register("firstName")} />
              </div>
              {errors.firstName && <span className="text-sm font-medium text-red-600">{errors.firstName.message}</span>}
            </div>
            <div>
              <span className="text-custom-medium-grey text-base font-medium">Middle Name</span>
              <div>
                <Input {...register("middleName")} />
              </div>
            </div>
            <div>
              <span className="text-custom-medium-grey text-base font-medium">Last Name</span>
              <div>
                <Input error={errors.lastName != null} {...register("lastName")} />
              </div>
              {errors.lastName && <span className="text-sm font-medium text-red-600">{errors.lastName.message}</span>}
            </div>
            <div>
              <span className="text-custom-medium-grey text-base font-medium">Email</span>
              <div>
                <Input error={errors.email != null} {...register("email")} />
              </div>
              {errors.email && <span className="text-sm font-medium text-red-600">{errors.email.message}</span>}
            </div>
            <div>
              <span className="text-custom-medium-grey text-base font-medium">Password</span>
              <div>
                <Input error={errors.password != null} {...register("password")} type="password" />
              </div>
              {errors.password && <span className="text-sm font-medium text-red-600">{errors.password.message}</span>}
            </div>
            <div>
              <span className="text-custom-medium-grey text-base font-medium">Confirm Password</span>
              <div>
                <Input error={errors.confirmPassword != null} {...register("confirmPassword")} type="password" />
              </div>
              {errors.confirmPassword && <span className="text-sm font-medium text-red-600">{errors.confirmPassword.message}</span>}
            </div>
          </div>
        </div>

        <div className="w-full h-12 mt-4">
          <Button disabled={!isValid || isLoading} type="submit" text="Register" variant="primary" />
        </div>
      </form>
    </div>
  );
}
