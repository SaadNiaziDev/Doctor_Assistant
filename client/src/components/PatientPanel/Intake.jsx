import React from 'react'
import { Accordion } from 'react-bootstrap'

export const Intake = ( { intake } ) => {
  const paragraph = `${intake?.intakeSummary}`;

  const paragraphs = paragraph.split( "\n" );

  const summaryArray = [];

  for ( const para of paragraphs ) {
    const parts = para.split( ": " );
    if ( parts.length === 2 ) {
      const heading = parts[ 0 ].trim();
      const summary = parts[ 1 ].trim();

      summaryArray.push( { heading, summary } );
    }
  }

  return (
    <>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Intake</Accordion.Header>
        <Accordion.Body>
          {intake?.intake.length > 0 &&
            intake?.intake.map( ( item, i ) => (
              <div key={i}>
                {i === 0 || item.Heading !== intake?.intake[ i - 1 ]?.Heading ? <div className="fw-700 mb-2">{item.Heading}</div> : null}
                <p>Q: {item?.question}</p>
                <p>A: {item?.answer}</p>
                {item.yes && (
                  <div>
                    <p>Yes:</p>
                    {item.yes.map( ( yesItem, j ) => (
                      <div key={j}>
                        <p>Q: {yesItem?.question}</p>
                        <p>A: {yesItem?.answer}</p>
                      </div>
                    ) )}
                  </div>
                )}
                {item.no && (
                  <div>
                    <p>No:</p>
                    {item.no.map( ( noItem, k ) => (
                      <div key={k}>
                        <p>Q: {noItem?.question}</p>
                        <p>A: {noItem?.answer}</p>
                      </div>
                    ) )}
                  </div>
                )}
              </div>
            ) )}

          {intake?.intake.length === 0 && <p>No Intake Found!</p>}
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Intake Summary</Accordion.Header>
        <Accordion.Body>
          {intake?.intakeSummary &&
            summaryArray &&
            summaryArray.length > 0 &&
            summaryArray.map( ( item ) => (
              <>
                <div className="fw-600 ">{item.heading}:</div>
                <div>{item.summary}</div>
              </>
            ) )}

          {intake?.intakeSummary === "" && <p>No Intake Summary Found!</p>}
        </Accordion.Body>
      </Accordion.Item>
    </>
  )
}
