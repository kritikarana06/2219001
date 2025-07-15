import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { logEvent } from "../logger/middleware";
import { resolveShortcode } from "../api";

const RedirectHandler = () => {
  const { shortcode } = useParams();

  useEffect(() => {
    try {
      const url = resolveShortcode(shortcode);
      logEvent("REDIRECT", { shortcode });
      window.location.href = url;
    } catch (err) {
      alert("Invalid or expired shortcode.");
    }
  }, [shortcode]);

  return <p>Redirecting...</p>;
};

export default RedirectHandler;