// resources/js/Pages/Sites/Index.jsx
import AppLayout from "../../Layouts/AppLayout";
import { Link } from "@inertiajs/react";

export default function SitesIndex({ sites = [] }) {
    return (
        <AppLayout title="Sites">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-500">
                        Projects
                    </p>
                    <h1 className="text-2xl font-bold text-neutral-50">
                        Sites
                    </h1>
                </div>
                <Link
                    href="/sites/create"
                    className="px-4 py-2 text-xs uppercase tracking-[0.2em] rounded-md bg-red-600 hover:bg-red-500 text-white shadow-sm"
                >
                    + New WordPress Site
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {sites.map((site) => (
                    <div
                        key={site.id}
                        className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between shadow-sm"
                    >
                        <div>
                            <Link
                                href={`/sites/${site.id}`}
                                className="text-lg font-semibold text-neutral-100 hover:text-red-400"
                            >
                                {site.domain}
                            </Link>
                            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mt-2">
                                {site.server?.name} · PHP {site.php_version}
                            </p>
                        </div>

                        <div className="mt-4 flex items-center justify-between text-xs">
                            <StatusBadge status={site.status} />
                            <span className="text-neutral-500 uppercase tracking-[0.15em]">
                                Last backup: {site.last_backup_at ?? "—"}
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
