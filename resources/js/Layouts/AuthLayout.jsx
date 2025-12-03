import { Head } from "@inertiajs/react";
import { card, pageBg, shell } from "../theme";

export default function AuthLayout({ title, children }) {
    return (
        <>
            <Head title={title} />
            <div className={`${pageBg} flex items-center`}>
                <div className={`${shell} w-full flex justify-center`}>
                    <div className={`${card} w-full max-w-md p-8 space-y-6`}>
                        <div className="space-y-1">
                            <p className="text-[12px] uppercase tracking-[0.2em] text-slate-400">
                                WP Control
                            </p>
                            <h1 className="text-2xl font-semibold text-white">
                                {title}
                            </h1>
                            <p className="text-slate-400 text-sm">
                                Secure access to your WordPress ops dashboard.
                            </p>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
