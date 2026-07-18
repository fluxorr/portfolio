import Link from "next/link";
import ThemeToggle from "./theme-toggle";

const Navbar = () => {
    return (
        <nav className="mx-auto max-w-5xl border-x border-dashed border-neutral-400/50 p-4">
            <div className="flex justify-between items-center">
                <div>(fx.)</div>
                <div className="flex items-center gap-2">
                    <Link href="/">Home</Link>
                    <Link href="/projects">Projects</Link>
                    <Link href="/more">More</Link>
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
