import { Container, Row, Col, Form, Alert, Button, Pagination } from "react-bootstrap";
import RiddleListElement from "./RiddleListElement.js";
import { useState, useEffect } from "react";
import { getAllRiddles, getMyRiddles } from "../../api/riddles.js";
import './RiddleList.css';
import { useNavigate } from "react-router-dom";

function RiddleList(props) {

    /* Riddle list state */

    const [riddles, setRiddles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const setRiddleClosed = (riddleID) => {
        setRiddles((originalRiddles) => {
            return originalRiddles.map((riddle) => {
                // Set riddle status to "closed"
                if (riddle.id === riddleID) {
                    const newRiddle = { ...riddle };
                    newRiddle.closed = true;
                    return newRiddle;
                } else {
                    return riddle;
                }
            })
        });
    }

    /* Filters */
    const [showOpen, setShowOpen] = useState(true);
    const [showClosed, setShowClosed] = useState(true);
    const navigate = useNavigate();
    const [loadingTime] = useState(new Date().getTime());

    /* Pagination */
    const [currentPage, setCurrentPage] = useState(0);
    const riddlesPerPage = 4;

    /* Fetch riddles */

    useEffect(() => {
        const fetchRiddles = props.type === "all" ? getAllRiddles : getMyRiddles;
        fetchRiddles()
            .then((riddleData) => {
                setRiddles(riddleData);
                setErrorMessage("");
            })
            .catch((err) => {
                setErrorMessage(JSON.parse(err.message).error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [props.type]);

    const filteredRiddleList = riddles
        .filter((riddle) => { // Filter open/closed
            return (showClosed && (riddle.closed || riddle.solution_found)) || (showOpen && !riddle.closed && !riddle.solution_found);
        });

    const riddleList = filteredRiddleList
        .sort((a, b) => { // Sort by remaining time and creation date
            if (a.remainingTime > 0 && b.remainingTime > 0)
                return b.remainingTime - a.remainingTime
            else if (a.remainingTime > 0)
                return -1
            else if (b.remainingTime > 0)
                return 1
            else
                return b.created_at.localeCompare(a.created_at);
        })
        .filter((riddle, index) => { // Pagination
            return index >= currentPage * riddlesPerPage && index < (currentPage + 1) * riddlesPerPage;
        })
        .map((riddle) => // Map to RiddleListElement Components
            <RiddleListElement key={riddle.id} id={riddle.id}
                question={riddle.question} difficulty={riddle.difficulty}
                duration={riddle.duration} solutionFound={riddle.solution_found}
                closed={riddle.closed} remainingTime={riddle.remainingTime}
                endTime={riddle.remainingTime * 1000 + loadingTime}
                setRiddleClosed={setRiddleClosed} startTime={riddle.start_time} />
        );

    const pages = Math.ceil(filteredRiddleList.length / riddlesPerPage);
    const pagination = [...Array(pages).keys()].map((pageNumber) => {
        return (<Pagination.Item key={pageNumber} active={pageNumber === currentPage} onClick={() => setCurrentPage(pageNumber)}>
            {pageNumber + 1}
        </Pagination.Item>);
    });

    return (
        <Container fluid className="px-0">
            <Row>
                <Col className="col-12 col-md-3">
                    <h4>Filters</h4>
                    <Form.Group className="mb-3">
                        <Form.Check type="checkbox" label="Open riddles" checked={showOpen} onChange={(e) => { setShowOpen(e.target.checked); setCurrentPage(0); }} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Check type="checkbox" label="Closed riddles" checked={showClosed} onChange={(e) => { setShowClosed(e.target.checked); setCurrentPage(0); }} />
                    </Form.Group>
                </Col>
                <Col className="col-12 col-md-9 col-lg-7">
                    <h4>{props.type === "mine" && "Your "}Riddles</h4>
                    {errorMessage.length > 0 && <Alert variant="danger">{errorMessage}</Alert>}

                    {!loading && riddleList}
                    {
                        !loading && filteredRiddleList.length > riddlesPerPage &&
                        <Pagination className="justify-content-center">
                            <Pagination.Prev onClick={() => setCurrentPage(page => Math.max(0, page - 1))} />
                            {pagination}
                            <Pagination.Next onClick={() => setCurrentPage(page => Math.min(pages - 1, page + 1))} />
                        </Pagination>
                    }
                    {!loading && riddleList.length === 0 && <p>No riddles found</p>}

                    {
                        props.type === "mine" && riddleList.length === 0 &&
                        <Button variant="primary" onClick={() => navigate("/new")}>
                            Create a new riddle
                        </Button>
                    }
                </Col>
            </Row>
        </Container>
    );

}

export default RiddleList;