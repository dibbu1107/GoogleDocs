import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useParams, useHistory } from "react-router-dom";
import QuillCursors from "quill-cursors"; 

// Time interval for periodically saving the document to the server
const SAVE_INTERVAL_MS = 2000;

// Options for the Quill editor's toolbar configuration
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }], 
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }], 
  ["bold", "italic", "underline"], 
  [{ color: [] }, { background: [] }], 
  [{ script: "sub" }, { script: "super" }], 
  [{ align: [] }], 
  ["image", "blockquote", "code-block"], 
  ["clean"], 
];

const TextEditor = () => {
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState(null);
  const history = useHistory();

  // Set up socket connection with the server
  useEffect(() => {
    const token = localStorage.getItem("token");
    const s = io("http://localhost:3002", {
      query: { token },
    });
    // Handle unauthorized access by redirecting to the login page
    s.on("unauthorized", (error) => {
      console.error("Unauthorized. Redirecting to login page:", error);
      history.push("/login");
    });
     // Set the socket in the component state
    setSocket(s);

    // Clean up the socket connection on component unmount
    return () => {
      s.disconnect();
    };
  }, [history]);

  // Load document content from the server when the documentId changes
  useEffect(() => {
    if (!socket || !quill) return;

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit("get-document", documentId);
  }, [socket, quill, documentId]);

  // Periodically save the document content to the server
  useEffect(() => {
    if (!socket || !quill) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);

    // Clean up the interval on component unmount
    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  // Receive changes from other users and update the document
  useEffect(() => {
    if (!socket || !quill) return;

    // Define a handler function for receiving changes from other users
    const receiveChangesHandler = (delta, userId, username, cursorPosition) => {
      console.log(userId, username, cursorPosition, "------------");
      quill.updateContents(delta);

      const cursors = quill.getModule("cursors");
      if (cursors) {
        cursors.moveCursor(userId, cursorPosition, username);
      }
    };
     // Set up a socket event listener for "receive-changes" event
    socket.on("receive-changes", receiveChangesHandler);

    // Clean up the event listener on component unmount
    return () => {
      socket.off("receive-changes", receiveChangesHandler);
    };
  }, [socket, quill]);

  // Initialize Quill editor inside the wrapper element
  const wrapperRef = useCallback((wrapper) => {
    if (!wrapper) return;

   // Clear the content of the wrapper element
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);

    // Register the QuillCursors module for collaborative editing
    Quill.register("modules/cursors", QuillCursors); 
    // Create a new Quill editor instance within the editor div
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS, cursors: true },
    });

    // Disable the Quill editor initially
    q.disable();
    q.setText("Loading...");

    const observer = new MutationObserver(() => {
      q.update();
    });

    // Observe changes to the wrapper and update the Quill editor
    observer.observe(wrapper, { childList: true });

    setQuill(q);
  }, []);

  // Set up collaborative cursors
  useEffect(() => {
    if (!quill) return;

    const cursors = quill.getModule("cursors");
    if (cursors) {
      quill.on("selection-change", (range, source) => {
        if (source === "user") return;
        const userId = localStorage.getItem("userId");
        const username = localStorage.getItem("username");
        cursors.createCursor(userId, username, range, userId);
      });
    }
  }, [quill]);

  // Send user's changes to the server
  useEffect(() => {
    if (!socket || !quill) return;

    const sendChangesHandler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      const userId = localStorage.getItem("userId");
      const username = localStorage.getItem("username");
      const cursorPosition = quill.getSelection();
      console.log("----->>>>", userId, username, cursorPosition);
      socket.emit("send-changes", delta, userId, username, cursorPosition);
    };
    quill.on("text-change", sendChangesHandler);

    // Clean up the event listener on component unmount
    return () => {
      quill.off("text-change", sendChangesHandler);
    };
  }, [socket, quill]);

  return <div className="container" ref={wrapperRef} />;
};

export default TextEditor;
