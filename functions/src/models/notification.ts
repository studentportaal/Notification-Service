export class changeNotification{

    userid: string;
    read: boolean;
    jobofferid: string;
    
    constructor(userid: string, read: boolean, jobofferid: string){
        this.userid = userid;
        this.read = read;
        this.jobofferid = jobofferid;
    }
}