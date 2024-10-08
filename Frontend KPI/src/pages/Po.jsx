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
  const [dataPo, setDataPo] = useState([]);
  const [pending, setPending] = useState(true);
  const [search, SetSearch] = useState("");
  const [filter, setFilter] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const fetchData = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/api/po`
      );

      const timeout = setTimeout(() => {
        setDataPo(response.data);
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
  const result = dataPo.filter((item) => {
    const poDescMatch = item.po_desc ? item.po_desc.toLowerCase().includes(search.toLowerCase()) : false;
    const vendorMatch = item.vendor ? item.vendor.toLowerCase().includes(search.toLowerCase()) : false;
    const vendorTypeMatch = item.vendor_type ? item.vendor_type.toLowerCase().includes(search.toLowerCase()) : false;
    const totalPriceMatch = item.total_price_idr ? numberFormatter(item.total_price_idr).toLowerCase().includes(search.toLowerCase()) : false;
    const poCreatedMatch = item.po_created ? formatDate(item.po_created).toLowerCase().includes(search.toLowerCase()) : false;
    const poApproveMatch = item.po_approve ? formatDate(item.po_approve).toLowerCase().includes(search.toLowerCase()) : false;
    const poConfirmationMatch = item.po_confirmation ? formatDate(item.po_confirmation).toLowerCase().includes(search.toLowerCase()) : false;
    const poReceivedMatch = item.po_received ? formatDate(item.po_received).toLowerCase().includes(search.toLowerCase()) : false;
    const poCancelMatch = item.po_cancel ? formatDate(item.po_cancel).toLowerCase().includes(search.toLowerCase()) : false;
    const poNoMatch = item.po_no ? item.po_no.toString().toLowerCase().includes(search.toLowerCase()) : false;

    return (
      poDescMatch ||
      vendorMatch ||
      vendorTypeMatch ||
      totalPriceMatch ||
      poCreatedMatch ||
      poApproveMatch ||
      poConfirmationMatch ||
      poReceivedMatch ||
      poCancelMatch ||
      poNoMatch
    );
  });
  setFilter(result);
}, [search, dataPo]);

  const handleSelectedRowsChange = (state) => {
    setSelectedRows(state.selectedRows);
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });

    // Specify the columns to exclude from the PDF table
    // const excludedColumns = ["id", "created_at", "updated_at"];

    const columnMapping = {
      po_no: "No",
      po_desc: "Description",
      po_created: "Created",
      po_last_changed: "Last Changed",
      po_approve: "Approved",
      po_confirmation: "Confirmation",
      po_received: "Received",
      po_closed: "Closed",
      po_cancel: "Canceled",
      vendor: "Vendor",
      vendor_type: "Vendor Type",
      total_price_idr: "Total Price IDR",
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
        doc.text("Purchase Order", data.settings.margin.left, 10);
      },
    });

    doc.save("purchase_order.pdf");
  };

  const numberFormatter = (value) => {
    return value.toLocaleString();
  };

  const formatDate = (dateString) => {
    if (dateString) {
      const [year, month, day] = dateString.split("-");
      return `${day}-${month}-${year}`;
    }
  };

  const column = [
    {
      name: "No",
      selector: "po_no",
      sortable: true,
      width: "75px",
    },

    {
      name: "Description",
      selector: "po_desc",
      sortable: true,
      width: "350px",
    },
    {
      name: "Created",
      selector: "po_created",
      sortable: true,
      width: "150px",
      cell: (row) => formatDate(row.po_created),
    },
    {
      name: "Approved",
      selector: "po_approve",
      sortable: true,
      width: "150px",
      cell: (row) => formatDate(row.po_approve),
    },
    {
      name: "Confirmed",
      selector: "po_confirmation",
      sortable: true,
      width: "150px",
      cell: (row) => formatDate(row.po_confirmation),
    },
    {
      name: "Received",
      selector: "po_received",
      sortable: true,
      width: "150px",
      cell: (row) => formatDate(row.po_received),
    },
    {
      name: "Cancel",
      selector: "po_cancel",
      sortable: true,
      width: "150px",
      cell: (row) => formatDate(row.po_cancel),
    },
    {
      name: "Vendor Type",
      selector: "vendor_type",
      sortable: true,
      width: "200px",
    },
    {
      name: "Vendor",
      selector: "vendor",
      sortable: true,
      width: "200px",
    },
    {
      name: "Total Price IDR",
      selector: "total_price_idr",
      sortable: true,
      width: "150px",
      cell: (row) => numberFormatter(row.total_price_idr),
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
          onSelectedRowsChange={handleSelectedRowsChange}
          selectableRowsHighlight
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
          subHeaderAlign="right"
          pointerOnHover
          onRowClicked={(row) => {
            // Navigasi ke rute berdasarkan ID PR
            Navigate(`/po/${row.po_no}`);
          }}
        />
      </div>
    </section>
  );
};

export default Pr;
