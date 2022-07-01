/*  - since document.readyState is only a readonly property, we are creating a mock property
    - this allows us to switch readyState between 'loading', 'complete' and 'interactive'
    - the reason for adding this here is for consistency
    - else only the tests defined after the property below has been defined will be able to set values for readyState
*/
let oldReadyState = document.readyState;
Object.defineProperty(document, "readyState", {
  get(): string {
    return oldReadyState;
  },

  set(newState: string) {
    // @ts-expect-error Type 'string' is not assignable to type 'DocumentReadyState'.
    oldReadyState = newState;
  },
});

let oldBody = document.body;
Object.defineProperty(document, "body", {
  get(): HTMLBodyElement | undefined {
    // @ts-expect-error Type 'string' is not assignable to type 'DocumentReadyState'.
    return oldBody;
  },

  set(newBody: HTMLBodyElement | undefined) {
    // @ts-expect-error Type 'HTMLBodyElement | null' is not assignable to type 'HTMLElement'.
    oldBody = newBody;
  },
});
