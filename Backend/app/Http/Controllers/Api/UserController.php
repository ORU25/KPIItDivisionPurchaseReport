<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();
        $data = $users->map(function ($user){
            return [
                'id' => $user->id,
                'name'=>$user->name,
                'email'=>$user->email,
                'role'=>$user->role,
            ];
        });
        return response()->json($data,200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show( $id)
    {   
        try {
            $user = User::findOrFail($id);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => "error $th"
            ],404);
        }
        
        return response()->json($user);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'name'      => 'required',
            'email'     => 'required|email|unique:users,email,'.$id,
            'password'  => 'sometimes|min:8|confirmed',
            'role'      => 'required'
        ]);
        
        //if validation fails
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        
        $user = User::find($id);
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }
        
        try {
            if (Auth::id() == $id && $request->role != Auth::user()->role) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not allowed to change your own role.',
                ], 403); // 403 Forbidden status code sesuai untuk kasus ini
            }
            $user->update([
                'name'      => $request->name,
                'email'     => $request->email,
                'role'      => $request->role,
                'password'  => $request->has('password') ? bcrypt($request->password) : $user->password
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user',
            ], 409);
        }
        
        return response()->json([
            'success' => true,
            'user'    => $user,
        ], 200);
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => "User not found"
            ], 404);
        }
        if(Auth::id() == $id){
            return response()->json([
                'message' => "You can't delete yourself"
            ], 403);
        }
        $user->delete();
        
        return response()->json([
            'message' => "Delete User Success"
        ]);
    }
}
