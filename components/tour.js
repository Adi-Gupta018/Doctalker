import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export default function handleTourStart(){
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: ".intro-title",
          popover: {
            title: "Introduction",
            description:
              "Welcome to DocTalker! This is a brief introduction to the application.",
            side: "right",
            align: "middle",
          },
        },
        {
          element: ".upload-button",
          popover: {
            title: "File Upload",
            description:
              "Upload your PDF files here to start chatting about their content.",
            side: "right",
            align: "middle",
          },
        },
        {
          element: ".my-files",
          popover: {
            title: "Uploaded Files",
            description: "View, select or delete your uploaded pdf files from here to chat.",
            side: "right",
            align: "middle",
          },
        },
        {
          element: ".chatbox",
          popover: {
            title: "Chat Box",
            description:
              "Engage in conversations about your selected file here.",
            side: "right",
            align: "middle",
          },
        },
      ],
    });
    driverObj.drive();
  };