import { useState } from "react";

function useCounterWithReset() {
  const [count, setCount] = useState(1);

  const increment = () => {
    setCount((prevCount) => (prevCount === 11 ? 1 : prevCount + 1));
  };

  return [count, increment];
}

export default useCounterWithReset;
