import React, { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { apiURL } from "../../constants";
import axios from "axios";

export const Intake = () => {
  const { patientId } = useParams();
  const [ counter, setCounter ] = useState( 0 );
  const [ text, setText ] = useState( "" );
  const [ isCompleted, setIsCompleted ] = useState( false );
  const [ image, setImage ] = useState( "" );
  const [ fileName, setFileName ] = useState( "" );

  const [ currentQuestionIndex, setCurrentQuestionIndex ] = useState( 0 );
  const [ showPrevious, setShowPrevious ] = useState( false );
  const [ yesClicked, setYesClicked ] = useState( false );
  const [ noClick, setNoClicked ] = useState( false );
  const [ subIndex, setSubIndex ] = useState( null );
  const [ selectedQuestion, setSelectedQuestion ] = useState( null );
  const [ subSelectedQuestion, setSubSelectedQuestion ] = useState( null );

  const [ questions, setQuestions ] = useState( [
    {
      Heading: "Language Preference",
      question: " What language would you like to proceed with for this intake process?",
      options: ".English .Spanish,.French,.Other",
      answer: "",
      index: 0,
      type: "text",
    },

    {
      Heading: "Personal Details",
      question: "May I have your full name, please?",
      answer: "",
      index: 1,
      type: "text",
    },

    {
      Heading: " Personal Details",
      question: "Please provide your date of birth (DD-MM-YYYY)",
      answer: "",
      index: 2,
      type: "text",
    },

    {
      Heading: " Personal Details",
      question: "Can you provide your email address or a contact number to reach you?",
      answer: "",
      index: 3,
      type: "text",
    },

    {
      Heading: "Medical History & Current Health",
      question: "Have you ever been diagnosed with any medical conditions or undergone surgery in the last year? If so, please elaborate.",
      answer: "",
      index: 4,
      type: "text",
    },

    {
      Heading: "Medical History & Current Health",
      question: "Are you currently on any medications? If yes, please provide their names and dosages.",
      answer: "",
      index: 5,
      type: "text",
    },

    {
      Heading: "Medical History & Current Health",
      question: "Do you have any known allergies (medication, food, environmental)?",
      answer: "",
      index: 6,
      type: "text",
    },

    {
      Heading: "Medical History & Current Health",
      question: "What is the reason for your visit today? Please describe your current health condition.",
      answer: "",
      index: 7,
      type: "text",
    },

    {
      Heading: "Health Insurance",
      question: "Do you have health insurance?",
      type: "bool",
      options: [ "Yes", "No" ],
      answer: "",
      index: 8,

      yes: [
        {
          Heading: "Health Insurance",
          question: "Do you have a photo or scan of your insurance card? (If possible, please upload)",
          requiresPicture: true,
          case: "yes",
          type: "file",
          answer: "",
          subIndex: 0,
          index: 8,
        },
      ],

      no: [
        {
          Heading: "Health Insurance",
          question: " Please provide your insurance policy provider and policy name",
          case: "no",
          answer: "",
          subIndex: 0,
          type: "text",
        },
        {
          Heading: "Health Insurance",
          question: "Please provide your insurance policy number.",
          case: "no",
          answer: "",
          subIndex: 1,
          type: "text",
        },
      ],
    },

    {
      Heading: "Consent",
      question: "I understand and consent to having my data stored and used for healthcare purposes.",
      answer: "",
      index: 9,
      options: [
        { label: "Agree", value: "agree" },
        { label: "Disagree", value: "disagree" },
      ],
      type: "radio",
    },

    {
      Heading: "Consent",
      question: "I understand and provide consent for receiving diagnosis and treatment based on the provided information.",
      answer: "",
      index: 10,
      options: [
        { label: "Agree", value: "agree" },
        { label: "Disagree", value: "disagree" },
      ],
      type: "radio",
    },

    {
      Heading: "Financial Transactions",
      subHeading: "Payments",
      question: "Would you like to make upfront payments or co-pays now?",
      answer: "",
      index: 11,
      type: "bool",
      options: [ "Yes, I would", "No, I'll do it later." ],
      yes: [
        {
          Heading: "Financial Transactions",
          subHeading: "Payments",
          question: "Please select your payment method.",
          type: "radio",
          options: [
            { label: "Credit Card", value: "Credit Card" },
            { label: "Debit Card", value: "Debit Card" },
            { label: "Cash", value: "Cash" },
            { label: "Insurance Coverage Only", value: "Insurance Coverage" },
          ],
          answer: "",
          subIndex: 0,
        },
      ],
      no: [],
    },

    {
      Heading: "Cost Transparency",
      question: "Would you like an estimated cost of potential treatments based on your insurance details?",
      answer: "",
      index: 12,
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
      type: "radio",
    },

    {
      Heading: "Personalized Care Plans",
      question: "Are you interested in receiving a personalized care plan recommendation based on your answers?",
      answer: "",
      index: 13,
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
      type: "radio",
    },

    {
      Heading: " Social Determinants of Health",
      question: "Would you like to answer a few questions to screen for social determinants affecting your health like housing, food security, and social interactions?",
      index: 14,
      answer: "",
      type: "bool",
      options: [ "Yes", "No" ],

      yes: [
        {
          Heading: " Social Determinants of Health",
          question: "How would you rate your current housing situation?",
          answer: "",
          options: [
            { label: "Stable", value: "stable" },
            { label: "Sometimes Stable", value: "sometimes" },
            { label: "Unstable", value: "unstable" },
          ],
          type: "radio",

          subIndex: 0,
        },
        {
          Heading: " Social Determinants of Health",
          question: "In the past 12 months, were there times when you didn't have enough food for you or your family?",
          answer: "",
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ],
          type: "radio",

          subIndex: 1,
        },
        {
          Heading: "Social Determinants of Health",
          question: "How often do you feel socially isolated or alone?",
          subIndex: 2,
          options: [
            { label: "Often", value: "often" },
            { label: "Sometimes", value: "sometimes" },
            { label: "Rarely", value: "rarely" },
            { label: "Never", value: "never" },
          ],
          type: "radio",

          answer: "",
        },
      ],
      no: [],
    },

    {
      Heading: "Mental Health Screening",
      question: "Would you be open to answering some questions for a basic mental health screening?",
      index: 15,
      answer: "",
      type: "bool",
      options: [ "Yes", "No" ],

      yes: [
        {
          Heading: "Mental Health Screening",
          question: "Over the past two weeks, how often have you felt down, depressed, or hopeless?",
          subIndex: 0,
          answer: "",

          options: [
            { label: "Not at all", value: "Not at all" },
            { label: "Several Days", value: "Several Days" },
            { label: "More than half the days", value: "More than half the days" },
            { label: "Nearly every day", value: "nearly everyday" },
          ],
          type: "radio",
        },

        {
          Heading: "Mental Health Screening",
          question: "Do you currently see or have plans to see a mental health professional?",
          subIndex: 1,
          answer: "",
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ],
          type: "radio",
        },
      ],
      no: [],
    },

    {
      Heading: "Feedback & Experience",
      question: "How would you rate your digital intake experience?",
      index: 16,
      answer: "",
      type: "text",
    },

    {
      Heading: "Feedback & Experience",
      question: "Anything else to share?",
      index: 17,
      answer: "",
      type: "text",
    },
  ] );

  const onProfileImageChange = async ( e ) => {
    try {
      console.log( "enter here in image" );
      const file = e.target.files[ 0 ];
      setFileName( file );
      const formData = new FormData();
      formData.append( "file", file );

      const response = await axios.post( apiURL + "/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      } );

      console.log( "response in image", response.data.data.url );

      const newQuestions = [ ...questions ];

      setCounter( ( prev ) => prev + 1 );

      if ( !subSelectedQuestion ) {
        newQuestions[ selectedQuestion.index ].answer = response.data.data.url;
        setQuestions( newQuestions );

        const newObject = { ...selectedQuestion, answer: response.data.data.url };

        setSelectedQuestion( newObject );
      }

      if ( subSelectedQuestion ) {
        newQuestions[ selectedQuestion.index ][ selectedQuestion.answer ][ subSelectedQuestion?.subIndex ].answer = response.data.data.url;
        setQuestions( newQuestions );
      }

      setTimeout( () => {
        if ( selectedQuestion && subSelectedQuestion && selectedQuestion[ selectedQuestion.answer ][ subSelectedQuestion?.subIndex + 1 ] ) {
          setSubSelectedQuestion( selectedQuestion[ selectedQuestion.answer ][ subSelectedQuestion?.subIndex + 1 ] );
        } else {
          setSubSelectedQuestion( null );
          setSelectedQuestion( questions[ selectedQuestion.index + 1 ] );
        }
      }, 400 );
    } catch ( error ) {
      // Handle errors here
      console.error( "Error:", error );
    }
  };

  const onSubmit = () => {
    const newQuestions = [ ...questions ];

    setCounter( ( prev ) => prev + 1 );

    if ( !subSelectedQuestion ) {
      questions[ selectedQuestion.index ].answer = text;
      setQuestions( newQuestions );

      const newObject = { ...selectedQuestion, answer: text };

      setSelectedQuestion( newObject );
    }

    if ( subSelectedQuestion ) {
      questions[ selectedQuestion.index ][ selectedQuestion.answer ][ subSelectedQuestion?.subIndex ].answer = text;
      setQuestions( newQuestions );
    }

    setText( "" );

    if ( selectedQuestion.index === 17 ) {
      return sendForm();
    }

    if ( selectedQuestion && subSelectedQuestion && selectedQuestion[ selectedQuestion.answer ][ subSelectedQuestion?.subIndex + 1 ] ) {
      setSubSelectedQuestion( selectedQuestion[ selectedQuestion.answer ][ subSelectedQuestion?.subIndex + 1 ] );
    } else {
      setSubSelectedQuestion( null );
      setSelectedQuestion( questions[ selectedQuestion.index + 1 ] );
    }
  };

  const handleYesNoChange = ( e ) => {
    const newQuestions = [ ...questions ];

    const value = e.target.value;

    const newObject = { ...selectedQuestion, answer: value };

    questions[ selectedQuestion.index ].answer = value;
    setQuestions( newQuestions );
    setCounter( ( prev ) => prev + 1 );

    setTimeout( () => {
      setSelectedQuestion( newObject );
      if ( value === "yes" ) {
        if ( questions[ selectedQuestion.index ].yes.length == 0 ) {
          setSelectedQuestion( questions[ selectedQuestion.index + 1 ] );
        }

        setSubSelectedQuestion( questions[ selectedQuestion.index ].yes[ 0 ] );
      } else if ( value === "no" ) {
        if ( questions[ selectedQuestion.index ].no.length == 0 ) {
          setSelectedQuestion( questions[ selectedQuestion.index + 1 ] );
        }

        setSubSelectedQuestion( questions[ selectedQuestion.index ].no[ 0 ] );
      } else {
        setSelectedQuestion( questions[ selectedQuestion.index + 1 ] );
      }
    }, 500 );
  };

  const handleRadioChange = ( e ) => {
    const newQuestions = [ ...questions ];

    setCounter( ( prev ) => prev + 1 );

    const value = e.target.value;

    console.log( "Selevy================", subSelectedQuestion );

    if ( subSelectedQuestion ) {
      questions[ selectedQuestion.index ][ selectedQuestion.answer ][ subSelectedQuestion?.subIndex ].answer = value;
      setSubSelectedQuestion( { ...subSelectedQuestion, answer: value } );
    }

    if ( !subSelectedQuestion ) {
      questions[ selectedQuestion.index ].answer = value;
      setQuestions( newQuestions );

      const newObject = { ...selectedQuestion, answer: value };
      setSelectedQuestion( newObject );
    }

    console.log( "else enter" );
    setTimeout( () => {
      if ( selectedQuestion && subSelectedQuestion && selectedQuestion[ selectedQuestion.answer ][ subSelectedQuestion?.subIndex + 1 ] ) {
        setSubSelectedQuestion( selectedQuestion[ selectedQuestion.answer ][ subSelectedQuestion?.subIndex + 1 ] );
      } else {
        setSubSelectedQuestion( null );
        setSelectedQuestion( questions[ selectedQuestion.index + 1 ] );
      }
    }, 1000 );
  };

  const handleInputChange = ( e, index ) => {
    const value = e.target.value;
    let updatedQuestions = [ ...questions ];
    updatedQuestions[ index ].answer = value;
    setQuestions( updatedQuestions );
  };

  const sendForm = () => {
    setIsCompleted( true );
    fetch( apiURL + "/intake/add/" + patientId, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify( { intake: questions } ),
    } )
      .then( ( res ) => res.json() )
      .then( () => setIsCompleted( true ) )
      .catch( ( err ) => console.log( err ) );
  };

  const preClicked = () => { };

  useEffect( () => {
    if ( currentQuestionIndex == 1 ) {
      setShowPrevious( true );
    }
  }, [ currentQuestionIndex ] );

  useEffect( () => {
    setSelectedQuestion( questions[ 0 ] );
  }, [] );

  return (
    <div className="h-100vh d-flex align-items-center">
      <div className="container">
        <div className="d-flex justify-content-center text-center">
          {!isCompleted && (
            <div className="intake-form">
              <div className="">
                <div className="fw-600 fs-22 text-start">{selectedQuestion?.Heading}</div>
              </div>

              {/* <div className="w-100"><div className="fs-18 fw-500 text-start mt-2">{selectedQuestion?.subHeading}</div></div> */}

              {subSelectedQuestion && (
                <>
                  <div className="w-100">
                    <div className="question">{subSelectedQuestion?.question}</div>
                  </div>
                </>
              )}

              {!subSelectedQuestion && (
                <>
                  <div className="w-100">
                    <div className="question">{selectedQuestion?.question}</div>
                  </div>
                </>
              )}

              {!subSelectedQuestion && selectedQuestion?.type && selectedQuestion?.type === "bool" && (
                <div className="d-flex flex-column align-items-start gap-2 my-5">
                  <label>
                    <input type="radio" checked={selectedQuestion.answer === "yes"} value="yes" name={`q${currentQuestionIndex}`} onChange={( e ) => handleYesNoChange( e, currentQuestionIndex )} />{" "}
                    {selectedQuestion.options[ 0 ]}
                  </label>
                  <label>
                    <input
                      type="radio"
                      className="mb-2"
                      checked={selectedQuestion.answer === "no"}
                      value="no"
                      name={`q${currentQuestionIndex}`}
                      onChange={( e ) => handleYesNoChange( e, currentQuestionIndex )}
                    />{" "}
                    {selectedQuestion.options[ 1 ]}
                  </label>
                </div>
              )}

              {selectedQuestion?.type && selectedQuestion?.type === "radio" && (
                <div className="d-flex flex-column align-items-start gap-2 my-5">
                  <label>
                    <input
                      type="radio"
                      checked={selectedQuestion.options[ 0 ].value === selectedQuestion.answer}
                      value={selectedQuestion.options[ 0 ].value}
                      name={`q${currentQuestionIndex}`}
                      onChange={( e ) => handleRadioChange( e, currentQuestionIndex )}
                    />{" "}
                    {selectedQuestion.options[ 0 ].label}
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={selectedQuestion.options[ 1 ].value === selectedQuestion.answer}
                      value={selectedQuestion.options[ 1 ].value}
                      name={`q${currentQuestionIndex}`}
                      onChange={( e ) => handleRadioChange( e, currentQuestionIndex )}
                    />{" "}
                    {selectedQuestion.options[ 1 ].label}
                  </label>
                </div>
              )}

              {selectedQuestion?.answer === "yes" && selectedQuestion?.type === "bool" && subSelectedQuestion?.type === "radio" && (
                <div>
                  {subSelectedQuestion.options.map( ( item, i ) => (
                    <div key={i} className="d-flex align-items-center gap-2 mb-3 ">
                      <label>
                        <input
                          type="radio"
                          checked={item.value === subSelectedQuestion.answer}
                          value={item.value}
                          name={`q${currentQuestionIndex}`}
                          onChange={( e ) => handleRadioChange( e, currentQuestionIndex )}
                        />{" "}
                        {item.label}
                      </label>
                    </div>
                  ) )}
                </div>
              )}

              {selectedQuestion?.answer === "yes" && selectedQuestion?.type === "bool" && subSelectedQuestion?.type === "file" && (
                <>
                  <div>
                    <div>
                      <input
                        type="file"
                        value={image}
                        className="answer skip my-5"
                        placeholder="Answer here or press Enter ⏎ to skip"
                        onChange={( e ) => {
                          onProfileImageChange( e );
                          e.target = null;
                        }}
                      />
                    </div>
                  </div>

                  <div>{/* <input type="text" value={fileName.name} className="answer skip my-5" readOnly /> */}</div>
                </>
              )}

              {selectedQuestion?.answer === "no" && selectedQuestion?.type === "bool" && !subSelectedQuestion && !!subSelectedQuestion && (
                <>
                  <div>
                    <div>
                      <input
                        type="text"
                        value={text}
                        className="answer skip my-5"
                        placeholder="Answer here or press Enter ⏎ to skip"
                        onChange={( e ) => setText( e.target.value )}
                        onKeyDown={( e ) => {
                          if ( e.key === "Enter" || e.key === "enter" ) {
                            onSubmit();
                          }
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              {!subSelectedQuestion && selectedQuestion?.type && selectedQuestion?.type !== "bool" && selectedQuestion.type !== "radio" && (
                <div className="d-flex align-items-center">
                  <input
                    type={selectedQuestion?.type}
                    value={text}
                    className="answer skip my-5"
                    placeholder="Answer here or press Enter ⏎ to skip"
                    onChange={( e ) => setText( e.target.value )}
                    onKeyDown={( e ) => {
                      if ( e.key === "Enter" || e.key === "enter" ) {
                        onSubmit();
                      }
                    }}
                  />
                </div>
              )}

              {subSelectedQuestion && selectedQuestion?.answer !== "yes" && (
                <div className="d-flex align-items-center">
                  <input
                    type={selectedQuestion?.type}
                    value={text}
                    className="answer skip my-5"
                    placeholder="Answer here or press Enter ⏎ to skip"
                    onChange={( e ) => setText( e.target.value )}
                    onKeyDown={( e ) => {
                      if ( e.key === "Enter" || e.key === "enter" ) {
                        onSubmit();
                      }
                    }}
                  />
                </div>
              )}
              {/* 
              {selectedQuestion?.index !== 0 && (
                <button className="border-0 bg-transparent text-gradient fs-14 fw-500 gap-1" onClick={() => setSelectedQuestion(questions[selectedQuestion.index - 1])}>
                  Previous
                </button>
              )} */}

              <button className="bg-transparent border-0 d-md-none">Previous</button>

              <div className="stepper">
                <ProgressBar variant="info" now={counter * 6} min={0} max={150} />
              </div>
            </div>
          )}
          {isCompleted && <div className="text-center fs-22 text-green">Intake Successful. Thank You!</div>}
        </div>
      </div>
    </div>
  );
};
