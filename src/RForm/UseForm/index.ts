import { useRef, useState, useEffect, useCallback } from "react"
import State from "../State"
import { debounce } from "../Debounce"
import { OptionsGetValues, FieldParam, InputProps, SelectProps, FieldCheckedParam, UseFormR, CustomFieldParam, CustomSelectProps, CustomDateProps } from "../Types"


export function useForm<TInitial extends {}>(initialState: TInitial, optionsGetValues?: OptionsGetValues): UseFormR<TInitial> {

   const state = useRef(new State(initialState))
   const [values, setValues] = useState(initialState)
   const setValuesDebounce = useCallback(debounce(setValues, optionsGetValues?.debounce || 500), [optionsGetValues])
   const setValuesOnChange = setValues


   function resolveOptionsGetValues(e: TInitial) {
      if (optionsGetValues?.debounce) {
         return setValuesDebounce({ ...e })
      }
      if (optionsGetValues?.onChange) {
         return setValuesOnChange({ ...e })
      }
   }



   function select(param: FieldParam<SelectProps>): React.InputHTMLAttributes<HTMLSelectElement> {
      function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
         state.current.onChange({
            path: e.target.name,
            value: e.target.value,
         })
      }

      const complementProps = (typeof param === 'string') ? { name: param } : { ...param }

      return {
         defaultValue: state.current.getValue(complementProps.name),
         onChange: onChange,
         type: "checkbox",
         ...complementProps
      }
   }

   function baseInput(param: FieldParam<InputProps>, type: string) {
      function onChange(e: React.ChangeEvent<HTMLInputElement>) {

         state.current.onChange({
            path: e.target.name,
            value: type === "number" ? e.target.valueAsNumber :
               type === 'date' ? e.target.valueAsDate : e.target.value
         })
      }

      const complementProps = (typeof param === 'string') ? { name: param } : { ...param }

      return {
         defaultValue: state.current.getValue(complementProps.name),
         onChange: onChange,
         type,
         ...complementProps
      }
   }

   function baseCheckbox(param: FieldParam<InputProps>, type: string, ...args: Array<any>) {
      function onChange(e: React.ChangeEvent<HTMLInputElement>) {

         state.current.onChange({
            path: e.target.name,
            value: e.target.checked
         })
      }

      const complementProps = (typeof param === 'string') ? { name: param } : { ...param }

      return {
         defaultValue: type === 'checkbox' ? state.current.getValue(complementProps.name) :
            state.current.getValue(complementProps.name) === (args[0] || (param as any).value),
         onChange: onChange,
         type,
         ...complementProps
      }
   }

   function baseCustom<Custom = any>(param: Custom) {
      const complementProps: any = (typeof param === 'string') ? { name: param } : { ...param }

      function onChange<TEvent extends CustomFieldParam>(e: CustomFieldParam<TEvent['value']>) {
         state.current.onChange({
            path: complementProps.name,
            value: e,
         })
      }

      return {
         defaultValue: state.current.getValue(complementProps.name),
         onChange: onChange,
         value: state.current.getValue(complementProps.name)
      }
   }

   function text(param: FieldParam<InputProps>): React.InputHTMLAttributes<HTMLInputElement> {
      return baseInput(param, "text")
   }

   function email(param: FieldParam<InputProps>): React.InputHTMLAttributes<HTMLInputElement> {
      return baseInput(param, "email")
   }

   function file(param: FieldParam<InputProps>): React.InputHTMLAttributes<HTMLInputElement> {
      return baseInput(param, "file")
   }

   function range(param: FieldParam<InputProps>): React.InputHTMLAttributes<HTMLInputElement> {
      return baseInput(param, "range")
   }

   function date(param: FieldParam<InputProps>): React.InputHTMLAttributes<HTMLInputElement> {
      return baseInput(param, "date")
   }

   function number(param: FieldParam<InputProps>): React.InputHTMLAttributes<HTMLInputElement> {
      return baseInput(param, "number")
   }

   function checkbox(param: FieldParam<InputProps>): React.InputHTMLAttributes<HTMLInputElement> {
      return baseCheckbox(param, "checkbox")
   }

   function radio(param: FieldCheckedParam<InputProps>, ...args: Array<string>): React.InputHTMLAttributes<HTMLInputElement> {
      return baseCheckbox(param, "radio", args)
   }

   function custom<Custom = any>(param: Custom): CustomSelectProps {
      return baseCustom(param)
   }

   function customDate<Custom = any>(param: Custom): CustomDateProps<string> {
      return baseCustom(param)
   }

   useEffect(() => {

      const subscriber = state.current.subscribe(resolveOptionsGetValues)

      return () => {
         subscriber()
      }
   }, [])


   return [values, { text, checkbox, radio, select, number, custom, customDate, date, email, file, range }]
}