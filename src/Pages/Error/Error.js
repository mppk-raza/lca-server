import React from "react"
import "./Error.css"
import error2 from "../../assets/error2.jpg"
import { Button } from "@mui/material"
import { useNavigate } from "react-router-dom";

export default function Error() {
    const navigate = useNavigate();
    return (<>
        <div className="error__container">
            <div className="error__content">
                <div className="error__content__bigtext">
                    Something's wrong here...
                </div>
                <div className="error__content__text">
                    We can't find the page you're looking for.
                    You can reach out to us for assisstance or head back to Home
                </div>
                <div className="error__content__buttons">
                    <Button variant={"outlined"} className="error__content__onebutton" onClick={(e) => { window.location.href = "mailto:no-reply@example.com"; e.preventDefault(); }} > Help </Button>
                    <div className="error__content__spacer"></div>
                    <Button variant={"contained"} className="error__content__onebutton" onClick={() => { navigate("/") }} > Home </Button>
                </div>
            </div>
            <div className="error__image__container">
                <img className="error__image" src={error2} alt="404 ERROR" />
            </div>
        </div>
    </>)
} 