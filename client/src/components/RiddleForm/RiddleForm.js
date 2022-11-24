import { Alert, Button, Form, FloatingLabel, ToggleButton, ButtonGroup, Spinner, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { createRiddle } from '../../api/riddles';
import AuthContext from '../../context/authContext';
import CharCounter from './CharCounter';
import './RiddleForm.css';

function RiddleForm(props) {

    /* Input values */

    const difficulties = ['Easy', 'Average', 'Hard'];
    const [question, setQuestion] = useState("");
    const [difficulty, setDifficulty] = useState('average');
    const [duration, setDuration] = useState(30);
    const [response, setResponse] = useState("");
    const [firstHint, setFirstHint] = useState("");
    const [secondHint, setSecondHint] = useState("");

    /* Form management state */

    const [validated, setValidated] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [textError, setError] = useState("");
    const navigate = useNavigate();
    const isLoggedIn = useContext(AuthContext);

    /* Redirect unathenticated users to riddles page */
    if (!isLoggedIn) {
        navigate('/riddles/');
    }

    const handleRiddleCreation = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        // Validate inputs
        const result = form.checkValidity();
        setValidated(true);

        // Send creation request
        if (result) {
            setLoading(true);
            createRiddle(question, difficulty, duration, response, firstHint, secondHint)
                .then((riddle) => {
                    navigate('/riddles/' + riddle.id);
                })
                .catch((error) => {
                    const errorMessage = JSON.parse(error.message).error;
                    setError(errorMessage);
                })
                .finally(() => {
                    setValidated(false);
                    setLoading(false);
                });
        }
    };

    /* Riddle Form Rendering */

    return (
        <Container className='px-0'>
            <Row>
                <Col className='col-12 col-lg-8 mx-auto'>
                    <Form validated={validated} onSubmit={!isLoading ? handleRiddleCreation : null}>

                        <h3>Create a new riddle</h3>

                        {/* Riddle Question */}

                        <Form.Group className="mb-3" controlId="riddleQuestion">
                            <FloatingLabel label="Question">
                                <Form.Control
                                    as="textarea"
                                    placeholder="Write your question here"
                                    className='textarea-height'
                                    onChange={(event) => setQuestion(event.target.value)}
                                    maxLength="500"
                                    required={true}
                                    value={question}
                                />
                            </FloatingLabel>
                            <CharCounter actual={question.length} limit={500}></CharCounter>
                        </Form.Group>

                        {/* Riddle difficulty */}

                        <Form.Group className="mb-5 text-center" controlId="riddleDifficulty">
                            <Form.Label className='d-block'>Difficulty</Form.Label>
                            <ButtonGroup>
                                {difficulties.map((radio, id) => (
                                    <ToggleButton
                                        key={id}
                                        id={`riddle-difficulty-${id}`}
                                        type="radio"
                                        variant={'outline-primary'}
                                        name="riddle-difficulty"
                                        value={radio.toLowerCase()}
                                        checked={difficulty === radio.toLowerCase()}
                                        onChange={(e) => setDifficulty(e.currentTarget.value)}
                                    >
                                        {radio}
                                    </ToggleButton>
                                ))}
                            </ButtonGroup>
                        </Form.Group>

                        {/* Duration */}

                        <Form.Group className="mb-5" controlId="riddleDuration">
                            <FloatingLabel label="Duration (in seconds)">
                                <Form.Control
                                    type="number"
                                    placeholder="30"
                                    min={30}
                                    id={"riddleDurationInput"}
                                    max={600}
                                    value={duration}
                                    onChange={(event) => setDuration(event.target.value)}
                                />
                            </FloatingLabel>
                            <Form.Control.Feedback type="invalid">
                                Riddle duration must be between 30 and 600 seconds
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* Reponse */}

                        <Form.Group className="mb-3" controlId="riddleResponse">
                            <FloatingLabel label="Response">
                                <Form.Control
                                    type="text"
                                    value={response}
                                    maxLength={"100"}
                                    required={true}
                                    placeholder="Write your response here"
                                    onChange={(event) => setResponse(event.target.value)}
                                />
                            </FloatingLabel>
                            <CharCounter actual={response.length} limit={100}></CharCounter>
                        </Form.Group>

                        {/* Hints */}

                        <Form.Group className="mb-3" controlId="riddleFirstHint">
                            <FloatingLabel label="Hint #1">
                                <Form.Control
                                    type="text"
                                    value={firstHint}
                                    maxLength={"100"}
                                    required={true}
                                    placeholder="Write your first hint here"
                                    onChange={(event) => setFirstHint(event.target.value)}
                                />
                            </FloatingLabel>
                            <CharCounter actual={firstHint.length} limit={100}></CharCounter>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="riddleSecondHint">
                            <FloatingLabel label="Hint #2">
                                <Form.Control
                                    type="text"
                                    value={secondHint}
                                    placeholder="Write your second hint here"
                                    maxLength={"100"}
                                    required={true}
                                    onChange={(event) => setSecondHint(event.target.value)}
                                />
                            </FloatingLabel>
                            <CharCounter actual={secondHint.length} limit={100}></CharCounter>
                        </Form.Group>

                        {/* Error message */}

                        {textError.length > 0 && <Alert variant="danger">{textError}</Alert>}

                        {/* Submit button */}

                        <Button variant="primary" type="submit" className="mx-auto mb-5 d-block" disabled={isLoading}>
                            Create Riddle
                            {isLoading && <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="ms-2" />}
                        </Button>

                    </Form>
                </Col>
            </Row>
        </Container >
    )
}

export default RiddleForm;