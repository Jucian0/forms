import { InputHTMLAttributes } from "react";

export interface OptionsGetValues {
   onChange?: boolean
   debounce?: number
   onSubmit?: boolean
}
/**
 * @param  {FieldParam<InputProps>} e
 * @returns InputRegister
 */
interface InputsRegister {
   text: InputRegister<InputProps, React.InputHTMLAttributes<HTMLInputElement>>,
   select: InputRegister<SelectProps, React.InputHTMLAttributes<HTMLSelectElement>>,
   checkbox: InputRegister<InputProps, React.InputHTMLAttributes<HTMLInputElement>>,
   radio: RadioRegister,
   number: InputRegister<InputProps, React.InputHTMLAttributes<HTMLInputElement>>,
   custom: CustomSelect
   date: InputRegister<InputProps, React.InputHTMLAttributes<HTMLInputElement>>,
   customDate: CustomDate,
   email: InputRegister<InputProps, React.InputHTMLAttributes<HTMLInputElement>>,
   file: InputRegister<InputProps, React.InputHTMLAttributes<HTMLInputElement>>,
   range: InputRegister<InputProps, React.InputHTMLAttributes<HTMLInputElement>>,
   password: InputRegister<InputProps, React.InputHTMLAttributes<HTMLInputElement>>,
}

interface FormState<TValues> {
   values: TValues
   onSubmit: (fn: (values: TValues) => void) => void
   reset: () => void
   resetField: (field: string) => void
}

export type UseFormR<TValues> = [
   FormState<TValues>,
   InputsRegister
]

export type RadioRegister = (e: FieldParam<InputProps>, ...args: Array<string>) => React.InputHTMLAttributes<HTMLInputElement>
export type InputRegister<TParam, TInputPropsReturn> = (e: FieldParam<TParam>) => TInputPropsReturn
export type CustomSelect = <Custom>(e: Custom) => CustomSelectProps
export type CustomDate = <Custom>(e: Custom) => CustomDateProps<string>


export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
   name: string
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
   name: string
}

export type FieldParam<TInput> = string | TInput

export type FieldCheckedParam<TInput> = string | TInput

export type CustomFieldParam<TValue = string> = {
   value: TValue,
   label: string
}

export interface CustomSelectProps {
   onChange?: (e: any, option?: any) => void
   defaultValue: CustomFieldParam
   // value: CustomFieldParam
}

export interface CustomDateProps<TValue> {
   onChange: (e: any) => void
   value: TValue
}


export type ListInputsRef = { [x: string]: React.RefObject<HTMLInputElement> }
export type Ref = React.RefObject<HTMLInputElement>