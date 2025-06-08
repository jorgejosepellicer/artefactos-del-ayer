import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewerService {
  private state = new BehaviorSubject<Record<string, boolean>>({});
  readonly state$ = this.state.asObservable();

  show(componentName: string) {
    const current = this.state.getValue();
    this.state.next({ ...current, [componentName]: true });
  }

  hide(componentName: string) {
    const current = this.state.getValue();
    this.state.next({ ...current, [componentName]: false });
  }

  toggle(componentName: string) {
    const current = this.state.getValue();
    const currentValue = current[componentName] ?? false;
    this.state.next({ ...current, [componentName]: !currentValue });
  }

  isVisible(componentName: string): boolean {
    return this.state.getValue()[componentName] ?? false;
  }
}
