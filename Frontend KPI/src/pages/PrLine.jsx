import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Card2 from "../components/Card2";
import TimeLineItem from "../components/TimeLineItem";

const PrLine = () => {
  const { pr_no } = useParams();

  const token = sessionStorage.getItem("token");
  const [data, setData] = useState([]);

  const Navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const previous = useNavigate();

  const fetchData = async (pr_no) => {
    setIsLoading(true);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/api/pr/${pr_no}`
      );
      setData(response.data);
    } catch (error) {
      if (error.response) {
        Navigate("/404");
      }
    }
    setIsLoading(false);
  };
  useEffect(() => {
    if (!token) {
      Navigate("/");
    }
    fetchData(pr_no);
    window.scrollTo(0, 0);
  }, [token, Navigate]);
  return (
    <>
     
        <section className="content ">
          <div className="container-fluid">
            <div className="card card-gray">
              <div className="card-header">
                <h3 className="card-title">No. {data.pr_no}</h3>
                <div className="card-tools"></div>
              </div>
              <div className="card-body">
                <div className="chart">
                  {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center my-5">
                      <h1>
                        <div
                          className="spinner-border text-secondary text-bold"
                          role="status"
                          style={{ width: "4rem", height: "4rem" }}
                        >
                          <span className="sr-only mx-auto">Loading...</span>
                        </div>
                      </h1>
                    </div>
                  ) : (
                    <>
                      <div className="row">
                        <Card2
                          classes={"col-md-6 col-lg-4 col-12"}
                          color={"olive"}
                          text={"Requested by"}
                          text2={data.requested_by}
                          icon={"fas fa-user-tie"}
                        />
                        <Card2
                          classes={"col-md-6 col-lg-4 col-12"}
                          color={"success"}
                          text={"Buyer"}
                          text2={data.buyer}
                          icon={"fas fa-shopping-cart"}
                        />
                        <Card2
                          classes={"col-md-6 col-lg-4 col-12"}
                          color={"warning"}
                          text={"Est Total Price"}
                          text2={`IDR ${data.est_total_price_idr}`}
                          icon={"fas fa-money-bill-wave"}
                        />
                      </div>
                      <div className="row">
                        <div className="timeline mt-3 col-md-6 col-lg-4">
                          <TimeLineItem
                            icon={"fas fa-calendar-plus"}
                            color={"primary"}
                            text={"Created"}
                            data={data.pr_created}
                          />
                          {data.pr_approve_date === "0000-00-00" ? (
                            ""
                          ) : (
                            <TimeLineItem
                              icon={"fas fa-calendar-check"}
                              color={"success"}
                              text={"Approved"}
                              data={data.pr_approve_date}
                            />
                          )}
                          {data.pr_cancel === "0000-00-00" ? (
                            ""
                          ) : (
                            <TimeLineItem
                              icon={"fas fa-calendar-times"}
                              color={"red"}
                              text={"Canceled"}
                              data={data.pr_cancel}
                            />
                          )}
                        </div>
                        {/* description */}
                        <div className="col-12 col-md-6 col-xl-8">
                          <div className="card border border-dashed">
                            <div className="card-header bg-gray">
                              <h3 className="card-title">Description</h3>
                              <div className="card-tools"></div>
                            </div>
                            <div className="card-body">{data.pr_desc}</div>
                          </div>
                        </div>
                      </div>

                      {/* Table */}
                      <div className="row">
                        <div className="col-12">
                          <div className="card border border-dashed">
                            <div className="card-header bg-secondary">
                              <h3 className="card-title">PR Lines</h3>
                              <div className="card-tools"></div>
                            </div>
                            <div className="card-body table-responsive p-0">
                              <table className="table table-hover text-nowrap">
                                <thead>
                                  <tr>
                                    <th>Line</th>
                                    <th>PCI No</th>
                                    <th>Description</th>
                                    <th>Created</th>
                                    <th>Approve</th>
                                    <th>Last Changed</th>
                                    <th>Cancel</th>
                                    <th>Est Qty</th>
                                    <th>Est Price</th>
                                    <th>Est Currency</th>
                                  </tr>
                                </thead>
                                {data.pr_lines &&
                                  data.pr_lines.map((line) => (
                                    <tr key={line.id}>
                                      <td>{line.pr_line}</td>
                                      <td>{line.pci_no}</td>
                                      <td>{line.pr_line_desc}</td>
                                      <td>{line.pr_created}</td>
                                      <td>{line.pr_approve_date}</td>
                                      <td>{line.pr_last_changed}</td>
                                      {line.pr_cancel === "0000-00-00" ? (
                                        <td>-</td>
                                      ) : (
                                        <td>{line.pr_cancel}</td>
                                      )}
                                      <td>
                                        {new Intl.NumberFormat().format(
                                          line.est_qty
                                        )}
                                      </td>
                                      <td>
                                        {new Intl.NumberFormat().format(
                                          line.est_price
                                        )}
                                      </td>
                                      <td>{line.est_currency}</td>
                                    </tr>
                                  ))}
                                <tbody></tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* PO */}
                      <p>Lihat Purchase Order:</p>
                      <div className="row">
                        {data.po &&
                          data.po.map((po, key) => {
                            return (
                              <div
                                key={key}
                                className="col-12 col-md-6 col-lg-4"
                              >
                                <Link
                                  to={`/po/${po.po_no}`}
                                  className="btn btn-app bg-olive  rounded"
                                >
                                  <i className="fas fa-inbox" /> {po.po_no}
                                </Link>
                                <div className="timeline mt-2">
                                  <TimeLineItem
                                    icon={"fas fa-calendar-plus"}
                                    color={"primary"}
                                    text={"Created"}
                                    data={po.po_created}
                                  />
                                  {po.po_approve === "0000-00-00" ? (
                                    ""
                                  ) : (
                                    <TimeLineItem
                                      icon={"fas fa-calendar-check"}
                                      color={"success"}
                                      text={"Approved"}
                                      data={po.po_approve}
                                    />
                                  )}
                                  {po.po_confirmation === "0000-00-00" ? (
                                    ""
                                  ) : (
                                    <TimeLineItem
                                      icon={"fas fa-calendar-day"}
                                      color={"olive"}
                                      text={"Confirmation"}
                                      data={po.po_confirmation}
                                    />
                                  )}
                                  {po.po_received === "0000-00-00" ? (
                                    ""
                                  ) : (
                                    <TimeLineItem
                                      icon={"fas fa-calendar-week"}
                                      color={"teal"}
                                      text={"Received"}
                                      data={po.po_received}
                                    />
                                  )}
                                  {po.po_closed === "0000-00-00" ? (
                                    ""
                                  ) : (
                                    <TimeLineItem
                                      icon={"fas fa-calendar-minus"}
                                      color={"warning"}
                                      text={"Closed"}
                                      data={po.po_closed}
                                    />
                                  )}
                                  {po.po_last_changed === "0000-00-00" ? (
                                    ""
                                  ) : (
                                    <TimeLineItem
                                      icon={"fas fa-calendar-alt"}
                                      color={"orange"}
                                      text={"Last Changed"}
                                      data={po.po_last_changed}
                                    />
                                  )}
                                  {po.po_cancel === "0000-00-00" ? (
                                    ""
                                  ) : (
                                    <TimeLineItem
                                      icon={"fas fa-calendar-times"}
                                      color={"red"}
                                      text={"Canceled"}
                                      data={po.po_cancel}
                                    />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </>
                  )}
                  <div className="float-right">
                    <button
                      onClick={() => previous(-1)}
                      className="btn btn-info btn-block btn-sm"
                    >
                      <i className="fas fa-caret-left mr-2"></i>
                      <span className="">Go back</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
    </>
  );
};

export default PrLine;
