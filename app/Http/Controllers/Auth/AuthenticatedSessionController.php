<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // Clear any previous active guard sessions before authenticating new user
        Auth::guard('web')->logout();
        Auth::guard('supir')->logout();

        $request->authenticate();

        $request->session()->regenerate();

        // Check Admin (web guard) first
        if (Auth::guard('web')->check()) {
            return redirect()->intended(route('dashboard', absolute: false));
        }

        // Check Supir (supir guard)
        if (Auth::guard('supir')->check()) {
            return redirect()->intended(route('supir.index', absolute: false));
        }

        return redirect('/');
    }

    /**
     * Destroy an authenticated session for all guards cleanly.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();
        Auth::guard('supir')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
