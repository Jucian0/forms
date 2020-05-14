import { InputHTMLAttributes, RefObject } from "react";

export interface OptionsGetValues {
   onChange?: boolean
   debounce?: number
   onSubmit?: boolean
}

type ObjectInputs = {
   input: (e: any, ...args: Array<string>) => InputProps,
   context: any
}

interface FormFunctions<TValues> {
   values: TValues
   onSubmit: (fn: (values: TValues) => void) => void
   reset: () => void
   resetField: (field: string) => void
}

export type UseFormR<TValues> = [
   FormFunctions<TValues>,
   ObjectInputs
]

export type RefFieldElement =
   | HTMLInputElement
   | HTMLSelectElement
   | HTMLTextAreaElement

export interface InputProps extends InputHTMLAttributes<RefFieldElement> {
   name: string
   type: string
}

export type FieldParam<TInput> = string | TInput
export type FieldValues = Record<string, any>;

export interface InputPartialProps {
   name: string
   defaultValue?: any
   value?: any
   onChange?: (...args: Array<any>) => void
   onBlur?: (...args: Array<any>) => void
   type?: string
   defaultChecked?: any
}
export interface InputRegisterProps extends InputPartialProps {
   ref: RefObject<RefFieldElement & { checked?: boolean }>
}

export type ListInputsRef = {
   [x: string]: InputRegisterProps
}
