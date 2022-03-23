import { LinkedList } from "./linkedList.js";
export{ Queue };
// FIFO
class Queue {
    constructor() {
        this.list = new LinkedList();
    }
    enqueue(element) {
        this.list.addFront(element);
    }
    dequeue() {
        return this.list.removeEnd();
    }
    isEmpty() {
        return this.list.isEmpty();
    }
    print() {
        this.list.print();
    }
    length() {
        return this.list.getLength();
    }
    forEach(func) {
        for(let i = 0; i < this.length(); i++) {
            let item = this.dequeue();
            func(item);
            this.enqueue(item);
        }
    }
}