/* eslint-disable react/prop-types */
const TimeLineItem = ({ icon, color, text, data }) => {
  if (data) {
    const [year, month, day] = data.split("-");

    return (
      <div>
        <i className={`${icon} bg-${color}`} />
        <div className="timeline-item">
          <h3 className="timeline-header rounded">
            {text}{" "}
            <span className="text-bold">{`${day}-${month}-${year}`}</span>
          </h3>
        </div>
      </div>
    );
  }
};

export default TimeLineItem;
