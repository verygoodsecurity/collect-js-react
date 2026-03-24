import type { IVGSCollect, IVGSCollectForm } from '../types/Form';

export const VGSCollectFieldInstanceMock = {
  on: jest.fn(),
  off: jest.fn(),
  delete: jest.fn()
};

export const VGSCollectInstanceMock = {
  field: jest.fn(() => VGSCollectFieldInstanceMock),
  on: jest.fn(),
  off: jest.fn(),
  submit: jest.fn(),
  tokenize: jest.fn(),
  createAliases: jest.fn(),
  createCard: jest.fn(),
  updateCard: jest.fn(),
  reset: jest.fn(),
  connectSatellite: jest.fn(),
  unmount: jest.fn(),
  useCname: jest.fn(),
  setRouteId: jest.fn()
};

const VGSCollectFormInstanceMock = VGSCollectInstanceMock as unknown as IVGSCollectForm;

window.VGSCollect = {
  create: jest.fn(() => VGSCollectFormInstanceMock),
  session: jest.fn(() => Promise.resolve(VGSCollectFormInstanceMock))
} as IVGSCollect;
