// resources/js/Pages/Servers/Index.jsx
import AppLayout from "../../Layouts/AppLayout";
import { Link } from "@inertiajs/react";

export default function ServersIndex() {
    // fake data
    const servers = [
        {
            id: 1,
            name: "Main VPS",
            host: "192.168.0.10",
            provider: "Hetzner",
            sites_count: 4,
            status: "online",
            region: "fsn1",
        },
        {
            id: 2,
            name: "DO #1",
            host: "203.0.113.5",
            provider: "DigitalOcean",
            sites_count: 3,
            status: "online",
            region: "sgp1",
        },
    ];

    return (
        <AppLayout title="Servers">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-semibold">Servers</h1>
                <button className="px-3 py-1.5 text-xs rounded-md bg-sky-600 hover:bg-sky-500 text-white">
                    + Add Server (UI only)
                </button>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-900/90 border-b border-slate-800">
                        <tr>
                            <Th>Name</Th>
                            <Th>Host</Th>
                            <Th>Provider</Th>
                            <Th>Sites</Th>
                            <Th>Status</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {servers.map((server, idx) => (
                            <tr
                                key={server.id}
                                className={
                                    idx % 2 === 0
                                        ? "bg-slate-900"
                                        : "bg-slate-950"
                                }
                            >
                                <Td>
                                    <Link
                                        href={`/servers/${server.id}`}
                                        className="text-sky-300 hover:underline"
                                    >
                                        {server.name}
                                    </Link>
                                    <div className="text-xs text-slate-500">
                                        {server.region} · {server.provider}
                                    </div>
                                </Td>
                                <Td>{server.host}</Td>
                                <Td>{server.provider}</Td>
                                <Td>{server.sites_count}</Td>
                                <Td>
                                    <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-400/30">
                                        ● Online
                                    </span>
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
        <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">
            {children}
        </th>
    );
}

function Td({ children }) {
    return (
        <td className="px-4 py-2 align-middle text-slate-100">{children}</td>
    );
}
