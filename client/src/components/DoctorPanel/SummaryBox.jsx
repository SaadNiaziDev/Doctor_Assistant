import React, { useState } from "react";
import { UploadModal } from "../Shared";
import { ThreeDots } from "react-loader-spinner";
import { activeKey } from "../../utils/activeKey";
import DrugService from "../../services/drugSearch.service";
import ConsultService from "../../services/consult.service";

export const SummaryBox = ( { openUpload, setOpenUpload, token, patient, selectedText, hl7, generatePrescription, setActiveTab, consult, setConsultation, drugSearch, setDrugSearch } ) => {
  const summaryBtn = {
    search: false,
    test: false,
    consult: false,
    json: false,
    perscription: false,
  };
  const [ isHover, setIsHover ] = useState( {
    search: false,
    test: false,
    consult: false,
    json: false,
    perscription: false,
  } );
  const [ loading, setLoading ] = useState( false );
  const [ summaryBox, setSummaryBox ] = useState( summaryBtn );
  const [ openDropdown, setOpenDropdown ] = useState( false );
  const [ msg, setMsg ] = useState( "" );
  const [ doc, setDoc ] = useState( "" );
  const [ socketType, setSocketType ] = useState( "" );

  const getTitle = () => {
    if ( summaryBox.consult ) return `${doc} Consultation`;
    else if ( summaryBox.search ) return "Semantic Drug Search";
    else if ( summaryBox.test ) return "Lab Test Analysis";
  };

  const createNote = () => {
    setMsg( "" );
    setSummaryBox( {
      search: false,
      test: false,
      consult: false,
      json: false,
      perscription: false,
    } );
  };


  const matchType = () => {
    switch ( socketType ) {
      case "sds": sdsSearch();
      case "ta": labTestSearch();
      default: consultAI()
    }
  }


  const sdsSearch = () => {
    setLoading( true )
    drugSearch.drugSearch.push( {
      question: question,
      anwser: "",
    } );
    setDrugSearch( drugSearch );
    handleAccordionChange( "2" );
    DrugService.drugSearch( `${patient.patientID}-${socketType}`, socketType, msg, [] ).then( ( data ) => {
      DrugService.saveDrugSearch( token, patient.patientID, msg, data[ 0 ].answer ).then( ( result ) => {
        setDrugSearch( result.data )
        setLoading( false );
        setMsg( "" );
        setSummaryBox( {
          search: false,
          test: false,
          consult: false,
          json: false,
          perscription: false,
        } );
      } ).catch( ( err ) => new Error( err.message ) );
    } ).catch( ( error ) => {
      console.log( error );
      setLoading( false );
    } )


  };
  const labTestSearch = () => {
    setLoading( true )
    drugSearch.labAnalyzerReport.push( {
      question: question,
      anwser: "",
    } );
    setDrugSearch( drugSearch );
    handleAccordionChange( "3" );
    DrugService.drugSearch( `${patient.patientID}-${socketType}`, socketType, msg, [] ).then( ( data ) => {
      DrugService.generateLabReport( token, patient.patientID, msg, data[ 0 ].answer ).then( ( result ) => {
        setDrugSearch( result.data )
        setLoading( false );
        setMsg( "" );
        setSummaryBox( {
          search: false,
          test: false,
          consult: false,
          json: false,
          perscription: false,
        } );
      } ).catch( ( err ) => new Error( err.message ) );
    } ).catch( ( error ) => {
      console.log( error );
      setLoading( false );
    } )


  };

  const consultAI = () => {
    setLoading( true )
    activeKey( socketType, msg, consult, setConsultation, setActiveTab );
    DrugService.drugSearch( `${patient.patientID}-${socketType}`, socketType, msg, [] ).then( ( data ) => {
      ConsultService.consultAI( token, patient.patientID, msg, socketType, data[ 0 ].answer ).then( ( result ) => {
        setConsultation( result.data )
        setLoading( false );
        setMsg( "" );
        setSummaryBox( {
          search: false,
          test: false,
          consult: false,
          json: false,
          perscription: false,
        } );
      } ).catch( ( err ) => new Error( err.message ) );
    } ).catch( ( error ) => {
      console.log( error );
      setLoading( false );
    } )


  };


  return (
    <div className="main-panel">
      <div className="side-panel gap-3">
        {/* Sementic Drug Search */}
        <div className="position-relative">
          <button
            className={`panel-btn ${summaryBox.search ? "active" : ""}`}
            onClick={() => {
              setSummaryBox( { ...summaryBtn, search: !summaryBox.search } )
              setSocketType( 'sds' )
              setDoc( "Sementic Drug Search" )
              setOpenDropdown( false )
            }}
            onMouseEnter={() => {
              setIsHover( { ...isHover, search: true } );
            }}
            onMouseLeave={() => {
              setIsHover( { ...isHover, search: false } );
            }}
          >
            <img src="/assets/images/search.svg" className="simple-img" alt="" />
            <img src="/assets/images/search-hover.svg" className="hover-img" alt="" />
          </button>
          {isHover.search && <div className="hover-box">Semantic Drug Search</div>}
        </div>

        {/* LAB TEST ANALYZER */}
        <div className="position-relative">
          <button
            className={`panel-btn ${summaryBox.test ? "active" : ""}`}
            onClick={() => {
              setSummaryBox( { ...summaryBtn, test: !summaryBox.test } ),
                setDoc( "Lab Test Analyzer" ), setSocketType( 'ta' ), setOpenDropdown( false );
            }}
            onMouseEnter={() => {
              setIsHover( { ...isHover, test: true } );
            }}
            onMouseLeave={() => {
              setIsHover( { ...isHover, test: false } );
            }}
          >
            <img src="/assets/images/microscope.svg" className="simple-img" alt="" />
            <img src="/assets/images/microscope-hover.svg" className="hover-img" alt="" />
          </button>
          {isHover.test && <div className="hover-box">Lab Test Analyzer</div>}
        </div>

        {/* CONSULT WITH AI */}
        <div className="position-relative">
          <button
            className={`panel-btn consult-btn ${summaryBox.consult ? "active" : ""}`}
            onClick={() => setOpenDropdown( !openDropdown )}
            onMouseEnter={() => {
              setIsHover( { ...isHover, consult: true } );
            }}
            onMouseLeave={() => {
              setIsHover( { ...isHover, consult: false } );
            }}
          >
            <img src="/assets/images/chat-plus.svg" className="simple-img" alt="" />
            <img src="/assets/images/chat-plus-hover.svg" className="hover-img chat-plus" alt="" />
          </button>
          {isHover.consult && <div className="hover-box">Consult with AI Specialist</div>}

          {/* DROP_DOWN CONTAINS 8 OPTIONS */}
          <div className={`consult-dropdown ${openDropdown ? "show" : ""}`}>
            <button
              type="button"
              className="consult-item"
              onClick={() => {
                setSummaryBox( { ...summaryBtn, consult: true } ), setSocketType( 'gp' ), setDoc( "General Practice" ), setOpenDropdown( false );
              }}
            >
              General Practice
            </button>
            <button
              type="button"
              className="consult-item"
              onClick={() => {
                setSummaryBox( { ...summaryBtn, consult: true } ), setSocketType( 'cardio' ), setDoc( "Cardiology" ), setOpenDropdown( false );
              }}
            >
              Cardiology
            </button>
            <button
              type="button"
              className="consult-item"
              onClick={() => {
                setSummaryBox( { ...summaryBtn, consult: true } ), setSocketType( 'neuro' ), setDoc( "Neurology" ), setOpenDropdown( false );
              }}
            >
              Neurology
            </button>
            <button
              type="button"
              className="consult-item"
              onClick={() => {
                setSummaryBox( { ...summaryBtn, consult: true } ), setSocketType( 'onco' ), setDoc( "Oncology" ), setOpenDropdown( false );
              }}
            >
              Oncology
            </button>
            <button
              type="button"
              className="consult-item"
              onClick={() => {
                setSummaryBox( { ...summaryBtn, consult: true } ), setSocketType( 'endo' ), setDoc( "Endocrinology" ), setOpenDropdown( false );
              }}
            >
              Endocrinology
            </button>
            <button
              type="button"
              className="consult-item"
              onClick={() => {
                setSummaryBox( { ...summaryBtn, consult: true } ), setSocketType( 'immu' ), setDoc( "Immununology" ), setOpenDropdown( false );
              }}
            >
              Immununology
            </button>
            <button
              type="button"
              className="consult-item"
              onClick={() => {
                setSummaryBox( { ...summaryBtn, consult: true } ), setSocketType( 'nurse' ), setDoc( "Nurse Assistant" ), setOpenDropdown( false );
              }}
            >
              Nurse Assistant
            </button>
            <button
              type="button"
              className="consult-item"
              onClick={() => {
                setSummaryBox( { ...summaryBtn, consult: true } ), setSocketType( 'medgen' ), setDoc( "Medical Genetics" ), setOpenDropdown( false );
              }}
            >
              Medical Genetics
            </button>
          </div>
        </div>
        <div className="position-relative">
          <button
            className={`panel-btn`}
            onClick={() => {
              createNote();
              hl7();
            }}
            onMouseEnter={() => {
              setIsHover( { ...isHover, json: true } );
            }}
            onMouseLeave={() => {
              setIsHover( { ...isHover, json: false } );
            }}
          >
            <img src="/assets/images/json-file.svg" className="simple-img" alt="" />
            <img src="/assets/images/json-file-hover.svg" className="hover-img" alt="" />
          </button>
          {isHover.json && <div className="hover-box">Export as HL7 FHIR JSON</div>}
        </div>
        <div className="position-relative">
          <button
            className={`panel-btn`}
            onClick={() => {
              createNote();
              generatePrescription();
            }}
            onMouseEnter={() => {
              setIsHover( { ...isHover, perscription: true } );
            }}
            onMouseLeave={() => {
              setIsHover( { ...isHover, perscription: false } );
            }}
          >
            <img src="/assets/images/contract.svg" className="simple-img" alt="" />
            <img src="/assets/images/contract-hover.svg" className="hover-img" alt="" />
          </button>
          {isHover.perscription && <div className="hover-box">Generate Prescription</div>}
        </div>
      </div>
      {( summaryBox.consult || summaryBox.search || summaryBox.test ) && (
        <div className="summary-box show">
          <div className="fs-14 d-flex justify-content-between w-100 align-items-center fw-500 text-grey mb-2">
            {getTitle()}
            <button className="bg-transparent border-0 text-green fs-18 line-1" onClick={() => setSummaryBox( summaryBtn )}>
              <span class="iconify" data-icon="fa:angle-right"></span>
            </button>
          </div>
          <div className="labtest-textarea mb-2">
            <textarea defaultValue={selectedText} value={msg} onChange={( e ) => setMsg( e.target.value )}></textarea>
          </div>
          <div className="d-flex  align-items-center  justify-content-end gap-2">
            {summaryBox?.test && (
              <>
                <button type="button" onClick={() => setOpenUpload( !openUpload )} className="border-0 bg-transparent text-dark-grey fs-14 fw-400 d-flex align-items-center gap-1">
                  Upload{" "}
                  <div className="fs-18 text-dark-grey line-1">
                    <span className="iconify" data-icon="eva:attach-fill"></span>
                  </div>
                </button>
                <div className="vertical-divider"></div>
              </>
            )}
            {loading && <ThreeDots height="30" width="80" radius="9" color="#4fa94d" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />}
            {!loading && (
              <button
                disabled={summaryBox.consult && msg == ""}
                type="button"
                className="border-0 bg-transparent text-gradient fs-14 fw-500 gap-1"
                onClick={() => matchType()}
              >
                Send <img src="/assets/images/send.svg" className="default-img" />
                <img src="/assets/images/send-hover.svg" className="save-img" />
              </button>
            )}
          </div>
          {openUpload && (
            <>
              <UploadModal openUpload={openUpload} setOpenUpload={setOpenUpload} fileType=".pdf, .docx ,.csv,.txt" />
            </>
          )}
        </div>
      )}
    </div>
  );
};
