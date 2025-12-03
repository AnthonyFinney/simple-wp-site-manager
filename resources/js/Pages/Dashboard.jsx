// resources/js/Pages/Dashboard.jsx
import AppLayout from "../Layouts/AppLayout";
import { Link } from "@inertiajs/react";
import { card, label, muted, pill, softCard } from "../theme";

export default function Dashboard({ sites = [], servers = [] }) {
    const stats = buildStats(sites, servers);
    const topServers = servers.slice(0, 4);
    const topSites = sites.slice(0, 6);

    const recentActivity = [
        {
            id: 1,
            type: "backup",
            message: "Backup completed for blog.example.com",
            time: "3 min ago",
        },
        {
            id: 2,
            type: "deploy",
            message: "New site deployed on vps-1: shop.example.com",
            time: "25 min ago",
        },
        {
            id: 3,
            type: "ssl",
            message: "Auto-renewed Let’s Encrypt SSL for dev.example.com",
            time: "2 hours ago",
        },
    ];

    return (
        <AppLayout title="Dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <section className={`${card} p-6`}>
                        <header className="flex items-center justify-between mb-6">
                            <div>
                                <p className={`${label}`}>Overview</p>
                                <p className={`${muted} text-sm`}>
                                    Live counts across your stack
                                </p>
                            </div>
                            <span className={`${pill}`}>Realtime</span>
                        </header>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard label="Servers" value={stats.servers} />
                            <StatCard label="Sites" value={stats.sites} />
                            <StatCard
                                label="Running"
                                value={stats.runningSites}
                                tone="good"
                            />
                            <StatCard
                                label="Stopped"
                                value={stats.stoppedSites}
                                tone="muted"
                            />
                        </div>
                    </section>

                    <section className={`${card} p-6`}>
                        <header className="flex items-center justify-between mb-4">
                            <div>
                                <p className={`${label}`}>Servers</p>
                                <p className={`${muted} text-sm`}>
                                    Health and capacity at a glance
                                </p>
                            </div>
                            <Link
                                href="/servers"
                                className="text-sm text-cyan-300 hover:text-white"
                            >
                                View all
                            </Link>
                        </header>
                        <ul className="divide-y divide-slate-800/70">
                            {topServers.length ? (
                                topServers.map((server) => (
                                    <li
                                        key={server.id}
                                        className="py-3 flex items-center justify-between gap-4"
                                    >
                                        <div className="space-y-1">
                                            <Link
                                                href={`/servers/${server.id}`}
                                                className="text-base font-semibold text-white hover:text-cyan-200"
                                            >
                                                {server.name}
                                            </Link>
                                            <p className={`${muted} text-sm`}>
                                                {server.region ?? "Unknown"} ·{" "}
                                                {server.provider ?? "Unknown"}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {server.host}
                                            </p>
                                        </div>
                                        <div className="text-right space-y-1">
                                            <ServerStatusBadge
                                                status={server.status}
                                            />
                                            <div className="text-xs text-slate-400">
                                                {server.sites_count ?? 0} sites
                                            </div>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="py-3 text-sm text-slate-400">
                                    No servers yet.{" "}
                                    <Link
                                        href="/servers/create"
                                        className="text-cyan-300 hover:text-white"
                                    >
                                        Add your first server
                                    </Link>
                                    .
                                </li>
                            )}
                        </ul>
                    </section>

                    <section className={`${card} p-6`}>
                        <header className="flex items-center justify-between mb-4">
                            <div>
                                <p className={`${label}`}>Sites</p>
                                <p className={`${muted} text-sm`}>
                                    WordPress installs across servers
                                </p>
                            </div>
                            <Link
                                href="/sites"
                                className="text-sm text-cyan-300 hover:text-white"
                            >
                                View all
                            </Link>
                        </header>
                        {topSites.length ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {topSites.map((site) => (
                                    <div
                                        key={site.id}
                                        className={`${softCard} p-4`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <Link
                                                href={`/sites/${site.id}`}
                                                className="font-semibold text-white hover:text-cyan-200"
                                            >
                                                {site.domain}
                                            </Link>
                                            <SiteStatusBadge
                                                status={site.status}
                                            />
                                        </div>
                                        <p className={`${muted} text-sm mt-1`}>
                                            {site.server?.name ??
                                                "Unassigned server"}{" "}
                                            · PHP {site.php_version ?? "—"}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-2">
                                            Last backup:{" "}
                                            {site.last_backup_at ?? "—"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400">
                                No sites yet.{" "}
                                <Link
                                    href="/sites/create"
                                    className="text-cyan-300 hover:text-white"
                                >
                                    Deploy your first site
                                </Link>
                                .
                            </p>
                        )}
                    </section>
                </div>

                <div className="space-y-6">
                    <section className={`${card} p-6`}>
                        <p className={`${label} mb-3`}>Backups today</p>
                        <p className="text-4xl font-bold text-cyan-200">
                            {stats.backupsToday}
                        </p>
                        <p className={`${muted} text-sm mt-2`}>
                            Counted from site backup timestamps.
                        </p>
                    </section>

                    <section className={`${card} p-6`}>
                        <header className="flex items-center justify-between mb-3">
                            <p className={`${label}`}>Recent activity</p>
                            <span className={`${muted} text-xs`}>
                                Latest events
                            </span>
                        </header>
                        <ul className="divide-y divide-slate-800/70">
                            {recentActivity.map((item) => (
                                <li
                                    key={item.id}
                                    className="py-3 flex items-start justify-between"
                                >
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-white">
                                            {item.message}
                                        </p>
                                        <StatusPill tone={item.type} />
                                    </div>
                                    <span className="text-xs text-slate-400">
                                        {item.time}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}

function buildStats(sites, servers) {
    const runningSites = sites.filter(
        (site) => (site.status || "").toLowerCase() === "running"
    ).length;

    const backupsToday = sites.reduce((total, site) => {
        if (!site.last_backup_at) {
            return total;
        }

        const backupDate = new Date(site.last_backup_at);
        if (Number.isNaN(backupDate.getTime())) {
            return total;
        }

        const now = new Date();
        return backupDate.toDateString() === now.toDateString()
            ? total + 1
            : total;
    }, 0);

    return {
        servers: servers.length,
        sites: sites.length,
        runningSites,
        stoppedSites: Math.max(0, sites.length - runningSites),
        backupsToday,
    };
}

function StatCard({ label, value, tone }) {
    const color = {
        good: "text-emerald-200",
        muted: "text-slate-400",
    }[tone];

    return (
        <div className={`${softCard} px-4 py-3`}>
            <p className={`${label}`}>{label}</p>
            <p className={`mt-2 text-3xl font-bold ${color ?? "text-white"}`}>
                {value}
            </p>
        </div>
    );
}

function ServerStatusBadge({ status }) {
    const isUp = (status || "").toLowerCase() === "online";
    const color = isUp
        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
        : "border-rose-500/30 bg-rose-500/10 text-rose-200";

    return (
        <span
            className={`inline-flex items-center px-3 py-1 text-[11px] uppercase tracking-[0.14em] rounded-full border ${color}`}
        >
            ● {isUp ? "Online" : "Offline"}
        </span>
    );
}

function SiteStatusBadge({ status }) {
    const isRunning = (status || "").toLowerCase() === "running";
    const color = isRunning
        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
        : "border-slate-600/60 bg-slate-800/50 text-slate-200";

    return (
        <span
            className={`inline-flex items-center px-3 py-1 text-[11px] uppercase tracking-[0.14em] rounded-full border ${color}`}
        >
            ● {isRunning ? "Running" : "Stopped"}
        </span>
    );
}

function StatusPill({ tone }) {
    const normalized = (tone || "").toLowerCase();
    const colors = {
        backup: "border-cyan-500/40 bg-cyan-500/10 text-cyan-100",
        deploy: "border-emerald-500/30 bg-emerald-500/10 text-emerald-100",
        ssl: "border-amber-500/30 bg-amber-500/10 text-amber-100",
    };
    const color =
        colors[normalized] ||
        "border-slate-700/60 bg-slate-900/60 text-slate-200";

    return (
        <span
            className={`${pill} ${color} px-2 py-0.5 uppercase tracking-[0.12em]`}
        >
            {tone}
        </span>
    );
}
