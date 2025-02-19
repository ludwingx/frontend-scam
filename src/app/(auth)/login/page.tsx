import { LoginForm } from "@/components/login-form";
import LoginLayout from "./layout";

export default function LoginPage() {
  return (
    <LoginLayout>
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <LoginForm />
        </div>
      </div>
    </LoginLayout>
  );
}
