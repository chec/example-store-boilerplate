import Commerce from '@chec/commerce.js';

export default () => {
  window.commerce = new Commerce(
    process.env.MIX_CHEC_API_KEY,
    true,
    {
      url: process.env.MIX_CHEC_API_URL || 'https://api.chec.io'
    }
  );
};
