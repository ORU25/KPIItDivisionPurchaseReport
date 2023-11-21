import { Bar } from "react-chartjs-2";
import { Chart as ChartS } from "chart.js/auto";

const BarChart = ({ chartData, title, classCustom, cardColor}) => {
    if (!chartData || !chartData.labels || !chartData.datasets) {
        
        return (
            <div className={classCustom}>
        <div className={`card card-${cardColor}`}>
          <div className="card-header">
            <h3 className="card-title">{title}</h3>
            <div className="card-tools"></div>
          </div>
          <div className="card-body">
            <div className="row d-flex justify-content-center align-items-center">
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
            <div className={classCustom}>
      <div className={`card card-${cardColor}`}>
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
          <div className="card-tools"></div>
        </div>
        <div className="card-body">
          <div className="row d-flex justify-content-center align-items-center">
            <Bar data={chartData} />
          </div>
        </div>
      </div>
    </div>
    
        );
};
export default BarChart