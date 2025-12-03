import { useForm, usePage } from "@inertiajs/react";
import AppLayout from "../../Layouts/AppLayout";
import {
    card,
    input as inputClass,
    label as labelClass,
    muted,
    primaryButton,
} from "../../theme";

export default function Profile({ user }) {
    const { props } = usePage();
    const { data, setData, put, processing, errors } = useForm({
        name: user?.name ?? "",
        email: user?.email ?? "",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put("/profile", { preserveScroll: true });
    };

    const success = props.flash?.success;
    const error = props.flash?.error;

    return (
        <AppLayout title="Profile">
            <div className="max-w-xl space-y-6">
                <div>
                    <p className={labelClass}>Account</p>
                    <h1 className="text-2xl font-semibold text-white">
                        Update email & password
                    </h1>
                    <p className={`${muted} text-sm mt-1`}>
                        Changes apply immediately to your login. Leave password blank to keep your current one.
                    </p>
                </div>

                {success && (
                    <div className="text-sm text-emerald-200 bg-emerald-500/10 border border-emerald-500/30 rounded-md px-3 py-2">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="text-sm text-rose-100 bg-rose-500/10 border border-rose-500/30 rounded-md px-3 py-2">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className={`${card} p-6 space-y-4`}
                >
                    <Field label="Name" error={errors.name}>
                        <input
                            name="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className={`${inputClass} mt-2`}
                        />
                    </Field>

                    <Field label="Email" error={errors.email}>
                        <input
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className={`${inputClass} mt-2`}
                        />
                    </Field>

                    <Field label="New password (optional)" error={errors.password}>
                        <input
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                            className={`${inputClass} mt-2`}
                            placeholder="Leave blank to keep current"
                        />
                    </Field>

                    <Field label="Confirm password" error={errors.password_confirmation}>
                        <input
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData("password_confirmation", e.target.value)}
                            className={`${inputClass} mt-2`}
                            placeholder="Leave blank to keep current"
                        />
                    </Field>

                    <div className="pt-2 flex justify-end gap-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className={primaryButton}
                        >
                            {processing ? "Saving..." : "Save changes"}
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
