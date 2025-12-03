// resources/js/Pages/Sites/Edit.jsx
import AppLayout from "../../Layouts/AppLayout";
import { Link, useForm, router } from "@inertiajs/react";
import {
    card,
    ghostButton,
    input as inputClass,
    label as labelClass,
    muted,
    primaryButton,
} from "../../theme";

export default function SiteEdit({ site, servers = [], statusOptions = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        server_id: site?.server_id ?? "",
        domain: site?.domain ?? "",
        http_port: site?.http_port ?? "",
        php_version: site?.php_version ?? "",
        docker_image: site?.docker_image ?? "",
        project_path: site?.project_path ?? "",
        container_name: site?.container_name ?? "",
        status: site?.status ?? "running",
        wp_admin_email: site?.wp_admin_email ?? "",
        wp_admin_user: site?.wp_admin_user ?? "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/sites/${site?.id}`, {
            preserveScroll: false,
            preserveState: false,
            onSuccess: () => {
                if (site?.id) {
                    router.visit(`/sites/${site.id}`, {
                        replace: true,
                        preserveScroll: false,
                        preserveState: false,
                        onError: () => {
                            window.location.assign(`/sites/${site.id}`);
                        },
                    });
                }
            },
        });
    };

    return (
        <AppLayout title={`Edit Site · ${site?.domain ?? "Site"}`}>
            <div className="max-w-3xl">
                <div className="mb-6">
                    <p className={labelClass}>Settings</p>
                    <h1 className="text-2xl font-semibold text-white">{site?.domain}</h1>
                    <p className={`${muted} text-sm`}>
                        Adjust runtime ports, container metadata, and admin credentials.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className={`${card} p-6 space-y-5`}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Domain" error={errors.domain}>
                            <input
                                name="domain"
                                value={data.domain}
                                onChange={(e) => setData("domain", e.target.value)}
                                className={`${inputClass} mt-2`}
                            />
                        </Field>

                        <Field label="Host Port (unique per server)" error={errors.http_port}>
                            <input
                                name="http_port"
                                type="number"
                                value={data.http_port}
                                onChange={(e) => setData("http_port", e.target.value)}
                                className={`${inputClass} mt-2`}
                            />
                        </Field>

                        <Field label="Server" error={errors.server_id}>
                            <select
                                name="server_id"
                                value={data.server_id}
                                onChange={(e) => setData("server_id", e.target.value)}
                                className={`${inputClass} mt-2`}
                            >
                                {servers.map((srv) => (
                                    <option key={srv.id} value={srv.id}>
                                        {srv.name} ({srv.host})
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="PHP Version" error={errors.php_version}>
                            <input
                                name="php_version"
                                value={data.php_version}
                                onChange={(e) => setData("php_version", e.target.value)}
                                className={`${inputClass} mt-2`}
                            />
                        </Field>

                        <Field label="Docker Image" error={errors.docker_image}>
                            <input
                                name="docker_image"
                                value={data.docker_image}
                                onChange={(e) => setData("docker_image", e.target.value)}
                                className={`${inputClass} mt-2`}
                            />
                        </Field>

                        <Field label="Project Path" error={errors.project_path}>
                            <input
                                name="project_path"
                                value={data.project_path}
                                onChange={(e) => setData("project_path", e.target.value)}
                                className={`${inputClass} mt-2`}
                            />
                        </Field>

                        <Field label="Container Name" error={errors.container_name}>
                            <input
                                name="container_name"
                                value={data.container_name}
                                onChange={(e) => setData("container_name", e.target.value)}
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
                                {(statusOptions.length ? statusOptions : ["running", "stopped", "deploying", "failed"]).map(
                                    (opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    )
                                )}
                            </select>
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Admin Email" error={errors.wp_admin_email}>
                            <input
                                name="wp_admin_email"
                                value={data.wp_admin_email}
                                onChange={(e) => setData("wp_admin_email", e.target.value)}
                                className={`${inputClass} mt-2`}
                            />
                        </Field>
                        <Field label="Admin Username" error={errors.wp_admin_user}>
                            <input
                                name="wp_admin_user"
                                value={data.wp_admin_user}
                                onChange={(e) => setData("wp_admin_user", e.target.value)}
                                className={`${inputClass} mt-2`}
                            />
                        </Field>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                        <Link
                            href={`/sites/${site?.id ?? ""}`}
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
