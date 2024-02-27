import { Databases, Client, Storage, Account } from 'appwrite';

/**
 * object containing IDs of all collections in the main database within appwrite
 */
const mainDb = {
	databaseID: '65cffe2a65e4ac1caf55',
	collections: [{
        messages: "65da2e313e61cd9ec368",
        chatRooms: "65da1ecbccdd8a19944c",
        forumComments: "65da1b313e4156c62a31",
        forums: "65da1a114ebcee58ef43",
        vacancyNotifications: "65da184a880fecbb724a",
        applicationNotes: "65da13b8d63166feaa66",
        vacancyApplications: "65da11ddcbc8ec1250bb",
        vacancies: "65da072f315d1ef8c141",
        notifications: "65d932d5a7bf501dd37c",
        socialMediaAccounts: "65d9304ed31d5d1c9509",
        organizations : "65d925ab10d43ec51b3c",
        userLanguages : "65d92425ed4facc9106e",
        workExperiences : "65d9161ab43a30cb78ca",
        projects : "65d219a74329731159d2",
        signedReferences : "65d218bb9da9a2e3456d",
        siteReferences : "65d20e28e850f1686f1e",
        educations : "65d0e7b4a60393b375ae",
        userBiographies : "65d0d74f2a513cb8337b",
        userProfiles : "65cffe8b792bb31cbb45",
    }]
};

/**
 * object containing the project ID and endpoint of appwrite
 */
const config = {
	endPoint: 'http://appwrite.waterwolf.tech:8080/v1',
	project: '65cb6350e2738c5d0f96'
};


class AuthService {
	client = new Client();
	auth;

	constructor() {
		try {
			this.client.setEndpoint(config.endPoint);
			this.client.setProject(config.project);

			this.auth = new Account(this.client);
		} catch (err) {
			console.log(err);
		}
	}

    // async getUser(){
    //     return this.auth?.get()
    //     .then(user => {return user})
    //     .catch(err => {

    //     })
    // }
}
