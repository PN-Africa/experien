import { redirect } from "next/navigation";

export default function AdminHome() {
  redirect("/admin/courses"); //  point to /admin/overview when that page exists
}
