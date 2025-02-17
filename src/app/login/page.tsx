"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { postLogin } from "@/requests/requests";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";

const setCookie = (name: string, value: string) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
};

export default function LoginPage() {
  const router = useRouter();
  const form = useForm<{
    email: string;
    password: string;
  }>({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      const response = await postLogin({
        email: value.email,
        password: value.password
      });
      const data = response.data;
      console.log(data.data.token)
      setCookie('Authorization', `Bearer ${data.data.token}`);
      router.push('/a')
    },
  });

  return (
    <div className="flex justify-center h-screen items-center">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await form.validateAllFields("submit");
          form.handleSubmit();
        }}
      >
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Cabbage Admin</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <form.Field
              name="email"
              children={(field) => (
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="Please enter the email"
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                    }}
                  />
                </div>
              )}
            />
            <form.Field
              name="password"
              children={(field) => (
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    placeholder="Please enter the password"
                    value={field.state.value}
                    type="password"
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                    }}
                  />
                </div>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-44 rounded-2xl"
                >
                  {isSubmitting ? "Logining" : "Login"}
                </Button>
              )}
            />
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
