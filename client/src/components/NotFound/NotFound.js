import { Button } from "react-bootstrap";

function NotFound(props) {
    return (
        <div className='text-center mt-5'>
            <h1 className="display-1">404</h1>
            <h2 className="mb-3">Page not found</h2>
            <Button variant="primary" href="/">Go back to solving riddles</Button>
        </div>
    );
}

export default NotFound;