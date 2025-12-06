import React, { useEffect, useState } from "react";
import Inspector from "./Inspector.js";

const Overlay = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const onEnable = () => setEnabled(true);
    const onDisable = () => {
      setEnabled(false);
      const img = document.getElementsByClassName("whole-page-preview-image")[0];
      if (img) {
        document.body.removeChild(img);
      }
    }

    window.addEventListener("EXT_ENABLE", onEnable);
    window.addEventListener("EXT_DISABLE", onDisable);

    return () => {
      window.removeEventListener("EXT_ENABLE", onEnable);
      window.removeEventListener("EXT_DISABLE", onDisable);
    };
  }, []);

  return (
    <>{enabled && <Inspector />}</>
  );
};

export default Overlay;