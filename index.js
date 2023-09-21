let speech = new SpeechSynthesisUtterance();
let textContent = document.getElementById("t-content");

// Functoin to stop speaking
function stopSpeaking() {
  window.speechSynthesis.cancel();
}
// Bắt sự kiện beforeunload để dừng việc nói trước khi thoát khỏi trang
window.addEventListener("beforeunload", function (event) {
  stopSpeaking();
  // Không cần gọi event.preventDefault() vì trình duyệt sẽ hiển thị thông báo thoát mặc định
});

//Function
let exptBtn = document.getElementById("expt-btn");
let clrAll = document.getElementById("clearAll-btn");
let imptBtn = document.getElementById("import-btn");
let savBtn = document.getElementById("save-btn");
let resBtn = document.getElementById("restore-btn");

let fileInput = document.getElementById("fileInput");

let voices = [];
let voiceSelect = document.getElementById("s-content");
window.speechSynthesis.onvoiceschanged = () => {
  voices = window.speechSynthesis.getVoices();
  console.log(voices);
  if (voices.length === 0) {
    console.log("Không có giọng nói nào được tìm thấy.");
  } else {
    console.log("Có giọng nói sẵn có.");
  }
  speech.voice = voices[voices.length - 5];
  console.log(speech);
  voices.forEach(
    (voice, i) => (voiceSelect.options[i] = new Option(voice.name, i))
  );
  console.log("voiceSelect ", voiceSelect.value);
  if (
    speech.voice.name !==
    "Microsoft NamMinh Online (Natural) - Vietnamese (Vietnam)"
  ) {
    speech.voice = voices[0];
  } else {
    voiceSelect.value = voices.length - 5;
  }
  console.log(speech);
  console.log("length - 5 ", voices[voices.length - 5].name, voiceSelect.value);
};
speech.onstart = function (event) {
  console.log("Bắt đầu phát âm...");
  console.log("Speechtext ", speech.text);
};

speech.onend = function (event) {
  console.log("Phát âm hoàn thành.");
};

speech.onerror = function (event) {
  console.error("Lỗi khi phát âm:", event.error);
};
voiceSelect.addEventListener("change", () => {
  stopSpeaking();
  speech.voice = voices[voiceSelect.value];
});

document.getElementById("play-btn").addEventListener("click", () => {
  console.log("value: ", document.getElementById("t-content").value);
  speech.text = textContent.value;
  window.speechSynthesis.speak(speech);
});

/*Function Features*/
/*Export*/
exptBtn.addEventListener("click", () => {
  let textContentValue = textContent.value;
  // Tạo một đối tượng Blob từ nội dung văn bản
  let blob;
  if (textContentValue.length > 0) {
    blob = new Blob([textContentValue], { type: "text/plain" });
  } else {
    alert("There is no content to export! Please check it again.");
    return;
  }

  // Tạo một đối tượng URL từ Blob
  const url = window.URL.createObjectURL(blob);

  // Tạo một thẻ a để tạo và tải tệp
  const a = document.createElement("a");
  a.href = url;
  a.download = "myText-to-speechFile.txt"; // Đặt tên tệp văn bản tải về
  a.style.display = "none";

  // Thêm thẻ a vào DOM và kích hoạt tải về
  document.body.appendChild(a);
  a.click();

  // Xóa đối tượng URL sau khi tệp đã tải về
  window.URL.revokeObjectURL(url);
});

/*Clear all*/
clrAll.addEventListener("click", () => {
  document.getElementById("t-content").value = "";
});

/*Improt file*/
imptBtn.addEventListener("click", () => {
  const selectedFile = fileInput.files[0];

  if (selectedFile) {
    const reader = new FileReader();

    reader.onload = function (event) {
      const fileContent = event.target.result;
      textContent.value = fileContent;
    };

    reader.readAsText(selectedFile);
  } else {
    alert("Please choose a txt file to import.");
  }
});
/*Save function*/
savBtn.addEventListener("click", () => {
  localStorage.setItem("textareaSContent", textContent.value);
  alert("Saved succesfully");
});
/*Restore function*/
resBtn.addEventListener("click", () => {
  const contentRestore = localStorage.getItem("textareaSContent");
  textContent.value = contentRestore;
});
