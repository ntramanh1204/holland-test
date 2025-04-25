// this is the Google Apps Script code for the webapp
function doGet(e) {
  var response = ContentService.createTextOutput("Hello, world!");
  response.setMimeType(ContentService.MimeType.TEXT);
  response.addHeader("Access-Control-Allow-Origin", "*");
  return response;
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();

  try {
    // Parse dữ liệu từ text/plain
    var data = JSON.parse(e.postData.contents);

    var hoVaTen = data.fullName || '';
    var lop = data.className || '';
    var ngayLam = data.date || '';
    var mainGroup = data.mainGroup || '';
    var secondaryGroup = data.secondaryGroup || '';
    var scores = data.scores || {};
    var answers = data.answers || {};

    var rowData = [
      hoVaTen,
      lop,
      ngayLam,
      mainGroup,
      secondaryGroup,
      scores.R || 0,
      scores.I || 0,
      scores.A || 0,
      scores.S || 0,
      scores.E || 0,
      scores.C || 0,
    ];

    rowData.push(...answers.R);
    rowData.push(...answers.I);
    rowData.push(...answers.A);
    rowData.push(...answers.S);
    rowData.push(...answers.E);
    rowData.push(...answers.C);

    sheet.appendRow(rowData);

    var response = ContentService.createTextOutput(
      JSON.stringify({ result: 'success', message: '...' })
    );
    response.setMimeType(ContentService.MimeType.JSON);
    response.addHeader('Access-Control-Allow-Origin', '*');
    return response;
  } catch (error) {
    Logger.log('Lỗi xử lý dữ liệu: ' + error);
    var errorResponse = ContentService.createTextOutput(
      JSON.stringify({ result: 'error', message: 'Lỗi khi ghi dữ liệu: ' + error })
    );
    errorResponse.setMimeType(ContentService.MimeType.JSON);
    errorResponse.addHeader('Access-Control-Allow-Origin', '*');
    return errorResponse;
  }
}


function doOptions(e) {
  var response = ContentService.createTextOutput("");
  response.addHeader("Access-Control-Allow-Origin", "*");
  response.addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.addHeader("Access-Control-Allow-Headers", "Content-Type");
  return response;
}