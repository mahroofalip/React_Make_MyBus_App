import React, { useState } from "react";

function Txt() {
  const [alignment, setAlignment] = useState("");
  return (
    <div>
     
        <h1>Typography - A Material-UI component</h1>
        <h2>Best website to learn Computer Science.</h2>
        <h3  >
          GeeksforGeeks
        </h3>
  
      <button onClick={() => setAlignment("center")}>Press</button>
    </div>
  );
}

export default Txt;
