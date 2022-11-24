import { Container, Row, Col, Figure, Alert } from "react-bootstrap";
import { useEffect, useState } from "react";
import { getTop3Users } from "../../api/users";
import './TopThree.css';

function TopThree(props) {

    const [topThree, setTopThree] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const placements = [
        <span className="user--placements__gold">1<span className="h1">st</span></span>,
        <span className="user--placements__silver">2<span className="h1">nd</span></span>,
        <span className="user--placements__bronze">3<span className="h1">rd</span></span>
    ];
    let actualPlacement = 0;

    // Refresh top three scores every 5 seconds
    useEffect((() => {

        // Get top three scores
        function getTopThree() {
            getTop3Users()
                .then((topThree) => {
                    setTopThree(topThree);
                    setErrorMessage("");
                })
                .catch(() => {
                    setErrorMessage("There was a problem loading the leaderboard, try again later");
                });
        }

        getTopThree(); // Initial call
        const refreshInterval = setInterval(getTopThree, 5000);  // Refresh leaderboard every 5 seconds

        // Called when component is unmounted
        return () => {
            clearInterval(refreshInterval);
        }

    }), []);

    return (

        <>
            <h1 className="text-center mb-5">Top 3 scores</h1>
            
            {topThree.map((user, i) => {

                // Increase placement if user's score is different than the previous one
                if (i > 0 && topThree[i - 1].points !== user.points)
                    actualPlacement++;

                return (
                    <Container fluid key={i}>
                        <Row className="invert-sm">
                            <Col className="col-12 col-sm-6 offset-sm-2 col-md-4 offset-md-3 col-lg-4 offset-lg-4">
                                <div className="d-flex">
                                    <div className="flex-shrink-0">
                                        <Figure>
                                            <Figure.Image
                                                  width={96}
                                                height={96}
                                                rounded={true}
                                                alt="User profile image"
                                                src={`http://localhost:3001/img/users/${user.profile_image}.svg`}
                                            />
                                        </Figure>
                                    </div>
                                    <div className="flex-grow-1 ms-2 text-start">
                                        <strong className="mt-3 d-block">@{user.username}</strong>
                                        <div className="me-auto h2 mt-2">
                                            {user.points} Pts.
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col className="col-12 col-md-3 col-sm-4">
                                <div className="ms-auto mt-3">
                                    {placements[actualPlacement]}
                                </div>
                            </Col>
                        </Row>
                    </Container>
                );
            })}

            {/* Error message */}
            {errorMessage.length > 0 && (<Alert variant="danger" className="text-center">{errorMessage}</Alert>)}

        </>
    );

}

export default TopThree;