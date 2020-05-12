export function InputType(ref: any) {
   return ref.type
}

export function setReferenceValue(ref: any, value: any) {

   switch (ref.current?.type) {
      case 'number':
         return ref.current.value = Number(value) || Number();
      case 'checkbox':
         return ref.current.checked = Boolean(value)
      case 'radio':
         return ref.current.checked = ref.current.value === value
      case 'file':
         console.log(ref.current)
         return ref.current.files = value || null
      default:
         return ref.current.value = String(value) || String()
   }

}