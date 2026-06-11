export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-full bg-brand-yellow"></div>
          <span className="font-semibold text-2xl tracking-tight">Reconny</span>
        </div>
        <h1 className="text-3xl font-light mb-2 text-center">Welcome Back</h1>
        <p className="text-brand-muted text-center mb-8">Sign in to your account</p>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full btn-primary">
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
