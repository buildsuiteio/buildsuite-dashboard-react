"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { gcompanyId } from "@/utils/utils";

type Props = {
  params: { locale: string };
};

export default function IndexPage({ params: { locale } }: Props) {
  const router = useRouter();
  const [companyId, setCompanyId] = useState("");
  const [usr, setUsr] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const sessionExpired = searchParams.get("session-expired");

  useEffect(() => {
    // Check if api_key and api_secret exist in localStorage
    const apiKey = localStorage.getItem("api_key");
    const apiSecret = localStorage.getItem("api_secret");

    if (apiKey && apiSecret) {
      // Redirect to the dashboard if they exist
      router.push(`/${gcompanyId}/projects`);
    }
  }, [router]);

  const login = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `https://${companyId}.app.buildsuite.io/api/method/bs_customisations.auth.user_login`,
        { usr, pwd }
      );
      const message = response.data.message;

      // Store necessary data in localStorage
      localStorage.setItem("sid", message.sid);
      localStorage.setItem("api_key", message.api_key);
      localStorage.setItem("api_secret", message.api_secret);
      localStorage.setItem("company_id", companyId);

      router.push(`/${companyId}/projects`);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login();
  };

  const t = useTranslations("IndexPage");
  const t2 = useTranslations("Navigation");

  return (
    <div className="flex flex-col items-center justify-center w-full h-[100vh] bg-white dark:bg-slate-950">
      <div className="shadow-xl p-8 w-[350px] bg-white dark:bg-slate-800 rounded-lg flex flex-col items-start justify-center">
        <h1 className="mb-2 text-xl font-semibold">Login</h1>
        <p className="mb-8 text-sm">Don&apos;t have an account? Get started</p>

        <form className="w-full" onSubmit={handleSubmit}>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Company ID</Label>
            <Input
              type="text"
              id="company-id"
              className=" mb-3 w-full"
              placeholder="Enter Company ID"
              onChange={(e) => setCompanyId(e.target.value)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              type="text"
              id="email"
              className=" mb-3 w-full"
              placeholder="Email or Username"
              onChange={(e) => setUsr(e.target.value)}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              className=" mb-8 w-full"
              placeholder="Password"
              onChange={(e) => setPwd(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full border-2 text-white bg-green-600 hover:bg-green-600 hover:p-1 hover:border-green-600"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {sessionExpired === "true" && (
          <p className="w-full text-[12px] text-red-500 text-center mt-2">
            Your session has expired. Please log in again.
          </p>
        )}
      </div>
    </div>
  );
}
