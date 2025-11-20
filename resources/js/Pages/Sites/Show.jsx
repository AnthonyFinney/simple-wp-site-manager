// resources/js/Pages/Sites/Show.jsx
import AppLayout from "../../Layouts/AppLayout";

export default function SiteShow() {
    // Eventually this comes from backend props
    const site = {
        id: 1,
        domain: "blog.example.com",
        server: { name: "Main VPS" },
        status: "running",
        phpVersion: "8.2",
        backups: [
            { id: 1, created_at: "2025-11-19 10:23", size: "450 MB" },
            { id: 2, created_at: "2025-11-18 09:01", size: "430 MB" },
        ],
    };

    return (
        <AppLayout title={`Site · ${site.domain}`}>
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main panel */}
                <div className="flex-1 space-y-4">
                    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
                        <h1 className="text-lg font-semibold mb-1">
                            {site.domain}
                        </h1>
                        <p className="text-xs text-slate-500">
                            Hosted on{" "}
                            <span className="text-slate-200">
                                {site.server.name}
                            </span>{" "}
                            · PHP {site.phpVersion}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2 text-xs">
                            <StatusBadge status={site.status} />
                            <button className="px-3 py-1 rounded-md bg-slate-800 text-slate-100 hover:bg-slate-700">
                                Visit Site
                            </button>
                            <button className="px-3 py-1 rounded-md bg-slate-800 text-slate-100 hover:bg-slate-700">
                                Open WP Admin
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
                        <h2 className="text-sm font-semibold mb-3">
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
                <div className="w-full lg:w-80 bg-slate-900/70 border border-slate-800 rounded-xl p-4">
                    <h2 className="text-sm font-semibold mb-3">Backups</h2>
                    <button className="w-full mb-3 px-3 py-1.5 text-xs rounded-md bg-sky-600 hover:bg-sky-500 text-white">
                        Create backup
                    </button>
                    <ul className="space-y-2 text-xs">
                        {site.backups.map((b) => (
                            <li
                                key={b.id}
                                className="flex items-center justify-between px-2 py-1 rounded-md bg-slate-950/70 border border-slate-800"
                            >
                                <div>
                                    <p className="text-slate-200">{b.size}</p>
                                    <p className="text-slate-500">
                                        {b.created_at}
                                    </p>
                                </div>
                                <button className="text-sky-300 hover:underline">
                                    Download
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </AppLayout>
    );
}

function StatusBadge({ status }) {
    if (status === "running") {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-400/30 text-xs">
                ● Running
            </span>
        );
    }
    return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-400/30 text-xs">
            ● Stopped
        </span>
    );
}

function ActionButton({ label, danger }) {
    const classes = danger
        ? "bg-rose-900/60 border border-rose-700 text-rose-200 hover:bg-rose-800"
        : "bg-slate-950/60 border border-slate-800 text-slate-100 hover:bg-slate-900";

    return (
        <button className={`px-3 py-2 rounded-md text-left ${classes}`}>
            {label}
        </button>
    );
}
