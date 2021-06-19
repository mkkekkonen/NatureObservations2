import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DebugService {
  debugMode = true;

  constructor() { }
}
