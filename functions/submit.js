const { GoogleSpreadsheet } = require('google-spreadsheet');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }

    let data;
    try {
      data = JSON.parse(event.body);
    } catch (parseError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON payload' }),
      };
    }
    const { fullName, className, date, mainGroup, secondaryGroup, scores, answers } = data;

    // Khởi tạo GoogleSpreadsheet với thông tin xác thực
    const doc = new GoogleSpreadsheet('1_JNzhtBOgOrtUDLMjKKQXr0XWJgV0FOZZcgZsm4e4ac', {
      auth: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT)
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    const rowData = {
      'Họ và tên': fullName,
      'Lớp': className,
      'Ngày làm': date,
      'Nhóm mạnh nhất': mainGroup,
      'Nhóm phụ': secondaryGroup,
      'R': scores.R,
      'I': scores.I,
      'A': scores.A,
      'S': scores.S,
      'E': scores.E,
      'C': scores.C,
      ...answers.R.reduce((acc, val, i) => ({ ...acc, [`R${i + 1}`]: val }), {}),
      ...answers.I.reduce((acc, val, i) => ({ ...acc, [`I${i + 1}`]: val }), {}),
      ...answers.A.reduce((acc, val, i) => ({ ...acc, [`A${i + 1}`]: val }), {}),
      ...answers.S.reduce((acc, val, i) => ({ ...acc, [`S${i + 1}`]: val }), {}),
      ...answers.E.reduce((acc, val, i) => ({ ...acc, [`E${i + 1}`]: val }), {}),
      ...answers.C.reduce((acc, val, i) => ({ ...acc, [`C${i + 1}`]: val }), {}),
    };

    await sheet.addRow(rowData);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Data recorded successfully!' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};