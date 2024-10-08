import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Loading from "../components/Loading";
import { CSVLink } from "react-csv";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const Pr = () => {
  const token = sessionStorage.getItem("token");
  const Navigate = useNavigate();
  const [dataPr, setDataPr] = useState([]);
  const [pending, setPending] = useState(true);
  const [search, SetSearch] = useState("");
  const [filter, setFilter] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const fetchData = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/api/pr`
      );

      const timeout = setTimeout(() => {
        setDataPr(response.data);
        setFilter(response.data);
        setPending(false);
      }, 1000);
      return () => clearTimeout(timeout);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        sessionStorage.removeItem("token");
        Navigate("/");
      } else {
        console.log("Error fetching data:", error);
      }
    }
  };
  useEffect(() => {
    if (!token) {
      Navigate("/");
    }
    fetchData();
    window.scrollTo(0, 0);
  }, [token, Navigate]);

  useEffect(() => {
    const result = dataPr.filter((item) => {
      const departmentMatch= item.departement ? item.departement.toLowerCase().includes(search.toLowerCase()) : false;
      const prDescMatch = item.pr_desc ? item.pr_desc.toLowerCase().includes(search.toLowerCase()) : false;
      const buyerMatch = item.buyer ? item.buyer.toLowerCase().includes(search.toLowerCase()) : false;
      const prTypeMatch = item.pr_type ? item.pr_type.toLowerCase().includes(search.toLowerCase()) : false;
      const requestedByMatch = item.requested_by ? item.requested_by.toLowerCase().includes(search.toLowerCase()) : false;
      const estTotalPriceMatch = item.est_total_price_idr ? numberFormatter(item.est_total_price_idr).toString().toLowerCase().includes(search.toLowerCase()) : false;
      const prCreatedMatch = item.pr_created ? formatDate(item.pr_created).toString().toLowerCase().includes(search.toLowerCase()) : false;
      const prApproveDateMatch = item.pr_approve_date ? formatDate(item.pr_approve_date).toString().toLowerCase().includes(search.toLowerCase()) : false;
      const prCancelMatch = item.pr_cancel ? formatDate(item.pr_cancel).toString().toLowerCase().includes(search.toLowerCase()) : false;
      const prNoMatch = item.pr_no ? item.pr_no.toString().toLowerCase().includes(search.toLowerCase()) : false;
  
      return (
        prDescMatch ||
        buyerMatch ||
        prTypeMatch ||
        requestedByMatch ||
        estTotalPriceMatch ||
        prCreatedMatch ||
        prApproveDateMatch ||
        prCancelMatch ||
        departmentMatch ||
        prNoMatch
      );
    });
    setFilter(result);
  }, [search, dataPr]);

  const handleSelectedRowsChange = (state) => {
    setSelectedRows(state.selectedRows);
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });

    // Specify the columns to exclude from the PDF table
    // const excludedColumns = ["id", "created_at", "updated_at"];

    const columnMapping = {
      pr_no: "No",
      pr_type: "Type",
      departement: "Department",
      pr_desc: "Description",
      buyer: "Buyer",
      requested_by: "Requested by",
      pr_created: "Created",
      pr_approve_date: "Approved",
      pr_cancel: "Canceled",
      est_total_price_idr: "Est Price IDR",
    };

    // Filter out the excluded columns
    const filteredHeaders = Object.keys(selectedRows[0])
      // .filter((header) => !excludedColumns.includes(header))
      .map((header) => columnMapping[header] || header);

    const filteredData = selectedRows.map((row) =>
      Object.keys(row)
        // .filter((key) => !excludedColumns.includes(key))
        .map((key) => row[key])
    );

    doc.autoTable({
      head: [filteredHeaders],
      body: filteredData,
      startY: 20,
      didDrawPage: (data) => {
        // Custom header
        doc.setFontSize(12);
        doc.setTextColor(40);
        doc.text("Purchase Report", data.settings.margin.left, 10);
      },
    });

    doc.save("purchase_requisition.pdf");
  };

  const formatDate = (dateString) => {
    if (dateString) {
      const [year, month, day] = dateString.split("-");
      return `${day}-${month}-${year}`;
    }
  };

  const numberFormatter = (value) => {
    return value.toLocaleString();
  };
  const column = [
    {
      name: "No",
      selector: "pr_no",
      sortable: true,
      width: "75px",
    },

    {
      name: "Department",
      selector: "departement",
      sortable: true,
      width: "200px",
    },
    {
      name: "Type",
      selector: "pr_type",
      sortable: true,
      width: "200px",
    },
    {
      name: "Description",
      selector: "pr_desc",
      sortable: true,
      width: "500px",
    },
    {
      name: "Created",
      selector: "pr_created",
      sortable: true,
      width: "150px",
      cell: (row) => formatDate(row.pr_created),
    },
    {
      name: "Approved",
      selector: "pr_approve_date",
      sortable: true,
      width: "150px",
      cell: (row) => formatDate(row.pr_approve_date),
    },
    {
      name: "Canceled",
      selector: "pr_cancel",
      sortable: true,
      width: "150px",
      cell: (row) => formatDate(row.pr_cancel),
    },
    {
      name: "Requested by",
      selector: "requested_by",
      sortable: true,
      width: "200px",
    },
    {
      name: "Buyer",
      selector: "buyer",
      sortable: true,
      width: "200px",
    },
    {
      name: "Est Price IDR",
      selector: "est_total_price_idr",
      sortable: true,
      width: "150px",
      cell: (row) => numberFormatter(row.est_total_price_idr),
    },
  ];
  return (
    <section className="content">
      <div className="container-fluid overflow-auto">
        <DataTable
          columns={column}
          data={filter}
          pagination
          selectableRows
          selectableRowsHighlight
          onSelectedRowsChange={handleSelectedRowsChange}
          progressPending={pending}
          highlightOnHover
          progressComponent={
            <Loading color={"secondary"} classes={"h5 my-5"} />
          }
          subHeader
          subHeaderComponent={
            <div className="row justify-content-between w-100">
              <div className="col-auto">
                {!pending ? (
                  <>
                    <CSVLink
                      data={selectedRows} // data yang ingin diekspor
                      headers={column.map((col) => ({
                        label: col.name,
                        key: col.selector || col.name,
                      }))}
                      filename={"purchase_requisition.csv"}
                      className={`btn btn-success btn-sm float-right mr-3 ${
                        selectedRows.length === 0 ? "disabled" : ""
                      }`}
                    >
                      <i className="fas fa-file-csv mr-2"></i>
                      Export to CSV
                    </CSVLink>
                    <button
                      className={`btn btn-danger btn-sm float-right mr-2 ${
                        selectedRows.length === 0 ? "disabled" : ""
                      }`}
                      onClick={exportToPDF}
                    >
                      <i className="fas fa-file-pdf mr-2"></i>
                      Export to PDF
                    </button>
                  </>
                ) : (
                  ""
                )}
              </div>
              <div className="col-md-4 mt-2 mt-md-0">
                <input
                  type="text"
                  className=" form-control"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => SetSearch(e.target.value)}
                />
              </div>
            </div>
          }
          subHeaderAlign="left"
          pointerOnHover
          onRowClicked={(row) => {
            // Navigasi ke rute berdasarkan ID PR
            Navigate(`/pr/${row.pr_no}`);
          }}
        />
      </div>
    </section>
  );
};

export default Pr;
