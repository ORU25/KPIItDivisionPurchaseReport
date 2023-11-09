@extends('layouts.app')

@section('content')
    <div class="container-fluid">
        <h1 class="text-success">Total PR = {{ $totalPr }}</h1>
        <h1 class="text-black-50">PR Success= {{ $prSuccess }}</h1>
        <h1 class="text-black-50">PR cancel= {{ $prCancel}}</h1>
        <h1 class="text-success">Total PR Line = {{ $totalPrLine }}</h1>
        <h1 class="text-black-50">PR Line Success= {{ $prLineSuccess}}</h1>
        <h1 class="text-black-50">PR Line cancel= {{ $prLineCancel}}</h1>
        <br>
        <br>
        <br>
        <h1 class="text-success">Total PO = {{ $totalPo }}</h1>
        <h1 class="text-success">PO Success= {{ $poSuccess}}</h1>
        <h1 class="text-success">PO cancel= {{ $poCancel}}</h1>
        <h1 class="text-success">Total PO Line= {{ $totalPoLine }}</h1>
        <h1 class="text-black-50">PO Line cancel= {{ $poLineCancel}}</h1>
    </div>
@endsection
