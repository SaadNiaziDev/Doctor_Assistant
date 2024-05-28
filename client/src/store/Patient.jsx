import { apiURL } from "../constants";

const initialState = {
    patient: {
        name: "",
        medicalHistory: "",
        portait: "",
        additionalNotes: "",
        patientID: ""
    },
    intakeForm: {
        intake: [],
        intakeSummary: ''
    },
    gptService: {
        hl7: '',
        prescription: '',
        email: '',
        insurance: '',
        ai: '',
        custom: [],
    },
    consult: {
        cardioSearch: [],
        neuroSearch: [],
        oncoSearch: [],
        endoSearch: [],
        immuSearch: [],
        nurseSearch: [],
        medgenSearch: [],
        gpSearch: [],
    },
    drugSearch: {
        drugSearch: [],
        labAnalyzerReport: []
    },
    transcript: {
        audio: '',
        soap: '',
        transcription: []
    },

};

const fetchWithAuthorization = async ( url, token ) => {
    const response = await fetch( url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    } ).then( ( res ) => res.json() );

    if ( response.status === 200 ) {
        return response.data
    }

    return null;
};

export const usePatientStore =
    ( set, get ) => ( {
        ...initialState,
        setPatient: ( payload ) => set( () => ( { patient: payload } ) ),
        getPatient: async ( id ) => {
            let _token = get().token;
            fetchWithAuthorization( apiURL + "/patient/getPatient/" + id, _token ).then( ( response ) => {
                if ( response ) {
                    set( { patient: response } );
                }
            } )
        },
        setIntakeForm: ( payload ) => set( () => ( { intakeForm: payload } ) ),
        getIntakeForm: async ( id ) => {
            let _token = get().token;
            fetchWithAuthorization( apiURL + "/intake/get/" + id, _token ).then( ( response ) => {
                if ( response ) {
                    set( { intakeForm: response } );
                }
            } )
        },

        setDrugSearch: ( payload ) => set( () => ( { drugSearch: payload } ) ),
        getDrugSearch: async ( id ) => {
            let _token = get().token;
            fetchWithAuthorization( apiURL + "/drugSearch/get/" + id, _token ).then( ( response ) => {
                if ( response ) {
                    set( { drugSearch: response } );
                }
            } )
        },
        setGptService: ( payload ) => set( () => ( { gptService: payload } ) ),
        getGptService: async ( id ) => {
            let _token = get().token;
            fetchWithAuthorization( apiURL + "/gpt-service/get/" + id, _token ).then( ( response ) => {
                if ( response ) {
                    set( { gptService: response } );
                }
            } )
        },
        setConsultation: ( payload ) => set( () => ( { consult: payload } ) ),
        getConsultation: async ( id ) => {
            let _token = get().token;
            fetchWithAuthorization( apiURL + "/consultation/get/" + id, _token ).then( ( response ) => {
                if ( response ) {
                    set( { consult: response } );
                }
            } )
        },
        setTranscription: ( payload ) => set( () => ( { transcript: payload } ) ),
        getTranscription: async ( id ) => {
            let _token = get().token;
            fetchWithAuthorization( apiURL + "/transcription/get/" + id, _token ).then( ( response ) => {
                if ( response ) {
                    set( { transcript: response } );
                }
            } )
        },
        resetState: () => set( () => initialState ),
    }
    )
