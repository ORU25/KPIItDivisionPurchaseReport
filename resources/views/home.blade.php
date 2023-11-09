@extends('layouts.app')

@section('content')
    <div class="container-fluid">
        <h1 class="text-success">Total PR = {{ $totalPr }}</h1>
        <h1 class="text-success">PR Success= {{ $prSuccess }}</h1>
        <h1 class="text-success">PR cancel= {{ $prCancel}}</h1>
        <h1 class="text-success">Total PR Line = {{ $totalPrLine }}</h1>
        <h1 class="text-success">PR Line Success= {{ $prLineSuccess}}</h1>
        <h1 class="text-success">PR Line cancel= {{ $prLineCancel}}</h1>

        <br>
        <br>
        <br>
        <h1 class="text-success">Total PO = {{ $totalPo }}</h1>
        <h1 class="text-success">PO Success= {{ $poSuccess}}</h1>
        <h1 class="text-success">PO cancel= {{ $poCancel}}</h1>
        <h1 class="text-success">Total PO Line= {{ $totalPoLine }}</h1>
        <h1 class="text-success">PO Line cancel= {{ $poLineCancel}}</h1>
    </div>
@endsection
