// resources/js/Pages/Sites/Edit.jsx
import AppLayout from "../../Layouts/AppLayout";

export default function SiteEdit({ siteId }) {
    // Placeholder: normally fetch current settings from props/backend.
    const site = {
        id: siteId ?? 1,
        domain: "blog.example.com",
        server: "Main VPS",
        phpVersion: "8.2",
        cache: "redis",
        maintenance: false,
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        console.log("Save site settings (dummy):", data);
        alert("Saved (frontend-only). Wire to backend later.");
    };

    return (
        <AppLayout title={`Edit Site · ${site.domain}`}>
            <div className="max-w-3xl">
                <div className="mb-6">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-500">
                        Settings
                    </p>
                    <h1 className="text-2xl font-bold text-neutral-50">{site.domain}</h1>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-5 shadow-sm"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Domain" name="domain" defaultValue={site.domain} />
                        <Field label="Server" name="server" defaultValue={site.server} />
                        <Field label="PHP Version" name="php_version" defaultValue={site.phpVersion} />
                        <Field label="Cache Driver" name="cache" defaultValue={site.cache} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Toggle label="Maintenance mode" name="maintenance" defaultChecked={site.maintenance} />
                        <Toggle label="Auto renew SSL" name="auto_ssl" defaultChecked />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <ActionButton label="Restart containers" />
                        <ActionButton label="Purge cache" />
                        <ActionButton label="Re-issue SSL" />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                        <button
                            type="button"
                            className="px-4 py-2 text-xs uppercase tracking-[0.2em] rounded-md border border-neutral-700 text-neutral-200 hover:border-neutral-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-xs uppercase tracking-[0.2em] rounded-md bg-red-600 hover:bg-red-500 text-white shadow-sm"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

function Field({ label, name, defaultValue }) {
    return (
        <label className="text-[11px] uppercase tracking-[0.2em] text-neutral-400">
            {label}
            <input
                name={name}
                defaultValue={defaultValue}
                className="mt-2 block w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 focus:border-red-500 focus:ring-0"
            />
        </label>
    );
}

function Toggle({ label, name, defaultChecked }) {
    return (
        <label className="flex items-center gap-2 text-xs text-neutral-300">
            <input type="checkbox" name={name} defaultChecked={defaultChecked} />
            <span className="uppercase tracking-[0.15em] text-[11px]">{label}</span>
        </label>
    );
}

function ActionButton({ label }) {
    return (
        <button className="px-3 py-3 rounded-md border border-neutral-700 text-neutral-200 hover:border-neutral-500 text-left uppercase tracking-[0.2em] text-[11px]">
            {label}
        </button>
    );
}
