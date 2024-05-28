import React from "react";
import Accordion from "react-bootstrap/Accordion";

const SummaryAccordion = ({ summary }) => {
  console.log("summary in summary componetn", summary);
  return (
    <>
      {summary?.map((item, index) => {
        return (
          <Accordion.Item eventKey={index + 3}>
            {/* <Accordion.Header>{item?.title}</Accordion.Header> */}
            <Accordion.Body className="position-relative">
              {/* <div className="fs-14 fw-400 text-grey">{item?.text}</div> */}
              {/* <div className="fs-14 fw-400 text-grey">{item?.answer}</div> */}
            </Accordion.Body>
          </Accordion.Item>
        );
      })}
    </>
  );
};

export default SummaryAccordion;
