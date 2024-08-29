import React from "react";
import "./UserTrainings.css"
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, useLocation } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import CoursesPagination from "../../../components/CoursesPagination/CoursesPagination";
import axios from "axios";

const Search = styled("div")(({ theme }) => ({
    zIndex: 1,
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "lightGrey",
    "&:hover": {
        backgroundColor: " rgba(240, 238, 238, 0.816)",
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        width: "auto",
    },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    zIndex: '7 !important',
    color: "inherit",
    "& .MuiInputBase-input": {
        zIndex: '7 !important',
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            width: "22ch",
            "&:focus": {
                width: "30ch",
            },
        },
    },
}));


export default function UserTrainings() {
    const [category, setCategory] = React.useState("all");
    const [status, setStatus] = React.useState("All");
    const [search, setSearch] = React.useState("");
    const [allData, setAllData] = React.useState(null);
    const [nomData, setNomData] = React.useState(null);
    const [statData, setStatData] = React.useState(null);
    const [catData, setCatData] = React.useState(null);
    const [showData, setShowData] = React.useState(null);

    const pageSize = 8;
    const path = useLocation().pathname;
    const navigate = useNavigate();
    const [pagination, setPagination] = React.useState({
        count: 0,
        from: 0,
        to: pageSize
    });

    React.useEffect(() => {
        axios.post(process.env.REACT_APP_BACKEND_URL + "/api/trainings/getActiveTrainingsForUser", {
            token: localStorage.getItem("token")
        }).then((res) => {
            console.log(res)
            if (!res.data.error) {
                setAllData(res.data.data)
            }
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    React.useEffect(() => {
        axios.post(process.env.REACT_APP_BACKEND_URL + "/api/trainings/getNominatedTrainingsForUser", {
            token: localStorage.getItem("token")
        }).then((res) => {
            console.log(res)
            if (!res.data.error) {
                setNomData(res.data.data)
            }
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    React.useEffect(() => {
        if (allData && nomData) {
            if (status === 'All') { setStatData(allData); console.log(allData) }
            else { setStatData(nomData); }
        }
    }, [status, allData, nomData])

    React.useEffect(() => {
        if (statData) {
            let out = []
            if (category === 'all') out = statData;
            else if (category === 'online') {
                statData.map((item) => {
                    if (item.eventType === "online") out.push(item);
                    return null;
                })
            }
            else {
                statData.map((item) => {
                    if (item.eventType === "physical") out.push(item);
                    return null;
                })
            }
            setCatData(out)
        }
    }, [category, statData])

    React.useEffect(() => {
        if (catData) {
            let out = []
            if (search !== "") {
                catData.map((item) => {
                    let str = item.name + " " + item.location + " " + item.description;
                    if (str.includes(search)) {
                        out.push(item);
                    }
                    return null;
                })
            } else {
                out = catData;
            }
            setShowData(out);
            setPagination({
                count: out.length,
                from: 0,
                to: pageSize
            })
        }
    }, [search, catData])

    function UserTrainings__Filter() {
        const orangeTheme = createTheme({ palette: { primary: { main: '#00a0ad', }, secondary: { main: '#fff' } } });
        return (
            <div className="UserTrainings__Filter">
                <div className="UserTrainings__Filter__left">
                    <Search sx={{ zIndex: '1' }} >
                        <SearchIconWrapper> <SearchIcon /> </SearchIconWrapper>
                        <StyledInputBase
                            sx={{ zIndex: '1' }}
                            placeholder="Search…"
                            inputProps={{ "aria-label": "search" }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Search>
                </div>
                <div className="UserTrainings__Filter__right">
                <div className="UserTrainings__Filter__mid">
                    <div onClick={() => setStatus("All")} className={status === "All" ? "UserTrainings__Filter__mid__item__active" : "UserTrainings__Filter__mid__item"}>All</div>
                    <div onClick={() => setStatus("Nominated")} className={status === "Nominated" ? "UserTrainings__Filter__mid__item__active" : "UserTrainings__Filter__mid__item"}>Nominated</div>
                </div>
                    <ThemeProvider theme={orangeTheme}>
                        <FormControl size="small" fullWidth>
                            <InputLabel id="demo-select-small" sx={{ color: "white" }}>Category</InputLabel>
                            <Select fullWidth labelId="demo-select-small" id="demo-select-small" value={category} label="Category"
                                onChange={(e) => setCategory(e.target.value)}
                                sx={{
                                    '.MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'white',
                                    },
                                    color: "white",
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#00a0ad',
                                    },
                                    '.MuiSvgIcon-root ': {
                                        fill: "white !important",
                                    }
                                }}

                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="online">Online</MenuItem>
                                <MenuItem value="physical">Physical</MenuItem>
                            </Select>
                        </FormControl>
                    </ThemeProvider>
                </div>
            </div>
        );
    };

    function UserTrainings__List() {
        let skeleton = [1, 2, 3, 4, 1, 2, 3, 4];
        return (
            <div className="UserTrainings__List">
                {showData ? (
                    <>
                        {showData.slice(pagination.from, pagination.to).map((cur, ind) => {
                            return (
                                <div key={ind} className={"UserTrainings__List__card"}>
                                    <div className="UserTrainings__List__card__img" onClick={() => { navigate("/UserPanel/oneTraining", { state: { backUrl: path, data: cur,trainings:showData ,id:cur._id} }) }}>
                                        <div className="UserTrainings__List__card__details__container">
                                            <div className="UserTrainings__List__card__title">
                                                {cur.name}
                                            </div>
                                            <div className="UserTrainings__List__card__instructor">
                                                Location : {cur.location}
                                            </div>
                                            <div className="UserTrainings__List__card__instructor">
                                                Mode : {cur.eventType.toUpperCase()}
                                            </div>
                                            <div className="UserTrainings__List__card__instructor">
                                                Start : {new Date(cur.startDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', time: "short" }) + " at " + new Date(cur.startDate).toTimeString().slice(0, 8)}
                                            </div>
                                            <div className="UserTrainings__List__card__instructor">
                                                End : {new Date(cur.endDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', time: "short" }) + " at " + new Date(cur.endDate).toTimeString().slice(0, 8)}
                                            </div>
                                            <br />
                                            <div className="UserTrainings__List__card__sec__time__box">
                                                <div className="UserTrainings__List__card__sec__time__box__item">
                                                    {cur.capacity} enrolled
                                                </div>
                                                <div className="UserTrainings__List__card__sec__time__box__item">
                                                    {cur.slotsLeft} slots left
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            );
                        })}
                    </>
                ) : (
                    <div className="UserTrainings__List__skeletons__box">
                        {skeleton.map((cur, ind) => {
                            return (
                                <div key={ind} className="UserTrainings__List__skeletons">
                                    <div className="UserTrainings__List__skeletons__top">
                                        <Skeleton sx={{ marginBottom: "10px" }} variant="rounded" width="100%" height={390} />
                                    </div> 
                                    <div className="UserTrainings__List__skeletons__bottom">
                                        <Skeleton sx={{ margin: "0 auto", bgcolor: '#c7c3c3' }} variant="rounded" width="80%" height={20} />
                                        <Skeleton sx={{ margin: "0 auto", bgcolor: '#c7c3c3' }} variant="rounded" width="80%" height={15} />
                                        <Skeleton sx={{ margin: "0 auto", bgcolor: '#c7c3c3' }} variant="rounded" width="80%" height={15} />
                                        <Skeleton sx={{ margin: "0 auto", bgcolor: '#c7c3c3' }} variant="rounded" width="80%" height={15} />
                                        <Skeleton sx={{ margin: "0 auto", bgcolor: '#c7c3c3' }} variant="rounded" width="80%" height={15} />
                                        <div className="UserTrainings__List__skeletons__bottom__iner"> <Skeleton sx={{ bgcolor: '#c7c3c3' }} variant="rounded" width="40%" height={12} /> <Skeleton sx={{ bgcolor: '#c7c3c3' }} variant="rounded" width="40%" height={12} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )
                }
            </div >
        );
    };

    return (<>
        <div className="UserTrainings">
            <div className="UserTrainings__Heading">Trainings List</div>
            {UserTrainings__Filter()}
            {UserTrainings__List()}
            <CoursesPagination
                pageSize={pageSize}
                pagination={pagination}
                setPagination={setPagination}
            />
        </div>
    </>)
}