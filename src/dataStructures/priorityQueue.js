import { Queue } from "./queue.js";
import { LLNode } from "./linkedList.js";

export { PriorityQueue };

class QItem {
    constructor(element, value) {
        this.element = element; // the actual element
        this.value = value;     // the "priority"
    }
}

// a priority queue which 
class PriorityQueue extends Queue {
    constructor(valueFunction) {
        super();
        this.valueFunction = valueFunction;
        // compare function should be like...
        // valueOf(element) = #
    }

    enqueue(element) {
        // console.log("enque " + element);
        let qElement = new QItem(element, this.valueFunction(element));
        let newLLNode = new LLNode(qElement);

        let current = this.list.head;   // A QItem
        let prev = current;

        if (this.list.length == 0) {
            // console.log('added' + element + " to front.");
            // console.log("first elem");
            this.list.addFront(qElement);
            return;
        }

        while (current != null) {
            // console.log("while");
            if (newLLNode.element.value >= current.element.value) {
                this.list.length++;
                if(current == this.list.head) {
                    this.list.head = newLLNode;
                    current.before = newLLNode;
                    newLLNode.before = null;
                    newLLNode.next = current;
                    // console.log(`${qElement.element} is the new head.`);
                    return;
                }
        
                current.before = newLLNode;
                newLLNode.next = current;
                newLLNode.before = prev;
                prev.next = newLLNode;
                // console.log(`adding ${qElement.element} between ${prev.element.element} and ${current.element.element}`);
                return;
            }
            prev = current;
            current = current.next;
        }

        this.list.addEnd(qElement);
    }

    dequeue() {
        return this.list.removeFront();
    }

    print() {
        let current = this.list.head;
        let string = "";
        while (current != null) {
            string = string + String(current.element.element) + ", ";
            current = current.next;
        }
        console.log(string);
    }

}