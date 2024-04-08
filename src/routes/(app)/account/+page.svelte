<script>
	import MyToast from '$lib/components/MyToast.svelte'
	export let data;

	const { user } = data;
</script>
<MyToast />
<ul>
	<li>
		<strong>Email:</strong>
		{user.email}
	</li>
	<li>
		<strong>Name:</strong>
		{user.name}
	</li>
	<li>
		<strong>ID: </strong>
		{user.$id}
	</li>
</ul>


<!-- Profile Preview -->
<!-- Job Applications -->
<!-- Job Postings -->
<!-- My organizations -->
<!--
Job Application Statistics:
Total number of job applications submitted
Number of active, pending, accepted, and rejected applications
Application success rate (percentage of accepted applications)
Average time to receive a response from employers

Forum Engagement Statistics:
Total number of forum posts created
Number of new threads started
Total number of replies and comments made
Most active forums or discussion topics
User's personal forum engagement metrics (e.g., posts, replies, likes received)

Chat Interaction Statistics:
Total number of chat conversations initiated
Number of active, ongoing, and completed chat sessions
Average duration of chat conversations
Most frequent chat partners or organizations

Organization Engagement Statistics:
Number of organizations the user is connected with or following
Total number of job postings from the user's connected organizations
Number of new job postings from the user's connected organizations
Engagement metrics with the user's connected organizations (e.g., messages sent, job applications submitted)

User Profile Statistics:
Number of profile views or visits
Completeness of the user's profile (percentage of fields filled out)
Number of endorsements or recommendations received
Skills or certifications added to the user's profile

General Usage Statistics:
Total number of users on the platform
Number of new user registrations over time
Frequency of user logins or visits to the platform
Most popular features or functionalities used by the users

Trending or Emerging Insights:
Most in-demand job titles or industries
Locations with the highest number of job postings
Fastest-growing or declining job sectors
Most discussed topics or trends on the forum
-->