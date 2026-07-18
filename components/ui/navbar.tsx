'use client'

import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import { AnimatedBackground } from "@/components/core/animated-background";

const links = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/more", label: "More" },
];

const Navbar = () => {
    return (
        <nav className="mx-auto max-w-5xl border-x border-dashed border-neutral-400/50 p-4">
            <div className="flex justify-between items-center">
                <div className="font-hand" >(fx.)</div>
                <div className="flex items-center gap-2 text-neutral-500">
                    <AnimatedBackground
                        className="rounded-md bg-neutral-600/30"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
                    >
                        {links.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                data-id={href}
                                className="relative z-10 inline-flex items-center px-3 py-1.5 text-sm transition-colors duration-100 hover:text-neutral-900 dark:hover:text-neutral-200"
                            >
                                {label}
                            </Link>
                        ))}
                    </AnimatedBackground>
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
