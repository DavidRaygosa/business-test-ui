import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    
    private loggingSource = new BehaviorSubject(false);
    currentLoging = this.loggingSource.asObservable();

    private permissionsSource = new BehaviorSubject(['']);
    currentPermissions = this.permissionsSource.asObservable();

    changeLoging(State:boolean){
        this.loggingSource.next(State);
    }

    changePermissions(Permissions:Array<string>){
        this.permissionsSource.next(Permissions);
    }
}