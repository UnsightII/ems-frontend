import React, { useState, useEffect } from 'react';
import { deleteEmployee, listEmployees } from '../services/EmployeeService';
import { useNavigate } from 'react-router-dom';

const ListEmployeeComponent = () => {

    const [employees, setEmployees] = useState([]);
    const [pageNo, setPageNo] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("id");
    const [sortDir, setSortDir] = useState("asc");
    const [totalPages, setTotalPages] = useState(0);
    const [last, setLast] = useState(false);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);

    const navigator = useNavigate();

    useEffect(() => {
        fetchEmployees();
    }, [pageNo, pageSize, search, sortBy, sortDir]);

    function fetchEmployees() {

        setLoading(true);

        listEmployees(pageNo, pageSize, search, sortBy, sortDir)
            .then((response) => {
                setEmployees(response.data.content);
                setTotalPages(response.data.totalPages);
                setLast(response.data.last);
                setTotalElements(response.data.totalElements);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }

    function addNewEmployee() {
        navigator('/add-employee');
    }

    function updateEmployee(id) {
        navigator(`/edit-employee/${id}`);
    }

    function removeEmployee(id) {

        const confirmDelete = window.confirm("Are you sure you want to delete this employee?");

        if (!confirmDelete) {
            return;
        }

        deleteEmployee(id)
            .then(() => {
                alert("Employee deleted successfully!");
                fetchEmployees();
            })
            .catch(error => {
                console.log(error);
                alert("Failed to delete employee.");
            });
    }

    function handleSort(column) {

        if (sortBy === column) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortDir("asc");
        }
    }

    function getSortIcon(column) {
        return sortBy === column
            ? (sortDir === "asc" ? "▲" : "▼")
            : "";
    }

    return (

        <div className="container card shadow-lg">

            <h2 className="text-center mt-3">List of Employee</h2>

            <div className="d-flex justify-content-between align-items-center mb-3">

                <button
                    className="btn btn-primary"
                    onClick={addNewEmployee}
                >
                    Add Employee
                </button>

                <p className="text-muted mb-0">
                    Showing {employees.length} of {totalElements} employees
                </p>

                <select
                    className="form-select"
                    style={{ width: "100px" }}
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPageNo(0);
                    }}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>

                <input
                    type="text"
                    className="form-control"
                    placeholder="Search employee..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPageNo(0);
                    }}
                    style={{ width: "300px" }}
                />

            </div>

            {
                loading ?

                    <div className="text-center my-5">
                        <div className="spinner-border text-primary"></div>
                        <p className="mt-2">Loading employees...</p>
                    </div>

                    :
                    <div className="table-responsive">
               
                        <table className="table table-striped table-bordered">

                            <thead>

                                <tr>

                                    <th
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleSort("id")}
                                    >
                                        Employee Id {getSortIcon("id")}
                                    </th>

                                    <th
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleSort("firstName")}
                                    >
                                        Employee First Name {getSortIcon("firstName")}
                                    </th>

                                    <th
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleSort("lastName")}
                                    >
                                        Employee Last Name {getSortIcon("lastName")}
                                    </th>

                                    <th
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleSort("email")}
                                    >
                                        Employee Email {getSortIcon("email")}
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>
                            {employees.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        No employees found.
                                    </td>
                                </tr>
                            ) : (
                                employees.map((employee) => (
                                    <tr key={employee.id}>
                                        <td>{employee.id}</td>
                                        <td>{employee.firstName}</td>
                                        <td>{employee.lastName}</td>
                                        <td>{employee.email}</td>

                                        <td>
                                            <div className="d-flex gap-2 justify-content-center">
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => updateEmployee(employee.id)}
                                                >
                                                    Update
                                                </button>

                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => removeEmployee(employee.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                        </table>
                    </div>
            }

            <div className="d-flex justify-content-center align-items-center gap-3 mb-3">

                <button
                    className="btn btn-outline-primary"
                    disabled={pageNo === 0 || loading}
                    onClick={() => setPageNo(pageNo - 1)}
                >
                    Previous
                </button>

                <span className="fw-bold">
                    Page {pageNo + 1} of {totalPages}
                </span>

                <button
                    className="btn btn-outline-primary"
                    disabled={last || loading}
                    onClick={() => setPageNo(pageNo + 1)}
                >
                    Next
                </button>

            </div>

        </div>
    );
}

export default ListEmployeeComponent;