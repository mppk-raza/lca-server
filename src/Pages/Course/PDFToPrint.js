import React from "react";
import "./PDFToPrint.css";
import signImage1 from "../../assets/sign_ali.jpeg";
import signImage2 from "../../assets/sign_imran.jpeg";
import e_certificate from "../../assets/certificate/e_certificate.png";
import for_completing from "../../assets/certificate/for_completing.jpeg";
import proudly_awarded_to from "../../assets/certificate/proudly_awarded_to.jpeg";

export const PDFToPrint = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} id="PDFBack" className="PDFToPrint">
      <style type="text/css" media="print">
        {
          "\
               @page { size: landscape; }\
            "
        }
      </style>
      <div className="PDFToPrint__container">
        <div className="PDFToPrint__left">
          <img src={e_certificate} className="PDFToPrint__left__head" />
          <div className="PDFToPrint__left__head__text__mid">
            <div className="PDFToPrint__left__head__text__mid__space"></div>
            <div className="PDFToPrint__left__head__text__mid__text">
              of appreciation
            </div>
            <div className="PDFToPrint__left__head__text__mid__space"></div>
          </div>
          <img
            src={proudly_awarded_to}
            className="PDFToPrint__left__head__text__small"
          />
          <div className="PDFToPrint__left__name">
            {props.name ? props.name : "Missing Name"}
          </div>
          <img src={for_completing} className="PDFToPrint__left__pictext" />
          <div className="PDFToPrint__left__training">
            {props.course ? props.course : "Missing Course"}
          </div>
          <div className="PDFToPrint__left__datetext">
            {props.date
              ? "on " +
                new Date(props.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Missing Date"}
          </div>
          <div className="PDFToPrint__left__sign">
            <div className="PDFToPrint__left__sign__one">
              <img
                className="PDFToPrint__left__sign__one__picture"
                src={signImage2}
              />
              <div className="PDFToPrint__left__sign__one__name">
                Imran Mazhar
              </div>
              <div className="PDFToPrint__left__sign__one__designation">
                Talent Development Manager
              </div>
            </div>
            <div className="PDFToPrint__left__sign__one">
              <img
                className="PDFToPrint__left__sign__one__picture"
                src={signImage1}
              />
              <div className="PDFToPrint__left__sign__one__name">Ali Raza</div>
              <div className="PDFToPrint__left__sign__one__designation">
                General Manager HR
              </div>
            </div>
          </div>
        </div>
        <div className="PDFToPrint__right"></div>
      </div>
    </div>
  );
});
