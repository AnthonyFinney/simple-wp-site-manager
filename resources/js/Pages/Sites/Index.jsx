// resources/js/Pages/Sites/Index.jsx
import AppLayout from "../../Layouts/AppLayout";
import { Link } from "@inertiajs/react";
import {
    card,
    label,
    muted,
    primaryButton,
    softCard,
} from "../../theme";

export default function SitesIndex({ sites = [] }) {
    return (
        <AppLayout title="Sites">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className={label}>Projects</p>
                    <h1 className="text-2xl font-semibold text-white">Sites</h1>
                    <p className={`${muted} text-sm`}>
                        Deployed WordPress projects grouped by server.
                    </p>
                </div>
                <Link
                    href="/sites/create"
                    className={primaryButton}
                >
                    + New WordPress Site
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {sites.map((site) => (
                    <div
                        key={site.id}
                        className={`${softCard} p-5 flex flex-col justify-between`}
                    >
                        <div>
                            <Link
                                href={`/sites/${site.id}`}
                                className="text-lg font-semibold text-white hover:text-cyan-200"
                            >
                                {site.domain}
                            </Link>
                            <p className={`${muted} text-sm mt-2`}>
                                {site.server?.name} · PHP {site.php_version} · Port {site.http_port || 80}
                            </p>
                        </div>

                        <div className="mt-4 flex items-center justify-between text-xs">
                            <StatusBadge status={site.status} />
                            <span className={`${muted} text-xs`}>
                                Last backup: {formatDate(site.last_backup_at)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}

function StatusBadge({ status }) {
    const normalized = (status || "").toLowerCase();
    const variants = {
        running: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
        deploying: "border-amber-500/30 bg-amber-500/10 text-amber-100",
        stopped: "border-slate-700/60 bg-slate-800/60 text-slate-200",
        failed: "border-rose-500/30 bg-rose-500/10 text-rose-200",
    };

    const classes = variants[normalized] ?? "border-slate-700/60 bg-slate-900/60 text-slate-200";
    const label = status ?? "Unknown";

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full border ${classes} text-[11px] uppercase tracking-[0.14em]`}>
            ● {label}
        </span>
    );
}

function formatDate(value) {
    if (!value) return "—";
    const date = new Date(value);
    return isNaN(date.getTime()) ? value : date.toLocaleDateString();
}
