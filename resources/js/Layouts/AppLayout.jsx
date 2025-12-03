// resources/js/Layouts/AppLayout.jsx
import { Link, Head, usePage, router } from "@inertiajs/react";
import {
    card,
    pageBg,
    pill,
    shell,
    subtleButton,
} from "../theme";

const navItems = [
    {
        name: "Dashboard",
        href: "/",
        match: (url) => url === "/" || url.startsWith("/dashboard"),
    },
    {
        name: "Servers",
        href: "/servers",
        match: (url) => url.startsWith("/servers"),
    },
    {
        name: "Sites",
        href: "/sites",
        match: (url) => url.startsWith("/sites") && !url.includes("/backups"),
    },
    {
        name: "Backups",
        href: "/backups",
        match: (url) => url.includes("/backups"),
    },
    {
        name: "Profile",
        href: "/profile",
        match: (url) => url.startsWith("/profile"),
    },
];

export default function AppLayout({ title, children }) {
    const { url, props } = usePage(); // '/sites', '/servers', etc.
    const user = props.auth?.user;

    const logout = (e) => {
        e.preventDefault();
        router.post("/logout", {}, { preserveScroll: true });
    };

    return (
        <>
            <Head title={title} />
            <div className={`${pageBg}`}>
                <div className={`${shell} flex gap-6`}>
                    <aside className="w-64 shrink-0 hidden md:block">
                        <div className={`${card} p-5 space-y-5`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[12px] uppercase tracking-[0.16em] text-slate-400">
                                        WP Control
                                    </p>
                                    <p className="text-lg font-semibold text-white">
                                        Site Manager
                                    </p>
                                </div>
                                <span className="text-[11px] text-slate-500">
                                    v2
                                </span>
                            </div>
                            <nav className="space-y-1">
                                {navItems.map((item) => {
                                    const active = item.match
                                        ? item.match(url)
                                        : url.startsWith(item.href);
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition border border-transparent hover:border-slate-800/80 hover:bg-slate-900/60 ${
                                                active
                                                    ? "border-slate-800/90 bg-slate-900/70 text-white"
                                                    : "text-slate-300"
                                            }`}
                                        >
                                            <span>{item.name}</span>
                                            <span className="text-[10px] text-slate-500">
                                                →
                                            </span>
                                        </Link>
                                    );
                                })}
                            </nav>
                            <div className="pt-2 border-t border-slate-800/70">
                                <p className="text-xs text-slate-400">
                                    {user?.name || user?.email || "User"}
                                </p>
                                <button
                                    onClick={logout}
                                    className="mt-2 text-sm text-slate-300 hover:text-white"
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </aside>

                    <div className="flex-1 space-y-4">
                        <div className="md:hidden">
                            <div className={`${card} p-4`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[12px] uppercase tracking-[0.16em] text-slate-400">
                                            WP Control
                                        </p>
                                        <p className="text-lg font-semibold text-white">
                                            {title}
                                        </p>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className={subtleButton}
                                    >
                                        Sign out
                                    </button>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {navItems.map((item) => {
                                        const active = item.match
                                            ? item.match(url)
                                            : url.startsWith(item.href);
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={`rounded-full px-3 py-1 text-xs border transition ${
                                                    active
                                                        ? "border-slate-700 bg-slate-900 text-white"
                                                        : "border-slate-800 text-slate-300 hover:border-slate-700"
                                                }`}
                                            >
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <header className={`${card} p-5 flex items-center justify-between`}>
                            <div>
                                <p className="text-[12px] uppercase tracking-[0.18em] text-slate-400">
                                    {title}
                                </p>
                                <h1 className="text-2xl font-semibold text-white">
                                    WordPress operations
                                </h1>
                            </div>
                            <div className={`${pill}`}>
                                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                                <span className="text-xs text-slate-200">
                                    Local environment
                                </span>
                            </div>
                        </header>

                        <main className="pb-4">{children}</main>
                    </div>
                </div>
            </div>
        </>
    );
}
