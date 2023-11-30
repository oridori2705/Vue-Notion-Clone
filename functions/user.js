require('dotenv').config();

//서버리스 함수
exports.handler = async function () {
  const { API_END_POINT, USER_NAME } = process.env;
  return {
    statusCode: 200,
    body: JSON.stringify({
      API_END_POINT,
      USER_NAME,
    }),
  };
};
