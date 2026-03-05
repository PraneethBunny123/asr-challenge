import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authFormSchema } from "@/lib/utils";
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import Link from "next/link";
import z from "zod";

interface AuthFormProps {
  type: string;
}

export default function AuthForm({ type }: AuthFormProps) {

  const formSchema = authFormSchema(type)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 space-y-12">
      <div className="w-full max-w-md border rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-center">Sign In</h2>
        <form>
          <FieldSet>
            <FieldGroup>
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <Field>
                      <FieldLabel>First Name</FieldLabel>
                      <Input placeholder="Enter first name" />
                    </Field>
                    <Field>
                      <FieldLabel>Last Name</FieldLabel>
                      <Input placeholder="Enter last name" />
                    </Field>
                  </div>
                </>
              )}
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input placeholder="Enter email" />
              </Field>

              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input placeholder="Enter password" type="password"/>
              </Field>
            </FieldGroup>
          </FieldSet>

          <Field>
            <Button type="submit" className="mt-4">
              Sign In
            </Button>
          </Field>
        </form>

        <footer className="flex justify-center gap-1">
          <p className="text-14 font-normal text-gray-600">
            {type === "sign-in"
              ? "Don't have an account?"
              : "Already have an account"}
          </p>
          <Link
            href={type === "sign-in" ? "/sign-up" : "/sign-in"}
            className="text-14 cursor-pointer text-md text-gray-800"
          >
            {type === "sign-in" ? "Sign Up" : "Sign In"}
          </Link>
        </footer>
      </div>
    </main>
  );
}
