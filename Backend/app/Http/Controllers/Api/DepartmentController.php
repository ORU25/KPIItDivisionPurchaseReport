<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $department = Department::all();
        $data = $department->map(function ($department){
            return [
                'id'=>$department->id,
                'name'=>$department->name,
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
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:departments',
            
        ]);

        //if validation fails
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $department = Department::create([
           'name' => $request->name, 
        ]);

        //return response JSON user is created
        if($department) {
            $data =[
                    'id'=>$department->id,
                    'name'=>$department->name,
                ];

            return response()->json([
                'success' => true,
                'department'    => $data,  
            ], 201);
        }

        //return JSON process insert failed 
        return response()->json([
            'success' => false,
        ], 409);

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        try {
            $department = Department::findOrFail($id);
            $data = [
                'name'=>$department->name,
            ];
        } catch (\Throwable $th) {
            return response()->json([
                'message' => "error $th"
            ],404);
        }
        
        return response()->json($data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:departments,name,'.$id,
        ]);

        //if validation fails
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        
        $department = Department::find($id);

        if (!$department) {
            return response()->json([
                'success' => false,
                'message' => 'Department not found',
            ], 404);
        }

        try {
               
            $purchase = Purchase::where('departement', $department->name)->get();

            if ($purchase->isNotEmpty()) {
                // Update departemen pada pembelian yang terkait
                $purchase->each(function ($purchaseItem) use ($request) {
                    $purchaseItem->update([
                        'departement' => $request->name
                    ]);
                });
            }

            
            $department->update([
               'name'=>$request->name, 
            ]);

            $data = [
                'id' => $department->id,
               'name' => $department->name, 
            ];
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update department',
                'error' => $th
            ], 409);
        }

        return response()->json([
            'success' => true,
            'department'    => $data,
        ], 200);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
