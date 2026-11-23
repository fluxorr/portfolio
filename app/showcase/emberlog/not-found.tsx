import Link from "next/link";
import { EmberIcon } from "@/components/emberlog/mark";
import { emberlogPath } from "@/lib/emberlog";

export default function EmberlogNotFound() {
  return (
    <main className="el-shell el-subpage" id="emberlog-main" tabIndex={-1}>
      <header className="el-subhead">
        <p className="el-index">404</p>
        <h1>
          This take has <em>gone cold.</em>
        </h1>
        <p>Open the sample checkout to start again.</p>
        <Link
          className="el-button el-primary"
          href={`${emberlogPath}#replay`}
          prefetch={false}
        >
          Find the sample take <EmberIcon name="arrow" />
        </Link>
      </header>
    </main>
  );
}
