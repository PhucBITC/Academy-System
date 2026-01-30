'use client'
import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import UpdateModal from './update.modal';
import CreateModal from './create.modal';
import { useState } from 'react';
import Link from 'next/link';


interface IProps {
    persons: IUser[]
}

const AppTable = (props: IProps) =>{
    const {persons} = props;
    
    const [person, setPerson] = useState<IUser | null> (null)
    const [showModalCreate, setShowModalCreate] = useState<boolean>(false)
    const [showModalUpdate, setShowModalUpdate] = useState<boolean>(false)

    return (
      <>
      <div className="mb-3"
            style={{
                display: "flex", 
                justifyContent: "space-between"
            }}
      >
        <h3>Person App</h3>
        <Button variant='secondary' onClick={() => setShowModalCreate(true)}>Add New</Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>MobileNumber</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {persons.map(item => {
            return (
                <tr key= {item.personId}>
                    <td>{item.personId}</td>
                    <td>{item.name}</td>
                    <td>{item.mobileNumber}</td>
                    <td>{item.email}</td>
                    <td>{item.roles.roleName}</td>
                    <td>
                          <Link 
                          className='btn btn-primary'
                          href={`/persons/${item.personId}`}>
                          View
                          </Link>
                  
                        <Button variant='warning' className='mx-3'
                            onClick={() =>{
                                setPerson(item)
                                setShowModalUpdate(true)
                            }}
                        >Edit
                        </Button>
                        <Button variant='danger'>Delete</Button>
                    </td>
                </tr>
            )
          })}  
        </tbody>
      </Table>
      <CreateModal
      showModalCreate = {showModalCreate}
      setShowModalCreate = {setShowModalCreate}
      />
      <UpdateModal
      showModalUpdate = {showModalUpdate}
      setShowModalUpdate = {setShowModalUpdate}
      person = {person}
      setPerson = {setPerson}
      />
      {/* <AppPagination/> */}
      </>
    )
}
export default AppTable