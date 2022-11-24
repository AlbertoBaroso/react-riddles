
import { Container, Row, Col } from 'react-bootstrap';
import { Outlet } from "react-router-dom";
import Topbar from '../Topbar/Topbar';

function Main(props) {
    return (
        <Container fluid>
            <Row>
                <Col className='px-0'>
                    <Topbar setLoggedIn={props.setLoggedIn} />
                    <Container>
                        <Row>
                            <Col>
                                <Outlet />
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>
        </Container>
    )
}

export default Main;