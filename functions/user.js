//서버리스 함수
exports.handler = async function () {
  return {
    statusCode: 200,
    body: JSON.stringify({
      API_END_POINT: 'https://kdt-frontend.programmers.co.kr',
      USER_NAME: 'user1234',
    }),
  };
};
