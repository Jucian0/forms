import dot from 'dot-prop-immutable'


type OnChange<T> = {
   value: T,
   path: string
}

class State<T extends {}>{

   private state: T = Object.assign({});
   private subscribers: Array<(e: T) => void> = []

   constructor(state: T) {

      this.state = state

   }

   get getState() {
      return this.state
   }

   onChange<T>({ value, path }: OnChange<T>) {

      this.state = dot.set(this.state, path, value)

      this.notify()
   }

   reset<T>(values: T) {
      this.state = values as any
      this.notify()
   }

   resetField<T>(values: T, field: string) {
      const value = dot.get(values, field)

      this.state = dot.set(this.state, field, value)
      this.notify()
   }

   getValue(path: string) {
      return dot.get(this.state, path)
   }

   subscribe(fn: (e: T) => void) {
      this.subscribers = [...this.subscribers, fn]

      return () => {
         this.subscribers = this.subscribers.filter(subscribe => subscribe !== fn)
      }
   }

   notify() {
      this.subscribers.forEach(fn => fn(this.getState))
   }

}

export default State