import { useEffect, useState } from "react";
import catchError from "../catchError";
import useInterval from "./useInterval";

type QueueItem = {
  id: string;
  value: any; // or a more specific type based on your needs
};

const useQueue = (delay: number, callback: (value: any) => Promise<any>) => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [resolvedItems, setResolvedItems] = useState<{ [id: string]: any }>({});

  // Function to add an item to the queue
  const addToQueue = (item: QueueItem) => {
    setQueue((prevQueue) => [...prevQueue, item]);
  };

  // Function to process the next item in the queue
  const processQueueItem = async (item: QueueItem) => {
    console.log(resolvedItems[item.id])
    if (resolvedItems[item.id]) {
      return;
    }
    // if (queue.length === 0) {
    //   return;
    // }
    // const currentItem = queue[0]; // Get the first item in the queue

    // console.log(currentItem, queue);
    const [error, result] = await catchError(callback(item.value)); //await callback(currentItem.value); // Call the callback with the item's value

    if (result) {
      // Update resolved items using the item's id as the key
      setResolvedItems((prevResolved) => ({
        ...prevResolved,
        [item.id]: result,
      }));
    } else if (error) {
        console.error(error)
    }
  };

  useEffect(() => {
    if (queue.length > 0) {
      const intervalId = setInterval(() => {
        const item = queue[0];
        const newQueue = queue.slice(1);
        setQueue(newQueue);
        processQueueItem(item);
      }, delay); // Call every 'delay' milliseconds
      // Cleanup function to clear the interval
      return () => clearInterval(intervalId);
    }
  }, [queue]); // Only re-run when queue changes
  return {
    queue,
    resolvedItems,
    addToQueue,
  };
};

export default useQueue;
