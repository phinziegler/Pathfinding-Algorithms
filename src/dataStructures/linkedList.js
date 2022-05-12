export { LinkedList, LLNode };
// DOUBLY LINKED LIST
class LLNode {
    constructor(element) {
        this.element = element;
        this.next = null;
        this.before = null;
    }
}
class LinkedList {
    constructor() {
        this.head = null;
        this.end = null;
        this.length = 0;
    }

    addFront(element) {
        let node = new LLNode(element);
        if(this.length == 0) {
            this.head = node;
            this.end = node;
            this.length++;
            return;
        }

        this.head.before = node;
        node.next = this.head;
        this.head = node;
        this.length++;
    }

    addEnd(element) {
        let node = new LLNode(element);
        if(this.length == 0) {
            this.head = node;
            this.end = node;
            this.length = this.length + 1;
            return;
        }
        this.end.next = node;
        node.before = this.end;
        node.next = null;
        this.end = node;
        this.length = this.length + 1;
    }

    removeFront() {
        if(this.length < 2) {
            let s = this.head.element;
            this.length = 0;
            this.head = null;
            this.end = null;
            return s;
        }
        let save = this.head.element;
        this.head = this.head.next;
        this.head.before = null;
        this.length--;
        return save;
    }

    removeEnd() {
        if(this.length < 2) {
            let s = this.end.element;
            this.length = 0;
            this.end = null;
            this.head = null;
            return s;
        }
        let save = this.end.element;
        this.end = this.end.before;
        this.end.next = null;
        this.length--;
        return save;
    }

    print() {
        let current = this.head;
        let string =  "";
        while(current != null) {
            string = string + String(current.element) + ", ";
            current = current.next;
        }
        console.log(string);
    }

    isEmpty() {
        if(this.length <= 0) {
            return true;
        }
        return false;
    }
    getLength() {
        return this.length;
    }
    
}