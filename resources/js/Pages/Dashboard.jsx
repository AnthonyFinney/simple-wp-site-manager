// resources/js/Pages/Dashboard.jsx
import AppLayout from "../Layouts/AppLayout";

export default function Dashboard() {
    // dummy stats – later you’ll get these from backend
    const stats = {
        servers: 2,
        sites: 7,
        runningSites: 6,
        stoppedSites: 1,
        backupsToday: 3,
    };

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
                                Today
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
                                Availability
                            </h2>
                            <button className="text-xs uppercase tracking-[0.2em] text-red-300">
                                Export
                            </button>
                        </header>
                        <div className="h-40 grid place-items-center text-neutral-500 text-xs border border-dashed border-neutral-800 rounded-lg">
                            Uptime graph placeholder
                        </div>
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

                <div className="space-y-6">
                    <section className="bg-black text-neutral-50 rounded-xl p-6 shadow-sm border border-neutral-800">
                        <h2 className="text-sm uppercase tracking-[0.25em] text-neutral-500 mb-2">
                            Backups Today
                        </h2>
                        <p className="text-4xl font-bold text-red-400">
                            {stats.backupsToday}
                        </p>
                        <p className="text-xs text-neutral-400 mt-1">
                            Last backup ran 3 minutes ago.
                        </p>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
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
