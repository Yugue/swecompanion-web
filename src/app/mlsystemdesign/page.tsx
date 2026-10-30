import { redirect } from "next/navigation";
import { DEFAULT_ML_SYSTEM_DESIGN_PATH } from "@/lib/mlDomains";

export default function MlSystemDesignPage() {
  redirect(DEFAULT_ML_SYSTEM_DESIGN_PATH);
}
