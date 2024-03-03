const handleTourStart = () => {
		const driverObj = driver({
		  showProgress: true,
		  steps: [
			{ element: '.intro-step', popover: { title: 'Introduction', description: 'Welcome to DocTalker! This is a brief introduction to the application.', side: "right", align: 'middle' }},
			{ element: '.upload-step', popover: { title: 'File Upload', description: 'Upload your PDF files here to start chatting about their content.', side: "right", align: 'middle' }},
			{ element: '.files-step', popover: { title: 'Uploaded Files', description: 'View and select your uploaded files from here.', side: "right", align: 'middle' }},
			{ element: '.chatbox-step', popover: { title: 'Chat Box', description: 'Engage in conversations about your selected file here.', side: "right", align: 'middle' }},
		  ]
		});
		driverObj.start();
	  };