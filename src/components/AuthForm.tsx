"use client"

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";

import ControllerInput from "./ControllerInput";

import { authFormSchema } from "@/lib/utils";
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import z from "zod";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { signIn, signUp } from "@/lib/auth-client";

interface AuthFormProps {
  type: string;
}

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard"

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

  async function onSubmit(data: formValues) {
    if(type === 'sign-in') {
      const {error} = await signIn.email({
        email: data.email,
        password: data.password
      })

      if(error) {
        form.setError("root", { message: error.message ?? "Invalid email or password" })
        return;
      } 
    } else {
      const {error} = await signUp.email({
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
      })

      if(error) {
        form.setError("root", { message: error.message ?? "Could not create account. Please try again" })
        return;
      }
    }
    
    router.push(callbackUrl)
    router.refresh()
  }

  const isSubmitting = form.formState.isSubmitting

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

          {form.formState.errors.root && (
            <p className="mt-3 text-sm text-red-500" role="alert">
              {form.formState.errors.root.message}
            </p>
          )}

          <Field>
            <Button type="submit" className="mt-8 w-full" disabled={isSubmitting}>
              {isSubmitting ? 
                type === "sign-in" ? "Signing in..." : "Creating account..." : 
                type === "sign-in" ? "Sign In" : "Sign Up"
              }
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
