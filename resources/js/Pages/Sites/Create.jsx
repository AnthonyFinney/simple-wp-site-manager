// resources/js/Pages/Sites/Create.jsx
import AppLayout from "../../Layouts/AppLayout";
import { Link, useForm } from "@inertiajs/react";
import {
    card,
    ghostButton,
    input as inputClass,
    label as labelClass,
    muted,
    primaryButton,
} from "../../theme";

export default function CreateSite({ servers = [], statusOptions = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        server_id: servers[0]?.id ?? "",
        domain: "",
        http_port: "",
        php_version: "8.2",
        docker_image: "wordpress:php8.2-fpm",
        wp_admin_email: "",
        wp_admin_user: "admin",
        status: "deploying",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/sites", { preserveScroll: true });
    };

    return (
        <AppLayout title="New WordPress Site">
            <div className="max-w-2xl">
                <div className="mb-6">
                    <p className={labelClass}>Create</p>
                    <h1 className="text-2xl font-semibold text-white">New WordPress Site</h1>
                    <p className={`${muted} text-sm`}>
                        Choose a server and bootstrap a WordPress container.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className={`${card} p-6 space-y-4`}
                >
                    <div className="grid grid-cols-1 gap-4">
                        <Field label="Server" error={errors.server_id}>
                            <select
                                name="server_id"
                                value={data.server_id}
                                onChange={(e) => setData("server_id", e.target.value)}
                                className={`${inputClass} mt-2`}
                            >
                                {servers.map((server) => (
                                    <option key={server.id} value={server.id}>
                                        {server.name} ({server.host})
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Domain" error={errors.domain}>
                            <input
                                name="domain"
                                type="text"
                                placeholder="example.com"
                                value={data.domain}
                                onChange={(e) => setData("domain", e.target.value)}
                                className={`${inputClass} mt-2`}
                            />
                        </Field>

                        <Field label="Host Port (unique per server)" error={errors.http_port}>
                            <input
                                name="http_port"
                                type="number"
                                placeholder="8080"
                                value={data.http_port}
                                onChange={(e) => setData("http_port", e.target.value)}
                                className={`${inputClass} mt-2`}
                            />
                        </Field>

                        <Field label="PHP Version" error={errors.php_version}>
                            <input
                                name="php_version"
                                type="text"
                                value={data.php_version}
                                onChange={(e) => setData("php_version", e.target.value)}
                                className={`${inputClass} mt-2`}
                            />
                        </Field>

                        <Field label="Docker Image" error={errors.docker_image}>
                            <input
                                name="docker_image"
                                type="text"
                                value={data.docker_image}
                                onChange={(e) => setData("docker_image", e.target.value)}
                                className={`${inputClass} mt-2`}
                            />
                        </Field>

                        <Field label="Admin Email" error={errors.wp_admin_email}>
                            <input
                                name="wp_admin_email"
                                type="email"
                                placeholder="you@example.com"
                                value={data.wp_admin_email}
                                onChange={(e) => setData("wp_admin_email", e.target.value)}
                                className={`${inputClass} mt-2`}
                            />
                        </Field>

                        <Field label="Admin Username" error={errors.wp_admin_user}>
                            <input
                                name="wp_admin_user"
                                type="text"
                                value={data.wp_admin_user}
                                onChange={(e) => setData("wp_admin_user", e.target.value)}
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
                                {(statusOptions.length ? statusOptions : ["deploying", "running", "stopped", "failed"]).map(
                                    (opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    )
                                )}
                            </select>
                        </Field>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                        <Link
                            href="/sites"
                            className={ghostButton}
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className={primaryButton}
                        >
                            {processing ? "Saving..." : "Create Site"}
                        </button>
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
                {error && <span className="text-red-400 text-[10px] normal-case">{error}</span>}
            </div>
            {children}
        </label>
    );
}
