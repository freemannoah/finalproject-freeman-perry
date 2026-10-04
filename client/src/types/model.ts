export class Model {
    currUser?: User
    cachedUsers: Record<number, User>
    currentPost?: PostDetails
    board?: Post[]

    isAuthenticated: boolean
    authLoading: boolean

    constructor() {
        this.currUser = undefined;
        this.cachedUsers = {};
        this.currentPost =  undefined;
        this.board = undefined;

        this.isAuthenticated = false;
        this.authLoading = true;
    }
}

export class User {
    id: number
    displayName: string
    residence: string
    created: Date

    constructor(id: number, displayName: string, residence: string, created: Date) {
        this.id = id;
        this.displayName = displayName;
        this.residence = residence;
        this.created = created;
    }
}

export class Post {
    post_id: number
    user_id: number
    userDisplayName: string
    title: string
    isResolved: boolean
    created: Date
    imageData?: string

    constructor(post_id: number, user_id: number, userDisplayName: string, title: string, isResolved: boolean, created: Date, imageData?: string){
        this.post_id = post_id;
        this.user_id = user_id;
        this.userDisplayName = userDisplayName;
        this.title = title;
        this.isResolved = isResolved;
        this.created = created;
        this.imageData = imageData;
    }
}

export class PostDetails {
    post_id: number
    user_id: number
    userDisplayName: string
    title: string
    isResolved: boolean
    created: Date
    messages: Message[]
    description?: string
    imageData?: string

    constructor(post_id: number, user_id: number, userDisplayName: string, title: string, isResolved: boolean, created: Date, messages: Message[], description?: string, imageData?: string){
        this.post_id = post_id;
        this.user_id = user_id;
        this.userDisplayName = userDisplayName;
        this.title = title;
        this.isResolved = isResolved;
        this.created = created;
        this.messages = messages;
        this.description = description;
        this.imageData = imageData;
    }
}

export class Message {
    message_id: number
    post_id: number
    sender_id: number
    senderDisplayName: string
    recipient_id: number
    recipientDisplayName: string
    body: string
    time: Date
    imageData?: string

    constructor(message_id: number, post_id: number, sender_id: number, senderDisplayName: string, recipient_id: number, recipientDisplayName: string, body: string, time: Date, imageData?: string){
        this.message_id = message_id;
        this.post_id = post_id;
        this.sender_id = sender_id;
        this.senderDisplayName = senderDisplayName;
        this.recipient_id = recipient_id
        this.recipientDisplayName = recipientDisplayName;
        this.body = body;
        this.time = time;
        this.imageData = imageData;
    }
}

export const RES_HALLS = [
  "Daniels Hall",
  "Founders Hall",
  "Institute Hall",
  "Messenger Hall",
  "Morgan Hall",
  "Sanford Riley Hall",
  "Stoddard Complex",
  "Ellsworth Apartments",
  "Fuller Apartments",
  "East Hall",
  "Faraday Hall",
  "WPI Townhouses",
  "Cedar House A",
  "Cedar House B",
  "Elbridge House",
  "Fruit House",
  "Hackfeld House",
  "Marston House A",
  "Marston House B",
  "Oak House",
  "Schussler House",
  "Sever House",
  "Trowbridge House",
  "Wachusett House",
  "West House",
  "William House",
  "8 Elbridge House",
  "45 Institute House",
] as const;