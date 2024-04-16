import toast from "svelte-french-toast";

export function getDatePickerValue(dateString) {
	const inputDate = new Date(dateString);
	const year = inputDate.getFullYear();
	const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
	const day = inputDate.getDate().toString().padStart(2, '0');

	return `${year}-${month}-${day}`;
}

export function handleFormToast(form) {
	if (form.message && form.message.type) {
		switch (form.message.type) {
			case 'success':
				toast.success(form.message.text ? form.message.text : 'Submission Successfull');
				break;
			case 'error':
				toast.error(form.message.text ? form.message.text : 'Invalid input(s), submission failed');
				break;
		}
	}
}
