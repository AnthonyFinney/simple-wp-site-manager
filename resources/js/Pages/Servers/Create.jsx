// resources/js/Pages/Servers/Create.jsx
import AppLayout from "../../Layouts/AppLayout";

export default function ServerCreate() {
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        console.log("Create server (dummy):", data);
        alert("Server creation is frontend-only for now.");
    };

    return (
        <AppLayout title="Add Server">
            <div className="max-w-3xl">
                <div className="mb-6">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-500">
                        New machine
                    </p>
                    <h1 className="text-2xl font-bold text-neutral-50">Register a server</h1>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-5 shadow-sm"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Server Name" name="name" placeholder="Main VPS" />
                        <Field label="Provider" name="provider" placeholder="Hetzner, DO, AWS" />
                        <Field label="Public IP" name="public_ip" placeholder="203.0.113.5" />
                        <Field label="Region" name="region" placeholder="fsn1" />
                        <Field label="OS" name="os" placeholder="Ubuntu 24.04 LTS" />
                        <Field label="SSH User" name="ssh_user" placeholder="root" />
                        <Field
                            label="SSH Port"
                            name="ssh_port"
                            placeholder="22"
                            type="number"
                            defaultValue="22"
                        />
                    </div>

                    <div>
                        <label className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 block mb-2">
                            SSH Key (paste public key)
                        </label>
                        <textarea
                            name="ssh_key"
                            rows={4}
                            className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 focus:border-red-500 focus:ring-0"
                            placeholder="ssh-ed25519 AAAA..."
                        />
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
                            Save & Continue
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

function Field({ label, name, placeholder, type = "text", defaultValue }) {
    return (
        <label className="text-[11px] uppercase tracking-[0.2em] text-neutral-400">
            {label}
            <input
                name={name}
                type={type}
                placeholder={placeholder}
                defaultValue={defaultValue}
                className="mt-2 block w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 focus:border-red-500 focus:ring-0"
            />
        </label>
    );
}
