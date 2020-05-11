import { useRef, useState, useEffect, useCallback } from "react"
import State from "../State"
import { debounce } from "../Debounce"
import { OptionsGetValues, FieldParam, InputProps, SelectProps, FieldCheckedParam, UseFormR, CustomFieldParam, CustomFieldProps } from "../Types"


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

   function text(param: FieldParam<InputProps>): React.InputHTMLAttributes<HTMLInputElement> {
      function onChange(e: React.ChangeEvent<HTMLInputElement>) {
         state.current.onChange({
            path: e.target.name,
            value: e.target.value,
         })
      }

      const complementProps = (typeof param === 'string') ? { name: param } : { ...param }

      return {
         defaultValue: state.current.getValue(complementProps.name),
         onChange: onChange,
         type: "text",
         ...complementProps
      }
   }

   function number(param: FieldParam<InputProps>): React.InputHTMLAttributes<HTMLInputElement> {
      function onChange(e: React.ChangeEvent<HTMLInputElement>) {
         state.current.onChange({
            path: e.target.name,
            value: e.target.value,
         })
      }

      const complementProps = (typeof param === 'string') ? { name: param } : { ...param }

      return {
         defaultValue: state.current.getValue(complementProps.name),
         onChange: onChange,
         type: "number",
         ...complementProps
      }
   }

   function checkbox(param: FieldParam<InputProps>): React.InputHTMLAttributes<HTMLInputElement> {
      function onChange(e: React.ChangeEvent<HTMLInputElement>) {
         state.current.onChange({
            path: e.target.name,
            value: e.target.checked,
         })
      }

      const complementProps = (typeof param === 'string') ? { name: param } : { ...param }

      return {
         defaultChecked: state.current.getValue(complementProps.name),
         onChange: onChange,
         type: "checkbox",
         ...complementProps
      }
   }

   function radio(param: FieldCheckedParam<InputProps>, ...args: Array<string>): React.InputHTMLAttributes<HTMLInputElement> {

      function onChange(e: React.ChangeEvent<HTMLInputElement>) {
         state.current.onChange({
            path: e.target.name,
            value: e.target.value,
         })
      }

      const complementProps = (typeof param === 'string') ? { name: param, value: args[0] } : { ...param }

      return {
         defaultChecked: state.current.getValue(complementProps.name) === (args[0] || (param as any).value),
         onChange: onChange,
         type: "radio",
         ...complementProps
      }
   }

   function custom<Custom = any>(param: Custom): CustomFieldProps {
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

   function date<Custom = any>(param: Custom): CustomFieldProps {
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

   useEffect(() => {

      const subscriber = state.current.subscribe(resolveOptionsGetValues)

      return () => {
         subscriber()
      }
   }, [])


   return [values, { text, checkbox, radio, select, number, custom, date }]
}