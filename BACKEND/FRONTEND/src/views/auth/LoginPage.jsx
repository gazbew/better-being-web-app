import React, { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // TODO: Integrate with Stack Auth login
    // Example: await stackAuth.login(email, password)
    setTimeout(() => {
      setLoading(false);
      setError("Invalid credentials (demo only)");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-navy-900">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-navy-800 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100 dark:border-navy-700"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-semibold">Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}
        <button
          type="submit"
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2 rounded transition"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
