// import { FaTrashAlt } from 'react-icons/fa'; // Import the dustbin icon
// import toast from 'react-hot-toast';
// import { mutate } from 'swr';
// import { useState } from 'react';
// import AnimatedEllipsis from './AnimatedEllipsis';

// export default function MyFiles({ setActiveFile, files }) {
//   const [deletingIndex, setDeletingIndex] = useState(null);

//   if (!files || files.length === 0) {
//     return <div>No files to display</div>;
//   }

//   const handleDelete = async (file, index) => {
//     setDeletingIndex(index);

//     let response = await fetch('/api/delete', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(file),
//     });

//     if (response.ok) {
//       response = await response.json();
//       toast.success(response.message);
//       mutate('/api/my-files');
//       setDeletingIndex(null);
//     } else {
//       setDeletingIndex(null);
//       response = await response.json();
//       toast.error(response.message);
//     }
//   };

//   return (
//     <div className="border">
//       <div className="bg-[#108dc7] text-primary-contrastText p-1 px-3">Select a pdf to chat</div>
//       {files.map((file, index) => (
//         <div key={index} className="flex items-center justify-between border-b">
//           <button
//             type="button"
//             onClick={() => setActiveFile(file)}
//             className="block w-full p-2 text-left transition duration-500 hover:bg-neutral-100 hover:text-neutral-500 focus:bg-neutral-100 focus:text-neutral-500 focus:ring-0"
//           >
//             {index + 1}. {file.fileName}
//           </button>
//           <button
//             type="button"
//             onClick={() => handleDelete(file, index)}
//             className="text-red-500 hover:text-red-600 pr-4 focus:outline-none"
//           >
//             {deletingIndex === index ? <AnimatedEllipsis /> : <FaTrashAlt />}
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }
import { FaTrashAlt } from 'react-icons/fa'; // Import the dustbin icon
import toast from 'react-hot-toast';
import { mutate } from 'swr';
import { useState } from 'react';
import AnimatedEllipsis from './AnimatedEllipsis';

export default function MyFiles({ setActiveFile, files }) {
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [processingIndex, setProcessingIndex] = useState(null);

  if (!files || files.length === 0) {
    return <div>No files to display</div>;
  }

  const handleDelete = async (file, index) => {
    setDeletingIndex(index);

    let response = await fetch('/api/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(file),
    });

    if (response.ok) {
      response = await response.json();
      toast.success(response.message);
      mutate('/api/my-files');
      setDeletingIndex(null);
    } else {
      setDeletingIndex(null);
      response = await response.json();
      toast.error(response.message);
    }
  };

  const handleProcessing = async (id, index) => {
    setProcessingIndex(index);
  
    try {
      let response = await fetch("/api/process", {
        method: 'POST',
        body: JSON.stringify({ id }),
        headers: {
          'Content-type': 'application/json'
        }
      })
  
      if (response.ok) {
        response = await response.json();
        toast.success(response.message,{duration:3000});
        setActiveFile(files[index]); // Set active file after processing
      } else {
        response = await response.json();
        toast.error(response.message,{duration:3000});
      }
    } catch (error) {
      console.error("Error processing:", error);
      toast.error("An error occurred while processing.Please try again."),{duration:3000};
    } finally {
      setProcessingIndex(null);
    }
  };
  

  return (
    <div className="border">
      <div className="bg-[#108dc7] text-primary-contrastText p-1 px-3">Select a pdf to chat</div>
      {files.map((file, index) => (
        <div key={index} className="flex items-center justify-between border-b">
          <button
            type="button"
            onClick={() => {
              if (!file.isProcessed) {
                handleProcessing(file._id, index);
              } else {
                setActiveFile(file);
              }
            }}
            className="block w-full p-2 text-left transition duration-500 hover:bg-neutral-100 hover:text-neutral-500 focus:bg-neutral-100 focus:text-neutral-500 focus:ring-0"
          >
             {(processingIndex === index) ? <AnimatedEllipsis /> : `${index + 1}. ${file.fileName}`}
          </button>
          <button
            type="button"
            onClick={() => handleDelete(file, index)}
            className="text-red-500 hover:text-red-600 pr-4 focus:outline-none"
          >
            {deletingIndex === index ? <AnimatedEllipsis /> : <FaTrashAlt />}
          </button>
          {/* {processingIndex === index && (
            <span className="ml-2">
              Processing...
            </span>
          )} */}
        </div>
      ))}
    </div>
  );
}
