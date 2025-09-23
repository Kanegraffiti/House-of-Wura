import { ulid } from 'ulidx';

export const newOrderId = () => `ow_${ulid()}`;
