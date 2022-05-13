import { Queue } from "./queue.js";
import { LLNode } from "./linkedList.js";

export { PriorityQueue };

class QItem {
    constructor(element, value) {
        this.element = element; // the actual element
        this.value = value;     // the "priority"
    }
}

/* THIS CLASS NEEDS TO BE REWORKED
    It currently assumes that all data entered is IMMUTABLE, but this is
    NOT appropriate for A*...

    The sorting needs to occur through the entire list for each enqueue, OR the dequeue needs to extract the min some other way.
*/

class PriorityQueue extends Queue {
    constructor(valueFunction, type="max") {
        super();
        this.valueFunction = valueFunction;
        if(type == "max") {
            this.multiplier = 1;
        }
        else if (type == "min") {
            this.multiplier = -1;
        }
        // compare function should be like...
        // valueOf(element) = #
    }

    enqueue(element) {
        let qElement = new QItem(element, this.multiplier * this.valueFunction(element));
        let newLLNode = new LLNode(qElement);

        let current = this.list.head;   // A QItem
        let prev = current;

        if (this.list.length == 0) {
            this.list.addFront(qElement);
            return;
        }

        while (current != null) {
            if (newLLNode.element.value >= current.element.value) {
                this.list.length++;
                if(current == this.list.head) {
                    this.list.head = newLLNode;
                    current.before = newLLNode;
                    newLLNode.before = null;
                    newLLNode.next = current;
                    return;
                }
        
                current.before = newLLNode;
                newLLNode.next = current;
                newLLNode.before = prev;
                prev.next = newLLNode;
                return;
            }
            prev = current;
            current = current.next;
        }

        this.list.addEnd(qElement);
    }

    dequeue() {
        return this.list.removeFront().element;
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

    toArray() {
        let output = [];
        let current = this.list.head;
        while(current != null) {
            output.push(current.element.element);
            current = current.next;
        }
        return output;
    }

}