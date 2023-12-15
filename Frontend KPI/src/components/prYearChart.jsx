/* eslint-disable react/prop-types */
import { Bar } from "react-chartjs-2";
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from "chart.js/auto";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

// eslint-disable-next-line react/prop-types
const PrYearChart = ({
  chartData,
  title,
  classCustom,
  cardColor,
  axis,
  barColor,
  style,
  department,
  yearList,
}) => {
  const [prYear, setPrYear] = useState([]);
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
          }/api/dashboard/${department}/prYear/${year}`
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

  const prYearHandler = () => {
    if (data.prLineYear) {
      const month = data.prLineYear.map((data) => data.month);

      const datasets = [
        {
          label: "Created",
          data: month.map((month) => {
            const monthData = data.prLineYear.find(
              (item) => item.month == month
            );
            return monthData ? monthData.pr_month_count : 0;
          }),
          backgroundColor: "rgba(75, 192, 192, 0.7)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
        },
        {
          label: "Successful",
          data: month.map((month) => {
            const yearData = data.prLineYearSuccess.find(
              (item) => item.month === month
            );
            return yearData ? yearData.pr_month_count : 0;
          }),
          backgroundColor: "rgba(40, 167, 69, 0.7)",
          borderColor: "rgba(40, 167, 69, 1)",
          borderWidth: 2,
        },
        {
          label: "Canceled",
          data: month.map((month) => {
            const yearData = data.prLineYearCancel.find(
              (item) => item.month === month
            );
            return yearData ? yearData.pr_month_count : 0;
          }),
          backgroundColor: "rgba(220, 53, 69, 0.7)",
          borderColor: "rgba(220, 53, 69, 1)",
          borderWidth: 2,
        },
      ];

      setPrYear({
        labels: month,
        datasets: datasets,
      });
    }
  };

  useEffect(() => {
    fetchYear();
  }, [year,chartData]);

  useEffect(() => {
    setYear(null)
  },[chartData])

  useEffect(() => {
    prYearHandler();
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

  const horizontalBarChartOptions = {
    indexAxis: axis,
    responsive: true,
    backgroundColor: barColor,
    scales: {
      x: {
        max: 12, // Batasi jumlah label yang ditampilkan pada sumbu x
      },
    },
  };

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
              {yearList &&
                yearList.map((year,index) => (
                  <option key={index} value={year.year}>{year.year}</option>
                ))}
            </select>
          </div>
        </div>
        <div className="card-body">
          <div
            className="row d-flex justify-content-center align-items-center"
            style={style}
          >
            {year ? (
              <Bar data={prYear} options={horizontalBarChartOptions} />
            ) : (
              <Bar data={chartData}  options={horizontalBarChartOptions} />
            )}
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrYearChart;
