// resources/js/Pages/Dashboard.jsx
import AppLayout from "../Layouts/AppLayout";
import { Link } from "@inertiajs/react";

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
                    <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm">
                        <header className="flex items-baseline justify-between mb-4">
                            <h2 className="text-sm uppercase tracking-[0.25em] text-neutral-400">
                                Overview
                            </h2>
                            <span className="text-xs text-neutral-500">
                                Live counts
                            </span>
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
                                tone="bad"
                            />
                        </div>
                    </section>

                    <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm">
                        <header className="flex items-center justify-between mb-3">
                            <h2 className="text-sm uppercase tracking-[0.25em] text-neutral-400">
                                Servers
                            </h2>
                            <Link
                                href="/servers"
                                className="text-xs uppercase tracking-[0.2em] text-red-300 hover:text-red-200"
                            >
                                View servers →
                            </Link>
                        </header>
                        <ul className="divide-y divide-neutral-800">
                            {topServers.length ? (
                                topServers.map((server) => (
                                    <li
                                        key={server.id}
                                        className="py-3 flex items-center justify-between gap-4"
                                    >
                                        <div>
                                            <Link
                                                href={`/servers/${server.id}`}
                                                className="text-sm font-semibold text-neutral-100 hover:text-red-400"
                                            >
                                                {server.name}
                                            </Link>
                                            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mt-1">
                                                {server.region ?? "Unknown"} ·{" "}
                                                {server.provider ?? "Unknown"}
                                            </p>
                                            <p className="text-xs text-neutral-500">
                                                {server.host}
                                            </p>
                                        </div>
                                        <div className="text-right space-y-1">
                                            <ServerStatusBadge
                                                status={server.status}
                                            />
                                            <div className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
                                                {server.sites_count ?? 0} sites
                                            </div>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="py-3 text-sm text-neutral-500">
                                    No servers yet.{" "}
                                    <Link
                                        href="/servers/create"
                                        className="text-red-300 hover:text-red-200"
                                    >
                                        Add your first server
                                    </Link>
                                    .
                                </li>
                            )}
                        </ul>
                    </section>

                    <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm">
                        <header className="flex items-center justify-between mb-3">
                            <h2 className="text-sm uppercase tracking-[0.25em] text-neutral-400">
                                Sites
                            </h2>
                            <Link
                                href="/sites"
                                className="text-xs uppercase tracking-[0.2em] text-red-300 hover:text-red-200"
                            >
                                View sites →
                            </Link>
                        </header>
                        {topSites.length ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {topSites.map((site) => (
                                    <div
                                        key={site.id}
                                        className="border border-neutral-800 rounded-lg p-4 bg-neutral-950"
                                    >
                                        <div className="flex items-center justify-between">
                                            <Link
                                                href={`/sites/${site.id}`}
                                                className="text-sm font-semibold text-neutral-100 hover:text-red-400"
                                            >
                                                {site.domain}
                                            </Link>
                                            <SiteStatusBadge
                                                status={site.status}
                                            />
                                        </div>
                                        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mt-1">
                                            {site.server?.name ??
                                                "Unassigned server"}{" "}
                                            · PHP {site.php_version ?? "—"}
                                        </p>
                                        <p className="text-xs text-neutral-500 mt-2">
                                            Last backup:{" "}
                                            {site.last_backup_at ?? "—"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-neutral-500">
                                No sites yet.{" "}
                                <Link
                                    href="/sites/create"
                                    className="text-red-300 hover:text-red-200"
                                >
                                    Deploy your first site
                                </Link>
                                .
                            </p>
                        )}
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="bg-black text-neutral-50 rounded-xl p-6 shadow-sm border border-neutral-800">
                        <h2 className="text-sm uppercase tracking-[0.25em] text-neutral-500 mb-2">
                            Backups Today
                        </h2>
                        <p className="text-4xl font-bold text-red-400">
                            {stats.backupsToday}
                        </p>
                        <p className="text-xs text-neutral-400 mt-1">
                            Counted from site backup timestamps.
                        </p>
                    </section>

                    <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm">
                        <header className="flex items-center justify-between mb-3">
                            <h2 className="text-sm uppercase tracking-[0.25em] text-neutral-400">
                                Recent Activity
                            </h2>
                            <span className="text-xs text-neutral-500">
                                Newest first
                            </span>
                        </header>
                        <ul className="divide-y divide-neutral-800">
                            {recentActivity.map((item) => (
                                <li
                                    key={item.id}
                                    className="py-3 flex items-start justify-between"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-neutral-100">
                                            {item.message}
                                        </p>
                                        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                                            {item.type}
                                        </p>
                                    </div>
                                    <span className="text-xs text-neutral-500">
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
    const color =
        tone === "good"
            ? "text-emerald-300"
            : tone === "bad"
            ? "text-red-400"
            : "text-neutral-50";

    return (
        <div className="border border-neutral-800 rounded-lg px-4 py-3 bg-neutral-950">
            <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-500">
                {label}
            </p>
            <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
        </div>
    );
}

function ServerStatusBadge({ status }) {
    const isUp = (status || "").toLowerCase() === "online";
    const color = isUp
        ? "bg-emerald-900/40 text-emerald-200 border border-emerald-800"
        : "bg-red-900/40 text-red-200 border border-red-800";

    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 text-[11px] uppercase tracking-[0.2em] rounded-full ${color}`}
        >
            ● {isUp ? "Online" : "Offline"}
        </span>
    );
}

function SiteStatusBadge({ status }) {
    const isRunning = (status || "").toLowerCase() === "running";
    const color = isRunning
        ? "bg-emerald-900/40 text-emerald-200 border border-emerald-800"
        : "bg-red-900/40 text-red-200 border border-red-800";

    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 text-[11px] uppercase tracking-[0.2em] rounded-full ${color}`}
        >
            ● {isRunning ? "Running" : "Stopped"}
        </span>
    );
}
