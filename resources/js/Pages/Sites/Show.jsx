// resources/js/Pages/Sites/Show.jsx
import AppLayout from "../../Layouts/AppLayout";
import { Link, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import { card, ghostButton, label, muted, pill, softCard } from "../../theme";

export default function SiteShow({ site }) {
    const safe = site ?? {};
    const backups = site?.backups ?? [];
    const { post, processing } = useForm({});
    const [action, setAction] = useState("");
    const [restoringId, setRestoringId] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const triggerBackup = () => {
        if (!safe.id) return;
        post(`/sites/${safe.id}/backups`, { preserveScroll: true });
    };

    const runAction = (label, path, method = "post", data = {}) => {
        if (!safe.id || !path) return;
        setAction(label);
        const opts = {
            preserveScroll: true,
            data,
            method,
            onSuccess: () => {
                setAction("");
                router.reload({ only: ["site"] });
            },
            onError: () => setAction(""),
            onCancel: () => setAction(""),
            onFinish: () => setAction(""),
        };

        router.visit(path, opts);
    };

    const deleteUrl =
        site?.delete_url || (safe.id ? `/sites/${safe.id}` : null);

    const deleteSite = () => {
        if (!safe.id) return;
        if (!confirm("Delete this site and queue container cleanup?")) return;

        setAction("Deleting...");
        router.visit("/sites", {
            method: "delete",
            data: { id: safe.id },
            replace: true,
            preserveState: false,
            preserveScroll: false,
            onSuccess: () => {
                window.location.href = "/sites";
            },
            onError: () => {
                window.location.href = "/sites";
            },
            onFinish: () => {
                setAction("");
                window.location.href = "/sites";
            },
        });
    };

    const restoreBackup = (backup) => {
        if (!backup?.id || !safe.id) return;
        setRestoringId(backup.id);
        router.post(
            `/sites/${safe.id}/backups/${backup.id}/restore`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setRestoringId(null),
            }
        );
    };

    const refreshBackups = () => {
        if (!safe.id) return;
        setRefreshing(true);
        router.reload({
            only: ["site"],
            onFinish: () => setRefreshing(false),
        });
    };

    return (
        <AppLayout title={`Site · ${safe.domain}`}>
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-6">
                    <div className={`${card} p-6`}>
                        <p className={label}>Site</p>
                        <h1 className="text-2xl font-semibold mt-1 text-white">
                            {safe.domain}
                        </h1>
                        <p className={`${muted} text-sm mt-2`}>
                            Hosted on{" "}
                            <span className="text-white">
                                {safe.server?.name}
                            </span>{" "}
                            · PHP {safe.php_version} · Port{" "}
                            {safe.http_port || 80}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2 text-sm">
                            <StatusBadge status={safe.status} />
                            <a
                                href={buildUrl(safe.domain, safe.http_port)}
                                target="_blank"
                                rel="noreferrer"
                                className={ghostButton}
                            >
                                Visit Site
                            </a>
                            <a
                                href={`${buildUrl(
                                    safe.domain,
                                    safe.http_port
                                )}/wp-admin`}
                                target="_blank"
                                rel="noreferrer"
                                className={ghostButton}
                            >
                                Open WP Admin
                            </a>
                            <Link
                                href={`/sites/${safe.id}/edit`}
                                className={ghostButton}
                            >
                                Edit settings
                            </Link>
                        </div>
                    </div>

                    <div className={`${card} p-6`}>
                        <h2 className={label}>Quick Actions</h2>
                        <p className={`${muted} text-sm mb-4`}>
                            Manage containers, redeploy, or request a backup.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <ActionButton
                                label="Start site"
                                onClick={() =>
                                    runAction(
                                        "Starting...",
                                        `/sites/${safe.id}/actions/start`
                                    )
                                }
                                disabled={!!action}
                            />
                            <ActionButton
                                label="Stop site"
                                onClick={() =>
                                    runAction(
                                        "Stopping...",
                                        `/sites/${safe.id}/actions/stop`
                                    )
                                }
                                disabled={!!action}
                            />
                            <ActionButton
                                label="Restart containers"
                                onClick={() =>
                                    runAction(
                                        "Restarting...",
                                        `/sites/${safe.id}/actions/restart`
                                    )
                                }
                                disabled={!!action}
                            />
                            <ActionButton
                                label={
                                    processing
                                        ? "Backing up..."
                                        : "Run backup now"
                                }
                                onClick={triggerBackup}
                                disabled={processing || !!action}
                            />
                            <ActionButton
                                label="Redeploy"
                                onClick={() =>
                                    runAction(
                                        "Redeploying...",
                                        `/sites/${safe.id}/actions/redeploy`
                                    )
                                }
                                disabled={!!action}
                            />
                            <ActionButton
                                label="Delete site (danger)"
                                danger
                                onClick={deleteSite}
                                disabled={!!action || !deleteUrl}
                            />
                            <div
                                className={`${muted} text-[11px] uppercase tracking-[0.14em]`}
                            >
                                {action}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`${card} w-full lg:w-80 p-5`}>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className={label}>Backups</h2>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={refreshBackups}
                                disabled={refreshing}
                                className="text-sm text-slate-300 hover:text-white disabled:opacity-60"
                            >
                                {refreshing ? "Refreshing..." : "Refresh"}
                            </button>
                            <button
                                onClick={triggerBackup}
                                disabled={processing}
                                className="text-sm text-cyan-300 hover:text-white disabled:opacity-60"
                            >
                                Create backup
                            </button>
                        </div>
                    </div>
                    <ul className="space-y-2 text-xs">
                        {backups.map((b) => (
                            <li
                                key={b.id}
                                className={`${softCard} flex items-center justify-between px-3 py-3`}
                            >
                                <div className="flex-1">
                                    <p className="text-white font-semibold">
                                        {formatSize(b.size)}
                                    </p>
                                    <p
                                        className={`${muted} flex items-center gap-2`}
                                    >
                                        <span>
                                            {formatDate(
                                                b.snapshot_at ||
                                                    b.started_at ||
                                                    b.created_at
                                            )}
                                        </span>
                                        <StatusBadge status={b.status} />
                                    </p>
                                    {b.log && (
                                        <p
                                            className={`${muted} mt-1 line-clamp-2`}
                                        >
                                            {b.log}
                                        </p>
                                    )}
                                </div>
                                {b.archive_path ? (
                                    <div className="flex flex-col items-end gap-1">
                                        <Link
                                            href={`/sites/${safe.id}/backups/${b.id}/download`}
                                            className="text-cyan-300 text-[11px] uppercase tracking-[0.14em] hover:underline"
                                        >
                                            Download
                                        </Link>
                                        <button
                                            onClick={() => restoreBackup(b)}
                                            disabled={restoringId === b.id}
                                            className="text-emerald-300 text-[11px] uppercase tracking-[0.14em] hover:underline disabled:opacity-60"
                                        >
                                            {restoringId === b.id
                                                ? "Restoring..."
                                                : "Restore"}
                                        </button>
                                    </div>
                                ) : (
                                    <span className="text-slate-500 text-[11px] uppercase tracking-[0.14em]">
                                        Pending
                                    </span>
                                )}
                            </li>
                        ))}
                        {backups.length === 0 && (
                            <li
                                className={`${softCard} px-3 py-3 text-slate-400 text-[12px]`}
                            >
                                No backups yet.
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </AppLayout>
    );
}

function StatusBadge({ status }) {
    const normalized = (status || "").toLowerCase();
    const isGood =
        normalized === "running" ||
        normalized === "online" ||
        normalized === "completed" ||
        normalized === "success";
    const isPending =
        normalized === "queued" ||
        normalized === "pending" ||
        normalized === "starting";

    const color = isGood
        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
        : isPending
        ? "border-amber-500/30 bg-amber-500/10 text-amber-100"
        : "border-rose-500/30 bg-rose-500/10 text-rose-200";

    return (
        <span className={`${pill} border ${color} px-3 py-1`}>
            ● {status || "Unknown"}
        </span>
    );
}

function ActionButton({ label, danger, onClick, disabled = false }) {
    const classes = danger
        ? "border-rose-500/30 bg-rose-500/5 text-rose-100 hover:border-rose-400/60"
        : "border-slate-700/60 bg-slate-900/60 text-slate-100 hover:border-cyan-400/50";

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${softCard} px-3 py-3 text-left border text-sm font-semibold ${classes} disabled:opacity-60`}
        >
            {label}
        </button>
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

function buildUrl(domain, port) {
    if (!domain) return "#";
    const normalizedPort = port && Number(port) !== 80 ? `:${port}` : "";
    return `https://${domain}${normalizedPort}`;
}
