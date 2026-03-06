import AuthForm from "@/components/AuthForm";
import { Suspense } from "react";

export default function SignIn() {
  return (
    <Suspense>
      <AuthForm type="sign-in"/>
    </Suspense>
  );
}
