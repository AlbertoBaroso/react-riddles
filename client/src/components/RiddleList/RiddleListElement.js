import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Badge, Container, Row, Col } from 'react-bootstrap';
import formatTime from '../Riddle/formatTime';
import { useState, useEffect } from 'react';


function RiddleListElement(props) {

    let navigate = useNavigate();

    const [remainingTime, setRemainingTime] = useState(formatTime(props.remainingTime));

    const updateTime = (timer) => {
        const time = (props.endTime - new Date().getTime()) / 1000;
        if (time >= 0) {
            setRemainingTime(formatTime(time));
        } else {
            clearInterval(timer);
            props.setRiddleClosed(props.id);
        }
    }

    useEffect(() => {
        if (!props.solutionFound && !props.closed && props.startTime) {
            const timer = setInterval(() => updateTime(timer), 1000);
            updateTime(timer);
            return () => clearInterval(timer);
        }
    });

    return (
        <Container fluid className="riddle-list-element mb-3"
            onClick={() => { navigate('/riddles/' + props.id) }}>
            <Row>
                <Col>
                    <h6 className='mt-2'>Riddle #{props.id + 2020}</h6>
                </Col>
            </Row>
            <Row>
                <Col className='px-3 mx-2'>
                    <p className='position-relative d-inline-block mb-2'>
                        <FaQuoteLeft className="riddle-list-element__quote--left" />
                        <span className='d-block p-2'>{props.question}</span>
                        <FaQuoteRight className="riddle-list-element__quote--right" />
                    </p>
                </Col>
            </Row>
            <Row>
                <Col>
                    Difficulty:
                    <Badge bg="primary" className="riddle-list-element__info px-2 mx-2">
                        {props.difficulty.toUpperCase()}
                    </Badge>
                </Col>
                <Col>
                    {props.solutionFound || props.closed || props.startTime === null ? "Status:" : "Remaining time:"}
                    <Badge bg="primary" className="riddle-list-element__info px-2 mx-2">
                        {props.solutionFound || props.closed ? "CLOSED" :
                            props.startTime === null ? "OPEN" : remainingTime}
                    </Badge>
                </Col>
            </Row>
        </Container>
    )
}

export default RiddleListElement;