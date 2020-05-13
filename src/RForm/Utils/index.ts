import { Ref } from "../Types";

export function InputType(ref: any) {
   return ref.type
}

export function setReferenceValue(ref: Ref, value: any) {
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
         return ref.current.files = value || null
      default:
         return ref.current.value = String(value)
   }

}