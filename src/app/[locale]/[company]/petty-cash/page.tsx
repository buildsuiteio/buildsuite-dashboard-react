"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

type Props = {
  params: { locale: string };
};

export default function IndexPage({ params: { locale } }: Props) {
  const [empId, setEmpId] = useState("");
  const [loading, setLoading] = useState(false);

  const [loggedIn, setLoggedIn] = useState(false);
  const searchParams = useSearchParams();
  const user_id = searchParams.get("user-id");
  const sid = searchParams.get("sid");
  const companyId = searchParams.get("company-id");

  // const apiKey = searchParams.get("api-key");
  // const apiSecret = searchParams.get("api-secret");

  useEffect(() => {
    const login = async () => {
      setLoading(true);
      try {
        console.log("sid=" + sid);
        const response = await axios.post(
          `https://${companyId}.app.buildsuite.io/api/method/bs_customisations.auth.get_user_details`,
          { user_id, sid }
        );

        const user = response.data.message.user;
        // Store necessary data in localStorage
        localStorage.setItem("sid", user.sid);
        localStorage.setItem("api_key", user.api_key);
        localStorage.setItem("api_secret", user.api_secret);

        setEmpId(user.employee_id);
        setLoggedIn(true);
      } catch (error) {
        console.error("Auth failed:", error);
        alert("Auth failed");
      } finally {
        setLoading(false);
      }
    };

    login();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[100vh] bg-white dark:bg-slate-950">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-[100vh] bg-white dark:bg-slate-950">
      {loggedIn && empId.length > 0 ? (
        <p className="w-full text-[12px] text-green-500 dark:text-white text-center mt-2">
          {empId}
        </p>
      ) : (
        <div>Not a valid user</div>
      )}
    </div>
  );
}
