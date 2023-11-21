import React, { useEffect, useState } from "react";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import DoughnutChart from "./DoughnutChart";
import PieChart from "./PieChart";

function Home({ data }) {
  const [poYear, setPoYear] = useState({});
  const [prLineYear, setPrLineYear] = useState({});
  const [prRequester, setPrRequester] =useState();
  const [prBuyer, setPrBuyer] = useState({});
  const [prType, setPrType] = useState({});
  
  const poYearHandler = () => {
    if (data && data.poYear) {
      setPoYear({
        labels: data.poYear.map((data) => data.year),
        datasets: [
          {
            label: "Jumlah",
            data: data.poYear.map((data) => data.po_year_count),
          },
        ],
      });
    }
  };

  const prLineYearHandler = () => {
    if (data && data.prLineYear) {
      setPrLineYear({
        labels: data.prLineYear.map((data) => data.year),
        datasets: [
          {
            label: "Jumlah",
            data: data.prLineYear.map((data) => data.pr_line_year_count),
          },
        ],
      });
    }
  };

  const prRequesterHandler = () => {
    if (data && data.prRequester) {
      setPrRequester({
        labels: data.prRequester.map((data) => data.requested_by),
        datasets: [
          {
            label: "Jumlah",
            data: data.prRequester.map((data) => data.pr_request_count),
          },
        ],
      });
    }
  };

  const prBuyerHandler = () => {
    if (data && data.prBuyer) {
      setPrBuyer({
        labels: data.prBuyer.map((data) => data.Buyer),
        datasets: [
          {
            label: "Jumlah",
            data: data.prBuyer.map((data) => data.pr_buyer_count),
          },
        ],
      });
    }
  };

  const prTypeHandler = () => {
    if (data && data.prType) {
      setPrType({
        labels: data.prType.map((data) => data.pr_type),
        datasets: [
          {
            label: "Jumlah",
            data: data.prType.map((data) => data.pr_type_count),
          },
        ],
      });
    }
  };




  useEffect(() => {
    poYearHandler();
    prLineYearHandler();
    prRequesterHandler();
    prBuyerHandler();
    prTypeHandler();
  }, [data]); //

    return (
      <>

  <div>
  <div className="content-wrapper">
    <div className="content-header">
      <div className="container-fluid">
        <div className="row mb-8">
          <div className="col-sm-6">
            <h1 className="m-0">Dashboard</h1>
          </div>
        </div>
      </div>
    </div>
  
    <section className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-3 col-6">
            <div className="small-box bg-info">
              <div className="inner">
                <h3>{data.totalPr}</h3>
                <p>Total PR</p>
              </div>
              <div className="icon">
                <i className="fas fa-clipboard-check" />
              </div>
            </div>
          </div>
        
          <div className="col-lg-3 col-6">
            <div className="small-box bg-success">
              <div className="inner">
                <h3>{data.totalPo}<sup style={{fontSize: 20}}></sup></h3>
                <p>Total PO</p>
              </div>
              <div className="icon">
                <i className="ion ion-stats-bars" />
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-6">
            <div className="small-box bg-warning">
              <div className="inner">
                <h3>{data.totalPrLine}</h3>
                <p>Total Pr Line</p>
              </div>
              <div className="icon">
                <i className="fas fa-poll-h" />
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-6">
            <div className="small-box bg-danger">
              <div className="inner">
                <h3>{data.totalPoLine}</h3>
                <p>Total Po Line</p>
              </div>
              <div className="icon">
                <i className="ion ion-pie-graph" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
          <div className="container-fluid">
            <div className="row">
              <BarChart
                chartData={poYear}
                title={"PO YEAR PERTAHUN"}
                classCustom={"col-md-6 "}
                cardColor={"warning"}
              />
              <LineChart
                chartData={prLineYear}
                title={"PR LINE PERTAHUN"}
                classCustom={"col-md-6 "}
                cardColor={"warning"}
              />
              <DoughnutChart
                chartData={prRequester}
                title={"PR REQUESTER"}
                classCustom={"col-md-6 col-xl-4 "}
                cardColor={"info"}
              />
              <DoughnutChart
                chartData={prBuyer}
                title={"PR BUYER"}
                classCustom={"col-md-6 col-xl-4 "}
                cardColor={"info"}
              />
              <PieChart
                chartData={prType}
                title={"PR TYPE"}
                classCustom={"col-md-6 col-xl-4 "}
                cardColor={"info"}
              />

            </div>
          </div>
    </section>
    </section>
  </div>
</div>


</>

    );
}

export default Home;