
import React, { useState } from "react";
import useMyFiles from "@/apiHooks/useMyFiles";
import FileUpload from "@/components/FileUpload";
import MyFiles from "@/components/MyFiles";
import Intro from "@/components/Intro";
import ChatBox from "@/components/ChatBox";
import Head from "next/head";
import Header from "@/components/home/header";

export default function Home() {
  const [activeFile, setActiveFile] = useState();
  const { files, isError, isLoading } = useMyFiles();
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <Head>
        <title>DocTalker - Chat with my PDF</title>
      </Head>
      <main className={`w-full h-screen`}>
        <Header/>
        <div className={"max-w-7xl mx-auto"}>
          <div
            className={
              "mt-5 px-5 lg:px-0 h-[calc(100vh-170px)] min-h-[calc(100vh-170px)]"
            }
          >
            <div className={"grid lg:grid-cols-2 gap-10 h-[inherit]"}>
              <div className="upload-button">
                <Intro />
                <FileUpload />
                <MyFiles setActiveFile={setActiveFile} files={files} />
              </div>
              <div className="chatbox">

                <ChatBox activeFile={activeFile} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
