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
    if (data && data.prRequester) {
      setPrBuyer({
        labels: data.prBuyer.map((data) => data.buyer),
        datasets: [
          {
            label: "Jumlah",
            data: data.prBuyer.map((data) => data.pr_buyer_count),
          },
        ],
      });
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
      setVendorType({
        labels: data.vendorTypePoCount.map((data) => data.vendor_type),
        datasets: [
          {
            label: "Jumlah",
            data: data.vendorTypePoCount.map((data) => data.po_count),
          },
        ],
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
      <Layout title={"Dashboard"}>
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
                cardColor={"danger"}
              />
              <BarChart
                axis={"y"}
                chartData={vendorType}
                title={"VENDOR TYPE"}
                classCustom={"col-md-8 col-12"}
                cardColor={"danger"}
                barColor={"RGB(255, 99, 132, 0.5)"}
                style={{ height: "350px" }}
              />
              
            </div>
            <div className="row">
              <DoughnutChart
                chartData={prRequester}
                title={"PR REQUESTER"}
                classCustom={"col-md-6 col-xl-4 "}
                cardColor={"danger"}
              />
              <DoughnutChart
                chartData={prBuyer}
                title={"PR BUYER"}
                classCustom={"col-md-6 col-xl-8 "}
                cardColor={"danger"}
              />
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Dashboard;
