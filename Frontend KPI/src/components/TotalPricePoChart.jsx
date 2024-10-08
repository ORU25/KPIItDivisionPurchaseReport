import axios from "axios";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from "chart.js/auto";

/* eslint-disable react/prop-types */
const TotalPricePoChart = ({
  chartData,
  title,
  classCustom,
  cardColor,
  style,
  department,
  yearList
}) => {
  const [poYearPrice, setPoYearPrice] = useState([]);
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
          }/api/dashboard/${department}/poYearPrice/${year}`
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


  const poPriceHandler = () => {
    if (data ) {
      setPoYearPrice({
        labels: data.map((data) => data.month),
        datasets: [
          {
            label: "IDR",
            data: data.map((data) => data.total_price_per_year),
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
  }, [year,chartData]);

  useEffect(() => {
    setYear(null)
  },[chartData])

  useEffect(() => {
    poPriceHandler();
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
              <Line data={poYearPrice} />
            ) : (
              <Line data={chartData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalPricePoChart;
