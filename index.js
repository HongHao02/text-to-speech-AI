let speech = new SpeechSynthesisUtterance();
let textContent = document.getElementById("t-content");
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
  if (voices.length === 0) {
    console.log("Không có giọng nói nào được tìm thấy.");
  } else {
    console.log("Có giọng nói sẵn có.");
  }
  speech.voice = voices[0];
  console.log(speech);

  voices.forEach(
    (voice, i) => (voiceSelect.options[i] = new Option(voice.name, i))
  );
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
