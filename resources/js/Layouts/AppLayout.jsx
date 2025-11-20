// resources/js/Layouts/AppLayout.jsx
import { Link, Head, usePage } from "@inertiajs/react";

const navItems = [
    { name: "Dashboard", href: "/" },
    { name: "Servers", href: "/servers" },
    { name: "Sites", href: "/sites" },
    { name: "Backups", href: "/backups" },
];

export default function AppLayout({ title, children }) {
    const { url } = usePage(); // '/sites', '/servers', etc.

    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-neutral-950 text-neutral-50 flex border-t-8 border-red-600">
                {/* Sidebar */}
                <aside className="w-64 border-r border-neutral-800 bg-neutral-900 flex flex-col">
                    <div className="px-6 py-6 border-b border-neutral-800">
                        <div className="uppercase tracking-[0.2em] text-[11px] text-neutral-400">
                            WP Control
                        </div>
                        <div className="mt-2 text-xl font-semibold text-neutral-50">WordPress Ops</div>
                        <div className="text-xs text-neutral-500">Swiss grid edition</div>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-1">
                        {navItems.map((item) => {
                            const active =
                                item.href === "/"
                                    ? url === "/" || url.startsWith("/dashboard")
                                    : url.startsWith(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={
                                        "flex items-center justify-between px-3 py-3 uppercase text-[11px] tracking-[0.2em] border-l-4 transition " +
                                        (active
                                            ? "border-red-500 text-red-300 bg-neutral-800"
                                            : "border-transparent text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800")
                                    }
                                >
                                    <span>{item.name}</span>
                                    <span className="text-[10px] text-neutral-500">→</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="px-6 py-4 border-t border-neutral-800 text-xs text-neutral-400">
                        Logged in as{" "}
                        <span className="font-semibold text-neutral-50">Demo User</span>
                    </div>
                </aside>

                {/* Main content */}
                <div className="flex-1 flex flex-col">
                    {/* Top bar */}
                    <header className="h-16 border-b border-neutral-800 flex items-center justify-between px-8 bg-neutral-900/80 backdrop-blur">
                        <div>
                            <div className="text-[11px] uppercase tracking-[0.3em] text-neutral-500">
                                {title}
                            </div>
                            <div className="text-sm font-semibold text-neutral-50">Site manager dashboard</div>
                        </div>
                        <div className="text-xs text-neutral-400 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                            Environment: Local
                        </div>
                    </header>

                    {/* Page content */}
                    <main className="flex-1 p-8 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
