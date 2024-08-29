import React from 'react'
import "./Gallery.css"
import Skeleton from "@mui/material/Skeleton";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import axios from "axios"
import MyGallery from '../../components/MyGallery/MyGallery'

export default function GalleryFun() {

  const [data, setData] = React.useState(null);
  const [data2, setData2] = React.useState(null);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 4
    },
    desktop: {
      breakpoint: { max: 3000, min: 1000 },
      items: 3
    },
    mobile: {
      breakpoint: { max: 1000, min: 0 },
      items: 1
    }
  };


  React.useEffect(() => {
    axios.get(process.env.REACT_APP_BACKEND_URL + "/api/gallery/getRecentGalleryMedia")
      .then((res) => {
        setData(res.data.data)
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  React.useEffect(() => {
    axios.get(process.env.REACT_APP_BACKEND_URL + "/api/gallery/getActiveGalleryMedia")
      .then((res) => {
        //xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        //Sorting
        let array1 = res.data.data.sort((a, b) => {
          let fa = a.event.toLowerCase(),
            fb = b.event.toLowerCase();
          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        });
        //xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        //Done with sort. Now group
        const arrOut = [];
        let ind = 0;

        arrOut.push([]);
        arrOut[ind].push({
          src: array1[0].imageLink,
          width: 1,
          height: 1,
          event: array1[0].event
        });

        array1.reduce((previousValue, currentValue) => {
          if (previousValue.event.toLowerCase() === currentValue.event.toLowerCase()) {
            arrOut[ind].push({
              src: currentValue.imageLink,
              width: 1,
              height: 1,
              event: currentValue.event
            })
            return previousValue
          } else {
            arrOut.push([]);
            ind = ind + 1;
            arrOut[ind].push({
              src: currentValue.imageLink,
              width: 1,
              height: 1,
              event: currentValue.event
            })
            return currentValue
          }
        });

        setData2(arrOut);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Header />
      <div className="Gallery">
        <div style={{minHeight:"50px"}}></div>
        <div>
          {(data)
            ? <Carousel
              swipeable={true}
              draggable={true}
              showDots={true}
              responsive={responsive}
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={5000}
              keyBoardControl={false}
              transitionDuration={200}
              containerClass="carousel-container"
              removeArrowOnDeviceType={["tablet", "mobile"]}
              dotListClass="custom-dot-list-style"
              itemClass="carousel-item-padding-40-px"
            >
              {data.map((item) => {
                return <div className='Gallery_Car_Cont'>
                  <img src={item.imageLink} className="Gallery_Car_Item" />
                </div>
              })}
            </Carousel>
            : <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Skeleton
                sx={{
                  margin: "1% auto",
                  minWidth: "33%",
                  maxWidth: "33%",
                  minHeight: "40vh",
                  maxHeight: "40vh",
                }}
                variant="rectangular"
              />
              <Skeleton
                sx={{
                  margin: "1% auto",
                  minWidth: "33%",
                  maxWidth: "33%",
                  minHeight: "40vh",
                  maxHeight: "40vh",
                }}
                variant="rectangular"
              />
              <Skeleton
                sx={{
                  margin: "1% auto",
                  minWidth: "33%",
                  maxWidth: "33%",
                  minHeight: "40vh",
                  maxHeight: "40vh",
                }}
                variant="rectangular"
              />
            </div>
          }
        </div>
        <div style={{ minHeight: "50px" }}></div>
        <div className="Gallery__heading">Events</div>
        {(data2)
          ? data2.map((item) => {
            console.log(item);
            return (<div className='Gallery__Container'>
              <div className="Gallery__Heading__Small">{item[0].event.toUpperCase()}</div>
              <div className='Gallery_Gal_Cont'>
                <MyGallery photos={item} />
              </div>
            </div>)
          })
          : <>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
              <Skeleton
                sx={{
                  margin: "1% auto",
                  minWidth: "95%",
                  maxWidth: "95%",
                  minHeight: "10vh",
                  maxHeight: "10vh",
                }}
                variant="rectangular"
              />
              <Skeleton
                sx={{
                  margin: "1% auto",
                  minWidth: "30%",
                  maxWidth: "30%",
                  minHeight: "25vh",
                  maxHeight: "25vh",
                }}
                variant="rectangular"
              />
              <Skeleton
                sx={{
                  margin: "1% auto",
                  minWidth: "30%",
                  maxWidth: "30%",
                  minHeight: "25vh",
                  maxHeight: "25vh",
                }}
                variant="rectangular"
              />
              <Skeleton
                sx={{
                  margin: "1% auto",
                  minWidth: "30%",
                  maxWidth: "30%",
                  minHeight: "25vh",
                  maxHeight: "25vh",
                }}
                variant="rectangular"
              />
              <Skeleton
                sx={{
                  margin: "1% auto",
                  minWidth: "95%",
                  maxWidth: "95%",
                  minHeight: "10vh",
                  maxHeight: "10vh",
                }}
                variant="rectangular"
              />
              <Skeleton
                sx={{
                  margin: "1% auto",
                  minWidth: "30%",
                  maxWidth: "30%",
                  minHeight: "25vh",
                  maxHeight: "25vh",
                }}
                variant="rectangular"
              />
              <Skeleton
                sx={{
                  margin: "1% auto",
                  minWidth: "30%",
                  maxWidth: "30%",
                  minHeight: "25vh",
                  maxHeight: "25vh",
                }}
                variant="rectangular"
              />
              <Skeleton
                sx={{
                  margin: "1% auto",
                  minWidth: "30%",
                  maxWidth: "30%",
                  minHeight: "25vh",
                  maxHeight: "25vh",
                }}
                variant="rectangular"
              />
              <Skeleton
                sx={{
                  margin: "1% auto",
                  minWidth: "95%",
                  maxWidth: "95%",
                  minHeight: "10vh",
                  maxHeight: "10vh",
                }}
                variant="rectangular"
              />
              <Skeleton
                sx={{
                  margin: "1% auto",
                  minWidth: "30%",
                  maxWidth: "30%",
                  minHeight: "25vh",
                  maxHeight: "25vh",
                }}
                variant="rectangular"
              />
              <Skeleton
                sx={{
                  margin: "1% auto",
                  minWidth: "30%",
                  maxWidth: "30%",
                  minHeight: "25vh",
                  maxHeight: "25vh",
                }}
                variant="rectangular"
              />
              <Skeleton
                sx={{
                  margin: "1% auto",
                  minWidth: "30%",
                  maxWidth: "30%",
                  minHeight: "25vh",
                  maxHeight: "25vh",
                }}
                variant="rectangular"
              />
            </div>
          </>
        }
      </div>
      <Footer />
    </>
  )
}
