/* eslint-disable react-hooks/rules-of-hooks */
import { useRef, useState, useEffect, useCallback, createRef } from "react"
import State from "../State"
import { debounce } from "../Debounce"
import { OptionsGetValues, FieldParam, InputProps, SelectProps, FieldCheckedParam, UseFormR, CustomFieldParam, CustomSelectProps, CustomDateProps, ListInputsRef, Ref } from "../Types"
import dot from 'dot-prop-immutable'

export function useForm<TInitial extends {}>(initialState: TInitial, optionsGetValues?: OptionsGetValues): UseFormR<TInitial> {

   const state = useRef(new State(initialState))
   const resetState = useRef<{ [x: string]: any }>(initialState)
   const [values, setValues] = useState(initialState)
   const setValuesDebounce = useCallback(debounce(setValues, optionsGetValues?.debounce || 500), [optionsGetValues])
   const setValuesOnChange = setValues

   const listInputsRef = useRef<ListInputsRef>(Object.assign({}))

   function setInputRef(path: string) {
      listInputsRef.current = { ...listInputsRef.current, [path]: createRef() }
      return listInputsRef.current[path]
   }


   function resolveOptionsGetValues(e: TInitial) {
      if (optionsGetValues?.debounce) {
         return setValuesDebounce(e)
      }
      if (optionsGetValues?.onChange) {
         return setValuesOnChange(e)
      }
   }


   function onSubmit(fn: (values: TInitial) => void) {
      return fn(state.current.getState)
   }


   function reset() {
      state.current.reset(resetState.current)
   }


   function resetField(fieldPath: string) {
      state.current.resetField(resetState.current, fieldPath)
   }


   function resetReferenceValue(ref: Ref, value: any) {
      if (!ref.current) {
         return
      }
      switch (ref.current?.type) {
         case 'checkbox':
            return ref.current.checked = Boolean(value)
         case 'radio':
            return ref.current.checked = ref.current.value === value
         case 'file':
            console.log(ref.current)
            return ref.current.value = value || null
         default:
            return ref.current.value = String(value)
      }
   }


   function select(param: FieldParam<SelectProps>): React.SelectHTMLAttributes<HTMLSelectElement> & { ref: any, type: string } {
      function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
         state.current.change({
            path: e.target.name,
            value: e.target.value,
         })
      }

      const complementProps = (typeof param === 'string') ? { name: param } : { ...param }
      setInputRef(complementProps.name)

      return {
         ref: listInputsRef.current?.[complementProps.name],
         value: state.current.getValue(complementProps.name),
         defaultValue: state.current.getValue(complementProps.name),
         onChange,
         type: "select",
         ...complementProps,
      }
   }


   function baseInput(param: FieldParam<InputProps>, type: string) {
      function onChange(e: React.ChangeEvent<HTMLInputElement>) {
         state.current.change({
            path: e.target.name,
            value: type === "number" ? e.target.valueAsNumber :
               type === 'date' ? e.target.valueAsDate :
                  type === 'file' ? e.target.files :
                     e.target.value
         })
      }

      const complementProps = (typeof param === 'string') ? { name: param } : { ...param }
      setInputRef(complementProps.name).current?.addEventListener('input', (e) => {
         console.log('mudou', e.target)
      })

      return {
         defaultValue: state.current.getValue(complementProps.name),
         onChange,
         type,
         ref: listInputsRef.current?.[complementProps.name],
         ...complementProps
      }
   }


   function baseCheckbox(param: FieldParam<InputProps>, type: string, ...args: Array<any>) {
      function onChange(e: React.ChangeEvent<HTMLInputElement>) {
         state.current.change({
            path: e.target.name,
            value: e.target.checked
         })
      }

      const complementProps = (typeof param === 'string') ? { name: param, value: args[0] } : { ...param }
      setInputRef(complementProps.name)

      return {
         defaultChecked: type === 'checkbox' ? state.current.getValue(complementProps.name) :
            state.current.getValue(complementProps.name) === (args[0] || (param as any).value),
         onChange,
         type,
         ref: listInputsRef.current?.[complementProps.name],
         ...complementProps
      }
   }


   function baseCustom<Custom = any>(param: Custom) {
      const complementProps: any = (typeof param === 'string') ? { name: param } : { ...param }

      function onChange<TEvent extends CustomFieldParam>(e: CustomFieldParam<TEvent['value']>) {
         state.current.change({
            path: complementProps.name,
            value: e,
         })
      }

      return {
         defaultValue: state.current.getValue(complementProps.name),
         onChange,
         selected: state.current.getValue(complementProps.name)
      }
   }


   function text(param: FieldParam<InputProps>) {
      return baseInput(param, "text")
   }


   function password(param: FieldParam<InputProps>) {
      return baseInput(param, "password")
   }


   function email(param: FieldParam<InputProps>) {
      return baseInput(param, "email")
   }


   function file(param: FieldParam<InputProps>) {
      return baseInput(param, "file")
   }


   function range(param: FieldParam<InputProps>) {
      return baseInput(param, "range")
   }


   function date(param: FieldParam<InputProps>) {
      return baseInput(param, "date")
   }


   function number(param: FieldParam<InputProps>) {
      return baseInput(param, "number")
   }


   function checkbox(param: FieldParam<InputProps>) {
      return baseCheckbox(param, "checkbox")
   }


   function radio(param: FieldCheckedParam<InputProps>, ...args: Array<string>) {
      return baseCheckbox(param, "radio", ...args)
   }


   function custom<Custom = any>(param: Custom): CustomSelectProps {
      return baseCustom(param)
   }


   function customDate<Custom = any>(param: Custom): CustomDateProps<string> {
      return baseCustom(param) as unknown as CustomDateProps<string>
   }


   useEffect(() => {
      const subscriberOnChange = state.current.subscribe('onChange', resolveOptionsGetValues)
      const subscriberOnSubmit = state.current.subscribe('onSubmit', resolveOptionsGetValues)

      const subscriberOnReset = state.current.subscribe('onReset', e => {
         Object.keys(listInputsRef.current).forEach(key => {
            resetReferenceValue(listInputsRef.current[key], dot.get(e, key))
         })
      })
      const subscriberOnResetField = state.current.subscribe('onResetField', (e, ...args: Array<string>) => {
         resetReferenceValue(listInputsRef.current[args[0]], dot.get(e, args[0]))
      })

      return () => {
         subscriberOnChange()
         subscriberOnSubmit()
         subscriberOnReset()
         subscriberOnResetField()
      }
   }, [])


   return [
      { values, onSubmit, reset, resetField },
      { text, checkbox, radio, select, number, custom, customDate, date, email, file, range, password }
   ]
}