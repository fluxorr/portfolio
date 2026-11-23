import { permanentRedirect } from "next/navigation";

export default function More() {
  permanentRedirect("/#about");
}
