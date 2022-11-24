import { Figure, Placeholder, Card } from "react-bootstrap";


function RiddleAnswer(props) {

    const difficulties = {
        'hard': 3,
        'average': 2,
        'easy': 1
    };

    return (
        <div className="d-flex riddle__answer mb-2">
            <div className="flex-shrink-0 position-relative">
                <Figure>
                    <Figure.Image
                        width={48}
                        height={48}
                        rounded={true}
                        className="mt-1"
                        alt="User profile image"
                        src={`http://localhost:3001/img/users/${props.profile_image}.svg`}
                    />
                </Figure>
                {
                    props.winner === 1 &&
                    <span className="answer-ribbon">
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <span>WINNER</span>
                    </span>
                }
            </div>
            <div className="flex-grow-1 px-2 ms-3 text-start">
                <h6 className="mt-2 mb-1">@{props.username}</h6>
                <div>
                    {   /* Correct response is initially hidden */
                        (props.winner === 1 && !props.responseRevealed) &&
                        <Placeholder as={Card.Title} animation="wave" className="w-75 d-inline-block"
                            onClick={() => props.setResponseRevealed(true)}>
                            <Placeholder xs={12} size="lg" />
                            <span className='riddle__placeholder--small text-center'>Click to reveal</span>
                        </Placeholder>
                    }
                    {
                        (!props.winner || props.responseRevealed) &&
                        <p className="fw-lighter d-inline-block">{props.answer}</p>
                    }
                </div>
            </div>
            <div className="flex-shrink-0 px-3">
                {
                    (props.winner === 1) &&
                    <h5 className="fw-lighter d-inline-block py-3">+ {difficulties[props.difficulty]} Pts.</h5>
                }
            </div>
        </div>
    );

}

export default RiddleAnswer;