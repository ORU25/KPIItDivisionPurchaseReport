/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from "chart.js/auto";

const TotalEstPricePrChart = ({
  chartData,
  title,
  classCustom,
  cardColor,
  style,
  department,
}) => {
  const [prYearEstPrice, setPrYearEstPrice] = useState([]);
  const [year, setYear] = useState(null);
  const [data, setData] = useState([]);
  const token = sessionStorage.getItem("token");
  const Navigate = useNavigate();

  const fetchYear = async () => {
    if (year) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await axios
        .get(
          `${
            import.meta.env.VITE_BACKEND_API
          }/api/dashboard/${department}/prYearPrice/${year}`
        )
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            sessionStorage.removeItem("token");
            Navigate("/");
          } else console.log("error fetching data", error);
        });
    }
  };

  const prEstPriceHandler = () => {
    if (data) {
      setPrYearEstPrice({
        labels: data.map((data) => data.month),
        datasets: [
          {
            label: "IDR",
            data: data.map((data) => data.total_est_price),
            backgroundColor: "rgba(29, 128, 14, 0.7)",
            borderColor: "rgba(29, 128, 14, 1)",
            borderWidth: 2,
          },
        ],
      });
    }
  };

  useEffect(() => {
    fetchYear();
  }, [year]);

  useEffect(() => {
    prEstPriceHandler();
  }, [data]);

  const handleSelectChange = (event) => {
    const selectedYear = event.target.value;
    setYear(selectedYear === "All" ? null : selectedYear);
  };

  if (!chartData || !chartData.labels || !chartData.datasets) {
    return (
      <div className={classCustom}>
        <div className={`card card-${cardColor} border border-dashed`}>
          <div className="card-header">
            <h3 className="card-title">{title}</h3>
            <div className="card-tools"></div>
          </div>
          <div className="card-body">
            <div className="row d-flex justify-content-center align-items-center chart-loading">
              <div
                className={`spinner-border h3 text-${cardColor}`}
                role="status"
              >
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classCustom}>
      <div className={`card card-${cardColor} border border-dashed`}>
        <div className="card-header" style={{ position: "relative" }}>
          <h3 className="card-title">{title}</h3>
          <div
            className="card-tools"
            style={{ position: "absolute", top: 8, right: 20 }}
          >
            <select
              className="form-control form-control-sm text-center"
              onChange={handleSelectChange}
            >
              <option value={null}>All</option>
              <option value={"2014"}>2014</option>
              <option value={"2015"}>2015</option>
              <option value={"2016"}>2016</option>
              <option value={"2017"}>2017</option>
              <option value={"2018"}>2018</option>
              <option value={"2019"}>2019</option>
              <option value={"2020"}>2020</option>
              <option value={"2021"}>2021</option>
              <option value={"2022"}>2022</option>
              <option value={"2023"}>2023</option>
            </select>
          </div>
        </div>
        <div className="card-body">
          <div
            className="row d-flex justify-content-center align-items-center"
            style={style}
          >
            {year ? <Line data={prYearEstPrice} /> : <Line data={chartData} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalEstPricePrChart;
