import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import del from '../assets/delete-forever.svg';



export default function Modale(props) {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleConfirm = () => {
        props.confirm();
        setShow(false);
    }
    return (
      <>
        <Button className="btn btn-danger pull-right mr-2" onClick={handleShow}>
        <img src={del} alt="delete logo"></img>&nbsp;Supprimer la liste
        </Button>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Supprimer la liste</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woooow, doucement malheureux ! Cette action est définitive ! Veux tu vraiment supprimer {props.liste} ?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              En fait non !
            </Button>
            <Button variant="primary" onClick={handleConfirm}>
              J'en suis sûr !
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  
