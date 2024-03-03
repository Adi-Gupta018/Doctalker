import {useState} from "react";


export default function MyFiles({setActiveFile, files}) {
	// console.log("MyFiles.js");
	// console.log(files);
	// check if files is undefined or empty
	if (!files || files.length === 0) {
		return <div>No files to display</div>;
	  }
	
	return (
		<div className={"border"}>
			<div className={"bg-[#108dc7] text-primary-contrastText p-1 px-3"}>Select a pdf to chat</div>
			{
				files.map((file, index) => (
					<button
						key={index}
						type="button"
						onClick={() => setActiveFile(file)}
						className="block border-b w-full cursor-pointer rounded-lg p-2 text-left transition duration-500 hover:bg-neutral-100 hover:text-neutral-500 focus:bg-neutral-100 focus:text-neutral-500 focus:ring-0">
						{index + 1}. {file.fileName}
					</button>
				))
			}
		</div>
	)
}