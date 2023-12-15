import axios from "axios";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from "chart.js/auto";

/* eslint-disable react/prop-types */
const VendorTypeByYearChart = ({
  chartData,
  title,
  classCustom,
  cardColor,
  style,
  department,
  yearList
}) => {
  const [vendorType, setVendorType] = useState([]);
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
          }/api/dashboard/${department}/vendorTypeByYear/${year}`
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

  const vendorTypeHandler = () => {
    if (data && data.vendorTypePoCount) {
      const months = data.vendorTypePoCount.months;
      const datasets = [];
      const pastelColorPalette = [
        "#FFD700", // Gold
        "#FFA07A", // Light Salmon
        "#FFB6C1", // Light Pink
        "#87CEEB", // Sky Blue
        "#00FA9A", // Medium Spring Green
        "#FFDAB9", // Peach Puff
        "#B0E0E6", // Powder Blue
        "#FFE4C4", // Bisque
        "#98FB98", // Mint Green
        "#DDA0DD", // Plum
      ];

      Object.keys(data.vendorTypePoCount).forEach((vendorType, index) => {
        if (vendorType === "months") return;

        const dataForVendorType = months.map((month) => {
          const monthData = data.vendorTypePoCount[vendorType].find(
            (item) => item.month === month
          );
          return monthData ? monthData.count : 0;
        });

        datasets.push({
          label: vendorType,
          data: dataForVendorType,
          borderWidth: 2,
          backgroundColor:
            pastelColorPalette[index % pastelColorPalette.length],
          borderColor: "rgba(61, 64, 62,0.7)",
        });
      });

      setVendorType({
        labels: months,
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
    vendorTypeHandler();
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
            {year ? <Bar data={vendorType} /> : <Bar data={chartData} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorTypeByYearChart;
