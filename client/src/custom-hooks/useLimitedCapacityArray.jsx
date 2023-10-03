import { useState } from "react";

function useLimitedCapacityArray(initialCapacity) {
  const [data, setData] = useState([]);

  const pushData = (newData) => {
    setData((prevData) => {
      const newDataArray = [...prevData, newData];

      // Check if the data size exceeds the set capacity + 10
      if (newDataArray.length > initialCapacity) {
        // If so, remove the oldest 10 values and keep the rest
        return newDataArray.slice(-initialCapacity);
      } else {
        // Otherwise, simply append the new data
        return newDataArray;
      }
    });
  };

  return [data, pushData];
}

export default useLimitedCapacityArray;
