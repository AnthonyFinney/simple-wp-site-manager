// resources/js/Pages/Servers/Index.jsx
import AppLayout from "../../Layouts/AppLayout";
import { Link } from "@inertiajs/react";
import {
    card,
    label,
    muted,
    primaryButton,
    tableCell,
    tableHeader,
} from "../../theme";

export default function ServersIndex({ servers = [] }) {
    return (
        <AppLayout title="Servers">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className={`${label}`}>Inventory</p>
                    <h1 className="text-2xl font-semibold text-white">
                        Servers
                    </h1>
                    <p className={`${muted} text-sm`}>
                        Registered hosts ready for deployments.
                    </p>
                </div>
                <Link
                    href="/servers/create"
                    className={primaryButton}
                >
                    + Add Server
                </Link>
            </div>

            <div className={`${card} overflow-hidden`}>
                <table className="min-w-full text-sm">
                    <thead className="border-b border-slate-800/70">
                        <tr>
                            <Th>Name</Th>
                            <Th>Host</Th>
                            <Th>Provider</Th>
                            <Th>Sites</Th>
                            <Th>Status</Th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                        {servers.map((server, idx) => (
                            <tr
                                key={server.id}
                                className={
                                    idx % 2 === 0
                                        ? "bg-slate-950/40"
                                        : "bg-slate-900/40"
                                }
                            >
                                <Td>
                                    <Link
                                        href={`/servers/${server.id}`}
                                        className="font-semibold text-white hover:text-cyan-200"
                                    >
                                        {server.name}
                                    </Link>
                                    <div className="text-xs text-slate-400">
                                        {server.region} · {server.provider}
                                    </div>
                                </Td>
                                <Td>{server.host}</Td>
                                <Td>{server.provider}</Td>
                                <Td>{server.sites_count}</Td>
                                <Td>
                                    <StatusBadge status={server.status} />
                                </Td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}

function Th({ children }) {
    return (
        <th className={tableHeader}>{children}</th>
    );
}

function Td({ children }) {
    return (
        <td className={tableCell}>{children}</td>
    );
}

function StatusBadge({ status }) {
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
