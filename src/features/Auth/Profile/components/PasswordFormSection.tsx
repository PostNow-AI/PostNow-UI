import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Loader,
} from "@/components";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { usePasswordEdit } from "../hooks/usePasswordEdit";

export const PasswordFormSection = () => {
  const { form, passwordChange, isChangingPassword } = usePasswordEdit();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword1, setShowNewPassword1] = useState(false);
  const [showNewPassword2, setShowNewPassword2] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alterar Senha</CardTitle>
        <CardDescription>Altere sua senha de acesso à conta</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit((data) => passwordChange(data))}
          className="space-y-4"
        >
          <div className="relative">
            <div className="space-y-2">
              <Label htmlFor="firstName">Senha atual</Label>
              <Input
                id="oldPassword"
                {...register("old_password")}
                type={showOldPassword ? "text" : "password"}
                className={errors.old_password ? "border-destructive" : ""}
              />
              <Button
                variant="ghost"
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-2 top-10 -translate-y-1/2 text-muted-foreground text-sm"
              >
                {showOldPassword ? <EyeClosed /> : <Eye />}
              </Button>
              {errors.old_password && (
                <p className="text-sm text-destructive">
                  {errors.old_password.message}
                </p>
              )}
            </div>
          </div>{" "}
          <div className="relative">
            <div className="space-y-2">
              <Label htmlFor="firstName">Senha nova</Label>
              <Input
                id="newPassword1"
                type={showNewPassword1 ? "text" : "password"}
                {...register("new_password1")}
                className={errors.new_password1 ? "border-destructive" : ""}
              />{" "}
              <Button
                variant="ghost"
                type="button"
                onClick={() => setShowNewPassword1(!showNewPassword1)}
                className="absolute right-2 top-10 -translate-y-1/2 text-muted-foreground text-sm"
              >
                {showNewPassword1 ? <EyeClosed /> : <Eye />}
              </Button>
              {errors.new_password1 && (
                <p className="text-sm text-destructive">
                  {errors.new_password1.message}
                </p>
              )}
            </div>
          </div>{" "}
          <div className="relative">
            <div className="space-y-2">
              <Label htmlFor="firstName">Confirmação da senha nova</Label>
              <Input
                id="newPassword2"
                type={showNewPassword2 ? "text" : "password"}
                {...register("new_password2")}
                className={errors.new_password2 ? "border-destructive" : ""}
              />{" "}
              <Button
                variant="ghost"
                type="button"
                onClick={() => setShowNewPassword2(!showNewPassword2)}
                className="absolute right-2 top-10 -translate-y-1/2 text-muted-foreground text-sm"
              >
                {showNewPassword2 ? <EyeClosed /> : <Eye />}
              </Button>
              {errors.new_password2 && (
                <p className="text-sm text-destructive">
                  {errors.new_password2.message}
                </p>
              )}
            </div>
          </div>{" "}
          <Button
            type="submit"
            disabled={isChangingPassword || !form.formState.isDirty}
          >
            {isChangingPassword ? <Loader /> : "Alterar Senha"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
