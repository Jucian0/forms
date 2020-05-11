import dot from 'dot-object'


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

      dot.set(path, value, this.state as object)

      this.notify()
   }

   reset<T>(values: T, path: string) {
      dot.set(path, values, this.state as object)
      this.notify()
   }

   getValue(path: string) {
      return dot.pick(path, this.state)
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