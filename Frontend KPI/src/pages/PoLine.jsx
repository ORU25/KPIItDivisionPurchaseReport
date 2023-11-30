// eslint-disable-next-line no-unused-vars
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Card2 from "../components/Card2";
import TimeLineItem from "../components/TimeLineItem";

const PoLine = () => {
  const { po_no } = useParams();
  const token = sessionStorage.getItem("token");
  const [data, setData] = useState([]);

  const Navigate = useNavigate();
  const previous = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (po_no) => {
    setIsLoading(true);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/api/po/${po_no}`
      );
      setData(response.data);
    } catch (error) {
      if (error.response) {
        Navigate("/po");
      }
    }
    setIsLoading(false);
  };
  useEffect(() => {
    if (!token) {
      Navigate("/");
    }
    fetchData(po_no);
    window.scrollTo(0, 0);
  }, [token, Navigate]);
  return (
    <>
      <Layout title={`Purchase Order No. ${po_no}`}>
        <section className="content ">
          <div className="container-fluid">
            <div className="card card-gray">
              <div className="card-header">
                <h3 className="card-title">No. {data.po_no}</h3>
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
                          text={"Vendor Type"}
                          text2={data.vendor_type}
                          icon={"fas fa-industry"}
                        />
                        <Card2
                          classes={"col-md-6 col-lg-4 col-12"}
                          color={"success"}
                          text={"Vendor"}
                          text2={data.vendor}
                          icon={"fas fa-building"}
                        />
                        <Card2
                          classes={"col-md-6 col-lg-4 col-12"}
                          color={"warning"}
                          text={"Total Price"}
                          text2={`IDR ${data.total_price_idr}`}
                          icon={"fas fa-money-bill-wave"}
                        />
                      </div>
                      <div className="row">
                        <div className="timeline mt-3 col-md-6 col-lg-4">
                          <TimeLineItem
                            icon={"fas fa-calendar-plus"}
                            color={"primary"}
                            text={"Created"}
                            data={data.po_created}
                          />
                          {data.po_approve === "0000-00-00" ? (
                            ""
                          ) : (
                            <TimeLineItem
                              icon={"fas fa-calendar-check"}
                              color={"success"}
                              text={"Approved"}
                              data={data.po_approve}
                            />
                          )}
                          {data.po_confirmation === "0000-00-00" ? (
                            ""
                          ) : (
                            <TimeLineItem
                              icon={"fas fa-calendar-day"}
                              color={"olive"}
                              text={"Confirmation"}
                              data={data.po_confirmation}
                            />
                          )}
                          {data.po_received === "0000-00-00" ? (
                            ""
                          ) : (
                            <TimeLineItem
                              icon={"fas fa-calendar-week"}
                              color={"teal"}
                              text={"Received"}
                              data={data.po_received}
                            />
                          )}
                          {data.po_closed === "0000-00-00" ? (
                            ""
                          ) : (
                            <TimeLineItem
                              icon={"fas fa-calendar-minus"}
                              color={"warning"}
                              text={"Closed"}
                              data={data.po_closed}
                            />
                          )}
                          {data.po_last_changed === "0000-00-00" ? (
                            ""
                          ) : (
                            <TimeLineItem
                              icon={"fas fa-calendar-alt"}
                              color={"orange"}
                              text={"Last Changed"}
                              data={data.po_last_changed}
                            />
                          )}
                          {data.po_cancel === "0000-00-00" ? (
                            ""
                          ) : (
                            <TimeLineItem
                              icon={"fas fa-calendar-times"}
                              color={"red"}
                              text={"Canceled"}
                              data={data.po_cancel}
                            />
                          )}
                        </div>
                        <div className="col-12 col-md-6 col-xl-8">
                          <div className="card border border-dashed ">
                            <div className="card-header bg-gray">
                              <h3 className="card-title">Description</h3>
                              <div className="card-tools"></div>
                            </div>
                            <div className="card-body">{data.po_desc}</div>
                          </div>
                        </div>
                      </div>

                      {/* table */}
                      <div className="row">
                        <div className="col-12">
                          <div className="card border border-dashed">
                            <div className="card-header bg-secondary">
                              <h3 className="card-title">PO Lines</h3>
                              <div className="card-tools"></div>
                            </div>
                            <div className="card-body table-responsive p-0">
                              <table className="table table-hover text-nowrap">
                                <thead>
                                  <tr>
                                    <th>Line</th>
                                    <th>Description</th>
                                    <th>Qty Order</th>
                                    <th>Unit Price Currency</th>
                                    <th>Unit Price PO</th>
                                    <th>Total Price Currency</th>
                                    <th>Total Price </th>
                                    <th>Closed Line</th>
                                    <th>Cancel Line</th>
                                    <th>Cancel Comments</th>
                                    <th>Eta gmt+8</th>
                                  </tr>
                                </thead>
                                {data.po_lines &&
                                  data.po_lines.map((line) => (
                                    <tr key={line.id}>
                                      <td>{line.po_line}</td>
                                      <td>{line.po_line_desc}</td>
                                      <td>{line.qty_order}</td>
                                      <td>{line.unit_price_currency}</td>
                                      <td>
                                        {new Intl.NumberFormat().format(
                                          line.unit_price_po
                                        )}
                                      </td>
                                      <td>{line.total_price_currency}</td>
                                      <td>
                                        {new Intl.NumberFormat().format(
                                          line.total_price
                                        )}
                                      </td>
                                      <td>{line.po_closed_line}</td>
                                      {line.po_cancel_line === "0000-00-00" ? (
                                        <td>-</td>
                                      ) : (
                                        <td>{line.po_cancel_line}</td>
                                      )}
                                      {line.po_cancel_comments === "" ? (
                                        <td>-</td>
                                      ) : (
                                        <td>{line.po_cancel_comments}</td>
                                      )}
                                      {line.eta_gmt8 === "0000-00-00" ? (
                                        <td>-</td>
                                      ) : (
                                        <td>{line.eta_gmt8}</td>
                                      )}
                                    </tr>
                                  ))}
                                <tbody></tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p>Lihat Purchase Requisition:</p>
                      <div className="row">
                        {data.pr &&
                          data.pr.map((pr, key) => {
                            return (
                              <div
                                key={key}
                                className="col-12 col-md-6 col-lg-4  "
                              >
                                <Link
                                  to={`/pr/${pr.pr_no}`}
                                  className="btn btn-app bg-olive  rounded mx-auto"
                                >
                                  <i className="fas fa-receipt" /> {pr.pr_no}
                                </Link>
                                <div className="timeline mt-2">
                                  <TimeLineItem
                                    icon={"fas fa-calendar-plus"}
                                    color={"primary"}
                                    text={"Created"}
                                    data={pr.pr_created}
                                  />
                                  {pr.pr_approve_date === "0000-00-00" ? (
                                    ""
                                  ) : (
                                    <TimeLineItem
                                      icon={"fas fa-calendar-check"}
                                      color={"success"}
                                      text={"Approved"}
                                      data={pr.pr_approve_date}
                                    />
                                  )}
                                  <TimeLineItem
                                    icon={"fas fa-inbox"}
                                    color={"secondary"}
                                    text={"PO Created"}
                                    data={data.po_created}
                                  />
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
      </Layout>
    </>
  );
};

export default PoLine;
