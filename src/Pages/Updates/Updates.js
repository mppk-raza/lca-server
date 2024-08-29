import React from "react";
import "./Updates.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { FaBriefcase, FaGraduationCap } from "react-icons/fa";
import axios from "axios";
import Skeleton from "@mui/material/Skeleton";

const Updates = () => {
    window.scrollTo(0, 0);

    const [items, setitems] = React.useState(null);
    React.useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND_URL + "/api/updates/getActiveUpdates").then((res) => {
            //console.log(res);
            setitems(res.data.data)
        }).catch((err) => {
            console.log(err);
        })
    }, [])
    return (
        <>
            <Header />
            <div className="updates">
                <div className="timeline">
                    {(items) ?
                        (items.length > 0) ?
                            <VerticalTimeline
                                lineColor={"#00a0ad"}
                            >
                                {items.map((item) => {
                                    let dateText = new Date(item.date).toLocaleString('en-US', { year: 'numeric', month: 'long', day: '2-digit' });
                                    return <VerticalTimelineElement
                                        className="vertical-timeline-element--work"
                                        contentStyle={(item.type && item.type === "education")
                                            ? { background: '#00a0ad', color: '#fff' }
                                            : { background: '#41424C', color: '#fff' }
                                        }
                                        contentArrowStyle={(item.type && item.type === "education")
                                            ? { borderRight: '7px solid #00a0ad' }
                                            : { borderRight: '7px solid #41424C' }
                                        }
                                        date={dateText}
                                        dateClassName={"Timeline__dateText"}
                                        iconStyle={(item.type && item.type === "education")
                                            ? { background: '#00a0ad', color: '#fff' }
                                            : { background: '#41424C', color: '#fff' }
                                        }
                                        icon={(item.type && item.type === "education")
                                            ? <FaGraduationCap />
                                            : <FaBriefcase />
                                        }
                                    >
                                        <div className="vertical-timeline-picture-container">
                                            <img src={item.imageLink} className="vertical-timeline-picture" />
                                        </div>
                                        <h3 className="vertical-timeline-element-title">{item.heading}</h3>
                                        <p style={{ fontSize: "small" }}> {(item.text.length > 250) ? item.text.slice(0, 250) + "..." : item.text} </p>
                                    </VerticalTimelineElement>
                                })}
                            </VerticalTimeline>
                            : <div style={{ minWidth: "100%", minHeight: "50vh", marginTop: "50px" }}>No Updates Found</div>
                        : <>
                            <VerticalTimeline lineColor={"grey"}>
                                <VerticalTimelineElement>
                                    <Skeleton animation="wave" variant="rectangular" width="100%" height="25vh" />
                                    <Skeleton animation="wave" variant="rectangular" width="100%" height="7vh" style={{ margin: "5px 0" }} />
                                    <Skeleton animation="wave" variant="rectangular" width="100%" height="4vh" />
                                </VerticalTimelineElement>
                                <VerticalTimelineElement>
                                    <Skeleton animation="wave" variant="rectangular" width="100%" height="25vh" />
                                    <Skeleton animation="wave" variant="rectangular" width="100%" height="7vh" style={{ margin: "5px 0" }} />
                                    <Skeleton animation="wave" variant="rectangular" width="100%" height="4vh" />
                                </VerticalTimelineElement>
                            </VerticalTimeline>
                        </>
                    }
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Updates;
