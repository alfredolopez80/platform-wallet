const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
  };
  jest.setTimeout(30000)
  global.localStorage = localStorageMock