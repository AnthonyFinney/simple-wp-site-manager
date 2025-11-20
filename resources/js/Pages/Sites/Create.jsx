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
            <h1 className="text-lg font-semibold mb-4">New WordPress Site</h1>

            <form
                onSubmit={handleSubmit}
                className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-4 max-w-xl"
            >
                <div className="grid grid-cols-1 gap-4">
                    <Field label="Server">
                        <select
                            name="server_id"
                            className="mt-1 block w-full rounded-md bg-slate-950 border border-slate-700 px-2 py-1.5 text-sm"
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
                            className="mt-1 block w-full rounded-md bg-slate-950 border border-slate-700 px-2 py-1.5 text-sm"
                        />
                    </Field>

                    <Field label="Site Name">
                        <input
                            name="site_name"
                            type="text"
                            placeholder="My Blog"
                            className="mt-1 block w-full rounded-md bg-slate-950 border border-slate-700 px-2 py-1.5 text-sm"
                        />
                    </Field>

                    <Field label="Admin Email">
                        <input
                            name="wp_admin_email"
                            type="email"
                            placeholder="you@example.com"
                            className="mt-1 block w-full rounded-md bg-slate-950 border border-slate-700 px-2 py-1.5 text-sm"
                        />
                    </Field>

                    <Field label="Admin Username">
                        <input
                            name="wp_admin_user"
                            type="text"
                            defaultValue="admin"
                            className="mt-1 block w-full rounded-md bg-slate-950 border border-slate-700 px-2 py-1.5 text-sm"
                        />
                    </Field>

                    <Field label="Admin Password">
                        <input
                            name="wp_admin_password"
                            type="password"
                            className="mt-1 block w-full rounded-md bg-slate-950 border border-slate-700 px-2 py-1.5 text-sm"
                        />
                    </Field>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                    <button
                        type="button"
                        className="px-3 py-1.5 text-xs rounded-md border border-slate-700 text-slate-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-3 py-1.5 text-xs rounded-md bg-sky-600 hover:bg-sky-500 text-white"
                    >
                        Create Site
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

function Field({ label, children }) {
    return (
        <label className="text-xs text-slate-300">
            {label}
            {children}
        </label>
    );
}
