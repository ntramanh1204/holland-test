const hollandData = {
  "R": { name: "Kỹ thuật (Realistic)", questions: ["Tự mua và lắp ráp máy vi tính theo ý mình", "Lắp ráp tủ theo hướng dẫn", "Trang điểm theo hướng dẫn", "Cắt tỉa cây cảnh", "Tháo điện thoại tìm hiểu", "Thám hiểm hang động, núi rừng", "Chăm sóc vật nuôi", "Sửa xe", "Làm đồ nội thất", "Lắp ráp máy vi tính", "Leo núi", "Đóng gói đồ đạc", "Chơi thể thao", "Đạp xe xuyên quốc gia"] },
  "I": { name: "Nghiên cứu (Investigative)", questions: ["Tham quan bảo tàng", "Tìm hiểu sự hình thành của các vì sao và vũ trụ", "Tìm hiểu về văn hóa một quốc gia", "Tìm hiểu về tâm lý con người", "Đọc sách về tương lai của loài người", "Xem tin tức khoa học", "Tìm hiểu cảm xúc con người", "Xem ca mổ tim", "Tìm hiểu nguồn gốc bệnh dịch", "Đọc báo về AI", "Tìm hiểu thế giới động vật", "Phát minh xe điện", "Thí nghiệm hóa học", "Nghiên cứu chế độ dinh dưỡng"] },
  "A": { name: "Nghệ thuật (Artistic)", questions: ["Tạo tác phẩm nghệ thuật", "Viết truyện ngắn", "Chứng tỏ năng lực nghệ thuật", "Chơi trong ban nhạc", "Chỉnh sửa phim", "Thuyết trình thiết kế", "Vẽ phim hoạt hình", "Hát trong ban nhạc", "Biểu diễn nhảy hiện đại", "Làm MC sự kiện", "Độc thoại phát thanh", "Viết kịch bản phim", "Chụp ảnh sự kiện", "Viết bài phê bình phim"] },
  "S": { name: "Xã hội (Social)", questions: ["Giúp người khác chọn nghề", "Kết nối bạn bè", "Dạy ăn uống đúng cách", "Tham gia ngày trái đất", "Hướng dẫn khách nước ngoài", "Cứu động vật", "Thảo luận nhóm", "Kể chuyện cười", "Dạy trẻ con chơi thể thao", "Lắng nghe bạn bè", "Giúp bạn giải quyết tình yêu", "Tham gia đi từ thiện", "Giúp dự án cộng đồng", "Sẵn sàng giúp thầy cô"] },
  "E": { name: "Quản lý (Enterprising)", questions: ["Tham gia ban đại diện học sinh", "Làm cán bộ lớp", "Bán hàng trực tuyến", "Quản lý cửa hàng online", "Học thị trường chứng khoán", "Học quản lý tài chính", "Trại kỹ năng lãnh đạo", "Lập kế hoạch nhóm", "Kinh doanh online", "Thuyết trình trước đám đông", "Xây dựng luật lệ", "Thuyết phục cha mẹ", "Tổ chức đi chơi", "Kiếm tiền làm thêm"] },
  "C": { name: "Nghiệp vụ (Conventional)", questions: ["Mở tài khoản tiết kiệm", "Lập kế hoạch chi tiêu", "Ngân sách đi chơi", "Chuẩn bị thuyết trình", "Kế hoạch nghỉ hè", "Đếm sắp xếp tiền", "Sắp xếp bàn học", "Viết kế hoạch học tập", "Hoàn thành bài tập đúng hạn", "Dò lỗi chính tả", "Học vi tính văn phòng", "Làm thủ quỹ", "Sắp xếp tủ quần áo", "Giúp cha mẹ quản lý tiền"] },
};

const container = document.getElementById("questionGroups");
for (const [key, group] of Object.entries(hollandData)) {
  const groupDiv = document.createElement("div");
  groupDiv.className = "group";
  groupDiv.innerHTML = `<h3>${group.name}</h3>`;
  group.questions.forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "question";
    div.innerHTML = `<label>${q}</label><select name="${key}_${i}">
      <option value="0">Không</option>
      <option value="1">Không rõ</option>
      <option value="2">Có</option>
    </select>`;
    groupDiv.appendChild(div);
  });
  container.appendChild(groupDiv);
}

// Hàm tính điểm số
function calculateScores(form) {
  const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  for (const key in hollandData) {
    hollandData[key].questions.forEach((_, i) => {
      const val = parseInt(form.get(`${key}_${i}`));
      if (val === 2) scores[key] += 1;
    });
  }
  return scores;
}

// Hàm thu thập câu trả lời
function collectAnswers(form) {
  const answers = { R: [], I: [], A: [], S: [], E: [], C: [] };
  for (const key in hollandData) {
    hollandData[key].questions.forEach((_, i) => {
      const val = form.get(`${key}_${i}`);
      answers[key].push(val);
    });
  }
  return answers;
}

// Hàm lấy nhóm mạnh nhất
function getMainGroup(scores) {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return sorted[0] ? sorted[0][0] : '';
}

// Hàm lấy nhóm phụ
function getSecondaryGroup(scores) {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return sorted[1] ? sorted[1][0] : '';
}

// Hàm gửi dữ liệu đến Google Apps Script
function submitToSheet(fullName, className, date, scores, answers) {
  const scriptURL = 'https://script.google.com/macros/s/AKfycbyW4s-BOiFMd0rxvUqAk_c_1c8WWxTbrDfRhjG099ymMrUETBK8X6VKjPsCvfBQYTdzqg/exec';
  const data = {
    fullName,
    className,
    date,
    mainGroup: getMainGroup(scores),
    secondaryGroup: getSecondaryGroup(scores),
    scores,
    answers
  };

  fetch(scriptURL, {
    method: 'POST',
    mode: 'no-cors',
    redirect: "follow",
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    }
  })
}

