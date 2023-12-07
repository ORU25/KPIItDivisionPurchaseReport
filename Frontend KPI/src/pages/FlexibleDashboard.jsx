import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Card from "../components/Card";
import PieChart from "../components/PieChart";
import BarChart from "../components/BarChart";
import LineChart from "../components/LineChart";
import DoughnutChart from "../components/DoughnutChart";
import PrYearChart from "../components/PrYearChart";
import PoYearChart from "../components/PoYearChart";

const FlexibleDashboard = () => {
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

  const token = sessionStorage.getItem("token");

  const { department } = useParams();

  const fetchData = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_API
        }/api/flexibleDashboard/${department}`
      )
      .then((response) => {
        if (response.data.totalPr == 0) {
          Navigate("/404");
        }
        setData(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          sessionStorage.removeItem("token");
          Navigate("/");
        }
      });
  };

  const poYearHandler = () => {
    if (data && data.poYear) {
      const years = data.poYear.map((data) => data.year);

      const datasets = [
        {
          label: "Created",
          data: years.map((year) => {
            const yearData = data.poYear.find((item) => item.year === year);
            return yearData ? yearData.po_year_count : 0;
          }),
          backgroundColor: "rgba(75, 192, 192, 0.7)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
        },
        {
          label: "Successful",
          data: years.map((year) => {
            const yearData = data.poYearSuccess.find(
              (item) => item.year === year
            );
            return yearData ? yearData.po_year_success_count : 0;
          }),
          backgroundColor: "rgba(40, 167, 69, 0.7)",
          borderColor: "rgba(40, 167, 69, 1)",
          borderWidth: 2,
        },
        {
          label: "Canceled",
          data: years.map((year) => {
            const yearData = data.poYearCancel.find(
              (item) => item.year === year
            );
            return yearData ? yearData.po_year_cancel_count : 0;
          }),
          backgroundColor: "rgba(220, 53, 69, 0.7)",
          borderColor: "rgba(220, 53, 69, 1)",
          borderWidth: 2,
        },
      ];

      setPoYear({
        labels: years,
        datasets: datasets,
      });
    }
  };

  const prLineYearHandler = () => {
    if (data && data.prLineYear) {
      const years = data.prLineYear.map((data) => data.year);

      const datasets = [
        {
          label: "Created",
          data: years.map((year) => {
            const yearData = data.prLineYear.find((item) => item.year === year);
            return yearData ? yearData.pr_line_year_count : 0;
          }),
          backgroundColor: "rgba(75, 192, 192, 0.7)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
        },
        {
          label: "Successful",
          data: years.map((year) => {
            const yearData = data.prLineYearSuccess.find(
              (item) => item.year === year
            );
            return yearData ? yearData.pr_line_year_success_count : 0;
          }),
          backgroundColor: "rgba(40, 167, 69, 0.7)",
          borderColor: "rgba(40, 167, 69, 1)",
          borderWidth: 2,
        },
        {
          label: "Canceled",
          data: years.map((year) => {
            const yearData = data.prLineYearCancel.find(
              (item) => item.year === year
            );
            return yearData ? yearData.pr_line_year_cancel_count : 0;
          }),
          backgroundColor: "rgba(220, 53, 69, 0.7)",
          borderColor: "rgba(220, 53, 69, 1)",
          borderWidth: 2,
        },
      ];

      setPrLineYear({
        labels: years,
        datasets: datasets,
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
            label: "IDR",
            data: data.poYearPrice.map((data) => data.total_price_per_year),
            backgroundColor: "rgba(29, 128, 14, 0.7)",
            borderColor: "rgba(29, 128, 14, 1)",
            borderWidth: 2,
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
            label: "IDR",
            data: data.prYearEstPrice.map((data) => data.total_est_price),
            backgroundColor: "rgba(29, 128, 14, 0.7)",
            borderColor: "rgba(29, 128, 14, 1)",
            borderWidth: 2,
          },
        ],
      });
    }
  };

  const vendorTypeHandler = () => {
    if (data && data.vendorTypePoCount) {
      const years = data.vendorTypePoCount.years;
      const datasets = [];

      // Iterating over each vendor type
      Object.keys(data.vendorTypePoCount).forEach((vendorType) => {
        // Skip the key 'years'
        if (vendorType === "years") return;

        const dataForVendorType = years.map((year) => {
          const yearData = data.vendorTypePoCount[vendorType].find(
            (item) => item.year === year
          );
          return yearData ? yearData.count : 0;
        });

        datasets.push({
          label: vendorType,
          data: dataForVendorType,
          borderWidth: 2,
        });
      });

      setVendorType({
        labels: years,
        datasets: datasets,
      });
    }
  };

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
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <Card
              color={"bg-success"}
              mainData={data.prSuccess}
              divider={data.totalPr}
              title={"PR Successful"}
              icon={"fas fa-check-circle"}
              classes={"col-lg-3 col-6"}
            />
            <Card
              color={"bg-danger"}
              mainData={data.prCancel}
              divider={data.totalPr}
              title={"PR Canceled"}
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
              title={"PO Successful"}
              icon={"far fa-check-circle"}
              classes={"col-lg-3 col-6"}
            />
            <Card
              color={"bg-danger"}
              mainData={data.poCancel}
              divider={data.totalPo}
              title={"PO Canceled"}
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
            <PrYearChart
              department={department}
              chartData={prLineYear}
              title={"PR LINE PER YEAR"}
              classCustom={"col-md-6 "}
              cardColor={"warning"}
            />

            <PoYearChart
              department={department}
              chartData={poYear}
              title={"PO PER YEAR"}
              classCustom={"col-md-6 "}
              cardColor={"warning"}
            />

            <LineChart
              chartData={prYearEstPrice}
              title={"TOTAL ESTIMATE PR PRICE PER YEAR (IDR)"}
              classCustom={"col-md-6 "}
              cardColor={"warning"}
            />

            <LineChart
              chartData={poYearPrice}
              title={"TOTAL PO PRICE PER YEAR (IDR)"}
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
              cardColor={"orange"}
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
                        <th style={{ width: 10 }} className="text-center">
                          #
                        </th>
                        <th className="text-center">Name</th>
                        <th className="text-center">PR</th>
                      </tr>
                    </thead>
                    {sortedRequesters && sortedRequesters.length > 0 ? (
                      <tbody>
                        {sortedRequesters.map((data, key) => {
                          return key == 0 ? (
                            <tr key={key} className="bg-warning">
                              <td className="text-center">{key + 1}.</td>
                              <td>{data.requested_by}</td>
                              <td className="text-center">
                                {data.pr_request_count}
                              </td>
                            </tr>
                          ) : (
                            <tr key={key}>
                              <td className="text-center">{key + 1}.</td>
                              <td>{data.requested_by}</td>
                              <td className="text-center">
                                {data.pr_request_count}
                              </td>
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
                        <th style={{ width: 10 }} className="text-center">
                          #
                        </th>
                        <th className="text-center">Name</th>
                        <th className="text-center">PR</th>
                      </tr>
                    </thead>
                    {sortedBuyers && sortedBuyers.length > 0 ? (
                      <tbody>
                        {sortedBuyers.map((data, key) => {
                          return key == 0 ? (
                            <tr key={key} className="bg-warning ">
                              <td className="text-center">{key + 1}.</td>
                              <td>{data.buyer}</td>
                              <td className="text-center">
                                {data.pr_buyer_count}
                              </td>
                            </tr>
                          ) : (
                            <tr key={key}>
                              <td className="text-center">{key + 1}.</td>
                              <td>{data.buyer}</td>
                              <td className="text-center">
                                {data.pr_buyer_count}
                              </td>
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

          <div className="d-flex justify-content-end mb-3">
            <div className="float-right">
              <button
                onClick={() => Navigate(-1)}
                className="btn btn-info btn-block btn-sm"
              >
                <i className="fas fa-caret-left mr-2"></i>
                <span className="">Go back</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FlexibleDashboard;