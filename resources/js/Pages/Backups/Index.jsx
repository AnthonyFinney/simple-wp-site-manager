// resources/js/Pages/Backups/Index.jsx
import AppLayout from "../../Layouts/AppLayout";
import { Link } from "@inertiajs/react";

export default function BackupsIndex() {
    const backups = [
        {
            id: 1,
            site: { id: 1, domain: "blog.example.com" },
            created_at: "2025-01-19 10:23",
            size: "450 MB",
            status: "Completed",
        },
        {
            id: 2,
            site: { id: 2, domain: "shop.example.com" },
            created_at: "2025-01-18 09:01",
            size: "430 MB",
            status: "Completed",
        },
        {
            id: 3,
            site: { id: 3, domain: "dev.example.com" },
            created_at: "2025-01-17 14:55",
            size: "410 MB",
            status: "Failed",
        },
    ];

    return (
        <AppLayout title="Backups">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-500">
                        Safety
                    </p>
                    <h1 className="text-2xl font-bold text-neutral-50">Backups</h1>
                </div>
                <button className="px-4 py-2 text-xs uppercase tracking-[0.2em] rounded-md bg-red-600 hover:bg-red-500 text-white shadow-sm">
                    Create backup
                </button>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
                <table className="min-w-full text-sm">
                    <thead className="bg-neutral-900 border-b border-neutral-800">
                        <tr>
                            <Th>Site</Th>
                            <Th>Created</Th>
                            <Th>Size</Th>
                            <Th>Status</Th>
                            <Th className="text-right">Actions</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {backups.map((backup, idx) => (
                            <tr
                                key={backup.id}
                                className={idx % 2 === 0 ? "bg-neutral-950" : "bg-neutral-900"}
                            >
                                <Td>
                                    <Link
                                        href={`/sites/${backup.site.id}`}
                                        className="font-semibold text-neutral-100 hover:text-red-400"
                                    >
                                        {backup.site.domain}
                                    </Link>
                                </Td>
                                <Td>{backup.created_at}</Td>
                                <Td>{backup.size}</Td>
                                <Td>
                                    <StatusBadge status={backup.status} />
                                </Td>
                                <Td className="text-right space-x-3">
                                    <button className="text-[11px] uppercase tracking-[0.2em] text-red-300 hover:underline">
                                        Download
                                    </button>
                                    <button className="text-[11px] uppercase tracking-[0.2em] text-emerald-300 hover:underline">
                                        Restore
                                    </button>
                                    <button className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 hover:underline">
                                        Delete
                                    </button>
                                </Td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}

function Th({ children, className = "" }) {
    return (
        <th
            className={`px-4 py-3 text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.25em] ${className}`}
        >
            {children}
        </th>
    );
}

function Td({ children, className = "" }) {
    return <td className={`px-4 py-3 align-middle text-neutral-100 ${className}`}>{children}</td>;
}

function StatusBadge({ status }) {
    const normalized = status.toLowerCase();
    const isGood = normalized === "completed" || normalized === "success";
    const color = isGood
        ? "bg-emerald-900/40 text-emerald-200 border border-emerald-800"
        : "bg-red-900/40 text-red-200 border border-red-800";

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.2em] ${color}`}>
            ● {status}
        </span>
    );
}
