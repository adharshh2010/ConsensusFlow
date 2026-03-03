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
import { useState, useTransition } from "react";

import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp";
import { Input } from "@workspace/ui/components/input";
import { LoginSchema, OTPSchema } from "@/schema/auth";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { verify2FAotp } from "@/actions/auth/2FAotpValidation";

export default function LoginPage() {
  const [isPending, setPending] = useTransition();

  const [OTP, showOTP] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const otp = useForm<z.infer<typeof OTPSchema>>({
    resolver: zodResolver(OTPSchema),
    defaultValues: {
      otp: undefined,
    },
  });

  const onOTPsubmit = async (data: z.infer<typeof OTPSchema>) => {
    setPending(async () => {
      try {
        await verify2FAotp(data).then((data) => {
          if (data.error) {
            toast.error(`${data.error || "Oops Something went really wrong!"}`);
          }
          if (data.success) {
            toast.success(`${data.success}`);
          }
        });
      } catch (error) {
        console.error(error);
      }
    });
  };

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setPending(async () => {
      try {
        const res = await fetch("/api/auth/login", {
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
          form.resetField("remember");
        } else {
          toast.success(`${resData.success}`, {
            description: `${resData.description}`,
          });
          showOTP(true);
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
      {!OTP ? (
        <div className="max-w-md mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 mt-12">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to access your consensus dashboard and saved claims.
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
                <Controller
                  name="remember"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <div className="flex items-center justify-between text-sm">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              id="remember"
                              checked={!!field.value}
                              onCheckedChange={(checked) =>
                                field.onChange(checked)
                              }
                              onBlur={field.onBlur}
                              ref={field.ref}
                              className="hover:cursor-pointer"
                              disabled={isPending}
                            />
                            <span className="text-muted-foreground">
                              Remember me
                            </span>
                          </label>
                          <Link
                            href="/auth/forgot"
                            className="text-primary hover:text-primary/80 transition-colors"
                          >
                            Forgot password?
                          </Link>
                        </div>
                      </Field>
                    );
                  }}
                />
              </FieldGroup>

              {/* Submit Button */}
              <Button
                className="w-full bg-primary hover:bg-primary/90 hover:cursor-pointer text-primary-foreground flex items-center justify-center gap-2 mt-6"
                type="submit"
                disabled={isPending}
              >
                Continue to the app
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </Card>

          {/* Toggle Auth Mode */}
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Don&apos;t have an account?
              <button
                onClick={() => {
                  window.location.href = "/auth/register";
                }}
                className="ml-2 text-primary hover:text-primary/80 font-medium transition-colors"
                disabled={isPending}
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      ) : (
        // OTP Page

        <div className="max-w-md mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 mt-12">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Enter The 2FA OTP Code
            </h1>
            <p className="text-muted-foreground">
              Your account is secured with Two-Factor Authentication. Please
              enter the OTP code from your email to continue.
            </p>
          </div>

          {/* Auth Cards */}
          <Card className="p-8 border border-border bg-card mb-8">
            <form
              className="space-y-5"
              id="otp-form"
              onSubmit={otp.handleSubmit(onOTPsubmit)}
            >
              {/* Email Field */}
              <FieldGroup>
                <div>
                  <Controller
                    name="otp"
                    control={otp.control}
                    render={({ field, fieldState }) => {
                      return (
                        <Field
                          data-invalid={fieldState.invalid}
                          className="flex flex-col items-center space-y-8"
                        >
                          {/* Header Section */}
                          <div className="flex flex-col items-center space-y-2">
                            <FieldLabel className="text-lg font-bold tracking-tight text-foreground">
                              Email Verification Code
                            </FieldLabel>
                            <p className="text-sm text-muted-foreground">
                              Enter the 6-digit code sent to your email
                            </p>
                          </div>

                          {/* OTP Input Section */}
                          <div className="flex flex-col items-center gap-3 w-full px-4">
                            <InputOTP
                              {...field}
                              maxLength={6}
                              id="otp-verification"
                              aria-invalid={fieldState.invalid}
                              disabled={isPending}
                              name="otp"
                              className="flex items-center justify-center gap-1"
                              pattern={REGEXP_ONLY_DIGITS}
                              required
                            >
                              {/* First Group */}
                              <InputOTPGroup className="gap-2.5">
                                <InputOTPSlot
                                  key={0}
                                  index={0}
                                  className={`
                  rounded-lg border-2 lg:h-14 lg:w-12 w-10 h-10 text-2xl font-semibold
                  transition-all duration-200
                  bg-background
                  border-input hover:border-primary/60
                  focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20
                  focus-visible:ring-offset-2 focus-visible:ring-offset-background
                  disabled:opacity-50 disabled:cursor-not-allowed
                  placeholder:text-muted-foreground
                `}
                                />
                                <InputOTPSlot
                                  key={1}
                                  index={1}
                                  className={`
                  rounded-lg border-2 lg:h-14 lg:w-12 w-10 h-10 text-2xl font-semibold
                  transition-all duration-200
                  bg-background
                  border-input hover:border-primary/60
                  focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20
                  focus-visible:ring-offset-2 focus-visible:ring-offset-background
                  disabled:opacity-50 disabled:cursor-not-allowed
                  placeholder:text-muted-foreground
                `}
                                />
                                <InputOTPSlot
                                  key={2}
                                  index={2}
                                  className={`
                  rounded-lg border-2 lg:h-14 lg:w-12 w-10 h-10 text-2xl font-semibold
                  transition-all duration-200
                  bg-background
                  border-input hover:border-primary/60
                  focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20
                  focus-visible:ring-offset-2 focus-visible:ring-offset-background
                  disabled:opacity-50 disabled:cursor-not-allowed
                  placeholder:text-muted-foreground
                `}
                                />
                              </InputOTPGroup>

                              {/* Separator */}
                              <InputOTPSeparator className="text-muted-foreground/40 mx-1 hidden lg:block" />

                              {/* Second Group */}
                              <InputOTPGroup className="gap-2.5">
                                <InputOTPSlot
                                  key={3}
                                  index={3}
                                  className={`
                  rounded-lg border-2 lg:h-14 lg:w-12 w-10 h-10 text-2xl font-semibold
                  transition-all duration-200
                  bg-background
                  border-input hover:border-primary/60
                  focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20
                  focus-visible:ring-offset-2 focus-visible:ring-offset-background
                  disabled:opacity-50 disabled:cursor-not-allowed
                  placeholder:text-muted-foreground
                `}
                                />
                                <InputOTPSlot
                                  key={4}
                                  index={4}
                                  className={`
                  rounded-lg border-2 lg:h-14 lg:w-12 w-10 h-10 text-2xl font-semibold
                  transition-all duration-200
                  bg-background
                  border-input hover:border-primary/60
                  focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20
                  focus-visible:ring-offset-2 focus-visible:ring-offset-background
                  disabled:opacity-50 disabled:cursor-not-allowed
                  placeholder:text-muted-foreground
                `}
                                />
                                <InputOTPSlot
                                  key={5}
                                  index={5}
                                  className={`
                  rounded-lg border-2 lg:h-14 lg:w-12 w-10 h-10 text-2xl font-semibold
                  transition-all duration-200
                  bg-background
                  border-input hover:border-primary/60
                  focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20
                  focus-visible:ring-offset-2 focus-visible:ring-offset-background
                  disabled:opacity-50 disabled:cursor-not-allowed
                  placeholder:text-muted-foreground
                `}
                                />
                              </InputOTPGroup>
                            </InputOTP>

                            {/* Error Message */}
                            <div className="min-h-6 w-full flex justify-center">
                              {fieldState.invalid && (
                                <FieldError
                                  errors={[fieldState.error]}
                                  className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1 duration-200"
                                />
                              )}
                            </div>

                            {/* Helper Text */}
                            <p className="text-xs text-muted-foreground text-center max-w-xs">
                              Didn&apos;t receive the code?{" "}
                              <button className="font-semibold text-primary hover:text-primary/80 transition-colors hover:cursor-pointer">
                                Resend
                              </button>
                            </p>
                          </div>
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
                Continue to the app
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </Card>

          {/* Toggle Auth Mode */}
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Don&apos;t have an account?
              <button
                onClick={() => {
                  window.location.href = "/auth/register";
                }}
                className="ml-2 text-primary hover:text-primary/80 font-medium transition-colors"
                disabled={isPending}
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
