export const VGSCollectInstanceMock = {
  field: jest.fn(),
  unmount: jest.fn(),
  useCname: jest.fn()
};

window.VGSCollect = {
  create: jest.fn(() => VGSCollectInstanceMock)
};
