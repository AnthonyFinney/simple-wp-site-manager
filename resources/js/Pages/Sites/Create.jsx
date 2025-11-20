// resources/js/Pages/Sites/Create.jsx
import AppLayout from "../../Layouts/AppLayout";

export default function CreateSite() {
    // For now, local state only, no Inertia form
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        console.log("Create site (dummy submit):", data);
        alert("Form submitted (frontend only). Backend will come later.");
    };

    return (
        <AppLayout title="New WordPress Site">
            <div className="max-w-2xl">
                <div className="mb-6">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-500">
                        Create
                    </p>
                    <h1 className="text-2xl font-bold text-neutral-50">New WordPress Site</h1>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4 shadow-sm"
                >
                    <div className="grid grid-cols-1 gap-4">
                        <Field label="Server">
                            <select
                                name="server_id"
                                className="mt-2 block w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 focus:border-red-500 focus:ring-0"
                                defaultValue="1"
                            >
                                <option value="1">Main VPS</option>
                                <option value="2">DO #1</option>
                            </select>
                        </Field>

                        <Field label="Domain">
                            <input
                                name="domain"
                                type="text"
                                placeholder="example.com"
                                className="mt-2 block w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 focus:border-red-500 focus:ring-0"
                            />
                        </Field>

                        <Field label="Site Name">
                            <input
                                name="site_name"
                                type="text"
                                placeholder="My Blog"
                                className="mt-2 block w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 focus:border-red-500 focus:ring-0"
                            />
                        </Field>

                        <Field label="Admin Email">
                            <input
                                name="wp_admin_email"
                                type="email"
                                placeholder="you@example.com"
                                className="mt-2 block w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 focus:border-red-500 focus:ring-0"
                            />
                        </Field>

                        <Field label="Admin Username">
                            <input
                                name="wp_admin_user"
                                type="text"
                                defaultValue="admin"
                                className="mt-2 block w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 focus:border-red-500 focus:ring-0"
                            />
                        </Field>

                        <Field label="Admin Password">
                            <input
                                name="wp_admin_password"
                                type="password"
                                className="mt-2 block w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 focus:border-red-500 focus:ring-0"
                            />
                        </Field>
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
                            Create Site
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

function Field({ label, children }) {
    return (
        <label className="text-[11px] uppercase tracking-[0.2em] text-neutral-400">
            {label}
            {children}
        </label>
    );
}
