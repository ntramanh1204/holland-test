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

    let credentials;
    try {
      credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Invalid GOOGLE_SERVICE_ACCOUNT credentials' }),
      };
    }

    const doc = new GoogleSpreadsheet('1_JNzhtBOgOrtUDLMjKKQXr0XWJgV0FOZZcgZsm4e4ac', {
      auth: credentials
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    const rowData = {
      'Họ và tên': fullName,
      'Lớp': className,
      'Ngày làm': date,
      'Nhóm mạnh nhất': mainGroup,
      'Nhóm phụ': secondaryGroup,
      'Realistic': scores.R,
      'Investigative': scores.I,
      'Artistic': scores.A,
      'Social': scores.S,
      'Enterprising': scores.E,
      'Conventional': scores.C,
      // Realistic answers
      '(R) Tự mua và lắp ráp máy vi tính theo ý mình': answers.R[0],
      '(R) Lắp ráp tủ theo hướng dẫn': answers.R[1],
      '(R) Trang điểm theo hướng dẫn': answers.R[2],
      '(R) Cắt tỉa cây cảnh': answers.R[3],
      '(R) Tháo điện thoại tìm hiểu': answers.R[4],
      '(R) Thám hiểm hang động, núi rừng': answers.R[5],
      '(R) Chăm sóc vật nuôi': answers.R[6],
      '(R) Sửa xe': answers.R[7],
      '(R) Làm đồ nội thất': answers.R[8],
      '(R) Lắp ráp máy vi tính': answers.R[9],
      '(R) Leo núi': answers.R[10],
      '(R) Đóng gói đồ đạc': answers.R[11],
      '(R) Chơi thể thao': answers.R[12],
      '(R) Đạp xe xuyên quốc gia': answers.R[13],
      // Investigative answers
      '(I) Tham quan bảo tàng': answers.I[0],
      '(I) Tìm hiểu sự hình thành của các vì sao và vũ trụ': answers.I[1],
      '(I) Tìm hiểu về văn hóa một quốc gia': answers.I[2],
      '(I) Tìm hiểu về tâm lý con người': answers.I[3],
      '(I) Đọc sách về tương lai của loài người': answers.I[4],
      '(I) Xem tin tức khoa học': answers.I[5],
      '(I) Tìm hiểu cảm xúc con người': answers.I[6],
      '(I) Xem ca mổ tim': answers.I[7],
      '(I) Tìm hiểu nguồn gốc bệnh dịch': answers.I[8],
      '(I) Đọc báo về AI': answers.I[9],
      '(I) Tìm hiểu thế giới động vật': answers.I[10],
      '(I) Phát minh xe điện': answers.I[11],
      '(I) Thí nghiệm hóa học': answers.I[12],
      '(I) Nghiên cứu chế độ dinh dưỡng': answers.I[13],
      // Artistic answers
      '(A) Tạo tác phẩm nghệ thuật': answers.A[0],
      '(A) Viết truyện ngắn': answers.A[1],
      '(A) Chứng tỏ năng lực nghệ thuật': answers.A[2],
      '(A) Chơi trong ban nhạc': answers.A[3],
      '(A) Chỉnh sửa phim': answers.A[4],
      '(A) Thuyết trình thiết kế': answers.A[5],
      '(A) Vẽ phim hoạt hình': answers.A[6],
      '(A) Hát trong ban nhạc': answers.A[7],
      '(A) Biểu diễn nhảy hiện đại': answers.A[8],
      '(A) Làm MC sự kiện': answers.A[9],
      '(A) Độc thoại phát thanh': answers.A[10],
      '(A) Viết kịch bản phim': answers.A[11],
      '(A) Chụp ảnh sự kiện': answers.A[12],
      '(A) Viết bài phê bình phim': answers.A[13],
      // Social answers
      '(S) Giúp người khác chọn nghề': answers.S[0],
      '(S) Kết nối bạn bè': answers.S[1],
      '(S) Dạy ăn uống đúng cách': answers.S[2],
      '(S) Tham gia ngày trái đất': answers.S[3],
      '(S) Hướng dẫn khách nước ngoài': answers.S[4],
      '(S) Cứu động vật': answers.S[5],
      '(S) Thảo luận nhóm': answers.S[6],
      '(S) Kể chuyện cười': answers.S[7],
      '(S) Dạy trẻ con chơi thể thao': answers.S[8],
      '(S) Lắng nghe bạn bè': answers.S[9],
      '(S) Giúp bạn giải quyết tình yêu': answers.S[10],
      '(S) Tham gia đi từ thiện': answers.S[11],
      '(S) Giúp dự án cộng đồng': answers.S[12],
      '(S) Sẵn sàng giúp thầy cô': answers.S[13],
      // Enterprising answers
      '(E) Tham gia ban đại diện học sinh': answers.E[0],
      '(E) Làm cán bộ lớp': answers.E[1],
      '(E) Bán hàng trực tuyến': answers.E[2],
      '(E) Quản lý cửa hàng online': answers.E[3],
      '(E) Học thị trường chứng khoán': answers.E[4],
      '(E) Học quản lý tài chính': answers.E[5],
      '(E) Trại kỹ năng lãnh đạo': answers.E[6],
      '(E) Lập kế hoạch nhóm': answers.E[7],
      '(E) Kinh doanh online': answers.E[8],
      '(E) Thuyết trình trước đám đông': answers.E[9],
      '(E) Xây dựng luật lệ': answers.E[10],
      '(E) Thuyết phục cha mẹ': answers.E[11],
      '(E) Tổ chức đi chơi': answers.E[12],
      '(E) Kiếm tiền làm thêm': answers.E[13],
      // Conventional answers
      '(C) Mở tài khoản tiết kiệm': answers.C[0],
      '(C) Lập kế hoạch chi tiêu': answers.C[1],
      '(C) Ngân sách đi chơi': answers.C[2],
      '(C) Chuẩn bị thuyết trình': answers.C[3],
      '(C) Kế hoạch nghỉ hè': answers.C[4],
      '(C) Đếm sắp xếp tiền': answers.C[5],
      '(C) Sắp xếp bàn học': answers.C[6],
      '(C) Viết kế hoạch học tập': answers.C[7],
      '(C) Hoàn thành bài tập đúng hạn': answers.C[8],
      '(C) Dò lỗi chính tả': answers.C[9],
      '(C) Học vi tính văn phòng': answers.C[10],
      '(C) Làm thủ quỹ': answers.C[11],
      '(C) Sắp xếp tủ quần áo': answers.C[12],
      '(C) Giúp cha mẹ quản lý tiền': answers.C[13],
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