import { create } from 'zustand'
import { useAuthStore } from './Auth'
import { usePatientStore } from './Patient'

export const useLumedStore = create( ( ...a ) => ( {
    ...useAuthStore( ...a ),
    ...usePatientStore( ...a ),
} ) )