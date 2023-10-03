let speech = new SpeechSynthesisUtterance();
let textContent = document.getElementById("t-content");

let isSpeaking = false; //variable for speaking
let paused = false; //variable for pause/resume
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
const playBtn = document.getElementById("play-btn");
let exptBtn = document.getElementById("expt-btn");
let clrAll = document.getElementById("clearAll-btn");
let imptBtn = document.getElementById("import-btn");
let savBtn = document.getElementById("save-btn");
let resBtn = document.getElementById("restore-btn");
let pasueBtn = document.getElementById("pause-btn");
pasueBtn.style.display = "none";
pasueBtn.classList.remove("fa-spin");

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

// speech.onend = function (event) {
//   console.log("Phát âm hoàn thành.");
// };

// speech.onerror = function (event) {
//   console.error("Lỗi khi phát âm:", event);
// };
voiceSelect.addEventListener("change", () => {
  stopSpeaking();
  speech.voice = voices[voiceSelect.value];
});

const ttsSpeak = () => {
  return new Promise((resolve, reject) => {
    console.log("isSpeaking-frist ", isSpeaking);
    speech.onstart = (event) => {
      console.log("Bắt đầu phát âm...");
      console.log("Speechtext ", speech.text);
    };
    speech.onend = () => {
      isSpeaking = false; //Đánh dấu phát âm hoàn tất
      console.log("Phát âm hoàn tất!");
      resolve();
    };

    speech.onerror = (error) => {
      isSpeaking = false; //Đánh dấu phát âm hoàn tất với lỗi
      reject(error);
    };
    window.speechSynthesis.speak(speech);
    isSpeaking = true; //Đánh dấu là đang trong quá trình phát âm
    console.log("isSpeaking ", isSpeaking);

    console.log("isSpeaking-after ", isSpeaking);
  });
};

playBtn.addEventListener("click", async () => {
  if (!isSpeaking) {
    try {
      console.log("click play success");
      pasueBtn.style.display = "block";
      pasueBtn.classList.add("fa-spin");
      playBtn.classList.add("btn-active");
      console.log("value: ", document.getElementById("t-content").value);
      speech.text = textContent.value;
      await ttsSpeak();
      console.log("PROMISE FINISHED");
      pasueBtn.style.display = "none";
      pasueBtn.classList.remove("fa-spin");
      playBtn.classList.remove("btn-active");
    } catch (error) {
      pasueBtn.style.display = "none";
      pasueBtn.classList.remove("fa-spin");
      playBtn.classList.remove("btn-active");
      console.error("Lỗi trong quá trình phát âm! ", error);
    }
  } else {
    window.speechSynthesis.cancel(); //Hủy việc phát âm
    isSpeaking = false;
    // Thêm hiệu ứng động cho nút play khi dừng phát âm
    pasueBtn.style.display = "none";
    pasueBtn.classList.remove("fa-spin");
    playBtn.classList.remove("btn-active");
  }
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
