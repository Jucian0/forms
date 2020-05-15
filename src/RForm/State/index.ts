import dot from 'dot-prop-immutable'


type OnChange<T> = {
   value: T,
   path: string
}

type Events = 'onChange' | 'onSubmit' | 'onReset' | 'onResetField'

class State<T extends {}>{

   private state: T = Object.assign({});
   private initialState: T = Object.assign({})

   private subscribers: { [k in Events]: Array<(e: T, ...args: Array<any>) => void> } = {
      onChange: [],
      onReset: [],
      onSubmit: [],
      onResetField: []
   }

   constructor(state: T) {
      this.state = state
      this.initialState = state
   }

   get getState() {
      return this.state
   }

   change<T>({ value, path }: OnChange<T>) {
      this.state = dot.set(this.state, path, value)
      this.notify('onChange')
   }

   reset<T>() {
      this.state = this.initialState
      this.notify('onReset')
   }

   resetField(field: string) {
      const value = dot.get(this.initialState, field)

      this.state = dot.set(this.state, field, value)
      this.notify('onResetField', field)
   }

   getValue(path: string) {
      return dot.get(this.state, path)
   }

   subscribe(event: Events, fn: (e: T) => void) {

      this.subscribers[event] = [...this.subscribers[event], fn]

      return () => {
         this.subscribers[event] = this.subscribers[event].filter(subscribe => subscribe !== fn)
      }
   }

   notify(e: Events, ...args: Array<any>) {
      this.subscribers[e].forEach(fn => fn(this.getState, ...args))
   }

}

export default State