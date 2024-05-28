import { persist } from "zustand/middleware";
import { Toast, apiURL } from "../constants";

const initialState = {
    user: null,
    token: null,
};

export const useAuthStore =
    persist(
        ( set, get ) => ( {
            ...initialState,
            setUser: ( payload ) => set( () => ( { user: payload } ) ),
            setToken: ( payload ) => set( () => ( { token: payload } ) ),
            context: async () => {
                let _token = get().token;
                let response = await fetch( apiURL + "/user/context", {
                    headers: {
                        Authorization: "Bearer " + _token,
                    },
                } )
                    .then( ( res ) => res.json() )
                    .then( ( res ) => res.data );

                set( { user: response || null } );
            },
            reset: async () => {
                await fetch( apiURL + "/user/logout", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                } )
                    .then( ( res ) => res.json() )
                    .then( ( res ) => {
                        if ( res.status !== 200 ) {
                            Toast.fire( {
                                icon: "error",
                                text: "Something went wrong!",
                            } );
                        } else {
                            localStorage.clear();
                            set( {
                                user: null,
                                token: null,
                                patient: null,
                            } );
                        }
                    } );
            },
        } ),
        {
            name: "lumed-Auth",
            // storage: createJSONStorage( () => localStorage ),
            partialize: ( state ) => ( { token: state.token } )
        }

    );
