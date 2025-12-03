// resources/js/Pages/Backups/Index.jsx
import AppLayout from "../../Layouts/AppLayout";
import { Link, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import {
    card,
    ghostButton,
    label,
    muted,
    primaryButton,
    tableCell,
    tableHeader,
} from "../../theme";

export default function BackupsIndex({ site, backups = [] }) {
    const { post, processing } = useForm({});
    const [deletingId, setDeletingId] = useState(null);
    const [restoringId, setRestoringId] = useState(null);
    const [deleteError, setDeleteError] = useState("");
    const [refreshing, setRefreshing] = useState(false);
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

    const restoreBackup = (backup) => {
        if (!backup?.id || !backup.site_id) return;
        setRestoringId(backup.id);
        router.post(
            `/sites/${backup.site_id}/backups/${backup.id}/restore`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setRestoringId(null),
            }
        );
    };

    const refresh = () => {
        setRefreshing(true);
        router.reload({
            only: ["backups"],
            onFinish: () => setRefreshing(false),
        });
    };

    return (
        <AppLayout title={`Backups · ${site?.domain ?? "Site"}`}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className={label}>Safety</p>
                    <h1 className="text-2xl font-semibold text-white">
                        {hasSiteContext
                            ? `Backups for ${site?.domain}`
                            : "All Backups"}
                    </h1>
                    <p className={`${muted} text-sm`}>
                        Download, restore, or prune snapshots across your sites.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={refresh}
                        disabled={refreshing}
                        className={ghostButton}
                    >
                        {refreshing ? "Refreshing..." : "Refresh"}
                    </button>
                    <button
                        onClick={triggerBackup}
                        disabled={processing || !site?.id}
                        className={primaryButton}
                    >
                        {processing ? "Backing up..." : "Create backup"}
                    </button>
                </div>
            </div>

            {deleteError && (
                <div className="mb-4 px-4 py-3 rounded-md border border-rose-500/40 bg-rose-500/10 text-sm text-rose-50">
                    {deleteError}
                </div>
            )}

            <div className={`${card} overflow-hidden`}>
                {!hasSiteContext && (
                    <div className="p-6 text-sm text-slate-300">
                        Showing backups across all sites.
                    </div>
                )}
                <table className="min-w-full text-sm">
                    <thead className="border-b border-slate-800/70">
                        <tr>
                            <Th>Site</Th>
                            <Th>Server</Th>
                            <Th>Created</Th>
                            <Th>Type</Th>
                            <Th>Size</Th>
                            <Th>Details</Th>
                            <Th>Status</Th>
                            <Th className="text-right">Actions</Th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
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
                                            ? "bg-slate-950/40"
                                            : "bg-slate-900/40"
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
                                                className="font-semibold text-white hover:text-cyan-200"
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
                                    <Td className="uppercase tracking-[0.15em] text-[11px] text-slate-300">
                                        {backup.type}
                                    </Td>
                                    <Td>{formatSize(backup.size)}</Td>
                                    <Td className="text-slate-300 max-w-xs">
                                        {backup.log ? (
                                            <span className="line-clamp-2">
                                                {backup.log}
                                            </span>
                                        ) : (
                                            <span className="text-slate-500">
                                                No log
                                            </span>
                                        )}
                                    </Td>
                                    <Td>
                                        <StatusBadge status={backup.status} />
                                    </Td>
                                    <Td className="text-right space-x-3">
                                        {resolveDownloadUrl(backup) ? (
                                            <Link
                                                href={resolveDownloadUrl(backup)}
                                                className="text-[11px] uppercase tracking-[0.14em] text-cyan-300 hover:underline"
                                            >
                                                Download
                                            </Link>
                                        ) : (
                                            <span className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                                                Pending
                                            </span>
                                        )}
                                        {backup.archive_path && (
                                            <button
                                                onClick={() =>
                                                    restoreBackup(backup)
                                                }
                                                disabled={
                                                    restoringId === backup.id
                                                }
                                                className="text-[11px] uppercase tracking-[0.14em] text-emerald-300 hover:underline disabled:opacity-60"
                                            >
                                                {restoringId === backup.id
                                                    ? "Restoring..."
                                                    : "Restore"}
                                            </button>
                                        )}
                                        {backup.id && (
                                            <button
                                                onClick={() =>
                                                    deleteBackup(backup)
                                                }
                                                disabled={
                                                    deletingId === backup.id
                                                }
                                                className="text-[11px] uppercase tracking-[0.14em] text-slate-400 hover:underline disabled:opacity-60"
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
                                    colSpan={8}
                                    className="text-center text-slate-400"
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
            className={`${tableHeader} ${className}`}
        >
            {children}
        </th>
    );
}

function Td({ children, className = "", colSpan }) {
    return (
        <td
            colSpan={colSpan}
            className={`${tableCell} ${className}`}
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
        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
        : isRunning
        ? "border-amber-500/30 bg-amber-500/10 text-amber-100"
        : "border-rose-500/30 bg-rose-500/10 text-rose-200";

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.14em] border ${color}`}
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
