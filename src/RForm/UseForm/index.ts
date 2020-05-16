/* eslint-disable react-hooks/rules-of-hooks */
import { useRef, useState, useEffect, useCallback, createRef, ChangeEvent } from "react"
import State from "../State"
import { debounce } from "../Debounce"
import {
   FieldParam,
   InputProps,
   UseFormR,
   ListInputsRef,
   InputRegisterProps,
   InputPartialProps,
   RefFieldElement,
   UseForm,
} from "../Types"
import dot from 'dot-prop-immutable'
import { isRadio, isCheckbox } from "../Utils"
import { InferType } from "yup"

export function useForm<TInitial extends {}, Schema>({
   initialValues,
   validation,
   ...optionsGetValues
}: UseForm<TInitial, Schema>): UseFormR<TInitial> {

   const state = useRef(new State(initialValues))
   const [values, setValues] = useState(initialValues)
   const setValuesOnChange = setValues
   const setValuesDebounce = useCallback(debounce(setValues, optionsGetValues?.debounce || 500), [optionsGetValues])

   const listInputsRef = useRef<ListInputsRef>(Object.assign({}))

   const resolveOptionsGetValues = useCallback((e: TInitial) => {
      if (optionsGetValues?.debounce) {
         return setValuesDebounce(e)
      }
      if (optionsGetValues?.onChange) {
         return setValuesOnChange(e)
      }
   }, [optionsGetValues, setValuesDebounce, setValuesOnChange])


   function registerInput(props: InputPartialProps) {
      const inputProps = {
         ...listInputsRef.current,
         [props.name]: { ...props, ref: createRef<HTMLInputElement>() }
      } as ListInputsRef

      listInputsRef.current = inputProps
      return listInputsRef.current[props.name]
   }


   function onSubmit(fn: (values: TInitial) => void) {
      return fn(state.current.getState)
   }


   function reset() {
      state.current.reset()
   }


   function resetField(fieldPath: string) {
      state.current.resetField(fieldPath)
   }


   function resetInputValue(input: InputRegisterProps<any>, value: any) {
      if (!input?.ref?.current) {
         return
      }
      const type = input.ref.current.type;

      if (isRadio(type)) {
         return input.ref.current.checked = input.ref.current.value === value
      } else if (isCheckbox(type)) {
         return input.ref.current.checked = Boolean(value)
      }
      return input.ref.current.value = value || null
   }

   function custom<Custom = any>(param: Custom): InputRegisterProps<RefFieldElement> {
      const complementProps: any = (typeof param === 'string') ? { name: param } : { ...param }

      function onChange<Tv>(e: InferType<Tv>) {
         state.current.change({
            path: complementProps.name,
            value: e,
         })
         setValues(dot.set(values, complementProps.name, e))
      }

      const props = registerInput({
         value: dot.get(values, complementProps.name),
         onChange,
         ...complementProps,
      })

      return props
   }


   function input(param: FieldParam<InputProps>, ...args: Array<string>): InputRegisterProps<RefFieldElement> {

      const complementProps = (typeof param === 'string') ? { name: param, type: args[0] } : { ...param }

      if (isCheckbox(complementProps.type) || isRadio(complementProps.type)) {
         return baseChecked(complementProps)
      }
      return baseDefaultInput(complementProps)
   }

   function baseDefaultInput(complementProps: InputProps) {

      function onChange(e: ChangeEvent<HTMLInputElement>) {
         state.current.change({
            path: e.target.name,
            value: complementProps.type === "number" ? e.target.valueAsNumber :
               complementProps.type === 'date' ? e.target.valueAsDate :
                  complementProps.type === 'file' ? e.target.files :
                     e.target.value
         })
      }

      const props = registerInput({
         defaultValue: state.current.getValue(complementProps.name),
         onChange,
         ...complementProps,
      })

      return props
   }

   function baseChecked(complementProps: InputProps) {
      function onChange(e: ChangeEvent<HTMLInputElement>) {
         state.current.change({
            path: e.target.name,
            value: e.target.checked
         })
      }

      const props = registerInput({
         defaultChecked: complementProps.type === 'radio' ?
            state.current.getValue(complementProps.name) === complementProps.value :
            state.current.getValue(complementProps.name),
         onChange,
         ...complementProps
      })
      return props
   }

   useEffect(() => {
      const subscriberOnChange = state.current.subscribe('onChange', resolveOptionsGetValues)
      const subscriberOnSubmit = state.current.subscribe('onSubmit', resolveOptionsGetValues)

      const subscriberOnReset = state.current.subscribe('onReset', e => {
         Object.keys(listInputsRef.current).forEach(key => {
            resetInputValue(listInputsRef.current[key], dot.get(e, key))
            setValues(e)
         })
      })
      const subscriberOnResetField = state.current.subscribe('onResetField', (e, ...args: Array<string>) => {
         resetInputValue(listInputsRef.current[args[0]], dot.get(e, args[0]))
         setValues(e)
      })

      return () => {
         subscriberOnChange()
         subscriberOnSubmit()
         subscriberOnReset()
         subscriberOnResetField()
      }
   }, [resolveOptionsGetValues])


   return [
      { values, onSubmit, reset, resetField },
      { input, custom }
   ]
}