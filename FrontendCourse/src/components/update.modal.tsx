'use client'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import {toast } from 'react-toastify';
import { mutate } from 'swr';

interface IProp{
    showModalUpdate: boolean;
    setShowModalUpdate: (v: boolean) => void;
    person : IUser | null
    setPerson: (value : IUser | null) => void;
}

function UpdateModal(props: IProp) {
  const {showModalUpdate, setShowModalUpdate, person, setPerson} = props;  

  const [personId, setPersonId] = useState<number>(0)
  const [name, setName] = useState<string>("")
  const [mobileNumber, setMobileNumber] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [role, setRole] = useState<string>("STUDENT")

  useEffect(() => {
    if(person && person.personId){
      setPersonId(person.personId); 
      setName(person.name)
      setMobileNumber(person.mobileNumber)
      setEmail(person.email)
      setRole(person.roles.roleName)
    }
  }, [person])


  const handleSubmit = async () => {
    const updatePerson = {
      name: name,
      mobileNumber: mobileNumber,
      email: email,
      roles: {
        roleName: role
    }
    };
  
    try {
      const response = await fetch(`http://localhost:8080/api/contact/updatePerson/${personId}`, 
        {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePerson),
      });
  
      if (response.ok) {
        mutate("http://localhost:8080/api/contact/persons")
        toast.success('Update Succeed');
        handeCloseModel();
      } else {
        toast.error('Create Failed');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Create Failed');
    }
  };
  
  const handeCloseModel = () =>{
    setEmail("");
    setName("");
    setMobileNumber("");
    // setPassword("");
    setPerson(null)
    setShowModalUpdate(false)

  }
  return (
    <>
      <Modal
        show={showModalUpdate}
        onHide={() => handeCloseModel()}
        backdrop="static"
        keyboard={false}
        size='lg'
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Person</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
            <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="..." 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" placeholder="..." 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control type="text" placeholder="..." 
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Control type="text" placeholder="..." 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                />
            </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handeCloseModel()}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleSubmit()}>Update</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateModal;