/* eslint-disable react/prop-types */
import { Pie } from "react-chartjs-2";
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from "chart.js/auto";

// eslint-disable-next-line react/prop-types
const PieChart = ({ chartData, title, classCustom, cardColor }) => {
    
  
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
              <div className={`spinner-border h3 text-${cardColor}`} role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`${classCustom}`}>
      <div className={`card card-${cardColor} border border-dashed`}>
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
          <div className="card-tools"></div>
        </div>
        <div className="card-body">
          <div className="row d-flex justify-content-center align-items-center " style={{ height: "350px" }}>
            <Pie data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieChart;
