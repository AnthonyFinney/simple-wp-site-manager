// resources/js/Pages/Sites/Show.jsx
import AppLayout from "../../Layouts/AppLayout";
import { Link } from "@inertiajs/react";

export default function SiteShow({ site }) {
    const safe = site ?? {};
    const backups = site?.backups ?? [];

    return (
        <AppLayout title={`Site · ${safe.domain}`}>
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main panel */}
                <div className="flex-1 space-y-6">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm">
                        <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-500">
                            Site
                        </p>
                        <h1 className="text-2xl font-bold mt-1 text-neutral-50">
                            {safe.domain}
                        </h1>
                        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mt-2">
                            Hosted on{" "}
                            <span className="text-neutral-100">
                                {safe.server?.name}
                            </span>{" "}
                            · PHP {safe.php_version}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2 text-xs">
                            <StatusBadge status={safe.status} />
                            <button className="px-4 py-2 rounded-md border border-neutral-700 text-neutral-200 uppercase tracking-[0.2em] hover:border-neutral-500">
                                Visit Site
                            </button>
                            <button className="px-4 py-2 rounded-md border border-neutral-700 text-neutral-200 uppercase tracking-[0.2em] hover:border-neutral-500">
                                Open WP Admin
                            </button>
                            <Link
                                href={`/sites/${safe.id}/edit`}
                                className="px-4 py-2 rounded-md border border-red-800 text-red-200 uppercase tracking-[0.2em] hover:border-red-500"
                            >
                                Edit settings
                            </Link>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm">
                        <h2 className="text-sm uppercase tracking-[0.25em] text-neutral-400 mb-4">
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                            <ActionButton label="Restart containers" />
                            <ActionButton label="Flush cache" />
                            <ActionButton label="Run backup now" />
                            <ActionButton label="Enable maintenance mode" />
                            <ActionButton label="View logs" />
                            <ActionButton label="Delete site (danger)" danger />
                        </div>
                    </div>
                </div>

                {/* Sidebar: Backups */}
                <div className="w-full lg:w-80 bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm uppercase tracking-[0.25em] text-neutral-400">
                            Backups
                        </h2>
                        <button className="text-[11px] uppercase tracking-[0.2em] text-red-300">
                            Create backup
                        </button>
                    </div>
                    <ul className="space-y-2 text-xs">
                        {backups.map((b) => (
                            <li
                                key={b.id}
                                className="flex items-center justify-between px-3 py-3 rounded-md border border-neutral-800 bg-neutral-950"
                            >
                                <div>
                                    <p className="text-neutral-100 font-semibold">
                                        {b.size}
                                    </p>
                                    <p className="text-neutral-500">
                                        {b.created_at}
                                    </p>
                                </div>
                                <button className="text-red-300 text-[11px] uppercase tracking-[0.2em] hover:underline">
                                    Download
                                </button>
                            </li>
                        ))}
                        {backups.length === 0 && (
                            <li className="px-3 py-3 rounded-md border border-neutral-800 bg-neutral-950 text-neutral-500 text-[11px] uppercase tracking-[0.15em]">
                                No backups yet.
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </AppLayout>
    );
}

function StatusBadge({ status }) {
    if (status === "running") {
        return (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-900/40 text-emerald-200 border border-emerald-800 text-[11px] uppercase tracking-[0.2em]">
                ● Running
            </span>
        );
    }
    return (
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-900/40 text-red-200 border border-red-800 text-[11px] uppercase tracking-[0.2em]">
            ● Stopped
        </span>
    );
}

function ActionButton({ label, danger }) {
    const classes = danger
        ? "border-red-800 text-red-200 hover:border-red-500"
        : "border-neutral-700 text-neutral-200 hover:border-neutral-500";

    return (
        <button
            className={`px-3 py-3 rounded-md text-left border uppercase tracking-[0.2em] text-[11px] ${classes}`}
        >
            {label}
        </button>
    );
}
