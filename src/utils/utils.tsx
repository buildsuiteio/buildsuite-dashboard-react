import { locales } from "@/config";
import { getTranslations } from "next-intl/server";
import { ReactNode } from "react";

export let gcompanyId = "buildsuite-dev";

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: Omit<Props, "children">) {
  const t = await getTranslations({ locale, namespace: "LocaleLayout" });

  return {
    title: t("title"),
  };
}

export async function getBaseUrl() {
  let companyId = await localStorage.getItem("company_id");
  if (companyId && companyId.length > 0) {
    gcompanyId = companyId;
    return `https://${companyId}.app.buildsuite.io`;
  } else {
    return `https://buildsuite-dev.app.buildsuite.io`;
  }
}

export function logout() {
  localStorage.setItem("sid", "");
  localStorage.setItem("api_key", "");
  localStorage.setItem("api_secret", "");
  window.location.href = "/?session-expired=true";
}
