"use client"

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { authFormSchema } from "@/lib/utils";
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import Link from "next/link";
import z from "zod";
import ControllerInput from "./ControllerInput";

interface AuthFormProps {
  type: string;
}

export default function AuthForm({ type }: AuthFormProps) {

  const formSchema = authFormSchema(type)
  type formValues = z.infer<typeof formSchema>

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    }
  })

  function onSubmit(data: formValues) {
    console.log(data);
    
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 space-y-12">
      <div className="w-full max-w-md border rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-center">{type === "sign-in" ? "Sign In" : "Sign Up"}</h2>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup>
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <ControllerInput 
                      control={form.control}
                      name="firstName"
                      label="First Name"
                      placeholder="Enter first name"
                    />
                    <ControllerInput 
                      control={form.control}
                      name="lastName"
                      label="Last Name"
                      placeholder="Enter last name"
                    />
                  </div>
                </>
              )}
              <ControllerInput 
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter the email"
              />
              <ControllerInput 
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter the password"
              />
            </FieldGroup>
          </FieldSet>

          <Field>
            <Button type="submit" className="mt-8">
              {type === "sign-in" ? "Sign In" : "Sign Up"}
            </Button>
          </Field>
        </form>

        <footer className="flex justify-center gap-1 mt-2">
          <p className="text-sm font-normal text-gray-600">
            {type === "sign-in"
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>
          <Link
            href={type === "sign-in" ? "/sign-up" : "/sign-in"}
            className="text-sm cursor-pointer text-md text-gray-600"
          >
            {type === "sign-in" ? "Sign Up" : "Sign In"}
          </Link>
        </footer>
      </div>
    </main>
  );
}
