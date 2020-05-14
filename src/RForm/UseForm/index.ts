/* eslint-disable react-hooks/rules-of-hooks */
import { useRef, useState, useEffect, useCallback, createRef, ChangeEvent } from "react"
import State from "../State"
import { debounce } from "../Debounce"
import {
   OptionsGetValues,
   FieldParam,
   InputProps,
   UseFormR,
   ListInputsRef,
   InputRegisterProps,
   InputPartialProps,
} from "../Types"
import dot from 'dot-prop-immutable'
import { isRadio, isCheckbox } from "../Utils"

export function useForm<TInitial extends {}>(initialState: TInitial, optionsGetValues?: OptionsGetValues): UseFormR<TInitial> {

   const state = useRef(new State(initialState))
   const resetState = useRef<{ [x: string]: any }>(initialState)
   const [values, setValues] = useState(initialState)
   const setValuesDebounce = useCallback(debounce(setValues, optionsGetValues?.debounce || 500), [optionsGetValues])
   const setValuesOnChange = setValues

   const listInputsRef = useRef<ListInputsRef>(Object.assign({}))

   function resolveOptionsGetValues(e: TInitial) {
      if (optionsGetValues?.debounce) {
         return setValuesDebounce(e)
      }
      if (optionsGetValues?.onChange) {
         return setValuesOnChange(e)
      }
   }


   function registerInput(props: InputPartialProps) {
      const inputProps = {
         ...listInputsRef.current,
         [props.name]: { ...props, ref: createRef<HTMLInputElement>() }
      }
      listInputsRef.current = inputProps
      return listInputsRef.current[props.name]
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


   function resetInputValue(input: InputRegisterProps, value: any) {
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


   function input(param: FieldParam<InputProps>, ...args: Array<string>) {

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

      return props as InputProps
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
      return props as InputProps
   }

   useEffect(() => {
      const subscriberOnChange = state.current.subscribe('onChange', resolveOptionsGetValues)
      const subscriberOnSubmit = state.current.subscribe('onSubmit', resolveOptionsGetValues)

      const subscriberOnReset = state.current.subscribe('onReset', e => {
         Object.keys(listInputsRef.current).forEach(key => {
            resetInputValue(listInputsRef.current[key], dot.get(e, key))
         })
      })
      const subscriberOnResetField = state.current.subscribe('onResetField', (e, ...args: Array<string>) => {
         resetInputValue(listInputsRef.current[args[0]], dot.get(e, args[0]))
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
      { input, context: state.current }
   ]
}


export function useCustom<TInitial>(context: State<TInitial>): [any, any] {
   const ref = useRef(null)
   const [value, setValue] = useState()

   function onChange(e: any) {
      context.change({
         path: (ref as any).current.props.name,
         value: e
      })
      setValue(e)
   }

   useEffect(() => {
      setValue(context.getValue((ref as any).current.props.name))
   }, [context, ref])

   useEffect(() => {
      const resetAll = context.subscribe('onReset', e => {
         setValue(dot.get(e, (ref as any).current.props.name))
      })
      const resetInput = context.subscribe('onResetField', e => {
         setValue(dot.get(e, (ref as any).current.props.name))
      })

      return () => {
         resetAll()
         resetInput()
      }
   }, [context])

   function registerInput(name: string) {
      return {
         name,
         ref,
         onChange,
         value
      }
   }

   return [registerInput, value]
}