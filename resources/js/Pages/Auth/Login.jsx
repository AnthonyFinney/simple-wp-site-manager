import { Link, useForm, usePage } from "@inertiajs/react";
import AuthLayout from "../../Layouts/AuthLayout";
import {
    input as inputClass,
    label as labelClass,
    primaryButton,
} from "../../theme";

export default function Login() {
    const { props } = usePage();
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/login");
    };

    const flashError = props.flash?.error;
    const formError = errors.email || errors.password || flashError;

    return (
        <AuthLayout title="Sign in">
            <form onSubmit={handleSubmit} className="space-y-4">
                {formError && (
                    <div className="text-sm text-rose-50 bg-rose-500/10 border border-rose-500/30 rounded-md px-3 py-2">
                        {formError}
                    </div>
                )}
                <Field label="Email" error={errors.email}>
                    <input
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        className={inputClass}
                        placeholder="you@example.com"
                    />
                </Field>
                <Field label="Password" error={errors.password}>
                    <input
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        className={inputClass}
                        placeholder="••••••••"
                    />
                </Field>
                <label className="flex items-center gap-2 text-xs text-slate-400">
                    <input
                        type="checkbox"
                        checked={data.remember}
                        onChange={(e) => setData("remember", e.target.checked)}
                        className="rounded border-slate-700 bg-slate-950 text-cyan-400 focus:ring-cyan-400"
                    />
                    Remember me
                </label>
                <button
                    type="submit"
                    disabled={processing}
                    className={`${primaryButton} w-full`}
                >
                    {processing ? "Signing in..." : "Sign in"}
                </button>
            </form>
        </AuthLayout>
    );
}

function Field({ label, error, children }) {
    return (
        <label className={`${labelClass} block space-y-2`}>
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
