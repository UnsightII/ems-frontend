import React, { useState, useEffect } from 'react';
import { deleteEmployee, listEmployees } from '../services/EmployeeService';
import {useNavigate} from 'react-router-dom'

const ListEmployeeComponent = () => {

  const [employees,setEmployees] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize] = useState(5);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [last, setLast] = useState(false);
  const [totalElements, setTotalElements] = useState(0);

  const navigator = useNavigate();

  useEffect(() => {
    fetchEmployees();
}, [pageNo, search]);

  function fetchEmployees() {
    listEmployees(pageNo, pageSize, search)
        .then((response) => {
            setEmployees(response.data.content);
            setTotalPages(response.data.totalPages);
            setLast(response.data.last);
            setTotalElements(response.data.totalElements);
        })
        .catch(console.error);
        
      }

  function addNewEmployee(){
    navigator('/add-employee')
  }

  function updateEmployee(id){
    navigator(`/edit-employee/${id}`)
  }

  function removeEmployee(id){
    console.log(id);

    deleteEmployee(id).then((response)=>{
      fetchEmployees();
    }).catch(error => {
      console.log(error);
    })
  }


  return (
    <div className="container card shadow-lg">
      <div>
        <h2 className = "text-center">List of Employee</h2>
        <div className="d-flex justify-content-between mb-3">

            <button
                className="btn btn-primary"
                onClick={addNewEmployee}
            >
                Add Employee
            </button>

            <p className="text-muted">
                Showing {employees.length} of {totalElements} employees
            </p>

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

        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Employee Id</th>
              <th>Employee First Name</th>
              <th>Employee Last Name</th>
              <th>Employee email Id</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              employees.map(employee => 
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.firstName}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.email}</td>
                  <td>
                    <button className='btn btn-info' onClick={()=> updateEmployee(employee.id)}>Update</button>
                    <button className='btn btn-danger' onClick={()=> removeEmployee(employee.id)}
                        style={{marginLeft: '10px'}}
                      >Delete</button>
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
        <div className="d-flex justify-content-center align-items-center gap-3 mt-3">

          <button
              className="btn btn-outline-primary"
              onClick={() => setPageNo(pageNo - 1)}
              disabled={pageNo === 0}
          >
              Previous
          </button>

          <span className="fw-bold">
              Page {pageNo + 1} of {totalPages}
          </span>

          <button
              className="btn btn-outline-primary"
              onClick={() => setPageNo(pageNo + 1)}
              disabled={last}
          >
              Next
          </button>

      </div>
      </div>
    </div>
  )
}

export default ListEmployeeComponent