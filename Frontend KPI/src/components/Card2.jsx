/* eslint-disable react/prop-types */
const Card2 = ({color,text,text2, icon, classes}) => {
  return (
    <div className={`${classes} `}>
      <div className="info-box">
        <span className={`info-box-icon bg-${color}`}>
          <i className={icon}/>
        </span>
        <div className="info-box-content">
          <span className="info-box-text">{text}</span>
          <span className="info-box-number">{text2}</span>
        </div>
      </div>
    </div>
  );
};

export default Card2;
