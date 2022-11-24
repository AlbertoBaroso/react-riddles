import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { login } from "../../api/users";
import AuthContext from "../../context/authContext";

export default function LoginForm(props) {

    /* Input values */
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    /* Login status */
    const [isLoading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState("");
    const navigate = useNavigate();
    const isLoggedIn = useContext(AuthContext);

    /* Redirect already athenticated users to riddles page */
    if (isLoggedIn) {
        navigate('/riddles/');
    }

    const handleLogin = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setLoading(true);
        login(username, password)
            .then(() => {
                props.setLoggedIn(true);
                navigate('/');
            })
            .catch((error) => {
                setLoginError("Wrong username or password");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return <Form onSubmit={handleLogin} className="col-12 col-sm-6 mx-auto">
        <h3>Login</h3>
        <Form.Group className="my-3">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="username" required={true}
                autoComplete="username"
                onChange={(event) => setUsername(event.target.value)} value={username} />
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" required={true}
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)} value={password} />
        </Form.Group>
        <Form.Group className="my-4 text-center">
            {
                loginError.length > 0 &&
                <Alert variant="danger" className="d-inline-block"  onClose={() => setLoginError("")} dismissible>
                    {loginError}
                </Alert>
            }
            <Button type="submit" variant="primary" className="mx-auto d-block">
                Login
                {isLoading && <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="ms-2" />}
            </Button>
        </Form.Group>
    </Form>

}