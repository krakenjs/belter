import { onResize } from '../../../src';

const setupTest = () => {
  document.body.innerHTML = '';
  const div = document.createElement('div');
  div.style.width = '200.43px';
  div.style.height = '100.72px';
  document.body.appendChild(div);

  return { el: div };
};

const isAlmostEqual = (valueA, valueB, marginOfError = 0.02) => {
  if (valueA === valueB) return true;
  if (valueA > valueB && valueA < valueB + marginOfError) {
    return true;
  }
  if (valueA < valueB && valueA > valueB - marginOfError) {
    return true;
  }
  return false;
};

describe('onResize cases', () => {
  it('should call handler width correct element dimension', () => {
    const { el } = setupTest();

    let handlerCalledSuccessfully = false;

    const handler = (dimension) => {
      const expectedDimension = { width: 200.43, height: 100.72 };

      if (
        !isAlmostEqual(dimension.width, expectedDimension.width) ||
        !isAlmostEqual(dimension.height, expectedDimension.height)
      ) {
        throw new Error(
          `Expected handler to have been with ${JSON.stringify(
            expectedDimension
          )} but it was ${JSON.stringify(dimension)}`
        );
      }
      handlerCalledSuccessfully = true;
    };

    onResize(el, handler);

    if (!handlerCalledSuccessfully) {
      throw new Error('Handler function was not called');
    }
  });
});
