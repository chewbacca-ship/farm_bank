import { useState } from "react";
import { auth } from "../api/Api";
import {  useNavigate } from "react-router-dom";

const SignIn = ({selectedRole, setSignIn}) => {

    const roleToUse = selectedRole || 'investor'

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate()
    const [error, setError] = useState('')


    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData((prev) => ({...prev, [name]: value}))

    }



    const handleSubmit =  async (e) => {

        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await auth.signin({ ...formData, role: roleToUse });

            if (result.success) {
                navigate("/");
            } else {
                setError(result.error || "Invalid credentials. Please try again.");
            }

        } catch (err) {
            setError("Something went wrong. Please try again later")
            console.error("Signin error:", err);
        } finally {
            setLoading(false)
        }

    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center space-y-1">
                <h2 className="text-xl font-semibold text-slate-900">
                    Welcome back, {roleToUse === 'investor' ? 'Investor' : 'Farmer'}
                </h2>
                <p className="text-sm text-slate-500">
                    {roleToUse === 'investor'
                        ? 'Sign in to review your portfolio and scout new deals.'
                        : 'Access your dashboard to manage projects and funding.'}
                </p>
            </div>

            {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-600">
                    {error}
                </div>
            )}

            <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700" htmlFor="signin-username">
                    Username
                    <input
                        id="signin-username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                        autoComplete="username"
                        required
                    />
                </label>

                <label className="block text-sm font-medium text-slate-700" htmlFor="signin-password">
                    Password
                    <input
                        id="signin-password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                        autoComplete="current-password"
                        required
                    />
                </label>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
                <label className="inline-flex items-center gap-2">
                    <input type="checkbox" className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                    <span>Remember me</span>
                </label>
                <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="font-medium text-emerald-600 hover:text-emerald-700"
                >
                    Forgot password?
                </button>
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition ${loading ? 'bg-slate-400' : 'bg-emerald-600 hover:bg-emerald-700'}`}
            >
                {loading ? 'Signing in…' : 'Sign in'}
            </button>

            <div className="flex items-center justify-center gap-1 text-sm text-slate-500">
                <span>New to our platform?</span>
                <button
                    type="button"
                    className="font-semibold text-emerald-600 hover:text-emerald-700"
                    onClick={() => setSignIn(false)}
                >
                    Create account
                </button>
            </div>
        </form>
    )



}

export default SignIn
