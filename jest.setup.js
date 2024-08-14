window.crypto = {
  randomUUID: () => Math.floor(Math.random() * 10)
};

jest.mock("nanoid", () => { return {
  nanoid : ()=>{}
} });