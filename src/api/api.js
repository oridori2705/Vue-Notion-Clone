// import { API_END_POINT, USER_NAME } from '../env/apiIgnore.js';

export const request = async (url, options = {}) => {
  const { API_END_POINT, USER_NAME } = await _envRequest();
  try {
    const res = await fetch(`${API_END_POINT}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-username': USER_NAME,
      },
    });

    if (res.ok) {
      const json = await res.json();
      return json;
    }
    throw new Error('API 오류');
  } catch (e) {
    throw new Error('API 오류');
  }
};

async function _envRequest() {
  try {
    const res = await fetch('/.netlify/functions/user', {
      method: 'GET',
    });
    if (res.ok) {
      const json = await res.json();
      return json;
    }
    throw new Error('서버리스 API 오류');
  } catch (error) {
    throw new Error('서버리스 API 오류');
  }
}
