import dot from 'dot-object'


type OnChange<T> = {
   value: T,
   path: string
}

class State<T>{

   private state: T = Object.assign({});
   private subscribers: Array<(e: T) => void> = []

   constructor(state: T) {

      this.state = state

   }

   get getState() {
      return this.state
   }

   onChange<T>({ value, path }: OnChange<T>) {

      dot.set(path, value, this.state as unknown as object)

      // this.state = dot.merge(this.state, path, value)

      this.subscribers.forEach(fn => fn(this.getState))

   }

   getValue(path: string) {
      return dot.pick(path, this.state)
      // return dot.get(this.state, path)
   }

   subscribe(fn: (e: T) => void) {
      this.subscribers = [...this.subscribers, fn]

      return () => {
         this.subscribers = this.subscribers.filter(subscribe => subscribe !== fn)
      }
   }


}

export default State