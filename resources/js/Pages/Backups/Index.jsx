// resources/js/Pages/Backups/Index.jsx
import AppLayout from "../../Layouts/AppLayout";
import { Link, router, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function BackupsIndex({ site, backups = [] }) {
    const { post, processing } = useForm({});
    const [deletingId, setDeletingId] = useState(null);
    const [deleteError, setDeleteError] = useState("");
    const hasSiteContext = !!site;

    const triggerBackup = () => {
        if (!site?.id) return;
        post(`/sites/${site.id}/backups`, { preserveScroll: true });
    };

    const deleteBackup = (backup) => {
        if (!backup || !backup.id) {
            console.error("Backup has no id, cannot delete", backup);
            return;
        }

        // Prefer backend-provided delete URL so it respects site/global context.
        const fallbackSiteId = backup.site_id ?? backup?.site?.id ?? site?.id;
        const path =
            backup.delete_url ||
            (fallbackSiteId
                ? `/sites/${fallbackSiteId}/backups/${backup.id}`
                : `/backups/${backup.id}`);

        if (!path) {
            console.error("No delete path resolved for backup", backup);
            return;
        }

        setDeleteError("");
        setDeletingId(backup.id);

        router.delete(
            path,
            {},
            {
                preserveScroll: true,
                onError: () =>
                    setDeleteError("Failed to delete backup. Please retry."),
                onSuccess: () => {
                    setDeleteError("");
                    router.reload({ only: ["backups"] });
                },
                onFinish: () => setDeletingId(null),
            }
        );
    };

    const resolveDownloadUrl = (backup) => {
        if (backup.download_url) return backup.download_url;
        if (backup.site_id && backup.archive_path) {
            return `/sites/${backup.site_id}/backups/${backup.id}/download`;
        }
        return null;
    };

    return (
        <AppLayout title={`Backups · ${site?.domain ?? "Site"}`}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-500">
                        Safety
                    </p>
                    <h1 className="text-2xl font-bold text-neutral-50">
                        {hasSiteContext
                            ? `Backups for ${site?.domain}`
                            : "All Backups"}
                    </h1>
                </div>
                <button
                    onClick={triggerBackup}
                    disabled={processing || !site?.id}
                    className="px-4 py-2 text-xs uppercase tracking-[0.2em] rounded-md bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white shadow-sm"
                >
                    Create backup
                </button>
            </div>

            {deleteError && (
                <div className="mb-4 px-4 py-3 rounded-md border border-red-800 bg-red-900/40 text-sm text-red-100">
                    {deleteError}
                </div>
            )}

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
                {!hasSiteContext && (
                    <div className="p-6 text-sm text-neutral-400">
                        Showing backups across all sites.
                    </div>
                )}
                <table className="min-w-full text-sm">
                    <thead className="bg-neutral-900 border-b border-neutral-800">
                        <tr>
                            <Th>Site</Th>
                            <Th>Server</Th>
                            <Th>Created</Th>
                            <Th>Type</Th>
                            <Th>Size</Th>
                            <Th>Status</Th>
                            <Th className="text-right">Actions</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {backups.map((backup, idx) => {
                            const siteId =
                                backup.site_id ??
                                backup?.site?.id ??
                                site?.id ??
                                null;
                            const siteDomain =
                                site?.domain ??
                                backup?.site?.domain ??
                                "Unknown site";
                            const serverName = backup?.server?.name ?? "—";
                            return (
                                <tr
                                    key={backup.id}
                                    className={`${
                                        idx % 2 === 0
                                            ? "bg-neutral-950"
                                            : "bg-neutral-900"
                                    } ${
                                        deletingId === backup.id
                                            ? "opacity-60"
                                            : ""
                                    }`}
                                >
                                    <Td>
                                        {siteId ? (
                                            <Link
                                                href={`/sites/${siteId}`}
                                                className="font-semibold text-neutral-100 hover:text-red-400"
                                            >
                                                {siteDomain}
                                            </Link>
                                        ) : (
                                            siteDomain
                                        )}
                                    </Td>
                                    <Td>{serverName}</Td>
                                    <Td>
                                        {formatDate(
                                            backup.snapshot_at ||
                                                backup.started_at ||
                                                backup.created_at
                                        )}
                                    </Td>
                                    <Td className="uppercase tracking-[0.15em] text-[11px] text-neutral-300">
                                        {backup.type}
                                    </Td>
                                    <Td>{formatSize(backup.size)}</Td>
                                    <Td>
                                        <StatusBadge status={backup.status} />
                                    </Td>
                                    <Td className="text-right space-x-3">
                                        {resolveDownloadUrl(backup) ? (
                                            <Link
                                                href={resolveDownloadUrl(backup)}
                                                className="text-[11px] uppercase tracking-[0.2em] text-red-300 hover:underline"
                                            >
                                                Download
                                            </Link>
                                        ) : (
                                            <span className="text-[11px] uppercase tracking-[0.2em] text-neutral-600">
                                                Pending
                                            </span>
                                        )}
                                        {backup.id && (
                                            <button
                                                onClick={() =>
                                                    deleteBackup(backup)
                                                }
                                                disabled={
                                                    deletingId === backup.id
                                                }
                                                className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 hover:underline disabled:opacity-60"
                                            >
                                                {deletingId === backup.id
                                                    ? "Deleting..."
                                                    : "Delete"}
                                            </button>
                                        )}
                                    </Td>
                                </tr>
                            );
                        })}
                        {backups.length === 0 && (
                            <tr>
                                <Td
                                    colSpan={5}
                                    className="text-center text-neutral-500"
                                >
                                    No backups yet.
                                </Td>
                            </tr>
                        )}
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

function Td({ children, className = "", colSpan }) {
    return (
        <td
            colSpan={colSpan}
            className={`px-4 py-3 align-middle text-neutral-100 ${className}`}
        >
            {children}
        </td>
    );
}

function StatusBadge({ status }) {
    const normalized = (status || "").toLowerCase();
    const isGood = normalized === "completed" || normalized === "success";
    const isRunning = normalized === "running" || normalized === "queued";

    const color = isGood
        ? "bg-emerald-900/40 text-emerald-200 border border-emerald-800"
        : isRunning
        ? "bg-amber-900/40 text-amber-100 border border-amber-800"
        : "bg-red-900/40 text-red-200 border border-red-800";

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.2em] ${color}`}
        >
            ● {status}
        </span>
    );
}

function formatSize(bytes) {
    if (!bytes && bytes !== 0) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value) {
    if (!value) return "—";
    const date = new Date(value);
    return isNaN(date.getTime()) ? value : date.toLocaleString();
}
