// resources/js/Layouts/AppLayout.jsx
import { Link, Head, usePage } from "@inertiajs/react";

const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Servers", href: "/servers" },
    { name: "Sites", href: "/sites" },
];

export default function AppLayout({ title, children }) {
    const { url } = usePage(); // '/sites', '/servers', etc.

    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-slate-950 text-slate-100 flex">
                {/* Sidebar */}
                <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
                    <div className="px-4 py-4 border-b border-slate-800">
                        <span className="font-semibold tracking-tight text-lg">
                            WP Control
                        </span>
                        <p className="text-xs text-slate-400">
                            VPS WordPress Manager
                        </p>
                    </div>

                    <nav className="flex-1 px-2 py-4 space-y-1">
                        {navItems.map((item) => {
                            const active = url.startsWith(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={
                                        "flex items-center px-3 py-2 rounded-md text-sm font-medium transition " +
                                        (active
                                            ? "bg-slate-800 text-sky-300"
                                            : "text-slate-300 hover:bg-slate-800 hover:text-sky-200")
                                    }
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="px-4 py-3 border-t border-slate-800 text-xs text-slate-500">
                        Logged in as{" "}
                        <span className="text-slate-300">Demo User</span>
                    </div>
                </aside>

                {/* Main content */}
                <div className="flex-1 flex flex-col">
                    {/* Top bar */}
                    <header className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950/70 backdrop-blur">
                        <div className="font-medium text-sm text-slate-200">
                            {title}
                        </div>
                        <div className="text-xs text-slate-400">
                            Environment:{" "}
                            <span className="text-emerald-300">Local</span>
                        </div>
                    </header>

                    {/* Page content */}
                    <main className="flex-1 p-6 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
