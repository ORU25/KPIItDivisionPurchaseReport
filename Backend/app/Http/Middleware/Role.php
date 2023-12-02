<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class Role
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        $roles = array_slice(func_get_args(),2);
        foreach($roles as $role){
            $user = Auth::user()->role;
            if($user == $role){
                return $next($request);
            }
        }

        return response('Forbidden', 403);
    }
}
