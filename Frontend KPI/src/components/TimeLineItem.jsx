/* eslint-disable react/prop-types */
const TimeLineItem = ({icon,color,text,data}) => {
  return (
    <div>
      <i className={`${icon} bg-${color}`}/>
      <div className="timeline-item">
        <h3 className="timeline-header rounded">
          {text} <span className="text-bold">{data}</span>
        </h3>
      </div>
    </div>
  );
};

export default TimeLineItem;
