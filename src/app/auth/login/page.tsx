import { Suspense } from "react";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex w-full max-w-lg flex-1 items-center justify-center px-4 py-12 text-lg">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
