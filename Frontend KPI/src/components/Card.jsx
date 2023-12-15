/* eslint-disable react/prop-types */
const Card = ({ color, mainData, divider, icon, title, classes }) => {
  return (
    <div className={classes}>
      {/* small box */}
      <div className={`small-box ${color}`}>
        <div className="inner">
          <h3>
            {mainData !== undefined && divider !== undefined ? (
              <span>
                {((mainData / divider) * 100).toFixed(2)}
                <sup style={{ fontSize: "20px" }}>%</sup>
              </span>
            ) : mainData !== undefined ? (
              mainData
            ) : (
              <div className="spinner-border text-light" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            )}
          </h3>
          <p>
            {title}
            {mainData && divider ? (
              <span className="ml-2 text-bold">
                {mainData}/{divider}
              </span>
            ) : (
              ""
            )}
          </p>
        </div>
        <div className="icon">
          <i className={icon} />
        </div>
      </div>
    </div>
  );
};

export default Card;
