import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import { Badge, Alert, Placeholder, Card, Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { Navigate, useNavigate, useParams } from "react-router-dom";
import RiddleAnswer from './RiddleAnswer';
import { fetchRiddle, submitAnswer } from '../../api/riddles';
import { useState, useEffect } from 'react';
import pop from './answerAnimation';
import './Riddle.css';
import AuthContext from '../../context/authContext';
import formatTime from './formatTime';


function Riddle(props) {

    /* Riddle state */
    const [riddle, setRiddle] = useState({});
    const [fetchErrorMessage, setFetchErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [responseRevealed, setResponseRevealed] = useState(false);
    const [timeToFirstHint, setTimeToFirstHint] = useState(-1);
    const [timeToSecondHint, setTimeToSecondHint] = useState(-1);
    const [remainingTime, setRemainingTime] = useState(-1);
    /* Answer form state */
    const [answerSubmissionLoading, setAnswerSubmissionLoading] = useState(false);
    const [submitErrorMessage, setSubmitErrorMessage] = useState("");
    const [answer, setAnswer] = useState("");

    const { riddleID } = useParams();
    const navigate = useNavigate();

    // Refresh riddle data every second
    useEffect((() => {

        function getRiddle() {
            fetchRiddle(riddleID)
                .then((riddleData) => {

                    setRiddle(riddleData);
                    setFetchErrorMessage("");
                    if (riddleData.closed || riddleData.solution_found)
                        clearInterval(refreshInterval);

                    if (riddleData.start_time > 0) {
                        setRemainingTime(riddleData.remainingTime);
                        setTimeToFirstHint(Math.max(0, 0.5 * riddleData.duration - riddleData.elapsedTime));
                        setTimeToSecondHint(Math.max(0, 0.75 * riddleData.duration - riddleData.elapsedTime));
                    }

                })
                .catch((error) => {
                    try {
                        const errorMessage = JSON.parse(error.message).error;
                        setFetchErrorMessage(errorMessage);
                    } catch (e) {
                        setFetchErrorMessage(error.message);
                    }
                })
                .finally(() => {
                    if (loading)
                        setLoading(false);
                });
        }

        getRiddle(); // Initial call
        const refreshInterval = setInterval(getRiddle, 1000);  // Refresh riddle data every second

        // Called when component is unmounted
        return () => {
            clearInterval(refreshInterval);
        }

    }), []);

    /* Get riddle id from url */
    if (isNaN(riddleID)) {
        return <Navigate to="/riddles" />;
    }

    /* On form submit handle answer creation */
    const handleAnswerSubmission = (event) => {
        event.preventDefault();
        setAnswerSubmissionLoading(false);
        setAnswerSubmissionLoading(true);
        submitAnswer(riddleID, answer)
            .then((correct) => {
                setAnswer("");
                if (correct) {
                    setResponseRevealed(true);
                    pop("correct");
                } else {
                    pop("wrong");
                }
            })
            .catch((error) => {
                setSubmitErrorMessage(JSON.parse(error.message).error);
            })
            .finally(() => {
                setAnswerSubmissionLoading(false);
            });
    }

    return (
        <Container>
            <Row>
                <Col className='col-12 col-sm-10 col-md-8 col-lg-7 col-xl-5 mx-auto'>

                    {/* Error message */}
                    {fetchErrorMessage.length > 0 && (<Alert variant="danger" className="text-center mt-4">{fetchErrorMessage}</Alert>)}

                    {   /* Riddle data */
                        !loading && riddle && Object.keys(riddle).length > 0 && 
                        <>
                            {/* Riddle difficulty and time */}
                            <section>
                                <h1>Riddle #{riddle.id + 2020}</h1>
                                <p className='mb-2'>Difficulty:
                                    <Badge bg="primary" className="riddle__difficulty px-2 mx-2">
                                        {riddle.difficulty.toUpperCase()}
                                    </Badge>
                                </p>
                                <p className='mb-2'>{riddle.solution_found || riddle.closed || riddle.start_time === null ? "Status:" : "Remaining time:"}
                                    <Badge bg="primary" className="riddle__timer px-2 mx-2">
                                        {
                                            riddle.solution_found || riddle.closed ? "CLOSED" :
                                                riddle.start_time === null ? "OPEN" : formatTime(remainingTime)
                                        }
                                    </Badge>
                                </p>
                            </section>

                            {/* Riddle question and hints */}
                            <section className='riddle d-block p-2 p-sm-5 text-center'>
                                <blockquote className="riddle__question">
                                    <FaQuoteLeft className="riddle__quote--left" />
                                    {riddle.question}
                                    <FaQuoteRight className="riddle__quote--right" />
                                </blockquote>
                                <cite className='riddle__author'>@{riddle.username}</cite>
                                {   /* Riddle hints */
                                    <div className='riddle__hints mt-2'>
                                        <span>Hint #1: </span>
                                        {
                                            riddle.hasOwnProperty("first_hint") ?
                                                <span>{riddle.first_hint}</span> :
                                                <Badge bg="primary" className="px-2">
                                                    {riddle.start_time > 0 ? "Unlocks in " + formatTime(timeToFirstHint) : "Answer to unlock"}
                                                </Badge>
                                        }
                                        <br />
                                        <span>Hint #2: </span>
                                        {
                                            riddle.hasOwnProperty("second_hint") ?
                                                <span>{riddle.second_hint}</span> :
                                                <Badge bg="primary" className="px-2">
                                                    {riddle.start_time > 0 ? "Unlocks in " + formatTime(timeToSecondHint) : "Answer to unlock"}
                                                </Badge>
                                        }
                                    </div>
                                }
                            </section>

                            <AuthContext.Consumer>
                                {(isLoggedIn) => {
                                    return (
                                        <>

                                            {
                                                /* User is not logged in, show message */
                                                !isLoggedIn &&
                                                <Alert variant="info" className="text-center mt-4">
                                                    You must be logged in to answer riddles and see other users' answers.
                                                    <Button variant="primary" className="mt-2 d-block mx-auto" onClick={() => {
                                                        navigate("/login");
                                                    }}>Login</Button>
                                                </Alert>
                                            }

                                            {
                                                /* Correct answer: visible only when riddle is closed or solution has been found */
                                                (isLoggedIn && (riddle.solution_found || riddle.closed) && riddle.response) &&
                                                <section className='riddle__response d-block text-center'>
                                                    <h4>Answer:
                                                        {   /* Correct response is initially hidden */
                                                            !responseRevealed &&
                                                            <Placeholder as={Card.Title} animation="wave" className="w-50 d-inline-block ml-2 mb-0 align-middle"
                                                                onClick={() => setResponseRevealed(true)}>
                                                                <Placeholder xs={11} size="lg" />
                                                                <span className='riddle__placeholder--small'>Click to reveal</span>
                                                            </Placeholder>
                                                        }
                                                        {responseRevealed && <Card.Title className="fw-lighter d-inline-block px-2">{riddle.response}</Card.Title>}
                                                    </h4>
                                                </section>
                                            }

                                            {
                                                /* Submit answer form: visible only when riddle is open, unaswered, and user's not the writer */
                                                (isLoggedIn && !riddle.solution_found && !riddle.closed && !riddle.yours && !riddle.answered) &&
                                                <section className='d-block my-5 text-center py-5' id="answer-submission">
                                                    <Form onSubmit={!answerSubmissionLoading ? handleAnswerSubmission : null}>
                                                        <h5>Submit your answer:</h5>
                                                        <Form.Control
                                                            type="text"
                                                            className="riddle__answer-input mb-3"
                                                            placeholder="Your answer"
                                                            value={answer}
                                                            onChange={(event) => setAnswer(event.target.value)}
                                                            required={true}
                                                            minLength={1}
                                                            maxLength={100}
                                                        />
                                                        <Button variant="primary" type="submit" disabled={answerSubmissionLoading} className="d-block mx-auto">
                                                            Answer
                                                            {answerSubmissionLoading && <Spinner className='ms-2' as="span" animation="border" size="sm" role="status" aria-hidden="true" />}
                                                        </Button>
                                                        {
                                                            /* Error message */
                                                            submitErrorMessage.length > 0 &&
                                                            <Alert variant="danger" className="text-center d-inline-block mt-4" dismissible={true} onClose={() => setSubmitErrorMessage("")}>
                                                                {submitErrorMessage}
                                                            </Alert>
                                                        }
                                                    </Form>
                                                </section>
                                            }
                                            {
                                                /* User answers: Visible only if user has already answered or if the user is the writer */
                                                (isLoggedIn && (riddle.answered || riddle.yours || riddle.closed || !!riddle.solution_found)) &&
                                                <section className='riddle__answers my-5 py-4'>
                                                    <h2>User answers</h2>
                                                    {riddle.answers.length === 0 ? <span>No answer yet</span> :
                                                        riddle.answers.sort((a) => a.winner ? -1 : 0).map((answer, index) => {
                                                            return (
                                                                <RiddleAnswer username={answer.username} answer={answer.answer} key={index}
                                                                    profile_image={answer.profile_image} winner={answer.winner} difficulty={riddle.difficulty}
                                                                    responseRevealed={responseRevealed} setResponseRevealed={setResponseRevealed} />
                                                            );
                                                        })
                                                    }
                                                </section>
                                            }
                                        </>
                                    )
                                }}
                            </AuthContext.Consumer>
                        </>
                    }
                </Col>
            </Row>
        </Container>
    );
}

export default Riddle;