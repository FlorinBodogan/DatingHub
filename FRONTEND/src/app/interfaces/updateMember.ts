export interface updateUserInfo {
    username: string,
    email: string,
    knownAs: string,
}

export interface updateUserDetails {
    introduction: string,
    lookingFor: string,
    interests: string,
    city: string,
    country: string,
}

export interface DeletePhoto {
    photoId: number,
    username: string,
}