import React, {   } from "react";

function PurchaseRequestion({ data }) {
    return (

  <div>
  <div className="content-wrapper">
    <div className="content-header">
      <div className="container-fluid">
        <div className="row mb-8">
          <div className="col-sm-6">
            <h1 className="m-0">Purchase Requestion</h1>
          </div>
        </div>
      </div>
    </div>
  
    <section className="content">
      <div className="container-fluid">
      <table id="table-app" className="table table-striped w-full">
        <thead>
            <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Office</th>
                <th>Age</th>
                <th>Start date</th>
                <th>Salary</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Tiger Nixon</td>
                <td>System Architect</td>
                <td>Edinburgh</td>
                <td>61</td>
                <td>2011-04-25</td>
                <td>$320,800</td>
            </tr>
        </tbody>
      </table>
      </div>
    </section>
  </div>
</div>

    );
}

export default PurchaseRequestion;
