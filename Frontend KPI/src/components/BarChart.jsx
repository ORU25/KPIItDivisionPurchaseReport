/* eslint-disable react/prop-types */
import { Bar } from "react-chartjs-2";
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from "chart.js/auto";

// eslint-disable-next-line react/prop-types
const BarChart = ({
  chartData,
  title,
  classCustom,
  cardColor,
  axis,
  barColor,
  style,
}) => {
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
  };

  return (
    <div className={classCustom}>
      <div className={`card card-${cardColor} border border-dashed`}>
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
          <div className="card-tools">
           
          </div>
        </div>
        <div className="card-body">
          <div
            className="row d-flex justify-content-center align-items-center"
            style={style}
          >
            <Bar data={chartData} options={horizontalBarChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarChart;
