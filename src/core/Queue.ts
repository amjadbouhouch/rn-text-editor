type EventQueueProps<T> = {
  handleQueue: (payload: T) => Promise<void>;
};

export class Queue<T> {
  queue: T[] = [];
  isProcessing = false;
  handleQueue!: EventQueueProps<T>['handleQueue'];
  constructor({ handleQueue }: EventQueueProps<T>) {
    this.handleQueue = handleQueue;
    this.queue = [];
    this.isProcessing = false;
  }

  enqueue(payload: T) {
    this.queue.push(payload);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  processQueue() {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const currentEvent = this.queue.shift()!;
    this.handleQueue(currentEvent).then(() => {
      this.processQueue();
    });
  }
}
