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
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-500">
                        Inventory
                    </p>
                    <h1 className="text-2xl font-bold text-neutral-50">Servers</h1>
                </div>
                <Link
                    href="/servers/create"
                    className="px-4 py-2 text-xs uppercase tracking-[0.2em] rounded-md bg-red-600 hover:bg-red-500 text-white shadow-sm"
                >
                    + Add Server
                </Link>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
                <table className="min-w-full text-sm">
                    <thead className="bg-neutral-900 border-b border-neutral-800">
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
                                className={idx % 2 === 0 ? "bg-neutral-950" : "bg-neutral-900"}
                            >
                                <Td>
                                    <Link
                                        href={`/servers/${server.id}`}
                                        className="font-semibold text-neutral-100 hover:text-red-400"
                                    >
                                        {server.name}
                                    </Link>
                                    <div className="text-xs text-neutral-500 uppercase tracking-[0.15em]">
                                        {server.region} · {server.provider}
                                    </div>
                                </Td>
                                <Td>{server.host}</Td>
                                <Td>{server.provider}</Td>
                                <Td>{server.sites_count}</Td>
                                <Td>
                                    <span className="inline-flex items-center px-2 py-0.5 text-[11px] uppercase tracking-[0.2em] rounded-full bg-emerald-900/40 text-emerald-200 border border-emerald-800">
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
        <th className="px-4 py-3 text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.25em]">
            {children}
        </th>
    );
}

function Td({ children }) {
    return (
        <td className="px-4 py-3 align-middle text-neutral-100">{children}</td>
    );
}
