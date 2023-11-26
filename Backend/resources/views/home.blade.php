
    <div class="container-fluid">
        <h3 class="text-success">Total PR: {{ $totalPr }}</h3>
        <h3 class="text-success">PR Success: {{ $prSuccess }}</h3>
        <h3 class="text-success">PR cancel: {{ $prCancel}}</h3>
        <h3 class="text-success">Total PR Line : {{ $totalPrLine }}</h3>
        <h3 class="text-success">PR Line Success: {{ $prLineSuccess}}</h3>
        <h3 class="text-success">PR Line Cancel: {{ $prLineCancel}}</h3>
        
       

        <br>
        <br>

        
        
        <h3 class="text-success">Total PO: {{ $totalPo }}</h3>
        <h3 class="text-success">PO Success: {{ $poSuccess}}</h3>
        <h3 class="text-success">PO Cancel: {{ $poCancel}}</h3>
        <h3 class="text-success">Total PO Line: {{ $totalPoLine }}</h3>
        <h3 class="text-success">PO Line Success: {{ $poLineSuccess}}</h3>
        <h3 class="text-success">PO Line Cancel: {{ $poLineCancel}}</h3>


        <br>
        <br>

        <ul class="h3 text-success">PR Type: 
            @foreach ($prType as $item)
            <li class="text-success">{{ str_replace(['0.', '1.', '6.'], '',$item->pr_type) }}: {{ $item->pr_type_count }}</li>
            @endforeach
        </ul>

        <br>
        <br>

        <ul class="h3 text-success">PR Requester: 
            @foreach ($prRequester as $item)
            <li class="text-success">{{ $item->requested_by }}: {{ $item->pr_request_count }}</li>
            @endforeach
        </ul>

        <br>
        <br>

        <ul class="h3 text-success">PR Buyer: 
            @foreach ($prBuyer as $item)
            <li class="text-success">{{ $item->buyer }}: {{ $item->pr_buyer_count }}</li>
            @endforeach
        </ul>

        <br>
        <br>

        <ul class="h3 text-success">PR Line by Year: 
            @foreach ($prLineYear as $item)
            <li class="text-success">{{ $item->year }}: {{ $item->pr_line_year_count }}</li>
            @endforeach
        </ul>

        <br>
        <br>

        <ul class="h3 text-success">Vendor Type: 
            @foreach ($vendorTypePoCount as $item)
            <li class="text-success">{{ $item->vendor_type }}: {{ $item->po_count }}</li>
            @endforeach
        </ul>

        <br>
        <br>

        <ul class="h3 text-success">PO by Year: 
            @foreach ($poYear as $item)
            <li class="text-success">{{ $item->year }}: {{ $item->po_year_count }}</li>
            @endforeach
        </ul>

        <br>
        <br>
    </div>

