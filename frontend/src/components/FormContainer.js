import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const FormContainer = ({ children, xs, md }) => {
    return (
        <Container>
            <Row className='justify-content-md-center'>
                <Col xs={xs} md={md}>
                    {children}
                </Col>
            </Row>
        </Container>
    )
}

export default FormContainer