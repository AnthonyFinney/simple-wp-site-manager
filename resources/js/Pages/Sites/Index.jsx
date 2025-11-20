// resources/js/Pages/Sites/Index.jsx
import AppLayout from "../../Layouts/AppLayout";
import { Link } from "@inertiajs/react";

export default function SitesIndex() {
    const sites = [
        {
            id: 1,
            domain: "blog.example.com",
            server: { name: "Main VPS" },
            status: "running",
            phpVersion: "8.2",
            lastBackup: "3m ago",
        },
        {
            id: 2,
            domain: "shop.example.com",
            server: { name: "DO #1" },
            status: "running",
            phpVersion: "8.1",
            lastBackup: "1h ago",
        },
        {
            id: 3,
            domain: "dev.example.com",
            server: { name: "Main VPS" },
            status: "stopped",
            phpVersion: "8.2",
            lastBackup: "1d ago",
        },
    ];

    return (
        <AppLayout title="Sites">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-semibold">Sites</h1>
                <Link
                    href="/sites/create"
                    className="px-3 py-1.5 text-xs rounded-md bg-sky-600 hover:bg-sky-500 text-white"
                >
                    + New WordPress Site
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {sites.map((site) => (
                    <div
                        key={site.id}
                        className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between"
                    >
                        <div>
                            <Link
                                href={`/sites/${site.id}`}
                                className="text-sm font-semibold text-sky-300 hover:underline"
                            >
                                {site.domain}
                            </Link>
                            <p className="text-xs text-slate-500 mt-1">
                                {site.server.name} · PHP {site.phpVersion}
                            </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs">
                            <StatusBadge status={site.status} />
                            <span className="text-slate-500">
                                Last backup: {site.lastBackup}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}

function StatusBadge({ status }) {
    if (status === "running") {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-400/30">
                ● Running
            </span>
        );
    }
    return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-400/30">
            ● Stopped
        </span>
    );
}
