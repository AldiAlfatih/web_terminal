import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Bus, Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import InputError from '@/components/input-error';
import AppLogoIcon from '@/components/app-logo-icon';

interface LoginForm {
    username: string;
    password: string;
    remember: boolean;
    [key: string]: string | boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        username: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Masuk — Terminal Induk Parepare" />

            {/* Full-page cream canvas background */}
            <div
                className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
                style={{ backgroundColor: '#f9f7f3' }}
            >
                {/* Hero branding strip */}
                <div className="mb-8 text-center">
                    {/* Dishub Logo badge */}
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-300 p-1.5 bg-white shadow-sm overflow-hidden">
                        <AppLogoIcon className="h-full w-full object-contain" />
                    </div>
                    <h1
                        className="text-4xl font-extrabold tracking-tight"
                        style={{
                            fontFamily: "'Bricolage Grotesque', sans-serif",
                            color: '#001A33',
                            lineHeight: 1.0,
                            letterSpacing: '-0.04em',
                        }}
                    >
                        Terminal Induk
                    </h1>
                    <p
                        className="mt-1 text-sm font-medium"
                        style={{ color: '#003B70', fontFamily: "'Inter', sans-serif" }}
                    >
                        Parepare — Portal Akses Masuk
                    </p>
                </div>

                {/* White login card */}
                <div
                    className="w-full max-w-sm border p-8"
                    style={{
                        backgroundColor: '#ffffff',
                        borderColor: '#d4cfc6',
                        borderRadius: '16px',
                    }}
                >
                    <h2
                        className="mb-6 text-xl font-bold"
                        style={{
                            fontFamily: "'Bricolage Grotesque', sans-serif",
                            color: '#001A33',
                        }}
                    >
                        Masuk ke Sistem
                    </h2>

                    {status && (
                        <div className="mb-4 rounded-full px-4 py-2 text-center text-sm font-medium text-green-700"
                            style={{ backgroundColor: '#d1fae5' }}>
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="flex flex-col gap-5">
                        {/* Username field */}
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="username"
                                className="text-sm font-semibold"
                                style={{ color: '#001A33', fontFamily: "'Inter', sans-serif" }}
                            >
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                required
                                autoFocus
                                autoComplete="username"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                placeholder="Masukkan username"
                                className="input-damri"
                                tabIndex={1}
                            />
                            <InputError message={errors.username} />
                        </div>

                        {/* Password field */}
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="password"
                                className="text-sm font-semibold"
                                style={{ color: '#001A33', fontFamily: "'Inter', sans-serif" }}
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Masukkan password"
                                    className="input-damri pr-12"
                                    tabIndex={2}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-[#003B70] transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        {/* Remember me */}
                        <div className="flex items-center gap-2">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                tabIndex={3}
                                className="h-4 w-4 rounded"
                                style={{ accentColor: '#003B70' }}
                            />
                            <label
                                htmlFor="remember"
                                className="text-sm"
                                style={{ color: '#4a5568', fontFamily: "'Inter', sans-serif" }}
                            >
                                Ingat saya
                            </label>
                        </div>

                        {/* Submit — DAMRI Yellow pill button */}
                        <button
                            type="submit"
                            disabled={processing}
                            tabIndex={4}
                            className="btn-damri-primary mt-2 w-full justify-center text-sm"
                            style={{ opacity: processing ? 0.7 : 1 }}
                        >
                            {processing && (
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                            )}
                            {processing ? 'Memproses...' : 'Masuk'}
                        </button>
                    </form>
                </div>

                {/* Footer caption */}
                <p
                    className="mt-8 text-xs"
                    style={{ color: '#4a5568', fontFamily: "'Inter', sans-serif" }}
                >
                    © {new Date().getFullYear()} Terminal Induk Parepare
                </p>
            </div>
        </>
    );
}
