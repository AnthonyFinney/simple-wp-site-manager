// resources/js/Pages/Servers/Edit.jsx
import AppLayout from "../../Layouts/AppLayout";
import { Link, router, useForm } from "@inertiajs/react";
import {
    card,
    dangerButton,
    ghostButton,
    input as inputClass,
    label as labelClass,
    muted,
    primaryButton,
} from "../../theme";

export default function ServerEdit({ server, statusOptions = [] }) {
    const { data, setData, put, delete: destroy, processing, errors } = useForm({
        name: server?.name ?? "",
        provider: server?.provider ?? "",
        host: server?.host ?? "",
        region: server?.region ?? "",
        os: server?.os ?? "",
        memory: server?.memory ?? "",
        disk: server?.disk ?? "",
        ssh_user: server?.ssh_user ?? "root",
        ssh_port: server?.ssh_port ?? 22,
        ssh_auth_type: server?.ssh_auth_type ?? "key",
        ssh_private_key: server?.ssh_private_key ?? "",
        ssh_password: server?.ssh_password ?? "",
        requires_sudo: server?.requires_sudo ?? true,
        docker_bin_path: server?.docker_bin_path ?? "/usr/bin/docker",
        ip_addresses: server?.ip_addresses ?? [],
        status: server?.status ?? "online",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!server?.id) return;
        put(`/servers/${server.id}`, {
            preserveScroll: false,
            onSuccess: () => {
                router.visit(`/servers/${server.id}`);
            },
        });
    };

    const handleDelete = () => {
        if (!server?.id) return;
        if (!confirm("Delete this server from inventory?")) return;
        destroy(`/servers/${server.id}`, {
            preserveScroll: false,
            onSuccess: () => router.visit("/servers"),
        });
    };

    const setIpAddresses = (value) => {
        const entries = value
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);
        setData("ip_addresses", entries);
    };

    const statusChoices =
        statusOptions.length > 0 ? statusOptions : ["online", "offline", "maintenance"];

    return (
        <AppLayout title={`Edit Server · ${server?.name ?? "Server"}`}>
            <div className="max-w-3xl">
                <div className="mb-6">
                    <p className={labelClass}>Edit</p>
                    <h1 className="text-2xl font-semibold text-white">
                        {server?.name || "Server"}
                    </h1>
                    <p className={`${muted} text-sm`}>
                        Update connection details, metadata, or remove the host from management.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className={`${card} p-6 space-y-5`}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Server Name" error={errors.name}>
                            <input
                                name="name"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                placeholder="Main VPS"
                                className={`${inputClass} mt-2`}
                            />
                        </Field>
                        <Field label="Provider" error={errors.provider}>
                            <input
                                name="provider"
                                value={data.provider}
                                onChange={(e) => setData("provider", e.target.value)}
                                placeholder="Hetzner, DO, AWS"
                                className={`${inputClass} mt-2`}
                            />
                        </Field>
                        <Field label="Host / Public IP" error={errors.host}>
                            <input
                                name="host"
                                value={data.host}
                                onChange={(e) => setData("host", e.target.value)}
                                placeholder="203.0.113.5"
                                className={`${inputClass} mt-2`}
                            />
                        </Field>
                        <Field label="Region" error={errors.region}>
                            <input
                                name="region"
                                value={data.region}
                                onChange={(e) => setData("region", e.target.value)}
                                placeholder="fsn1"
                                className={`${inputClass} mt-2`}
                            />
                        </Field>
                        <Field label="OS" error={errors.os}>
                            <input
                                name="os"
                                value={data.os}
                                onChange={(e) => setData("os", e.target.value)}
                                placeholder="Ubuntu 24.04 LTS"
                                className={`${inputClass} mt-2`}
                            />
                        </Field>
                        <Field label="Memory" error={errors.memory}>
                            <input
                                name="memory"
                                value={data.memory}
                                onChange={(e) => setData("memory", e.target.value)}
                                placeholder="8 GB"
                                className={`${inputClass} mt-2`}
                            />
                        </Field>
                        <Field label="Disk" error={errors.disk}>
                            <input
                                name="disk"
                                value={data.disk}
                                onChange={(e) => setData("disk", e.target.value)}
                                placeholder="160 GB NVMe"
                                className={`${inputClass} mt-2`}
                            />
                        </Field>
                        <Field label="Status" error={errors.status}>
                            <select
                                name="status"
                                value={data.status}
                                onChange={(e) => setData("status", e.target.value)}
                                className={`${inputClass} mt-2`}
                            >
                                {statusChoices.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="SSH User" error={errors.ssh_user}>
                            <input
                                name="ssh_user"
                                value={data.ssh_user}
                                onChange={(e) => setData("ssh_user", e.target.value)}
                                placeholder="root"
                                className={`${inputClass} mt-2`}
                            />
                        </Field>
                        <Field label="SSH Port" error={errors.ssh_port}>
                            <input
                                name="ssh_port"
                                type="number"
                                value={data.ssh_port}
                                onChange={(e) => setData("ssh_port", e.target.value)}
                                placeholder="22"
                                className={`${inputClass} mt-2`}
                            />
                        </Field>
                        <Field label="SSH Auth" error={errors.ssh_auth_type}>
                            <select
                                name="ssh_auth_type"
                                value={data.ssh_auth_type}
                                onChange={(e) => setData("ssh_auth_type", e.target.value)}
                                className={`${inputClass} mt-2`}
                            >
                                <option value="key">Key</option>
                                <option value="password">Password</option>
                            </select>
                        </Field>
                        <Field label="Requires sudo" error={errors.requires_sudo}>
                            <select
                                name="requires_sudo"
                                value={data.requires_sudo ? "1" : "0"}
                                onChange={(e) => setData("requires_sudo", e.target.value === "1")}
                                className={`${inputClass} mt-2`}
                            >
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </select>
                        </Field>
                    </div>

                    <div>
                        <label className={`${labelClass} block mb-2`}>
                            SSH Private Key
                            {errors.ssh_private_key && (
                                <span className="text-red-400 text-[10px] ml-2 normal-case">
                                    {errors.ssh_private_key}
                                </span>
                            )}
                        </label>
                        <textarea
                            name="ssh_private_key"
                            rows={4}
                            value={data.ssh_private_key}
                            onChange={(e) => setData("ssh_private_key", e.target.value)}
                            className={`${inputClass} min-h-[120px]`}
                            placeholder="-----BEGIN PRIVATE KEY-----"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="SSH Password (if using password auth)" error={errors.ssh_password}>
                            <input
                                name="ssh_password"
                                type="password"
                                value={data.ssh_password}
                                onChange={(e) => setData("ssh_password", e.target.value)}
                                className={`${inputClass} mt-2`}
                            />
                        </Field>
                        <Field label="Docker binary path" error={errors.docker_bin_path}>
                            <input
                                name="docker_bin_path"
                                value={data.docker_bin_path}
                                onChange={(e) => setData("docker_bin_path", e.target.value)}
                                className={`${inputClass} mt-2`}
                            />
                        </Field>
                    </div>

                    <div>
                        <label className={`${labelClass} block mb-2`}>
                            IP Addresses (one per line)
                            {errors.ip_addresses && (
                                <span className="text-red-400 text-[10px] ml-2 normal-case">
                                    {errors.ip_addresses}
                                </span>
                            )}
                        </label>
                        <textarea
                            name="ip_addresses"
                            rows={3}
                            value={(data.ip_addresses || []).join("\n")}
                            onChange={(e) => setIpAddresses(e.target.value)}
                            className={`${inputClass} min-h-[100px]`}
                            placeholder={"203.0.113.5\n10.0.0.5"}
                        />
                    </div>

                    <div className="pt-2 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleDelete}
                                className={dangerButton}
                                disabled={processing}
                            >
                                Delete Server
                            </button>
                            <p className={`${muted} text-xs`}>
                                Removing a server also deletes its sites and backups via cascading. No remote actions are executed.
                            </p>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Link
                                href={`/servers/${server?.id ?? ""}`}
                                className={ghostButton}
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className={primaryButton}
                            >
                                {processing ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

function Field({ label, children, error }) {
    return (
        <label className={labelClass}>
            <div className="flex items-center justify-between">
                <span>{label}</span>
                {error && (
                    <span className="text-red-400 text-[10px] normal-case">
                        {error}
                    </span>
                )}
            </div>
            {children}
        </label>
    );
}
