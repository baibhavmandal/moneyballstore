import React from "react";

export default function ListOrders({ order }) {
  return (
    <div className="flex-[0_0_100%] max-w-[100%] w-full px-4">
      <div className="flex flex-wrap pb-2">
        <div className="flex-[0_0_100%] flex text-base max-w-[100%] w-full px-4 pb-3 pt-2 relative">
          <ListItem text={order.period} width="[26.85%]" />
          <ListColor result={order.select} width="[12.08%]" />
          <ListItem text={order.profitLoss} width="[15.44%]" />
          <ListColor result={order.results} width="[12.08%]" />
          <ListItem text={order.betamount} width="[33.55%]" />
        </div>
      </div>
    </div>
  );
}

function ListItem({ text, width }) {
  return <div className={`inline-block flex-${width} text-left`}>{text}</div>;
}

function ListColor({ result, width }) {
  let color;
  let number;

  // Check if the result can be parsed as a number
  if (!isNaN(result)) {
    number = parseFloat(result); // Parse the result as a number
  } else if (Array.isArray(result) && result.length === 2) {
    // Check if the result is an array with two elements
    [color, number] = result;
  } else if (typeof result === "string") {
    // Check if the result is a string
    color = result;
  }

  console.log(result, color, number);

  return (
    <div className={`inline-block flex-${width} text-left`}>
      <ColorBall color={color} number={number} />
    </div>
  );
}

function ColorBall({ color, number }) {
  // Function to determine the letter to display
  const getLetter = (color, number) => {
    if (number || number === 0) {
      return number;
    } else if (color === "green") {
      return "G";
    } else if (color === "red") {
      return "R";
    } else if (color === "violet") {
      return "V";
    }
    return "?";
  };

  // Define color styles
  const colorStyles = {
    red: {
      boxShadow: "rgb(0 0 0 / 40%) 0px 0px 5px",
      background: "#fa3c09",
    },
    green: {
      boxShadow: "rgb(0 0 0 / 40%) 0px 0px 5px",
      background: "#00c282",
    },
    violet: {
      boxShadow: "rgb(0 0 0 / 40%) 0px 0px 5px",
      background: "#6655d3",
    },
    "violet-green": {
      boxShadow: "rgb(0 0 0 / 40%) 0px 0px 5px",
      background: "#00c282",
    },
    "violet-red": {
      boxShadow: "rgb(0 0 0 / 40%) 0px 0px 5px",
      background: "#fa3c09",
    },
  };

  // Define the default style
  const defaultStyle = {
    boxShadow: "rgb(0 0 0 / 40%) 0px 0px 5px",
    background: "#f57c00",
  };

  // Determine the background style
  const determineBackgroundStyle = () => {
    if (colorStyles[color]) {
      return colorStyles[color];
    } else if (number || number === 0) {
      return {
        boxShadow: "rgb(0 0 0 / 40%) 0px 0px 5px",
        background: "#000000",
      };
    } else {
      return defaultStyle;
    }
  };

  // Calculate empty color style
  const emptyStyle = {
    backgroundColor: "rgb(102, 85, 211)",
    position: "absolute",
    width: "14px",
    borderRadius: "0 15px 15px 0",
    color: "white",
    textAlign: "center",
    height: "28px",
    display: "inline-block",
    boxShadow: "rgb(0 0 0 / 40%) 0px 0px 2px",
  };

  // Apply empty style if needed
  const emptyColorStyle =
    color === "violet-green" || color === "violet-red" ? emptyStyle : {};

  // Get the letter to display
  const letterToDisplay = getLetter(color, number);

  return (
    <div className="grid justify-center w-[10%] p-[1px] mb-2">
      <div
        className="inline-block text-white text-center leading-7 h-7 w-[28px] rounded-[50%]"
        style={determineBackgroundStyle()}
      >
        <div className="" style={emptyColorStyle}></div>
        <div className="relative">{letterToDisplay}</div>
      </div>
    </div>
  );
}
