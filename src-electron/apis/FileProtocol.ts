import { protocol } from 'electron';

export const registerProtocol = () => {
  protocol.unregisterProtocol('local-image');
  const result = protocol.registerFileProtocol('local-image', (req, cb) => {
    const path = req.url.replace('local-image://', '');
    console.log('FileProtocol', { path });
    cb({ path });
  });

  console.log('[RegisterProtocol]', { result });
};
