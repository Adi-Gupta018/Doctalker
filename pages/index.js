import FileUpload from "@/components/FileUpload";
import MyFiles from "@/components/MyFiles";
import Intro from "@/components/Intro";
import ChatBox from "@/components/ChatBox";
import { useState } from "react";
import useMyFiles from "@/apiHooks/useMyFiles";
import Head from "next/head";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export default function Home() {
  const [activeFile, setActiveFile] = useState();
  const { files, isError, isLoading } = useMyFiles();

  const handleTourStart = () => {
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
            description: "View and select your uploaded pdf files from here to chat.",
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

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    
    <>
      <Head>
        <title>DocTalker - Chat with my PDF</title>
      </Head>
      <main className={`w-full h-screen`}>
        <div className={"max-w-5xl mx-auto"}>
          <h1
            className={
              "intro-title inline-block text-transparent px-5 lg:px-0 bg-clip-text py-4 text-3xl font-bold bg-gradient-to-r from-[#108dc7] to-[#ef8e38] font-squarePeg"
            }
          >
            DocTalker
          </h1>
          <div
            className={
              "mt-5 px-5 lg:px-0 h-[calc(100vh-170px)] min-h-[calc(100vh-170px)]"
            }
          >
            <div className={"grid lg:grid-cols-2 gap-8 h-[inherit]"}>
              <div  className="upload-button">
                <Intro />
                <FileUpload />
                {console.log(activeFile)}
                <MyFiles
                  setActiveFile={setActiveFile}
                  files={files}
                />
              </div>
              <div className="chatbox">
                <button
                  onClick={handleTourStart}
                  className="text-white bg-[#ef8e38] hover:bg-[#ef7b38] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                >
                  Tour
                </button>
                <ChatBox activeFile={activeFile} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
