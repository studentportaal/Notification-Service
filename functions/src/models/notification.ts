export class changeNotification{

    userid: string;
    read: boolean;
    jobofferid: string;
    joboffername: string;
    
    constructor(userid: string, jobofferid: string, read: boolean, joboffername: string){
        this.userid = userid;
        this.jobofferid = jobofferid;
        this.read = read;
        this.joboffername = joboffername;
    }
}