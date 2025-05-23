// import { get, isEqual, omit } from 'lodash';
import { BehaviorSubject, Observable, pipe } from 'rxjs';

// https://georgebyte.com/state-management-in-angular-with-observable-store-services/

export class State {
  readonly version: number = 1;
}

export class Store<T extends State> {
  get state(): T {
    return this.actions.value;
  }

  protected constructor(initialState: T, private key?: string) {
    if (key) {
      const local = JSON.parse(localStorage.getItem(key)) as T;
      initialState = local?.version != initialState.version ? initialState : local;

      if (!local) {
        localStorage.setItem(key, JSON.stringify(initialState));
      }
    }

    this.actions = new BehaviorSubject(initialState);
    this.state$ = this.actions.asObservable(); // .pipe(shareReplay(1));

    // win.devTools = win.__REDUX_DEVTOOLS_EXTENSION__.connect();
  }

  protected actions: BehaviorSubject<T>;
  public state$: Observable<T>;

  dispatch(payload: Partial<T>): void {
    const next = { ...this.state, ...payload };
    this.actions.next(next);

    if (this.key) localStorage.setItem(this.key, JSON.stringify(next));
  }

  // select(path: string) {
  //   return this.state$.pipe(select<T>(path));
  // }
}

// export const select = <T>(path: string) =>
//   pipe(
//     map(state => get(state, path, null)),
//     distinctUntilChanged(isEqual)
//   );

// redux
const win = window as any;

export class Action {
  constructor(public type: string, public payload?: any) {}
}

// export const reducer = () =>
// scan<any>((state: any, action: Action) => {
//   let next: any;
//   switch (action.type) {
//     case 'set':
//       next = action.payload;
//       break;
//     case 'update':
//       next = { ...state, ...action.payload };
//       break;
//     case 'delete':
//       next = omit(state, action.payload);
//       break;
//   }

//   win.devTools.send(action.type, next);
//   return next;
// });

// @Injectable({ providedIn: 'root' })
// export class Store {
//   protected constructor() {
//     this.actions = new Subject();
//     this.state$ = this.actions.pipe(reducer(), shareReplay());

//     win.devTools = win.__REDUX_DEVTOOLS_EXTENSION__.connect();
//   }

//   readonly state$: Observable<any>;
//   private actions: Subject<Action>;

//   dispatch(action: Action) {
//     this.actions.next(action);
//   }

//   select(path: string) {
//     return this.state$.pipe(select(path));
//   }
// }

// example feature state & service

// export class CoffeeElectionState implements State {
//   version = 1;
//   candidates: { name: string; votes: number }[] = [];
// }

// @Injectable({ providedIn: 'root' })
// export class CoffeeElectionStore extends Store<CoffeeElectionState> {
//   // add a super call to CoffeeElectionStore’s constructor in order to
//   // correctly initialize the state when creating a new instance of CoffeeElectionStore
//   constructor() {
//     super(new CoffeeElectionState());
//   }

//   addVote(candidate: { name: string; votes: number }): void {
//     super.dispatch({
//       ...this.state,
//       candidates: this.state.candidates.map(c => {
//         if (c === candidate) {
//           return { ...c, votes: c.votes + 1 };
//         }
//         return c;
//       })
//     });
//   }

//   addCandidate(name: string): void {
//     super.dispatch({
//       ...this.state,
//       candidates: [...this.state.candidates, { name, votes: 0 }]
//     });
//   }
// }
