'use client'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import {toast } from 'react-toastify';
import { mutate } from 'swr';

interface IProp{
    showModalCreate: boolean;
    setShowModalCreate: (v: boolean) => void;
}

function CreateModal(props: IProp) {
  const {showModalCreate, setShowModalCreate} = props;  

  const [name, setName] = useState<string>("")
  const [mobileNumber, setMobileNumber] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const handleSubmit = async () => {
    const newPerson = {
      name: name,
      mobileNumber: mobileNumber,
      email: email,
      pwd: password,
      accountFrom : "APP_LOG",
      roles: {
        roleName: "STUDENT"
    }
    };
  
    try {
      const response = await fetch('http://localhost:8080/api/contact/createPerson', 
        {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPerson),
      });
  
      if (response.ok) {
        toast.success('Create Succeed');
        handeCloseModel();
        mutate("http://localhost:8080/api/contact/persons")
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
    setPassword("");
    setShowModalCreate(false)

  }
  return (
    <>
      <Modal
        show={showModalCreate}
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
                <Form.Label>Password</Form.Label>
                <Form.Control type="text" placeholder="..." 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handeCloseModel()}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleSubmit()}>Save</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateModal;