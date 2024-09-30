import { gcompanyId } from "@/utils/utils";
import { redirect } from "next/navigation";

// This page only renders when the app is built statically (output: 'export')
export default async function RootPage() {
    redirect(`/${gcompanyId}/projects`);
}
