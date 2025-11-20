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
            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <StatCard label="Servers" value={stats.servers} />
                <StatCard label="Total Sites" value={stats.sites} />
                <StatCard
                    label="Running Sites"
                    value={stats.runningSites}
                    tone="good"
                />
                <StatCard
                    label="Stopped Sites"
                    value={stats.stoppedSites}
                    tone="bad"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Backups card */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
                    <h2 className="text-sm font-semibold mb-2">
                        Backups Today
                    </h2>
                    <p className="text-3xl font-semibold text-sky-300">
                        {stats.backupsToday}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                        Last backup ran 3 minutes ago.
                    </p>
                </div>

                {/* Placeholder for chart/uptime */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 lg:col-span-2">
                    <h2 className="text-sm font-semibold mb-2">
                        Uptime Overview
                    </h2>
                    <div className="h-40 flex items-center justify-center text-slate-500 text-xs">
                        (Later: add uptime graph here)
                    </div>
                </div>
            </div>

            {/* Recent activity */}
            <div className="mt-8 bg-slate-900/70 border border-slate-800 rounded-xl p-4">
                <h2 className="text-sm font-semibold mb-4">Recent Activity</h2>
                <ul className="divide-y divide-slate-800">
                    {recentActivity.map((item) => (
                        <li
                            key={item.id}
                            className="py-2 flex items-center justify-between"
                        >
                            <div>
                                <p className="text-sm text-slate-200">
                                    {item.message}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {item.type}
                                </p>
                            </div>
                            <span className="text-xs text-slate-500">
                                {item.time}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </AppLayout>
    );
}

function StatCard({ label, value, tone }) {
    const color =
        tone === "good"
            ? "text-emerald-300"
            : tone === "bad"
            ? "text-rose-300"
            : "text-slate-100";

    return (
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl px-4 py-3">
            <p className="text-xs text-slate-400">{label}</p>
            <p className={`mt-1 text-2xl font-semibold ${color}`}>{value}</p>
        </div>
    );
}
