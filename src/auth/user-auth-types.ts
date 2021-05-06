export interface UserCustomData {
	gdprConsent: boolean;
}


export interface UserCredential {
	id: string;
	email: string;
	name?: string;
	pictureUrl?: string;
	phoneNumber?: string;
	emailVerified?: boolean;
	customData: UserCustomData;
	lastLogin: number;
	creationDate: number;
}

export interface SignData {
	authProvider: string; 
	email?: string; 
	password?: string;
	name?: string;
	verificationLink?: string;
}
