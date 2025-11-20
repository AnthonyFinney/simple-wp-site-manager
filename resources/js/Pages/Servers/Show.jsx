// resources/js/Pages/Servers/Show.jsx
import AppLayout from "../../Layouts/AppLayout";
import { Link } from "@inertiajs/react";

export default function ServerShow({ server }) {
    const fallback = {
        name: "Server",
        provider: "Unknown",
        host: "n/a",
        region: "n/a",
        os: "Unknown",
        memory: "n/a",
        disk: "n/a",
        status: "offline",
        ip_addresses: [],
    };
    const safeServer = server ?? fallback;
    const sites = server?.sites ?? [];

    const services = [
        { name: "Docker", status: "running" },
        { name: "Nginx", status: "running" },
        { name: "MySQL", status: "running" },
        { name: "Fail2ban", status: "running" },
    ];

    return (
        <AppLayout title={`Server · ${safeServer.name}`}>
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-6">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-500">
                                    Server
                                </p>
                                <h1 className="text-2xl font-bold text-neutral-50">
                                    {safeServer.name}
                                </h1>
                                <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mt-1">
                                    {safeServer.provider} · {safeServer.region} ·{" "}
                                    {safeServer.os}
                                </p>
                            </div>
                            <StatusBadge status={safeServer.status} />
                        </div>

                        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <InfoTile
                                    label="Public IP"
                                value={safeServer.host}
                            />
                            <InfoTile
                                label="Private IP"
                                value={safeServer.ip_addresses?.[1] ?? "—"}
                            />
                            <InfoTile
                                label="Memory"
                                value={safeServer.memory}
                            />
                            <InfoTile label="Disk" value={safeServer.disk} />
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2 text-xs">
                            <button className="px-4 py-2 rounded-md border border-neutral-700 text-neutral-200 uppercase tracking-[0.2em] hover:border-neutral-500">
                                Open SSH (todo)
                            </button>
                            <button className="px-4 py-2 rounded-md border border-neutral-700 text-neutral-200 uppercase tracking-[0.2em] hover:border-neutral-500">
                                Run update (todo)
                            </button>
                        </div>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm uppercase tracking-[0.25em] text-neutral-400">
                                Services
                            </h2>
                            <button className="text-xs uppercase tracking-[0.2em] text-red-300">
                                Restart all
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                            {services.map((service) => (
                                <div
                                    key={service.name}
                                    className="flex items-center justify-between px-4 py-3 rounded-lg border border-neutral-800 bg-neutral-950"
                                >
                                    <span className="text-neutral-100 font-semibold">
                                        {service.name}
                                    </span>
                                    <StatusBadge status={service.status} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-80 space-y-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm uppercase tracking-[0.25em] text-neutral-400">
                                Sites on this server
                            </h2>
                            <Link
                                href="/sites/create"
                                className="text-[11px] uppercase tracking-[0.2em] text-red-300"
                            >
                                + New site
                            </Link>
                        </div>
                        <ul className="space-y-2 text-xs">
                            {sites.map((site) => (
                                <li
                                    key={site.id}
                                    className="flex items-center justify-between px-3 py-3 rounded-md border border-neutral-800 bg-neutral-950"
                                >
                                    <div>
                                        <Link
                                            href={`/sites/${site.id}`}
                                            className="text-neutral-100 font-semibold hover:text-red-400"
                                        >
                                            {site.domain}
                                        </Link>
                                        <p className="text-neutral-500 uppercase tracking-[0.15em] text-[11px]">
                                            ID: {site.id}
                                        </p>
                                    </div>
                                    <StatusBadge status={site.status} />
                                </li>
                            ))}
                            {sites.length === 0 && (
                                <li className="px-3 py-3 rounded-md border border-neutral-800 bg-neutral-950 text-neutral-500 text-[11px] uppercase tracking-[0.15em]">
                                    No sites yet.
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function InfoTile({ label, value }) {
    return (
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2">
            <p className="text-xs text-neutral-500">{label}</p>
            <p className="text-sm text-neutral-100">{value}</p>
        </div>
    );
}

function StatusBadge({ status }) {
    const isOnline = status === "online" || status === "running";
    const color = isOnline
        ? "bg-emerald-900/40 text-emerald-200 border border-emerald-800"
        : "bg-red-900/40 text-red-200 border border-red-800";

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.2em] ${color}`}
        >
            ● {isOnline ? "Online" : "Offline"}
        </span>
    );
}
