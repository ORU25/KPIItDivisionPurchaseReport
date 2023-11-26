// eslint-disable-next-line react/prop-types
const Loading = ({ color, classes }) => {
  return (
    <div style={{ height: "100vh" }}>
      <div className={`spinner-border text-${color} ${classes}`} role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
