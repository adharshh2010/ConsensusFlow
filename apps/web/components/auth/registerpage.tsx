"use client";

import * as z from "zod";
import type React from "react";
import Link from "next/link";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTransition } from "react";

import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { RegisterSchema } from "@/schema/auth";

export default function RegisterPage() {
  const [isPending, setPending] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    setPending(async () => {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: `${JSON.stringify(data)}`,
        });

        const resData = await res.json();

        if (!res.ok) {
          toast.error(
            `${resData.error || "Oops Something went really wrong!"}`,
          );
          form.resetField("password");
        } else {
          toast.success(`${resData.success}`, {
            description: `${resData.description}`,
          });
        }
      } catch {
        toast.error("Oops Something went really wrong!", {
          description: "Try Again, After Few Moments!",
        });
        form.resetField("password");
      }
    });
  };

  return (
    <main className="h-full p-2 bg-background ">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 mt-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome To ConsensusFlow
          </h1>
          <p className="text-muted-foreground">
            Sign up to create your account and start trusting what is true with
            proof.
          </p>
        </div>

        {/* Auth Cards */}
        <Card className="p-8 border border-border bg-card mb-8">
          <div className="">
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2 bg-transparent hover:cursor-pointer"
                onClick={() => {}}
                disabled={isPending}
              >
                <FaGithub className="w-4 h-4" />
                GitHub
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2 bg-transparent hover:cursor-pointer"
                onClick={() => {}}
                disabled={isPending}
              >
                <FaGoogle className="w-4 h-4" />
                Google
              </Button>
            </div>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>
          </div>
          <form
            className="space-y-5"
            id="login-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* Email Field */}
            <FieldGroup>
              <div>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="block text-sm font-medium text-foreground mb-2">
                          Email Address
                        </FieldLabel>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                          <Input
                            {...field}
                            aria-invalid={fieldState.invalid}
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-primary bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors h-[41.08px]"
                            disabled={isPending}
                          />
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    );
                  }}
                />
              </div>

              {/* Password Field */}
              <div>
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="block text-sm font-medium text-foreground mb-2">
                          Password
                        </FieldLabel>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                          <Input
                            {...field}
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-primary bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors h-[41.08px]"
                            aria-invalid={fieldState.invalid}
                            disabled={isPending}
                          />
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    );
                  }}
                />
              </div>
            </FieldGroup>

            {/* Submit Button */}
            <Button
              className="w-full bg-primary hover:bg-primary/90 hover:cursor-pointer text-primary-foreground flex items-center justify-center gap-2 mt-6"
              type="submit"
              disabled={isPending}
            >
              Continue to on-boarding
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </Card>

        {/* Toggle Auth Mode */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Already have an account?
            <button
              onClick={() => {
                window.location.href = "/auth/login";
              }}
              className="ml-2 text-primary hover:text-primary/80 font-medium transition-colors"
              disabled={isPending}
            >
              Sign in instead
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
