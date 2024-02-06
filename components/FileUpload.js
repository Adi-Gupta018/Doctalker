import {useState,useEffect} from 'react';
import toast from "react-hot-toast";
import useSWR, { mutate } from 'swr';

export default function FileUpload() {
	const [file, setFile] = useState();
	const [uploading, setUploading] = useState(false)

	useEffect(() => {
        // This effect will run whenever the file state is updated
        console.log('file', file);
    }, [file]);

	const handleFileChange = (e) => {
		console.log("handlefile change is called")
		if (e.target.files) {
			let ufile = e.target.files[0]
			console.log(ufile, ufile.type);
			if (ufile.type !== 'application/pdf') {
				toast.error('Only PDF files are allowed')
				e.target.value = null
				return
			}
			setFile(ufile);
			console.log("file",file);
		}
	}; 
	

	const handleUploadClick = async () => {
		if (!file) {
			return;
		}
		console.log("handleupload click is called")
		setUploading(true)
		const formData = new FormData();
		formData.append('file', file);
		console.log(formData);
		// 👇 Uploading the file using the fetch API to the server
		let response = await fetch('/api/upload', {
			method: 'POST',
			body: formData
		})
		if (response.ok) {
			response = await response.json()
			toast.success(response.message)

			mutate('/api/my-files');
		} else {
			response = await response.json()
			toast.error(response.message)
		}
		setUploading(false)
	};

	return (
		<div className="mb-3">
			<div>
				<label
					htmlFor="formFile"
					className="mb-2 inline-block text-black"
				>Upload a PDF File</label
				>
				<input
					className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
					type="file"
					id="formFile"
					onChange={handleFileChange}
				/>
			</div>

			<div className={"text-right py-2"}>
				<button
					type="button"
					onClick={handleUploadClick}
					disabled={uploading}
					className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
					{uploading ? 'Please wait...' : 'Upload'}
				</button>
			</div>
		</div>
	)
}

