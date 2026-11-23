import { permanentRedirect } from "next/navigation";
import { emberlogPath } from "@/lib/emberlog";

export default function FormerStillframePage() {
  permanentRedirect(emberlogPath);
}
