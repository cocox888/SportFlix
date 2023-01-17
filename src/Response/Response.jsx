import React, { useEffect, useState } from "react";
import { useDataLayerValue } from "../Datalayer/DataLayer";
import "./response.css";

function Response() {
  const [{ responseData }, dispatch] = useDataLayerValue();
  const [disappearPrompt, setDisappearPrompt] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setDisappearPrompt(true);
      setTimeout(() => {
        setDisappearPrompt(false);
        dispatch({
          type: "SET_RESPONSE_DATA",
          responseData: null,
        });
      }, 300);
    }, 2000);
  }, []);

  return (
    <div
      className={`${responseData?.type} ${
        disappearPrompt && "disappear-prompt"
      }`}
    >
      {responseData?.message}
    </div>
  );
}

export default Response;
