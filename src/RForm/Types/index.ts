import { InputHTMLAttributes, RefObject } from "react";

export interface UseForm<TInitialValues = {}, TValidation = any> {
   initialValues: TInitialValues
   validation?: TValidation
   onChange?: boolean
   debounce?: number
   onSubmit?: boolean
}

type ObjectInputs = {
   input: InputRegister,
   custom: InputRegister
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
   onChange: (...args: Array<any>) => void
   onBlur?: (...args: Array<any>) => void
   type?: string
   defaultChecked?: any
}
export interface InputRegisterProps<T = RefFieldElement> extends InputPartialProps {
   ref?: T extends RefFieldElement ? RefObject<RefFieldElement extends RefObject<infer Ref> ? Ref : never> : RefObject<T>
}

export type ListInputsRef = {
   [x: string]: InputRegisterProps<RefFieldElement extends HTMLInputElement ? HTMLInputElement : HTMLTextAreaElement>
}

type InputRegister = (param: FieldParam<InputProps>, ...args: Array<string>) => InputRegisterProps