document.getElementById("hollandForm").onsubmit = function (e) {
  e.preventDefault();
  const form = new FormData(e.target);
  const scores = calculateScores(form);
  const answers = collectAnswers(form);
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const top2 = sorted.slice(0, 2);
  const comboKey = `${top2[0][0]}+${top2[1][0]}`;
  const reverseKey = `${top2[1][0]}+${top2[0][0]}`;
  const hollandDescriptions = {
    R: "Thích hoạt động thực tế và sử dụng công cụ.",
    I: "Thích khám phá, phân tích, suy luận.",
    A: "Yêu thích sáng tạo nghệ thuật và tự do.",
    S: "Quan tâm và giúp đỡ người khác.",
    E: "Giỏi lãnh đạo và thuyết phục.",
    C: "Thích công việc tổ chức, hệ thống và chính xác."
  };
  const hollandCareers = {
    R: ["Kỹ sư cơ khí", "Thợ điện", "Kỹ thuật viên máy tính", "Kỹ sư công trình", "Nhân viên logistics"],
    I: ["Nhà khoa học dữ liệu", "Nhà tâm lý học", "Nhà nghiên cứu thị trường", "Bác sĩ", "Nhà sinh học"],
    A: ["Nhà thiết kế đồ họa", "Nhà văn", "Diễn viên", "Nhạc sĩ", "Đạo diễn phim"],
    S: ["Giáo viên", "Nhân viên công tác xã hội", "Chuyên gia tâm lý học đường", "Điều dưỡng", "Tư vấn viên học đường"],
    E: ["Quản trị kinh doanh", "Nhà sáng lập startup", "Nhân viên marketing", "Giám đốc dự án", "Chuyên viên quan hệ công chúng"],
    C: ["Kế toán", "Thủ thư", "Chuyên viên nhập liệu", "Nhân viên hành chính", "Chuyên viên phân tích dữ liệu"]
  };
  const hollandCombinations = {
    "S+E": ["Quản lý giáo dục", "Tư vấn viên phát triển cộng đồng", "Chuyên viên nhân sự", "Huấn luyện viên kỹ năng", "Chuyên viên đào tạo nội bộ"],
    "A+E": ["Giám đốc sáng tạo", "Nhà sản xuất nghệ thuật", "Chuyên viên truyền thông sáng tạo", "Khởi nghiệp trong lĩnh vực nghệ thuật"],
    "R+S": ["Kỹ thuật viên y tế", "Giáo viên dạy nghề", "Huấn luyện viên thể thao", "Chuyên viên vận hành kỹ thuật trong tổ chức phi lợi nhuận"],
    "I+R": ["Kỹ sư nghiên cứu", "Chuyên gia AI", "Nhà khoa học môi trường", "Kỹ sư y sinh", "Nhà phát triển robot"],
    "A+C": ["Thiết kế đồ họa", "Biên tập viên xuất bản", "Chuyên viên sản xuất nội dung", "Tổ chức sự kiện nghệ thuật"],
    "E+C": ["Chuyên viên kế hoạch tài chính", "Quản lý dự án doanh nghiệp", "Chuyên viên tổ chức sự kiện", "Chuyên viên nhân sự"],
    "I+C": ["Nhà phân tích dữ liệu", "Chuyên viên hệ thống thông tin", "Chuyên viên thống kê nghiên cứu thị trường"],
    "I+S": ["Chuyên gia phát triển chương trình đào tạo", "Nhà tư vấn giáo dục", "Nhà nghiên cứu giáo dục xã hội"],
    "R+A": ["Thiết kế công nghiệp", "Chuyên gia kỹ thuật ánh sáng sân khấu", "Nhà thiết kế sản phẩm"],
    "A+S": ["Nhà trị liệu nghệ thuật", "Giáo viên nghệ thuật", "Nhà văn truyền cảm hứng"],
    "E+R": ["Chuyên viên kỹ thuật vận hành kinh doanh", "Quản lý sản xuất", "Giám sát kỹ thuật dự án"],
    "E+I": ["Chuyên gia khởi nghiệp công nghệ", "Cố vấn đầu tư công nghệ", "Nhà chiến lược thị trường số"]
  };

  const comboCareers = hollandCombinations[comboKey] || hollandCombinations[reverseKey] || [];

  let html = "<h3>🔎 Tổng quan điểm số của bạn:</h3><ul>" +
    sorted.map(([code, score]) => `<li><strong>${hollandData[code].name}</strong>: ${score} điểm</li>`).join("") +
    "</ul><hr><h3>🌟 Hai nhóm nổi bật nhất:</h3>" +
    top2.map(([code]) => `
      <p><strong>${hollandData[code].name}</strong></p>
      <p>${hollandDescriptions[code]}</p>
      <p><em>Ngành nghề phù hợp:</em> ${hollandCareers[code].join(", ")}</p>
    `).join("");

  if (comboCareers.length > 0) {
    html += `<h3>🔍 Gợi ý ngành nghề từ kết hợp nhóm ${comboKey}</h3><ul>${comboCareers.map(c => `<li>${c}</li>`).join("")}</ul>`;
  }

  document.getElementById("resultContent").innerHTML = html;
  document.getElementById("resultBox").style.display = "block";
  document.getElementById("resultBox").scrollIntoView({ behavior: 'smooth' });

  const fullName = form.get('name');
  const className = form.get('class');
  const date = new Date().toLocaleDateString('vi-VN');
  submitToSheet(fullName, className, date, scores, answers);
};
