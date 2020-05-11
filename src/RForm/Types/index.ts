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
   date: any
}

export type UseFormR<TValues> = [
   TValues,
   InputsRegister
]

export type RadioRegister = (e: FieldParam<InputProps>, ...args: Array<string>) => React.InputHTMLAttributes<HTMLInputElement>
export type InputRegister<TParam, TInputPropsReturn> = (e: FieldParam<TParam>) => TInputPropsReturn
export type CustomSelect = <Custom>(e: Custom) => CustomFieldProps

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

export interface CustomFieldProps {
   onChange?: (e: any, option?: any) => void
   defaultValue: CustomFieldParam
   value: CustomFieldParam
}