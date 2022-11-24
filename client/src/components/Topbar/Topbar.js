import { Container, Navbar, Nav, Alert } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { AiOutlineUser } from "react-icons/ai";
import { logout } from "../../api/users";
import { useState } from "react";
import './Topbar.css';

const AuthContext = require('../../context/authContext').default;
const checkActiveLink = ({ isActive }) => (isActive ? "active" : "");

function Topbar(props) {

    const [logoutError, setLogoutError] = useState("");

    const handleLogout = () => {
        logout()
            .then(() => {
                props.setLoggedIn(false);
            })
            .catch((error) => {
                setLogoutError("There was a problem logging out, try again");
            });
    }

    return (
        <>
            <Navbar bg="light" expand="lg" className="soft-shadow mb-5">
                <Container>
                    <Navbar.Brand>React Riddles</Navbar.Brand>
                    <Navbar.Toggle aria-controls="top-navbar-nav" />
                    <AuthContext.Consumer>
                        {(isLoggedIn) => {
                            return <Navbar.Collapse id="top-navbar-nav" className="navbar--links">
                                <Nav className="mx-auto pt-3 pt-lg-0">
                                    <NavLink to="/" className={checkActiveLink}>Riddles</NavLink>
                                    {isLoggedIn && <NavLink to="/mine" className={checkActiveLink}>Your Riddles</NavLink>}
                                    <NavLink to="/top3" className={checkActiveLink}>Top 3</NavLink>
                                    {isLoggedIn && <NavLink to="/new" className={checkActiveLink}>Write a riddle</NavLink>}
                                </Nav>
                                <div className="ps-0 ps-lg-3 py-3 py-lg-0">
                                    {!isLoggedIn &&
                                        <NavLink to="/login" className={checkActiveLink}>
                                            Login<AiOutlineUser className="navbar--icon" />
                                        </NavLink>}
                                    {isLoggedIn && <span className="cursor-pointer" onClick={handleLogout}>Logout <MdLogout className="navbar--icon" /></span>}
                                </div>
                            </Navbar.Collapse>
                        }}
                    </AuthContext.Consumer>
                </Container>
            </Navbar>
            {
                logoutError.length > 0 &&
                <div className="text-center">
                    <Alert variant="danger" className="d-inline-block mb-5" dismissible onClick={() => setLogoutError("")}>{logoutError}</Alert>
                </div>
            }
        </>
    );
}

export default Topbar;