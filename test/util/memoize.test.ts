import { describe, it, expect } from "vitest";

import { memoize, inlineMemoize } from "../../src";

describe("memoize cases", () => {
  it("should create a memoized function", () => {
    let counter = 0;
    const add = memoize(() => {
      counter += 1;
    });
    add();
    add();
    add();
    add();
    add();

    expect(counter).toEqual(1);
  });

  it("should create a memoized function with a parameter", () => {
    let counter = 0;
    const add = memoize((number) => {
      counter += number;
    });
    add(1);
    add(2);
    add(2);
    add(3);
    add(3);
    add(3);

    expect(counter).toEqual(6);
  });

  it("should create a memoized function, and reset", () => {
    let counter = 0;
    const add = memoize(() => {
      counter += 1;
    });
    add();
    add();
    add.reset();
    add();
    add();
    add.reset();
    add();
    add();
    add();

    expect(counter).toEqual(3);
  });

  it("should create a memoized function with a parameter, and reset", () => {
    let counter = 0;
    const add = memoize((number) => {
      counter += number;
    });
    add(1);
    add(2);
    add.reset();
    add(2);
    add(2);
    add(3);
    add.reset();
    add(3);
    add(3);

    expect(counter).toEqual(11);
  });

  it("should create a memoized function, and clear", () => {
    let counter = 0;
    const add = memoize(() => {
      counter += 1;
    });
    add();
    add();
    memoize.clear();
    add();
    add();
    memoize.clear();
    add();
    add();
    add();

    expect(counter).toEqual(3);
  });

  it("should create a memoized function with a parameter, and clear", () => {
    let counter = 0;
    const add = memoize((number) => {
      counter += number;
    });
    add(1);
    add(2);
    memoize.clear();
    add(2);
    add(2);
    add(3);
    memoize.clear();
    add(3);
    add(3);

    expect(counter).toEqual(11);
  });

  it("should create multiple memoized functions, and reset one", () => {
    let counter = 0;
    const add = memoize(() => {
      counter += 1;
    });
    const addAgain = memoize(() => {
      counter += 1;
    });
    add();
    addAgain();
    add();
    addAgain();
    add.reset();
    add();
    addAgain();
    add();
    addAgain();
    add.reset();
    add();
    addAgain();
    add();
    addAgain();
    add();
    addAgain();

    expect(counter).toEqual(4);
  });

  it("should create a self-memoized function", () => {
    let counter = 0;

    const add = (): unknown => {
      return inlineMemoize(add, () => {
        counter += 1;
      });
    };

    add();
    add();
    add();
    add();
    add();

    expect(counter).toEqual(1);
  });

  it("should create a self-memoized function with a parameter", () => {
    let counter = 0;

    const add = (number: number): unknown => {
      return inlineMemoize(
        add,
        () => {
          counter += number;
        },
        [number]
      );
    };

    add(1);
    add(2);
    add(2);
    add(3);
    add(3);
    add(3);

    expect(counter).toEqual(6);
  });

  it("should create a self-memoized function and call recursively", () => {
    let counter = 0;

    const add = (): unknown => {
      return inlineMemoize(add, () => {
        counter += 1;

        if (counter === 1) {
          add();
        }
      });
    };

    add();

    expect(counter).toEqual(2);
  });

  it("should create a memoized function with cache based on this", () => {
    let counter = 0;
    const add = memoize(
      () => {
        counter += 1;
      },
      {
        thisNamespace: true,
      }
    );
    const obj1 = {
      name: "obj1",
    };
    const obj2 = {
      name: "obj2",
    };
    add.call(obj1);
    add.call(obj1);
    add.call(obj1);
    add.call(obj1);
    add.call(obj2);
    add.call(obj2);
    add.call(obj2);
    add.call(obj2);

    expect(counter).toEqual(2);
  });

  it("should create a memoized function with cache based on this and a parameter", () => {
    let counter = 0;
    const add = memoize(
      (number) => {
        counter += number;
      },
      {
        thisNamespace: true,
      }
    );
    const obj1 = {
      name: "obj1",
    };
    const obj2 = {
      name: "obj2",
    };
    add.call(obj1, 1);
    add.call(obj1, 2);
    add.call(obj1, 2);
    add.call(obj1, 3);
    add.call(obj1, 3);
    add.call(obj1, 3);
    add.call(obj2, 1);
    add.call(obj2, 2);
    add.call(obj2, 2);
    add.call(obj2, 3);
    add.call(obj2, 3);
    add.call(obj2, 3);

    expect(counter).toEqual(12);
  });

  it("should create a memoized function with cache based on this, and reset the cache", () => {
    let counter = 0;
    const add = memoize(
      () => {
        counter += 1;
      },
      {
        thisNamespace: true,
      }
    );
    const obj1 = {
      name: "obj1",
    };
    const obj2 = {
      name: "obj2",
    };
    add.call(obj1);
    add.call(obj1);
    add.reset();
    add.call(obj1);
    add.call(obj1);
    add.call(obj2);
    add.call(obj2);
    add.reset();
    add.call(obj2);
    add.call(obj2);

    expect(counter).toEqual(4);
  });

  it("should create a memoized function with cache based on this and a parameter, and reset the cache", () => {
    let counter = 0;
    const add = memoize(
      (number) => {
        counter += number;
      },
      {
        thisNamespace: true,
      }
    );
    const obj1 = {
      name: "obj1",
    };
    const obj2 = {
      name: "obj2",
    };
    add.call(obj1, 1);
    add.call(obj1, 2);
    add.reset();
    add.call(obj1, 2);
    add.call(obj1, 3);
    add.reset();
    add.call(obj1, 3);
    add.call(obj1, 3);
    add.reset();
    add.call(obj2, 1);
    add.call(obj2, 2);
    add.reset();
    add.call(obj2, 2);
    add.call(obj2, 3);
    add.reset();
    add.call(obj2, 3);
    add.call(obj2, 3);

    expect(counter).toEqual(22);
  });

  it("should create a memoized function with cache based on this, and clear the cache", () => {
    let counter = 0;
    const add = memoize(
      () => {
        counter += 1;
      },
      {
        thisNamespace: true,
      }
    );
    const obj1 = {
      name: "obj1",
    };
    const obj2 = {
      name: "obj2",
    };
    add.call(obj1);
    add.call(obj1);
    memoize.clear();
    add.call(obj1);
    add.call(obj1);
    add.call(obj2);
    add.call(obj2);
    memoize.clear();
    add.call(obj2);
    add.call(obj2);

    expect(counter).toEqual(4);
  });

  it("should create a memoized function with cache based on this and a parameter, and clear the cache", () => {
    let counter = 0;
    const add = memoize(
      (number) => {
        counter += number;
      },
      {
        thisNamespace: true,
      }
    );
    const obj1 = {
      name: "obj1",
    };
    const obj2 = {
      name: "obj2",
    };
    add.call(obj1, 1);
    add.call(obj1, 2);
    memoize.clear();
    add.call(obj1, 2);
    add.call(obj1, 3);
    memoize.clear();
    add.call(obj1, 3);
    add.call(obj1, 3);
    memoize.clear();
    add.call(obj2, 1);
    add.call(obj2, 2);
    memoize.clear();
    add.call(obj2, 2);
    add.call(obj2, 3);
    memoize.clear();
    add.call(obj2, 3);
    add.call(obj2, 3);

    expect(counter).toEqual(22);
  });

  it("should call a memoized function with an HTML element", () => {
    let counter = 0;
    const add = memoize((arg: { foo: number; element: HTMLElement }) => {
      if (!arg || !arg.element || !arg.foo) {
        throw new Error(`Expected element to be passed`);
      }

      counter += 1;
    });
    const element1 = document.createElement("div");
    const obj1 = {
      foo: 1,
      element: element1,
    };
    const element2 = document.createElement("div");
    const obj2 = {
      foo: 2,
      element: element2,
    };
    add(obj1);
    add(obj1);
    add(obj1);
    add(obj1);
    add(obj2);
    add(obj2);
    add(obj2);
    add(obj1);
    add(obj1);
    add(obj1);

    expect(counter).toEqual(2);
  });

  it("should call a memoized function with an HTML element with a circular child", () => {
    let counter = 0;
    const add = memoize((arg: { foo: number; element: HTMLElement }) => {
      if (!arg || !arg.element || !arg.foo) {
        throw new Error(`Expected element to be passed`);
      }

      counter += 1;
    });
    const circularObject: Record<string, unknown> = {};
    circularObject.child = circularObject;
    const element1 = document.createElement("div");
    // @ts-expect-error circular object
    element1.circularChild = circularObject;
    const obj1 = {
      foo: 1,
      element: element1,
    };
    const element2 = document.createElement("div");
    const obj2 = {
      foo: 2,
      element: element2,
    };
    add(obj1);
    add(obj1);
    add(obj1);
    add(obj1);
    add(obj2);
    add(obj2);
    add(obj2);
    add(obj1);
    add(obj1);
    add(obj1);

    expect(counter).toEqual(2);
  });

  it("should call a memoized function with a circular element and skip memoization", () => {
    let counter = 0;
    type CircularObject = {
      child: CircularObject;
    };

    // @ts-expect-error can't make an infinitely circular object
    const circularObject: CircularObject = {};
    circularObject.child = circularObject;
    const add = memoize((arg: CircularObject) => {
      if (arg !== circularObject) {
        throw new Error(`Expected arg to be circularObject`);
      }

      counter += 1;
    });
    add(circularObject);
    add(circularObject);
    add(circularObject);
    add(circularObject);

    expect(counter).toEqual(4);
  });
});
