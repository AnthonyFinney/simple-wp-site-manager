// resources/js/Pages/Servers/Show.jsx
import AppLayout from "../../Layouts/AppLayout";
import { Link, router } from "@inertiajs/react";
import {
    card,
    dangerButton,
    ghostButton,
    label,
    muted,
    pill,
    softCard,
} from "../../theme";

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

    const deleteUrl = server?.delete_url || (safeServer?.id ? `/servers/${safeServer.id}` : null);

    const handleDelete = () => {
        const targetUrl = deleteUrl;
        if (!targetUrl) return;
        if (!confirm("Delete this server and cascade remove its sites/backups?")) return;
        router.post(
            targetUrl,
            { _method: "delete" },
            {
                preserveScroll: false,
                onSuccess: () => router.visit("/servers"),
            }
        );
    };

    return (
        <AppLayout title={`Server · ${safeServer.name}`}>
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-6">
                    <div className={`${card} p-6`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className={label}>Server</p>
                                <h1 className="text-2xl font-semibold text-white">
                                    {safeServer.name}
                                </h1>
                                <p className={`${muted} text-sm mt-1`}>
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

                        <div className="mt-6 flex flex-wrap gap-3 text-sm">
                            <a
                                href={`ssh://${safeServer.ssh_user ?? "root"}@${safeServer.host}`}
                                className={ghostButton}
                            >
                                Open SSH
                            </a>
                            {safeServer.id && (
                                <Link
                                    href={server?.edit_url || `/servers/${safeServer.id}/edit`}
                                    className={ghostButton}
                                >
                                    Edit details
                                </Link>
                            )}
                            <button
                                type="button"
                                disabled
                                className={`${ghostButton} cursor-not-allowed opacity-60`}
                                title="System update automation coming soon"
                            >
                                Run update (coming soon)
                            </button>
                            {deleteUrl && (
                                <button type="button" className={dangerButton} onClick={handleDelete}>
                                    Delete server
                                </button>
                            )}
                        </div>
                    </div>

                    <div className={`${card} p-6`}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className={label}>Services</h2>
                            <button
                                type="button"
                                disabled
                                className="text-sm text-slate-500 cursor-not-allowed"
                                title="Restart all coming soon"
                            >
                                Restart all
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                            {services.map((service) => (
                                <div
                                    key={service.name}
                                    className={`${softCard} flex items-center justify-between px-4 py-3`}
                                >
                                    <span className="text-white font-semibold">
                                        {service.name}
                                    </span>
                                    <StatusBadge status={service.status} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-80 space-y-4">
                    <div className={`${card} p-5`}>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className={label}>Sites on this server</h2>
                            <Link
                                href="/sites/create"
                                className="text-sm text-cyan-300 hover:text-white"
                            >
                                + New site
                            </Link>
                        </div>
                        <ul className="space-y-2 text-xs">
                            {sites.map((site) => (
                                <li
                                    key={site.id}
                                    className={`${softCard} flex items-center justify-between px-3 py-3`}
                                >
                                    <div>
                                        <Link
                                            href={`/sites/${site.id}`}
                                            className="text-white font-semibold hover:text-cyan-200"
                                        >
                                            {site.domain}
                                        </Link>
                                        <p className={`${muted} text-[11px]`}>
                                            ID: {site.id}
                                        </p>
                                    </div>
                                    <StatusBadge status={site.status} />
                                </li>
                            ))}
                            {sites.length === 0 && (
                                <li className={`${softCard} px-3 py-3 text-slate-400 text-[12px]`}>
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
        <div className={`${softCard} px-3 py-2`}>
            <p className={`${muted} text-xs`}>{label}</p>
            <p className="text-sm text-white">{value}</p>
        </div>
    );
}

function StatusBadge({ status }) {
    const isOnline = status === "online" || status === "running";
    const color = isOnline
        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
        : "border-rose-500/30 bg-rose-500/10 text-rose-200";

    return (
        <span
            className={`${pill} border ${color} px-3 py-1`}
        >
            ● {isOnline ? "Online" : "Offline"}
        </span>
    );
}
