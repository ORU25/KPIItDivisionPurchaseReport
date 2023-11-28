import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "../components/Card";
import PieChart from "../components/PieChart";
import LineChart from "../components/LineChart";
import BarChart from "../components/BarChart";
import DoughnutChart from "../components/DoughnutChart";

const Dashboard = () => {
  const Navigate = useNavigate();
  const [data, setData] = useState([]);

  const [poYear, setPoYear] = useState({});
  const [poYearPrice, setPoYearPrice] = useState({});

  const [prRequester, setPrRequester] = useState({});
  const [prBuyer, setPrBuyer] = useState({});
  const [prType, setPrType] = useState({});
  const [prLineYear, setPrLineYear] = useState({});
  const [prYearEstPrice, setPrYearEstPrice] = useState({});

  const [vendorType, setVendorType] = useState({});

  const [sortedBuyers, setSortedBuyers] = useState({});
  const [sortedRequesters, setSortedRequesters] = useState({});

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios
      .get(`${import.meta.env.VITE_BACKEND_API}/api/dashboard`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          Navigate("/");
        } else console.log("error fetching data", error);
      });
  };

  const poYearHandler = () => {
    if (data && data.poYear) {
      setPoYear({
        labels: data.poYear.map((data) => data.year),
        datasets: [
          {
            label: "Created",
            data: data.poYear.map((data) => data.po_year_count),
            backgroundColor: "rgba(75, 192, 192, 0.7)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "Success",
            data: data.poYearSuccess.map((data) => data.po_year_success_count),

            backgroundColor: "rgba(40, 167, 69, 0.7)",
            borderColor: "rgba(40, 167, 69, 1)",
            borderWidth: 1,
          },
          {
            label: "Cancel",
            data: data.poYearCancel.map((data) => data.po_year_cancel_count),
            backgroundColor: "rgba(220, 53, 69, 0.7)",
            borderColor: "rgba(220, 53, 69, 1)",
            borderWidth: 1,
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
      setSortedRequesters(
        data.prRequester.sort((a, b) => b.pr_request_count - a.pr_request_count)
      );
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
  const prBuyerHandler = () => {
    if (data && data.prBuyer) {
      setPrBuyer({
        labels: data.prBuyer.map((data) => data.buyer),
        datasets: [
          {
            label: "Jumlah",
            data: data.prBuyer.map((data) => data.pr_buyer_count),
          },
        ],
      });
      setSortedBuyers(
        data.prBuyer.sort((a, b) => b.pr_buyer_count - a.pr_buyer_count)
      );
    }
  };
  const poPricePerYearHandler = () => {
    if (data && data.poYearPrice) {
      setPoYearPrice({
        labels: data.poYearPrice.map((data) => data.year),
        datasets: [
          {
            label: "Jumlah",
            data: data.poYearPrice.map((data) => data.total_price_per_year),
            backgroundColor: "rgba(29, 128, 14, 0.7)",
            borderColor: "rgba(29, 128, 14, 1)",
            borderWidth: 1,
          },
        ],
      });
    }
  };
  const prEstPricePerYearHandler = () => {
    if (data && data.prYearEstPrice) {
      setPrYearEstPrice({
        labels: data.prYearEstPrice.map((data) => data.year),
        datasets: [
          {
            label: "Jumlah",
            data: data.prYearEstPrice.map((data) => data.total_est_price),
          },
        ],
      });
    }
  };
  const vendorTypeHandler = () => {
    if (data && data.vendorTypePoCount) {
      const years = data.vendorTypePoCount.years;
      const datasets = [];

      // Iterasi setiap vendor type
      Object.keys(data.vendorTypePoCount).forEach((vendorType) => {
        // Lewati kunci 'years'
        if (vendorType === "years") return;

        const dataForVendorType = data.vendorTypePoCount[vendorType].map(
          (item) => item.count
        );

        datasets.push({
          label: vendorType,
          data: dataForVendorType,
        });
      });

      setVendorType({
        labels: years,
        datasets: datasets,
      });
    }
  };

  // Function to generate random colors for the chart

  useEffect(() => {
    if (!token) {
      Navigate("/");
    }
    fetchData();
    window.scrollTo(0, 0);
  }, [token, Navigate]);

  useEffect(() => {
    poYearHandler();
    prLineYearHandler();
    prRequesterHandler();
    prBuyerHandler();
    prTypeHandler();
    poPricePerYearHandler();
    prEstPricePerYearHandler();
    vendorTypeHandler();
  }, [data]); //

  return (
    <>
      <Layout title={"Dashboard IT Division Purchase Report"}>
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <Card
                color={"bg-success"}
                mainData={data.prSuccess}
                divider={data.totalPr}
                title={"PR Success"}
                icon={"fas fa-check-circle"}
                classes={"col-lg-3 col-6"}
              />
              <Card
                color={"bg-danger"}
                mainData={data.prCancel}
                divider={data.totalPr}
                title={"PR Cancel"}
                icon={"fas fa-times-circle"}
                classes={"col-lg-3 col-6"}
              />
              <Card
                color={"bg-info"}
                mainData={data.totalPr}
                title={"Total PR"}
                icon={"fas fa-receipt"}
                classes={"col-lg-3 col-6"}
              />
              <Card
                color={"bg-secondary"}
                mainData={data.totalPrLine}
                title={"Total PR Line"}
                icon={"fas fa-list-alt"}
                classes={"col-lg-3 col-6"}
              />
            </div>

            <div className="row">
              <Card
                color={"bg-success"}
                mainData={data.poSuccess}
                divider={data.totalPo}
                title={"PO Success"}
                icon={"far fa-check-circle"}
                classes={"col-lg-3 col-6"}
              />
              <Card
                color={"bg-danger"}
                mainData={data.poCancel}
                divider={data.totalPo}
                title={"PO Cancel"}
                icon={"far fa-times-circle"}
                classes={"col-lg-3 col-6"}
              />

              <Card
                color={"bg-info"}
                mainData={data.totalPo}
                title={"Total PO"}
                icon={"fas fa-file-invoice"}
                classes={"col-lg-3 col-6"}
              />
              <Card
                color={"bg-secondary"}
                mainData={data.totalPoLine}
                title={"Total PO Line"}
                icon={"far fa-list-alt"}
                classes={"col-lg-3 col-6"}
              />
            </div>

            <div className="row">
              <BarChart
                chartData={poYear}
                title={"PO PERTAHUN"}
                classCustom={"col-md-6 "}
                cardColor={"warning"}
              />
              <BarChart
                chartData={poYearPrice}
                title={"TOTAL PRICE PO PERTAHUN (IDR)"}
                classCustom={"col-md-6 "}
                cardColor={"warning"}
              />

              <LineChart
                chartData={prLineYear}
                title={"PR LINE PERTAHUN"}
                classCustom={"col-md-6 "}
                cardColor={"warning"}
              />
              <LineChart
                chartData={prYearEstPrice}
                title={"TOTAL ESTIMATE PRICE PR PERTAHUN (IDR)"}
                classCustom={"col-md-6 "}
                cardColor={"warning"}
              />
            </div>

            <div className="row">
              <PieChart
                chartData={prType}
                title={"PR TYPE"}
                classCustom={"col-12 col-md-4"}
                cardColor={"olive"}
              />
              <BarChart
                chartData={vendorType}
                title={"VENDOR TYPE"}
                classCustom={"col-md-8 col-12"}
                cardColor={"olive"}
                style={{ height: "350px" }}
              />
            </div>

            <div className="row">
              <DoughnutChart
                chartData={prRequester}
                title={"PR REQUESTER"}
                classCustom={"col-md-7"}
                cardColor={"danger"}
              />
              <div className="col-md-5">
                <div className="card card-orange">
                  <div className="card-header">
                    <h3 className="card-title">TOP REQUESTER</h3>
                    <div className="card-tools"></div>
                  </div>
                  <div
                    className="card-body"
                    style={{ height: "390px", overflowY: "auto" }}
                  >
                    <table
                      className="table table-sm"
                      style={{ minHeight: "350px" }}
                    >
                      <thead>
                        <tr>
                          <th style={{ width: 10 }}>#</th>
                          <th>Name</th>
                          <th>PR</th>
                        </tr>
                      </thead>
                      {sortedRequesters && sortedRequesters.length > 0 ? (
                        <tbody>
                          {sortedRequesters.map((data, key) => {
                            return (
                              <tr key={key}>
                                <td>{key + 1}.</td>
                                <td>{data.requested_by}</td>
                                <td>{data.pr_request_count}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      ) : (
                        <tbody>
                          <tr>
                            <td colSpan="2">No data available</td>
                          </tr>
                        </tbody>
                      )}
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <DoughnutChart
                chartData={prBuyer}
                title={"PR BUYER"}
                classCustom={"col-md-7 "}
                cardColor={"danger"}
              />
              <div className="col-md-5">
                <div className="card card-danger">
                  <div className="card-header">
                    <h3 className="card-title">TOP BUYER</h3>
                    <div className="card-tools"></div>
                  </div>
                  <div
                    className="card-body"
                    style={{ height: "390px", overflowY: "auto" }}
                  >
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th style={{ width: 10 }}>#</th>
                          <th>Name</th>
                          <th>PR</th>
                        </tr>
                      </thead>
                      {sortedBuyers && sortedBuyers.length > 0 ? (
                        <tbody>
                          {sortedBuyers.map((data, key) => {
                            return (
                              <tr key={key}>
                                <td>{key + 1}.</td>
                                <td>{data.buyer}</td>
                                <td>{data.pr_buyer_count}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      ) : (
                        <tbody>
                          <tr>
                            <td colSpan="2">No data available</td>
                          </tr>
                        </tbody>
                      )}
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Dashboard;
