
import React from "react"

function splitName (fullName)  {
    const parts = fullName.split(" ");
    return {
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" ") || "",
    };
  };

  export default splitName;